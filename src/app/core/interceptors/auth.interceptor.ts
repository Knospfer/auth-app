import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import {
  Credentials,
  PersistenceService,
} from 'src/app/core/services/persistence.service';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private persistenceService: PersistenceService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.method.includes('/auth/login')) return next.handle(req);

    const token = this.persistenceService.getToken();
    const authorizedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });

    return next.handle(authorizedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) return throwError(() => error);

        const credentials = this.persistenceService.getCredentials();
        if (!credentials) return throwError(() => error);

        return this.refreshToken(req, next, credentials);
      })
    );
  }

  private refreshToken(
    req: HttpRequest<any>,
    next: HttpHandler,
    credentials: Credentials
  ): Observable<HttpEvent<any>> {
    return this.authService
      .login(credentials.username, credentials.password)
      .pipe(
        catchError((error) => {
          this.persistenceService.clearStorage();
          this.router.navigateByUrl('login');

          return throwError(() => error);
        }),
        switchMap(() => next.handle(req))
      );
  }
}
