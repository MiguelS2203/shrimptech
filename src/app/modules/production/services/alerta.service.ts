// src/app/services/alerta.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alerta {
  mensaje: string;
  tipo: 'info' | 'warning' | 'error';
}

@Injectable({
  providedIn: 'root'
})
export class AlertaService {
  private _alertas: Alerta[] = [];
  private alertasSubject = new BehaviorSubject<Alerta[]>([]);
  alertas$ = this.alertasSubject.asObservable();

  mostrarAlerta(
    mensaje: string, 
    tipo: 'info' | 'warning' | 'error' = 'info', 
    duracion = 5000
  ) {
    const alerta: Alerta = { mensaje, tipo };
    this._alertas.push(alerta);
    this.alertasSubject.next([...this._alertas]);

    // Eliminar automáticamente después de la duración
    setTimeout(() => {
      this._alertas = this._alertas.filter(a => a !== alerta);
      this.alertasSubject.next([...this._alertas]);
    }, duracion);
  }
}
