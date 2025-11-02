import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Authorization } from '../../services/authorization';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user: string = '';
  password: string = '';

  readonly router = inject(Router);
  readonly authorize = inject(Authorization);

  validateAccess() {
    alert('Se procederá a validar las credenciales de acceso');
    this.authorize.loggedIn$.next(true);
    this.router.navigate(['/']);

    console.log(`Usuario: ${this.user}`);
    console.log(`Clave: ${this.password}`);
  }
}
