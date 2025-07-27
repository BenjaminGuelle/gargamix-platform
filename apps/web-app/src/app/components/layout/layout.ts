import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DeviceService } from '../../services/device-service';
import { LayoutService } from '../../services/layout-service';
import { UserRole } from '@gargamix/shared';
import { IconDirective } from '../ui/icon/icon.directive';
import {AuthService} from '@gargamix/firebase-services';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  roles?: UserRole[];
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'Accueil',
    icon: 'home',
    route: '/home',
    roles: ['VISITOR', 'FREE', 'PREMIUM', 'ADMIN'],
  },
  {
    id: 'recipes',
    label: 'Recettes',
    icon: 'chef-hat',
    route: '/recettes',
    roles: ['VISITOR', 'FREE', 'PREMIUM', 'ADMIN'], // Consultables par tous
  },
  {
    id: 'groups',
    label: 'Groupes',
    icon: 'users',
    route: '/groups',
    roles: ['PREMIUM', 'ADMIN'], // Premium uniquement
  },
  {
    id: 'profile',
    label: 'Profil',
    icon: 'user',
    route: '/profile',
    roles: ['FREE', 'PREMIUM', 'ADMIN'], // Connectés uniquement
  },
];

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    IconDirective,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  layoutService: LayoutService = inject(LayoutService);
  deviceService: DeviceService = inject(DeviceService);
  #authService: AuthService = inject(AuthService);

  readonly navigationItems = computed(() => {
    const userRoles = this.#authService.currentUserRoles();
    return this.filterNavigationByRoles(NAVIGATION_ITEMS, userRoles);
  });

  constructor() {
    console.log('🎯 AppLayoutComponent initialized');
    console.log('📱 Navigation mode:', this.deviceService.navigationMode());
  }

  filterNavigationByRoles(items: NavigationItem[], userRoles: UserRole[]): NavigationItem[] {
    return items.filter(item => {
      if (!item.roles || item.roles.length === 0) {
        return true;
      }
      return item.roles.some(requiredRole => userRoles.includes(requiredRole));
    });
  }
}
