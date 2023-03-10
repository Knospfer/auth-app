import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { PersistenceService } from './persistence.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private persistenceService: PersistenceService
  ) {}

  getUser(): Observable<User | null> {
    const id = this.persistenceService.getUserId();
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }
}
