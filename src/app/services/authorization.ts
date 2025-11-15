import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root',
})
export class Authorization {
  private readonly users: IUser[] = [
    { username: 'edu', password: '1234', name: 'Edú Sabando' },
    { username: 'heidy', password: '1234', name: 'Heidy Mendoza' },
    { username: 'emily', password: '1234', name: 'Emily Obando' },
    { username: 'johan', password: '1234', name: 'Johan Tigrero' },
    { username: 'miguel', password: '1234', name: 'Miguel Salazar' },
  ];

  readonly loggedIn$ = new BehaviorSubject<boolean>(false);
  readonly currentUser$ = new BehaviorSubject<string | null>(null);

  login(user: string, pass: string): boolean {
    const userFound = this.users.find((u) => u.username === user && u.password === pass);

    if (userFound) {
      this.loggedIn$.next(true);
      this.currentUser$.next(userFound.name);
      return true;
    } else {
      this.loggedIn$.next(false);
      this.currentUser$.next(null);
      return false;
    }
  }

  logout(): void {
    this.loggedIn$.next(false);
    this.currentUser$.next(null);
  }
}
