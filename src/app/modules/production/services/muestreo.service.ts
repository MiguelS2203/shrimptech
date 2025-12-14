// src/app/services/muestreo.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Muestreo {
  id: number;
  id_lote?: number;
  lote?: string;
  fecha: string;
  peso: number;
  individuos: number;
  mortalidad: string;
  observaciones?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MuestreoService {

  private _muestreos: Muestreo[] = [];
  private muestreosSubject = new BehaviorSubject<Muestreo[]>([]);
  muestreos$ = this.muestreosSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();

    // Datos demo si está vacío
    if (this._muestreos.length === 0) {
      this._muestreos = [
        {
          id: 1,
          fecha: '2025-12-05',
          peso: 2.5,
          individuos: 50,
          mortalidad: '0',
          observaciones: '',
          id_lote: 1,
          lote: 'L001'
        },
        {
          id: 2,
          fecha: '2025-12-06',
          peso: 2.8,
          individuos: 60,
          mortalidad: '1',
          observaciones: '',
          id_lote: 2,
          lote: 'L002'
        }
      ];
      this.saveToLocalStorage();
    }
  }

  // ===== LocalStorage =====
  private saveToLocalStorage() {
    localStorage.setItem('muestreos', JSON.stringify(this._muestreos));
    this.muestreosSubject.next([...this._muestreos]);
  }

  private loadFromLocalStorage() {
    const data = localStorage.getItem('muestreos');
    if (data) {
      this._muestreos = JSON.parse(data);
      this.muestreosSubject.next([...this._muestreos]);
    }
  }

  // ===== CRUD =====
  getAll(): Muestreo[] {
    return [...this._muestreos];
  }

  getById(id: number): Muestreo | undefined {
    return this._muestreos.find(m => m.id === id);
  }

  add(muestreo: Muestreo) {
    muestreo.id = this._muestreos.length
      ? Math.max(...this._muestreos.map(m => m.id)) + 1
      : 1;

    this._muestreos.push({ ...muestreo });
    this.saveToLocalStorage();
  }

  update(muestreo: Muestreo) {
    const index = this._muestreos.findIndex(m => m.id === muestreo.id);
    if (index > -1) {
      this._muestreos[index] = { ...muestreo };
      this.saveToLocalStorage();
    }
  }

  delete(id: number) {
    this._muestreos = this._muestreos.filter(m => m.id !== id);
    this.saveToLocalStorage();
  }

  // ===== Funciones para el módulo de producción =====

  // Filtrar por lote
  getByLote(idLote: number): Muestreo[] {
    return this._muestreos
      .filter(m => m.id_lote === idLote)
      .sort((a, b) =>
        new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
  }

  // Calcular tasa de supervivencia
  calcularSupervivencia(idLote: number, cantidadInicial: number): number {
    const muestreos = this.getByLote(idLote);
    if (!muestreos.length || !cantidadInicial) return 0;

    const ultimo = muestreos[muestreos.length - 1];

    const vivos = ultimo.individuos;
    const supervivencia = (vivos / cantidadInicial) * 100;

    return Math.round(supervivencia);
  }

  // Detectar mortalidad alta (alerta)
  hayAlertaMortalidad(m: Muestreo): boolean {
    const mortalidad = Number(m.mortalidad || 0);
    return mortalidad > 5; // más de 5% = alerta
  }

}
