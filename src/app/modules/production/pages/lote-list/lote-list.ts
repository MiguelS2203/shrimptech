import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoteService, Lote } from '../../services/lote.service';
import { LoteFormDialog } from '../lote-form-dialog/lote-form-dialog';
import { Router, ActivatedRoute } from '@angular/router'; // <- Agregamos ActivatedRoute

@Component({
  selector: 'app-lote-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './lote-list.html',
  styleUrls: ['./lote-list.css']
})
export class LoteListComponent {

  filtroLote: number | '' = '';
  filtroEstanque: string = '';
  filtroEstado: string = '';

  lotes: Lote[] = [];

  constructor(
    private service: LoteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute   // <- Inyectamos ActivatedRoute
  ) {}

  ngOnInit() {
    this.service.lotes$.subscribe(data => this.lotes = data);
  }

  abrirNuevo() {
    this.dialog.open(LoteFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-lote',
      data: {
        id: 0,
        lote: '',
        fecha: '',
        especie: '',
        cantidad: 0,
        estanque: '',
        estado: 'Activo',
        modo: 'crear'
      }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.service.add(res);
        this.snackBar.open('¡Lote agregado correctamente!', 'Cerrar', { duration: 2500 });
      }
    });
  }

  ver(lote: Lote) {
    this.dialog.open(LoteFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-lote',
      data: { ...lote, modo: 'ver' }
    });
  }

  editar(item: Lote) {
    this.dialog.open(LoteFormDialog, {
      width: '500px',
      maxHeight: '80vh',
      autoFocus: false,
      panelClass: 'dialog-lote',
      data: { ...item, modo: 'editar' }
    }).afterClosed().subscribe(res => {
      if (res) {
        this.service.update(res);
        this.snackBar.open('¡Lote actualizado correctamente!', 'Cerrar', { duration: 2500 });
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar lote?')) {
      this.service.delete(id);
      this.snackBar.open('¡Lote eliminado correctamente!', 'Cerrar', { duration: 2500 });
    }
  }


  verDetalleCompleto(id: number) {
    this.router.navigate(['detalle', id], { relativeTo: this.route });
  }

  get filtrados() {
    return this.lotes.filter(l =>
      (this.filtroLote !== '' ? l.id === this.filtroLote : true) &&
      (this.filtroEstanque !== '' ? l.estanque === this.filtroEstanque : true) &&
      (this.filtroEstado !== '' ? l.estado === this.filtroEstado : true)
    );
  }

}
