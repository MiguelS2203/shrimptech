import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Authorization } from '../../services/authorization';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterModule, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly router = inject(Router);
  readonly authorize = inject(Authorization);

  loggedInHeader = false;
  menuOpen = false;

  readonly sub = this.authorize.loggedIn$.subscribe((val) => {
    this.loggedInHeader = val;
  });

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  logout() {
    const confirmed = confirm('¿Estás seguro de que quieres cerrar sesión?');

    if (confirmed) {
      this.authorize.logout();
      this.router.navigate(['/login']);
      this.closeMenu();
    }
  }
}
