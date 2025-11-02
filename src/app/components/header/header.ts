import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Authorization } from '../../services/authorization';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly router = inject(Router);
  readonly authorize = inject(Authorization);
  loggedInHeader = false;

  // Suscripción inline:
  readonly sub = this.authorize.loggedIn$.subscribe((val) => (this.loggedInHeader = val));

  logout() {
    this.authorize.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }
}
