// src/app/services/lote.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LoteHistorialItem {
  fecha: string;           // ISO date o fecha legible
  accion: string;          // 'CREAR' | 'EDITAR' | 'COSECHA' | 'ESTADO' | 'ELIMINAR' | etc.
  detalle?: string;        // descripción breve
  usuario?: string;        // opcional
}

export interface Lote {
  id: number;
  lote: string;
  fecha: string;
  especie: string;
  cantidad: number;
  estanque: string;
  estado: string;
  densidadInicial?: number;
  supervivencia?: number;
  rendimiento?: number;
  historial?: LoteHistorialItem[];
}

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private storageKey = 'lotes';
  private _lotes: Lote[] = [];
  private lotesSubject = new BehaviorSubject<Lote[]>([]);
  lotes$ = this.lotesSubject.asObservable();

  constructor() {
    this.loadFromLocalStorage();

    if (this._lotes.length === 0) {
      // Datos iniciales de ejemplo
      this._lotes = [
        { 
          id: 1, 
          lote: 'L001', 
          fecha: '2025-12-01', 
          especie: 'Camarón', 
          cantidad: 1000, 
          estanque: 'E1', 
          estado: 'Activo', 
          densidadInicial: 50,
          supervivencia: 95,
          rendimiento: 120,
          historial: [
            { fecha: new Date().toISOString(), accion: 'CREAR', detalle: 'Carga inicial' },
            { fecha: new Date().toISOString(), accion: 'MUESTREO', detalle: 'Muestreo inicial registrado' }
          ]

        },
        { 
          id: 2, 
          lote: 'L002', 
          fecha: '2025-12-02', 
          especie: 'Camarón', 
          cantidad: 1500, 
          estanque: 'E2', 
          estado: 'Activo', 
          densidadInicial: 55,
          supervivencia: 92,
          rendimiento: 130,
          historial: [
            { fecha: new Date().toISOString(), accion: 'CREAR', detalle: 'Carga inicial' }
          ] 
        }
      ];
      this.saveToLocalStorage();
    }
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this._lotes));
    this.lotesSubject.next([...this._lotes]);
  }

  private loadFromLocalStorage() {
    const data = localStorage.getItem(this.storageKey);
    if (data) {
      try {
        this._lotes = JSON.parse(data);
      } catch {
        this._lotes = [];
      }
      this.lotesSubject.next([...this._lotes]);
    }
  }

  getAll(): Lote[] {
    return [...this._lotes];
  }

  getById(id: number): Lote | undefined {
    return this._lotes.find(l => l.id === id);
  }

  add(lote: Lote) {
    lote.id = this._lotes.length ? Math.max(...this._lotes.map(l => l.id)) + 1 : 1;
    lote.historial = lote.historial ?? [];
    lote.historial.push({ fecha: new Date().toISOString(), accion: 'CREAR', detalle: 'Lote creado' });
    this._lotes.push(lote);
    this.saveToLocalStorage();
  }

  update(lote: Lote) {
    const index = this._lotes.findIndex(l => l.id === lote.id);
    if (index > -1) {
      lote.historial = lote.historial ?? this._lotes[index].historial ?? [];
      lote.historial.push({ fecha: new Date().toISOString(), accion: 'EDITAR', detalle: 'Lote actualizado' });
      this._lotes[index] = { ...lote };
      this.saveToLocalStorage();
    }
  }

  delete(id: number) {
    const lote = this.getById(id);
    if (lote) {
      lote.historial = lote.historial ?? [];
      lote.historial.push({ fecha: new Date().toISOString(), accion: 'ELIMINAR', detalle: 'Lote eliminado' });
    }
    this._lotes = this._lotes.filter(l => l.id !== id);
    this.saveToLocalStorage();
  }

  addHistorialEntry(id: number, accion: string, detalle?: string, usuario?: string) {
    const lote = this.getById(id);
    if (!lote) return;
    lote.historial = lote.historial ?? [];
    lote.historial.push({ fecha: new Date().toISOString(), accion, detalle, usuario });
    this.update(lote);
  }

  setEstado(id: number, nuevoEstado: string, detalle?: string) {
    const lote = this.getById(id);
    if (!lote) return;
    lote.estado = nuevoEstado;
    this.addHistorialEntry(id, 'ESTADO', detalle ?? `Estado -> ${nuevoEstado}`);
  }
}

