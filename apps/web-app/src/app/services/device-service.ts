import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { debounceTime, fromEvent, map, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export type DeviceType = 'phone' | 'large-phone' | 'tablet' | 'desktop';
export type NavigationMode = 'bottom' | 'sidebar';
export type SyncStrategy = 'immediate' | 'background' | 'offline';
export type CameraMode = 'user' | 'environment';

export interface DeviceCapabilities {
  camera: boolean;
  voice: boolean;
  touch: boolean;
  vibration: boolean;
  geolocation: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  #destroyRef: DestroyRef = inject(DestroyRef);

  #width = signal(typeof window !== 'undefined' ? window.innerWidth : 1024);
  #height = signal(typeof window !== 'undefined' ? window.innerHeight : 768);
  #isOnline = signal(typeof navigator !== 'undefined' ? navigator.onLine : true);

  readonly deviceType = computed<DeviceType>(() => {
    const width = this.#width();
    if (width < 480) {
      return 'phone';
    }
    if (width < 768) {
      return 'large-phone';
    }
    if (width < 1024) {
      return 'tablet';
    }
    return 'desktop';
  });

  readonly isMobile = computed(() => this.#width() < 768);
  readonly isTablet = computed(() => this.#width() >= 768 && this.#width() < 1024);
  readonly isDesktop = computed(() => this.#width() >= 1024);

  readonly navigationMode = computed<NavigationMode>(() =>
    this.isMobile() ? 'bottom' : 'sidebar',
  );

  readonly isInstalled = computed(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(display-mode: standalone)').matches,
  );

  readonly isIOS = computed(() =>
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent),
  );

  readonly isAndroid = computed(() =>
    typeof navigator !== 'undefined' &&
    /Android/.test(navigator.userAgent),
  );

  readonly capabilities = computed<DeviceCapabilities>(() => ({
    camera: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    voice: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window),
    touch: typeof window !== 'undefined' && 'ontouchstart' in window,
    vibration: typeof navigator !== 'undefined' && 'vibrate' in navigator,
    geolocation: typeof navigator !== 'undefined' && 'geolocation' in navigator,
  }));

  readonly supportsCamera = computed(() => this.capabilities().camera);
  readonly preferredCamera = computed<CameraMode>(() =>
    this.isMobile() ? 'environment' : 'user',
  );

  readonly supportsVoice = computed(() => this.capabilities().voice);
  readonly voiceOptimal = computed(() =>
    this.isMobile() && this.supportsVoice(),
  );
  readonly enableVoiceAssistant = computed(() =>
    this.voiceOptimal() && this.isInstalled(),
  );

  readonly supportsTouch = computed(() => this.capabilities().touch);
  readonly enableSwipeNavigation = computed(() =>
    this.isMobile() && this.supportsTouch(),
  );
  readonly enablePinchZoom = computed(() => this.supportsTouch());

  readonly isOnline = this.#isOnline.asReadonly();
  readonly connectionType = signal<string | undefined>(
    typeof navigator !== 'undefined' ?
      (navigator as any).connection?.effectiveType : undefined,
  );

  readonly syncStrategy = computed<SyncStrategy>(() => {
    if (!this.isOnline()) {
      return 'offline';
    }
    const connectionType = this.connectionType();
    if (connectionType === '4g' || connectionType === 'wifi') {
      return 'immediate';
    }
    return 'background';
  });

  readonly recipeGridColumns = computed(() => {
    switch (this.deviceType()) {
      case 'phone':
        return 1;
      case 'large-phone':
        return 2;
      case 'tablet':
        return 3;
      default:
        return 4;
    }
  });

  readonly headerHeight = computed(() => {
    if (this.isIOS() && this.isInstalled()) {
      return 'var(--safe-area-inset-top, 44px)';
    }
    return this.isMobile() ? '56px' : '64px';
  });

  readonly bottomNavHeight = computed(() => {
    if (this.isIOS() && this.isInstalled()) {
      return 'calc(60px + var(--safe-area-inset-bottom, 0px))';
    }
    return '60px';
  });

  readonly showInstallPrompt = computed(() =>
    !this.isInstalled() && (this.isIOS() || this.isAndroid()),
  );

  readonly enableOfflineMode = computed(() =>
    this.isInstalled() && 'serviceWorker' in navigator,
  );

  readonly prefersDarkMode = signal(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  constructor() {
    this.#initializeListeners();

    // Debug mode (retirer en production)
    effect(() => {
      console.log('🔧 Device state:', {
        type: this.deviceType(),
        navMode: this.navigationMode(),
        online: this.isOnline(),
        installed: this.isInstalled(),
        capabilities: this.capabilities(),
      });
    });

  }

  #initializeListeners(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Resize listener
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(150),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe(() => {
        this.#width.set(window.innerWidth);
        this.#height.set(window.innerHeight);
      });

    merge(
      fromEvent(window, 'online').pipe(map(() => true)),
      fromEvent(window, 'offline').pipe(map(() => false)),
    )
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(online => {
        this.#isOnline.set(online);
      });

    if ((navigator as any).connection) {
      fromEvent((navigator as any).connection, 'change')
        .pipe(takeUntilDestroyed(this.#destroyRef))
        .subscribe(() => {
          this.connectionType.set((navigator as any).connection.effectiveType);
        });
    }

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    fromEvent(darkModeQuery, 'change')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((e: any) => {
        this.prefersDarkMode.set(e.matches);
      });
  }

  vibrate(pattern: number | number[] = 200): void {
    if (this.capabilities().vibration) {
      navigator.vibrate(pattern);
    }
  }

  async requestCameraPermission(): Promise<boolean> {
    if (!this.supportsCamera()) {
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.preferredCamera() },
      });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }

  async getCurrentPosition(): Promise<GeolocationPosition | null> {
    if (!this.capabilities().geolocation) {
      return null;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        position => resolve(position),
        () => resolve(null),
        { timeout: 10000, enableHighAccuracy: false },
      );
    });
  }

  getOptimalImageQuality(): number {
    switch (this.syncStrategy()) {
      case 'immediate':
        return 0.9;
      case 'background':
        return 0.7;
      case 'offline':
        return 0.5;
    }
  }

  shouldPreloadImages(): boolean {
    return this.syncStrategy() === 'immediate' && !this.isMobile();
  }

  getMaxRecipesPerPage(): number {
    return this.recipeGridColumns() * (this.isMobile() ? 4 : 6);
  }
}
