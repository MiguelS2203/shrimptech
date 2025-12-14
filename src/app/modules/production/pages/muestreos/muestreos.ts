import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MuestreoService, Muestreo } from '../../services/muestreo.service';
import { MuestreoFormDialog } from '../muestreo-form-dialog/muestreo-form-dialog';

@Component({
  selector: 'app-muestreos',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './muestreos.html',
  styleUrls: ['./muestreos.css']
})
export class MuestreosComponent {

  filtroFecha = '';
  filtroLote = '';
  filtroIndividuos: number | null = null;

  muestreos: Muestreo[] = [];

  constructor(
    private service: MuestreoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.service.muestreos$.subscribe(data => this.muestreos = data);
  }

  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroLote = '';
    this.filtroIndividuos = null;
  }
abrirNuevo() {
  const dialogRef = this.dialog.open(MuestreoFormDialog, {
    width: '500px',
    autoFocus: false,
    maxHeight: '80vh',
    panelClass: 'dialog-evento',
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.add(result);
      this.snackBar.open('Muestreo agregado', 'Cerrar', { duration: 2500 });
    }
  });
}


  ver(m: Muestreo) {
    this.dialog.open(MuestreoFormDialog, {
      width: '500px',
      autoFocus: false,
      maxHeight: '80vh',
      panelClass: 'dialog-evento',
      data: { ...m, viewMode: true }
    });
  }

  editar(m: Muestreo) {
   const dialogRef = this.dialog.open(MuestreoFormDialog, {
  width: '500px',
  autoFocus: false,
  maxHeight: '80vh',
  panelClass: 'dialog-evento',
  data: { ...m }
});

dialogRef.afterClosed().subscribe(result => {
  if (result) {
    this.service.update(result);
    this.snackBar.open('Muestreo actualizado', 'Cerrar', { duration: 2500 });
  }
});
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar muestreo?')) {
      this.service.delete(id);
      this.snackBar.open('Muestreo eliminado', 'Cerrar', { duration: 2500 });
    }
  }

  get filtrados() {
    return this.muestreos.filter(m => {

      const coincideFecha =
        !this.filtroFecha || m.fecha === this.filtroFecha;

      const coincideLote =
        !this.filtroLote ||
        (m.lote || '').toLowerCase().includes(this.filtroLote.toLowerCase());

      const coincideInd =
        this.filtroIndividuos == null ||
        Number(m.individuos) === Number(this.filtroIndividuos);

      return coincideFecha && coincideLote && coincideInd;
    });
  }
}
