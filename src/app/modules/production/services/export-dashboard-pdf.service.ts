import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class ExportDashboardPdfService {

  async exportDashboardPDF(
    indicadores: any,
    lotes: any[],
    muestreos: any[],
    cosechas: any[],
    eventos: any[]
  ) {

    const doc = new jsPDF("p", "mm", "a4");

    // ================================
    // TITULO Y RESUMEN (MISMA ESTRUCTURA)
    // ================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Informe Completo de Producción", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);

    doc.text(
      "Este informe reúne toda la información mostrada en el dashboard de producción,",
      14, 40
    );
    doc.text(
      "permitiendo tener un documento completo para análisis, auditorías o envíos.",
      14, 46
    );
    doc.text("- Indicadores del sistema", 14, 55);
    doc.text("- Gráficos comparativos", 14, 61);
    doc.text("- Listado de lotes, muestreos, cosechas y eventos", 14, 67);

    let y = 75;

    // ================================
    // INDICADORES (MISMO BLOQUE, MÁS DETALLE)
    // ================================
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Indicadores Generales", 14, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(`• Densidad Inicial: ${indicadores.densidadInicial}`, 14, y);
    y += 8;
    doc.text(`• Supervivencia Promedio: ${indicadores.tasaSupervivencia}%`, 14, y);
    y += 8;
    doc.text(`• Rendimiento Promedio: ${indicadores.rendimientoPromedio} Kg`, 14, y);
    y += 12;

    doc.setFontSize(11);
    doc.text(
      "Estos indicadores permiten evaluar la eficiencia biológica y productiva de los cultivos.",
      14, y
    );
    y += 6;
    doc.text(
      "El análisis de estas métricas es clave para identificar mejoras, problemas operativos",
      14, y
    );
    y += 6;
    doc.text(
      "y tomar decisiones que optimicen los procesos de cultivo y cosecha.",
      14, y
    );
    y += 15;

    // ================================
    // GRAFICOS (MISMO LAYOUT, MÁS TEXTO)
    // ================================
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Análisis Visual", 14, y);
    y += 10;

    const canvas1 = document.getElementById("graficoCrecimiento") as HTMLCanvasElement;
    const canvas2 = document.getElementById("graficoSupervivencia") as HTMLCanvasElement;

    const img1 = canvas1 ? canvas1.toDataURL("image/png") : null;
    const img2 = canvas2 ? canvas2.toDataURL("image/png") : null;

    if (img1) doc.addImage(img1, "PNG", 10, y, 90, 60);
    if (img2) doc.addImage(img2, "PNG", 110, y, 90, 60);

    y += 70;

    doc.setFontSize(11);
    doc.text("• Gráfico de crecimiento: Muestra la evolución del peso en el tiempo.", 14, y);
    y += 6;
    doc.text(
      "  Este análisis permite identificar patrones de alimentación, salud y desempeño biológico.",
      14, y
    );
    y += 6;
    doc.text(
      "• Gráfico de supervivencia: Refleja la estabilidad sanitaria del cultivo.",
      14, y
    );
    y += 6;
    doc.text(
      "  Una supervivencia estable indica buenas prácticas de manejo, nutrición y bioseguridad.",
      14, y
    );
    y += 14;

    // ================================
    // LOTES
    // ================================
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Lotes Registrados", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Lote", "Especie", "Estanque", "Cantidad"]],
      body: lotes.map(l => [l.lote, l.especie, l.estanque, l.cantidad]),
      theme: "grid",
      headStyles: { fillColor: [0, 150, 200] }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ================================
    // MUESTREOS
    // ================================
    doc.setFontSize(18);
    doc.text("Muestreos Registrados", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Fecha", "Peso (g)", "Mortalidad"]],
      body: muestreos.map(m => [m.fecha, m.peso, m.mortalidad]),
      theme: "grid",
      headStyles: { fillColor: [0, 150, 200] }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ================================
    // COSECHAS
    // ================================
    doc.setFontSize(18);
    doc.text("Cosechas Registradas", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Fecha", "Kg", "Supervivencia"]],
      body: cosechas.map(c => [c.fecha, c.cantidadKg, c.sobrevivencia]),
      theme: "grid",
      headStyles: { fillColor: [0, 150, 200] }
    });

    y = (doc as any).lastAutoTable.finalY + 12;

    // ================================
    // EVENTOS
    // ================================
    doc.setFontSize(18);
    doc.text("Eventos Registrados", 14, y);
    y += 5;

    autoTable(doc, {
      startY: y,
      head: [["Fecha", "Tipo"]],
      body: eventos.map(e => [e.fecha, e.tipo]),
      theme: "grid",
      headStyles: { fillColor: [0, 150, 200] }
    });

    doc.save("informe-produccion.pdf");
  }
}
