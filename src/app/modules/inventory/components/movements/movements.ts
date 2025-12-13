import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
//DIALOGS
import { AddMovements } from './add-movements/add-movements';
import { EditMovements } from './edit-movements/edit-movements';
import { ViewMovements } from './view-movements/view-movements';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatToolbarModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './movements.html',
  styleUrls: ['./movements.css'],
})
export class Movements {

  //MOVIMIENTOS
  movimientos = [
    { id: 1, fecha: "2025-02-01", tipo: "Entrada", producto: "Producto 1", cantidad: 500, responsable: "Admin" },
    { id: 2, fecha: "2025-03-02", tipo: "Salida",  producto: "Producto 2", cantidad: 200, responsable: "Admin" },
    { id: 3, fecha: "2025-04-02", tipo: "Entrada", producto: "Producto 4", cantidad: 300, responsable: "Admin" },
    { id: 4, fecha: "2025-05-03", tipo: "Ajuste",  producto: "Producto 3", cantidad: 100, responsable: "Admin" }
  ];

  //FILTROS
  filtroTipo = "";
  filtroProducto = "";
  filtroFecha = "";
  filtroDesde: string = "";
  filtroHasta: string = "";

  //LISTAS DINÁMICAS
  tipos = [...new Set(this.movimientos.map(m => m.tipo))];
  productos = [...new Set(this.movimientos.map(m => m.producto))];
  fechas = [...new Set(this.movimientos.map(m => m.fecha))];

  //MOVIMIENTOS FILTRADOS
  movimientosFiltrados = [...this.movimientos];

  displayedColumns: string[] = [
    'id',
    'fecha',
    'producto',
    'tipo',
    'cantidad',
    'responsable',
    'acciones'
  ];

  constructor(private dialog: MatDialog) { }

  //CONVERTIR STRING YYYY-MM-DD
  convertirStringAFechaLocal(fechaStr: string): Date {
    const [anio, mes, dia] = fechaStr.split('-').map(Number);
    return new Date(anio, mes - 1, dia);  
  }

  //FILTRAR
  filtrar() {
    this.movimientosFiltrados = this.movimientos.filter(m => {
      const cumpleTipo = this.filtroTipo ? m.tipo === this.filtroTipo : true;
      const cumpleProducto = this.filtroProducto ? m.producto === this.filtroProducto : true;

      const fechaMov = new Date(m.fecha);
      const desde = this.filtroDesde ? new Date(this.filtroDesde) : null;
      const hasta = this.filtroHasta ? new Date(this.filtroHasta) : null;

      const cumpleDesde = desde ? fechaMov >= desde : true;
      const cumpleHasta = hasta ? fechaMov <= hasta : true;

      return cumpleTipo && cumpleProducto && cumpleDesde && cumpleHasta;
    });
  }

  //AGREGAR
  openRegistrarDialog() {
    const dialogRef = this.dialog.open(AddMovements, {
      data: {
        tipos: this.tipos,
        productos: this.productos
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        //CONVERTIR A STRING YYYY-MM-DD
        if (result.fecha instanceof Date) {
          result.fecha = this.formatearFecha(result.fecha);
        }
        result.id = this.movimientos.length + 1;

        this.movimientos.push(result);
        this.actualizarListas();
        this.filtrar();
      }
    });
  }

  //EDITAR
  openEditarDialog(movimiento: any) {
    const dialogRef = this.dialog.open(EditMovements, {
      data: {
        tipos: this.tipos,
        productos: this.productos,
        movimiento: {
          ...movimiento,
          fecha: this.convertirStringAFechaLocal(movimiento.fecha)
        }
      }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (result.fecha instanceof Date) {
          //FORMATEAR FECHA
          result.fecha = this.formatearFecha(result.fecha);
        }
        const index = this.movimientos.findIndex(m => m.id === result.id);
        if (index >= 0) {
          this.movimientos[index] = result;
          this.actualizarListas();
          this.filtrar();
        }
      }
    });
  }

  //VER
  openVerDialog(movimiento: any) {
    this.dialog.open(ViewMovements, {
      data: { movimiento }
    });
  }

  //ELIMINAR
  eliminarMovimiento(id: number) {
    this.movimientos = this.movimientos.filter(m => m.id !== id);
    this.actualizarListas();
    this.filtrar();
  }

  //FORMATEAR FECHA A YYYY-MM-DD
  formatearFecha(fecha: Date): string {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  //ACTUALIZAR LISTAS
  actualizarListas() {
    this.tipos = [...new Set(this.movimientos.map(m => m.tipo))];
    this.productos = [...new Set(this.movimientos.map(m => m.producto))];
    this.fechas = [...new Set(this.movimientos.map(m => m.fecha))];
  }
}
