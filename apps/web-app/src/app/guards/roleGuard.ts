import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '@gargamix/shared';
import { AuthService } from '@gargamix/firebase-config';

const ROLE_HIERARCHY: UserRole[] = ['VISITOR', 'FREE', 'PREMIUM', 'MODERATOR', 'ADMIN'];

export const requireMinRole = (minRole: UserRole): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.userPrivate()?.role;

    if (!userRole) {
      router.navigate(['/auth']);
      return false;
    }

    const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
    const minRoleIndex = ROLE_HIERARCHY.indexOf(minRole);

    if (userRoleIndex < minRoleIndex) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};

export const requireExactRoles = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRole = authService.userPrivate()?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};