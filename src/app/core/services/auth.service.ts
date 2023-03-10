import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { environment } from 'src/environments/environment';
import { PersistenceService } from './persistence.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService
  ) {}

  public login(
    username: string,
    password: string
  ): Observable<AuthResponse | null> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { //OCCHIO al backtick, non si può fare su windows con la tastiera italiana ma in js/ts è molto comodo per comporre le stringhe al posto del classico +
        username,
        password,
        expiresInMins: 1,
      })
      .pipe(
        tap((response) => {
          this.persistenceService.saveUserId(response.id);
          this.persistenceService.saveToken(response.token);
          this.persistenceService.saveCredentials(username, password);
        })
      );
  }

  public logout() {
    return of(null).pipe(
      tap(() => {
        this.persistenceService.clearStorage();
      })
    );
  }
}
