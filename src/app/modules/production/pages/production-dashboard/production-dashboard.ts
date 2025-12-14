import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';

import { LoteService, Lote } from '../../services/lote.service';
import { EventoService, Evento } from '../../services/evento.service';
import { MuestreoService, Muestreo } from '../../services/muestreo.service';
import { CosechaService, Cosecha } from '../../services/cosecha.service';
import { ExportDashboardPdfService } from '../../services/export-dashboard-pdf.service';

@Component({
  selector: 'app-production-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './production-dashboard.html',
  styleUrls: ['./production-dashboard.css']
})
export class ProductionDashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('detalleDashboard', { static: false }) detalleDashboard!: ElementRef;

  lotes: Lote[] = [];
  muestreos: Muestreo[] = [];
  cosechas: Cosecha[] = [];
  eventos: Evento[] = [];

  densidadInicial = 0;
  tasaSupervivencia = 0;
  rendimientoPromedio = 0;

  constructor(
    private loteService: LoteService,
    private eventoService: EventoService,
    private muestreoService: MuestreoService,
    private cosechaService: CosechaService,
    private exportDashboardPdf: ExportDashboardPdfService

  ) {}

  ngOnInit() {

    this.loteService.lotes$.subscribe(data => {
      this.lotes = data.slice(-5).reverse();
      this.calcularIndicadores();
      this.actualizarGraficos();
    });

    this.eventoService.eventos$.subscribe(data => {
      this.eventos = data.slice(-5).reverse();
    });

    this.muestreoService.muestreos$.subscribe(data => {
      this.muestreos = data.slice(-5).reverse();
      this.calcularIndicadores();
      this.actualizarGraficos();
    });

    this.cosechaService.cosechas$.subscribe(data => {
      this.cosechas = data.slice(-5).reverse();
      this.calcularIndicadores();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.actualizarGraficos();
    }, 200);
  }

  actualizarGraficos() {
    this.graficarCrecimiento();
    this.graficarSupervivencia();
  }

  graficarCrecimiento() {
    const muestreos = this.muestreoService.getAll();

    const fechas = muestreos.map(m => m.fecha);
    const pesos = muestreos.map(m => m.peso);

    const canvas = document.getElementById('graficoCrecimiento') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{ label: 'Crecimiento (Peso g)', data: pesos }]
      }
    });
  }

  graficarSupervivencia() {
    const muestreos = this.muestreoService.getAll();

    const fechas = muestreos.map(m => m.fecha);
    const supervivencia = muestreos.map(m => 100 - (Number(m.mortalidad) || 0));

    const canvas = document.getElementById('graficoSupervivencia') as HTMLCanvasElement;
    if (!canvas) return;

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{ label: 'Supervivencia (%)', data: supervivencia }]
      }
    });
  }

  calcularIndicadores() {
    const areaEstanque = 100;

    const totalCamarones = this.lotes.reduce((sum, l) => sum + (l.cantidad || 0), 0);
    this.densidadInicial = +(totalCamarones / areaEstanque).toFixed(2);

    const supervivencias = this.cosechas.map(c => c.sobrevivencia || 0);
    this.tasaSupervivencia = supervivencias.length
      ? +(supervivencias.reduce((a, b) => a + b, 0) / supervivencias.length).toFixed(2)
      : 0;

    const rendimientos = this.cosechas.map(c => c.cantidadKg || 0);
    this.rendimientoPromedio = rendimientos.length
      ? +(rendimientos.reduce((a, b) => a + b, 0) / rendimientos.length).toFixed(2)
      : 0;
  }

  // ⬇⬇⬇ **CAPTURA SOLO CANVAS DENTRO DE .detalle-dashboard**
  private getCanvasImages(): string[] {
    if (!this.detalleDashboard) return [];

    const canvasElements = this.detalleDashboard.nativeElement.querySelectorAll('canvas');
    const images: string[] = [];

    canvasElements.forEach((canvas: HTMLCanvasElement) => {
      try {
        const img = canvas.toDataURL('image/png', 1.0);
        images.push(img);
      } catch (e) {
        console.error('Error exportando canvas:', e);
      }
    });

    return images;
  }

  // ⬇⬇⬇ **EXPORTACIÓN PDF COMPLETA**
  exportarPDF() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFontSize(22);
    pdf.text('📊 Informe Completo de Producción', 10, 20);

    pdf.setFontSize(14);
    pdf.text(`Densidad Inicial: ${this.densidadInicial}`, 10, 40);
    pdf.text(`Supervivencia Promedio: ${this.tasaSupervivencia}%`, 10, 50);
    pdf.text(`Rendimiento Promedio: ${this.rendimientoPromedio} Kg`, 10, 60);

    // Agregar gráficos
    const images = this.getCanvasImages();

    images.forEach((img, i) => {
      pdf.addPage();
      pdf.setFontSize(16);
      pdf.text(`Gráfico ${i + 1}`, 10, 20);
      pdf.addImage(img, 'PNG', 10, 30, 180, 120);
    });

    pdf.save('informe-produccion.pdf');
  }
  exportarDashboardPDF() {
  this.exportDashboardPdf.exportDashboardPDF(
    {
      densidadInicial: this.densidadInicial,
      tasaSupervivencia: this.tasaSupervivencia,
      rendimientoPromedio: this.rendimientoPromedio
    },
    this.lotes,
    this.muestreos,
    this.cosechas,
    this.eventos
  );
}

}
