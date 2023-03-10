import { Injectable } from '@angular/core';

export interface Credentials {
  username: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class PersistenceService {
  clearStorage() {
    localStorage.clear();
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUserId(id: number) {
    localStorage.setItem('userId', id.toString());
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  saveCredentials(username: string, password: string) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  getCredentials(): Credentials | null {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    if (!username || !password) return null;

    return { username, password };
  }
}
