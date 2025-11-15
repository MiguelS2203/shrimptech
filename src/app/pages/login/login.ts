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

  message: string = '';
  messageClass: string = '';

  validateAccess() {
    const access = this.authorize.login(this.user, this.password);

    if (access) {
      this.message = 'Acceso concedido';
      this.messageClass = 'success';

      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      this.message = 'Error en credenciales';
      this.messageClass = 'error';
    }

    console.log(`Usuario: ${this.user}`);
    console.log(`Clave: ${this.password}`);
  }
}
