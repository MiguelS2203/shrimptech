// src/app/services/cosecha.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoteService } from './lote.service';

export interface Cosecha {
  id: number;
  fecha: string;
  lote: string;
  id_lote?: number;
  cantidadKg: number;
  sobrevivencia: number;
  pesoPromedio: number;
  temperatura: number;
  observaciones: string;
  rendimiento?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CosechaService {

  private storageKey = 'cosechasData';

  private data: Cosecha[] = JSON.parse(
    localStorage.getItem(this.storageKey) || '[]'
  );

  private subject = new BehaviorSubject<Cosecha[]>([...this.data]);
  cosechas$ = this.subject.asObservable();

  constructor(private loteService: LoteService) {
    // Si no hay datos, opcionalmente precargar ejemplos (mantén o quita según prefieras)
    if (this.data.length === 0) {
      this.data = [
        { id: 1, fecha: '2025-12-01', lote: 'Lote A', id_lote: 1, cantidadKg: 120, sobrevivencia: 90, pesoPromedio: 15, temperatura: 28, observaciones: 'Normal' },
        { id: 2, fecha: '2025-12-02', lote: 'Lote B', id_lote: 2, cantidadKg: 150, sobrevivencia: 92, pesoPromedio: 16, temperatura: 28, observaciones: 'Normal' }
      ];
      this.save(); // guardará y emitirá
    }
  }

  private save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    this.subject.next([...this.data]);
  }

  getAll() {
    return [...this.data];
  }

  add(c: Cosecha) {
    c.id = Date.now();
    // calcular rendimiento si no viene (ejemplo simple: cantidadKg / area supuesta)
    // Si quieres usar área real, pásala en c.rendimiento o calcula según tu regla.
    if (c.rendimiento == null) {
      const areaEstanque = 100; // ejemplo, o traer del lote si lo tienes
      c.rendimiento = +( (c.cantidadKg || 0) / areaEstanque ).toFixed(2);
    }

    this.data.push(c);
    this.save();

    // Si la cosecha está vinculada a un lote, actualizar estado e historial
    if (c.id_lote) {
      // al cosechar podríamos marcar 'En cosecha' o 'Cerrado' según la lógica; aquí usamos 'Cerrado'
      this.loteService.setEstado(c.id_lote, 'Cerrado', `Cosecha registrada: ${c.cantidadKg}Kg el ${c.fecha}`);
      // añadir detalle en historial (setEstado ya agrega historial)
    } else if (c.lote) {
      // si sólo tienes el nombre, busco lote por nombre (opcional)
      const posibles = this.loteService.getAll().filter(l => l.lote === c.lote);
      if (posibles.length) {
        this.loteService.setEstado(posibles[0].id, 'Cerrado', `Cosecha registrada: ${c.cantidadKg}Kg el ${c.fecha}`);
      }
    }
  }

  update(c: Cosecha) {
    const idx = this.data.findIndex(x => x.id === c.id);
    if (idx >= 0) {
      this.data[idx] = c;
      this.save();
    }
  }

  delete(id: number) {
    this.data = this.data.filter(x => x.id !== id);
    this.save();
  }

  getById(id: number) {
    return this.data.find(x => x.id === id);
  }
}
