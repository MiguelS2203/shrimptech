import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoteService, Lote } from '../../services/lote.service';
import { AlertaService } from '../../services/alerta.service';
import { ExportPdfService } from '../../services/export-pdf.service';

@Component({
  selector: 'app-production-lote-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './production-lote-detalle.html',
  styleUrls: ['./production-lote-detalle.css']
})
export class ProductionLoteDetalleComponent implements OnInit {
  lotes: Lote[] = [];

  constructor(
    private loteService: LoteService,
    private alertaService: AlertaService,
    private exportPdfService: ExportPdfService
  ) {}

  ngOnInit(): void {
    // Cargar lotes
    this.lotes = this.loteService.getAll();
    
// Solo agregar historial automático al lote 1
const lote1 = this.lotes.find(l => l.id === 1);

if (lote1 && (!lote1.historial || lote1.historial.length === 0)) {
  this.loteService.addHistorialEntry(
    lote1.id,
    'CREAR',
    'Registro inicial del lote'
  );
}

    // Revisar supervivencia y disparar alertas
    this.lotes.forEach(lote => {
      if (lote.supervivencia !== undefined && lote.supervivencia < 80) {
        this.alertaService.mostrarAlerta(
          `¡Atención! Lote ${lote.lote} tiene supervivencia baja (${lote.supervivencia}%)`,
          'warning'
        );
      }
    });
  }

  // Exportar todos los lotes a PDF
  exportarPDF() {
    this.exportPdfService.exportLotesPDF(this.lotes);
  }
  exportarDetallePDF(lote: Lote) {
  this.exportPdfService.exportLotesPDF([lote]);
}

}
