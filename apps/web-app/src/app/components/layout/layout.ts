import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceService } from '../../services/device-service';
import { LayoutService } from '../../services/layout-service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  #layoutService: LayoutService = inject(LayoutService);
  #deviceService: DeviceService = inject(DeviceService);

  navigationMode = this.#deviceService.navigationMode;
  toggleSidebar = this.#layoutService.toggleSidebar;
  headerTitle = this.#layoutService.headerTitle;

  constructor() {
    console.log('🎯 AppLayoutComponent initialized');
    console.log('📱 Navigation mode:', this.#deviceService.navigationMode());
  }
}
