import { Injectable } from '@angular/core';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  //di solito io non uso direttamente il local storage, ma per semplicità in questo esempio facciamo così per persistere i dati che ci servono
  //così anche riavviando l'app non perdiamo questi dati


  clearStorage() {
    localStorage.clear(); //elimino tutto, mi serve quando faccio il logout
  }

  saveToken(token: string) {
    localStorage.setItem('token', token); //scrivo una riga con chiave 'token' e valore il valore della variabile token
  }

  getToken(): string | null {
    return localStorage.getItem('token'); //prendo il valore della chiave 'token', il nostro token che ci serve per autenticare le chiamate
  }

  saveUserId(id: number) {
    localStorage.setItem('userId', id.toString()); //salvo l'id dell'utente, in questo caso mi serve per prendere il dettaglio dell'utente, perchè le api che ho usato sono fatte così
  }

  getUserId(): string | null {
    return localStorage.getItem('userId'); //prendo l'id dell'utente
  }
 
  saveCredentials(username: string, password: string) { //salvo le credenziali dell'utente, mi servono quando devo refreshare il token in automatico quando scade, (farò un altro login in automatico e salverò il token, nell'interceptor)
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  getCredentials(): Credentials | null { //prendo le credenziali dell'utente, mi serve nell'interceptor per refreshare il token
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) return null; //se per qualche motivo una delle due credenziali non c'è esco e l'interceptor porterà alla pagina di login

    return { username, password };
  }
}
