// src/app/services/evento.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Evento {
  id: number;
  fecha: string;
  hora: string;
  tipo: string;
  id_lote?: number;
  lote?: string;
  descripcion: string;
  responsable: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private _eventos: Evento[] = [];
  private eventosSubject = new BehaviorSubject<Evento[]>([]);
  eventos$ = this.eventosSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();

    // Datos de prueba si no hay nada guardado
    if (this._eventos.length === 0) {
      this._eventos = [
        {
          id: 1,
          fecha: '2025-12-05',
          hora: '08:00',
          tipo: 'Alimentación',
          id_lote: 1,
          lote: 'L001',
          descripcion: 'Alimentación inicial',
          responsable: 'Juan',
          estado: 'Activo'
        },
        {
          id: 2,
          fecha: '2025-12-06',
          hora: '10:00',
          tipo: 'Muestreo',
          id_lote: 2,
          lote: 'L002',
          descripcion: 'Control de peso',
          responsable: 'Ana',
          estado: 'Programado'
        }
      ];
      this.saveToLocalStorage();
    }
  }

  // ===== LocalStorage =====
  private saveToLocalStorage() {
    localStorage.setItem('eventos', JSON.stringify(this._eventos));
    this.eventosSubject.next([...this._eventos]);
  }

  private loadFromLocalStorage() {
    const data = localStorage.getItem('eventos');
    if (data) {
      this._eventos = JSON.parse(data);
      this.eventosSubject.next([...this._eventos]);
    }
  }

  // ===== CRUD Básico =====
  getAll(): Evento[] {
    return [...this._eventos];
  }

  getById(id: number): Evento | undefined {
    return this._eventos.find(e => e.id === id);
  }

  add(evento: Evento) {
    evento.id = this._eventos.length
      ? Math.max(...this._eventos.map(e => e.id)) + 1
      : 1;

    this._eventos.push(evento);
    this.saveToLocalStorage();
  }

  update(evento: Evento) {
    const index = this._eventos.findIndex(e => e.id === evento.id);
    if (index > -1) {
      this._eventos[index] = { ...evento };
      this.saveToLocalStorage();
    }
  }

  delete(id: number) {
    this._eventos = this._eventos.filter(e => e.id !== id);
    this.saveToLocalStorage();
  }

  // ===== Funciones para el módulo de producción =====

  // Eventos por lote (ordenados por fecha)
  getByLote(idLote: number): Evento[] {
    return this._eventos
      .filter(e => e.id_lote === idLote)
      .sort((a, b) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  }

  // Detectar eventos críticos (para alertas)
  isEventoCritico(evento: Evento): boolean {
    const texto = (evento.tipo + ' ' + evento.descripcion).toLowerCase();
    return texto.includes('mortalidad') || texto.includes('emergencia');
  }

}
