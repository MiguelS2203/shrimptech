import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Muestreo } from '../../services/muestreo.service';
import { LoteService, Lote } from '../../services/lote.service';

@Component({
  selector: 'app-muestreo-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './muestreo-form-dialog.html',
  styleUrls: ['./muestreo-form-dialog.css']
})
export class MuestreoFormDialog {

  form: any;
  lotes: Lote[] = [];

  isCreateMode = false;
  isViewMode = false;

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    public dialogRef: MatDialogRef<MuestreoFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isViewMode = data?.viewMode === true;
    this.isCreateMode = !data || !data.id;

    // ✅ Cargar los lotes
    this.lotes = this.loteService.getAll();

    this.form = this.fb.group({
      id: [data?.id ?? 0],
      fecha: [data?.fecha ?? '', Validators.required],
      peso: [data?.peso ?? null, [Validators.required, Validators.min(0)]],
      individuos: [data?.individuos ?? null, [Validators.required, Validators.min(1)]],
      mortalidad: [data?.mortalidad ?? '', Validators.required],
      observaciones: [data?.observaciones ?? ''],
      id_lote: [data?.id_lote ?? null],   // ✅ nuevo
      lote: [data?.lote ?? '']
    });

    if (this.isViewMode) {
      this.form.disable();
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // ✅ Auto asignar nombre de lote
    if (this.form.value.id_lote) {
      const lote = this.lotes.find(l => l.id == this.form.value.id_lote);
      if (lote) {
        this.form.value.lote = lote.lote;
      }
    }

    this.dialogRef.close(this.form.value);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
