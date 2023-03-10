import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { PersistenceService } from 'src/app/core/services/persistence.service';

export function canActivateLoggedIn() {
  const router = inject(Router);
  const persistenceService = inject(PersistenceService);
  const token = persistenceService.getToken();

  if (!token) return router.createUrlTree(['login']);

  return !!token;
};

export function canActivateNotLoggedIn() {
  const persistenceService = inject(PersistenceService);
  const token = persistenceService.getToken();

  return !token;
};
