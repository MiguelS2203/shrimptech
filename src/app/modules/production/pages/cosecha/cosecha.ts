import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CosechaService, Cosecha } from '../../services/cosecha.service';
import { CosechaFormDialog } from '../cosecha-form-dialog/cosecha-form-dialog';

@Component({
  selector: 'app-cosecha',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './cosecha.html',
  styleUrls: ['./cosecha.css']
})
export class CosechaComponent {

  // filtros solicitados (Opción C)
  filtroFecha = "";
  filtroLote = "";
  filtroTemperatura: number | null = null;

  cosechas: Cosecha[] = [];

  // datos de ejemplo para mostrar si el servicio está vacío
  private sampleData: Cosecha[] = [
    {
      id: 1,
      fecha: '2025-11-01',
      lote: 'L-001',
      cantidadKg: 120,
      sobrevivencia: 95,
      pesoPromedio: 18.4,
      temperatura: 28,
      observaciones: 'Cosecha normal, sin incidencias'
    },
    {
      id: 2,
      fecha: '2025-11-15',
      lote: 'L-002',
      cantidadKg: 90,
      sobrevivencia: 92,
      pesoPromedio: 17.8,
      temperatura: 27,
      observaciones: 'Disminución leve por corriente'
    },
    {
      id: 3,
      fecha: '2025-12-01',
      lote: 'L-003',
      cantidadKg: 150,
      sobrevivencia: 97,
      pesoPromedio: 19.2,
      temperatura: 29,
      observaciones: 'Excelente rendimiento'
    }
  ];

  constructor(
    private service: CosechaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.service.cosechas$.subscribe(data => {
      this.cosechas = data || [];
      // si no hay datos en el servicio, mostramos ejemplos (para que no se vea vacío)
      if (!this.cosechas || this.cosechas.length === 0) {
        this.cosechas = this.sampleData.slice();
      }
    });
  }

  abrirNuevo() {
    this.dialog.open(CosechaFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-evento',
      data: {
        id: 0,
        fecha: '',
        lote: '',
        cantidadKg: 0,
        sobrevivencia: 0,
        pesoPromedio: 0,
        temperatura: 0,
        observaciones: ''
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.service.add(res);
        this.snackBar.open('¡Cosecha agregada correctamente!', 'Cerrar', { duration: 2500 });
      }
    });
  }

  ver(item: Cosecha) {
    this.dialog.open(CosechaFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-evento',
      data: { ...item, viewMode: true }
    });
  }

  editar(item: Cosecha) {
    this.dialog.open(CosechaFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-evento',
      data: { ...item }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.service.update(res);
        this.snackBar.open('¡Cosecha actualizada correctamente!', 'Cerrar', { duration: 2500 });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar registro?')) {
      this.service.delete(id);
      this.snackBar.open('Registro eliminado', 'Cerrar', { duration: 2500 });
    }
  }

  get filtradas() {
    return this.cosechas.filter(c => {
      const coincideFecha =
        !this.filtroFecha || c.fecha === this.filtroFecha;

      const coincideLote =
        !this.filtroLote ||
        (c.lote || '').toLowerCase().includes(this.filtroLote.toLowerCase());

      // ✔ opción A — limpia, sin comparar con '', sin errores TS
      const coincideTemp =
        this.filtroTemperatura == null ||
        Number(c.temperatura) === Number(this.filtroTemperatura);

      return coincideFecha && coincideLote && coincideTemp;
    });
  }
}
