import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EventoService, Evento } from '../../services/evento.service';
import { EventoFormDialog } from '../evento-form-dialog/evento-form-dialog';

@Component({
  selector: 'app-evento-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './eventos.html',
  styleUrls: ['./eventos.css']
})


export class EventoListComponent {

  filtroTipo = '';
  filtroFecha = '';
  filtroEstado = '';  

  eventos: Evento[] = [];

  constructor(
    private service: EventoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.service.eventos$.subscribe(data => this.eventos = data);
  }
abrirNuevo() {
  const dialogRef = this.dialog.open(EventoFormDialog, {
    width: '500px',
    maxHeight: '80vh',
    autoFocus: false,
    panelClass: 'dialog-evento',
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.add(result);
      this.snackBar.open('Evento registrado', 'Cerrar', { duration: 2500 });
    }
  });
}

ver(ev: Evento) {
  this.dialog.open(EventoFormDialog, {
    width: '500px',          
    maxHeight: '80vh',
    autoFocus: false,
    panelClass: 'dialog-evento',
    data: { ...ev, viewMode: true }
  });
}

editar(ev: Evento) {
  const dialogRef = this.dialog.open(EventoFormDialog, {
    width: '500px',
    maxHeight: '80vh',
    autoFocus: false,
    panelClass: 'dialog-evento',
    data: { ...ev }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.service.update(result);
      this.snackBar.open('Evento actualizado', 'Cerrar', { duration: 2500 });
    }
  });
}


  eliminar(id: number) {
    if (confirm('¿Eliminar evento?')) {
      this.service.delete(id);
      this.snackBar.open('Evento eliminado', 'Cerrar', { duration: 2500 });
    }
  }

  get filtrados() {
    return this.eventos.filter(e => {

      const coincideTipo =
        this.filtroTipo === '' || e.tipo === this.filtroTipo;

      const coincideFecha =
        this.filtroFecha === '' || e.fecha === this.filtroFecha;

      const coincideEstado =
        this.filtroEstado === '' || e.estado === this.filtroEstado;

      return coincideTipo && coincideFecha && coincideEstado;
    });
  }
}
