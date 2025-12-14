import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cosecha-form-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cosecha-form-dialog.html',
  styleUrls: ['./cosecha-form-dialog.css']
})
export class CosechaFormDialog {

  // Área base simulada (puedes cambiarla luego)
  areaEstanque = 100;

  constructor(
    public dialogRef: MatDialogRef<CosechaFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  // ✅ Nuevo cálculo automático
  calcularRendimiento(): number {
    if (!this.data?.cantidadKg || this.areaEstanque === 0) return 0;
    return +(this.data.cantidadKg / this.areaEstanque).toFixed(2);
  }

  guardar() {
    // guardar rendimiento calculado internamente
    this.data.rendimiento = this.calcularRendimiento();
    this.dialogRef.close(this.data);
  }

  cerrar() {
    this.dialogRef.close(null);
  }
}
