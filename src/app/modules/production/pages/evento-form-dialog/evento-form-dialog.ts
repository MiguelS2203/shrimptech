import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Evento } from '../../services/evento.service';
import { LoteService, Lote } from '../../services/lote.service';

@Component({
  selector: 'app-evento-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './evento-form-dialog.html',
  styleUrls: ['./evento-form-dialog.css']
})
export class EventoFormDialog {

  form: any;
  lotes: Lote[] = [];


  isCreateMode = false;
  isViewMode = false;

  constructor(
    private fb: FormBuilder,
    private loteService: LoteService,
    public dialogRef: MatDialogRef<EventoFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    this.isViewMode = data?.viewMode === true;
    this.isCreateMode = !data || !data.id;

    this.lotes = this.loteService.getAll();

    this.form = this.fb.group({
      id: [data?.id ?? 0],
      fecha: [data?.fecha ?? '', Validators.required],
      tipo: [data?.tipo ?? '', Validators.required],
      id_lote: [data?.id_lote ?? null],   
      lote: [data?.lote ?? ''],
      descripcion: [data?.descripcion ?? '', Validators.required],
      responsable: [data?.responsable ?? '', Validators.required],
      hora: [data?.hora ?? '', Validators.required],
      estado: [data?.estado ?? 'Activo', Validators.required]
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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
