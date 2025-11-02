import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Authorization {
  // Variable global para  determinar si un usuario está logeado en el sistema:
  readonly loggedIn$ = new BehaviorSubject<boolean>(false);
}
