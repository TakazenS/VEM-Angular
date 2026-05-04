import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { map } from 'rxjs';

export const roleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = ['administrateur', 'logistique', 'directeur'];

  return authService.getUser().pipe(
    map(user => {
      if (user && allowedRoles.includes(user.role)) {
        return true;
      }
      router.navigate(['/forbidden']);
      return false;
    })
  );
};
