import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@gargamix/firebase-config';
import { UserRole } from '@gargamix/shared';

export const requireRole = (requiredRole: UserRole): CanActivateFn => {
  return () => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    const userRoles: UserRole[] = authService.currentUserRoles();

    if (!userRoles.includes(requiredRole)) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};

export const requireAnyRole = (allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const userRoles: UserRole[] = authService.currentUserRoles();

    const hasAnyRole = userRoles.some(role => allowedRoles.includes(role));

    if (!hasAnyRole) {
      router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  };
};