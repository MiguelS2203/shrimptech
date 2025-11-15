import { Component, inject } from '@angular/core';
import { Authorization } from '../../services/authorization';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-principal-dashboard',
  imports: [AsyncPipe, RouterModule],
  templateUrl: './principal-dashboard.html',
  styleUrl: './principal-dashboard.css',
})
export class PrincipalDashboard {
  readonly authorize = inject(Authorization);
}
