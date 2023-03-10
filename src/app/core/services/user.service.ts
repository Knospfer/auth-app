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
    const id = this.persistenceService.getUserId(); //per come sono fatte le api che ho usato mi serve l'id dell'utente per prendere tutti i suoi dati
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`); //OCCHIO al backtick, non si può fare su windows con la tastiera italiana ma in js/ts è molto comodo per comporre le stringhe al posto del classico +
  }
}
