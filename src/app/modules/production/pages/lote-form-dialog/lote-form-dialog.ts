import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lote } from '../../services/lote.service';

@Component({
  selector: 'app-lote-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lote-form-dialog.html',
  styleUrls: ['./lote-form-dialog.css']
})
export class LoteFormDialog {

  form: any;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LoteFormDialog>,

    @Inject(MAT_DIALOG_DATA)
    public data: (Lote & { modo?: string }) | null
  ) {

    this.form = this.fb.group({
      id: [data?.id ?? 0],
      lote: [data?.lote ?? '', Validators.required],
      fecha: [data?.fecha ?? '', Validators.required],
      especie: [data?.especie ?? '', Validators.required],
      cantidad: [data?.cantidad ?? 0, [Validators.required, Validators.min(1)]],
      estanque: [data?.estanque ?? '', Validators.required],
      estado: [data?.estado ?? 'Activo', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data?.modo === 'ver') {
      this.form.disable();
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  cancelar() {
    this.dialogRef.close(null);
  }
}
