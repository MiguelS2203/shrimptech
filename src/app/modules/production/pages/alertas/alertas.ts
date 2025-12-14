import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertaService } from '../../services/alerta.service';
import { AsyncPipe, NgForOf } from '@angular/common';

@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, NgForOf, AsyncPipe],
  template: `
    <div class="alerta-container">
      <div *ngFor="let a of alertaService.alertas$ | async" class="alerta" [ngClass]="a.tipo">
        {{ a.mensaje }}
      </div>
    </div>
  `,
  styles: [`
    .alerta-container {
      position: fixed;
      top: 10px;
      right: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 1000;
    }
    .alerta {
      padding: 12px 18px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      min-width: 250px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.2);
      animation: fadeIn 0.3s;
    }
    .info { background: #2196f3; }
    .warning { background: #ff9800; }
    .error { background: #f44336; }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class AlertasComponent {
  constructor(public alertaService: AlertaService) {}
}
