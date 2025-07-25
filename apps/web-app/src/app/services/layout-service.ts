import { Injectable, signal, computed, effect, inject, DestroyRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { DeviceService } from './device-service';
import { StorageService } from './storage-service';

export interface LayoutState {
  sidebarCollapsed: boolean;
  loading: boolean;
  headerTitle: string;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  #deviceService: DeviceService = inject(DeviceService);
  #router: Router = inject(Router);
  #storageService: StorageService = inject(StorageService);
  #destroyRef: DestroyRef = inject(DestroyRef);

  #layoutState = signal<LayoutState>({
    sidebarCollapsed: this.#storageService.get('mijotello-sidebar-collapsed', false)!,
    loading: false,
    headerTitle: 'Mijotello',
  });

  #currentRoute = signal<string>('/home');

  readonly layoutState = this.#layoutState.asReadonly();

  readonly sidebarCollapsed = computed(() => this.layoutState().sidebarCollapsed);
  readonly loading = computed(() => this.layoutState().loading);
  readonly headerTitle = computed(() => this.layoutState().headerTitle);
  readonly navigationMode = computed(() => this.#deviceService.navigationMode());

  readonly activeRoute = computed(() => this.#currentRoute());

  readonly layoutClasses = computed(() => ({
    'layout--mobile': this.navigationMode() === 'bottom',
    'layout--desktop': this.navigationMode() === 'sidebar',
    'layout--sidebar-collapsed': this.navigationMode() === 'sidebar' && this.sidebarCollapsed(),
    'layout--loading': this.loading(),
  }));

  constructor() {
    this.#initializeRouteTracking();
    this.#initializeSidebarPersistence();
  }

  toggleSidebar(): void {
    this.#layoutState.update(state => ({
      ...state,
      sidebarCollapsed: !state.sidebarCollapsed,
    }));
  }

  setLoading(loading: boolean): void {
    this.#layoutState.update(state => ({
      ...state,
      loading,
    }));
  }

  setHeaderTitle(title: string): void {
    this.#layoutState.update(state => ({
      ...state,
      headerTitle: title,
    }));
  }

  setSidebarCollapsed(collapsed: boolean): void {
    this.#layoutState.update(state => ({
      ...state,
      sidebarCollapsed: collapsed,
    }));
  }

  isRouteActive(route: string): boolean {
    return this.activeRoute().startsWith(route);
  }

  autoCollapseSidebar(): void {
    if (this.#deviceService.isMobile()) {
      this.setSidebarCollapsed(true);
    }
  }

  resetLayout(): void {
    this.#layoutState.set({
      sidebarCollapsed: false,
      loading: false,
      headerTitle: 'Mijotello',
    });
  }

  #initializeRouteTracking(): void {
    this.#router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((event: NavigationEnd) => {
        this.#currentRoute.set(event.urlAfterRedirects || event.url);
        this.#updateHeaderTitleFromRoute(event.url);
      });
  }

  #updateHeaderTitleFromRoute(url: string): void {
    const routeTitles: Record<string, string> = {
      '/home': 'Accueil',
      '/recipes': 'Mes Recettes',
      '/recipes/create': 'Nouvelle Recette',
      '/recipes/favorites': 'Favoris',
      '/profile': 'Mon Profil',
      '/profile/settings': 'Paramètres',
    };

    const title = routeTitles[url] || 'Mijotello';
    this.setHeaderTitle(title);
  }

  #loadSidebarState(): boolean {
    if (typeof localStorage === 'undefined') {
      return false;
    }

    const saved = localStorage.getItem('mijotello-sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  }

  #initializeSidebarPersistence(): void {
    effect(() => {
      const collapsed = this.sidebarCollapsed();
      this.#storageService.set('mijotello-sidebar-collapsed', collapsed);
    });

    effect(() => {
      if (this.#deviceService.isMobile()) {
        this.setSidebarCollapsed(true);
      }
    });
  }
}