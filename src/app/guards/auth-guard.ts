import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Authorization } from '../services/authorization';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Authorization);
  const router = inject(Router);

  if (auth.loggedIn$.value) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
