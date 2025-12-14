import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { Lote } from './lote.service';


@Injectable({
  providedIn: 'root'
})
export class ExportPdfService {

  async exportLotesPDF(lotes: Lote[], fileName: string = 'lotes.pdf') {
    const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let cursorY = 20;


    doc.setFontSize(18);
    doc.setTextColor(0, 151, 167);
    doc.text('Reporte Completo de Lotes', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 8;

    doc.setFontSize(11);
    const fecha = new Date().toLocaleString();
    doc.setTextColor(0, 0, 0);
    doc.text(`Fecha de generación: ${fecha}`, margin, cursorY);
    cursorY += 6;


    try {
      const banner = document.querySelector('.titulo-banner-detalle') as HTMLElement | null;
      if (banner) {
        const canvasBanner = await html2canvas(banner, { scale: 2 });
        const imgData = canvasBanner.toDataURL('image/png');
        const imgW = pageWidth - 2 * margin;
        const imgH = (canvasBanner.height * imgW) / canvasBanner.width;
        cursorY += 4;
        doc.addImage(imgData, 'PNG', margin, cursorY, imgW, imgH);
        cursorY += imgH + 6;
      } else {
        cursorY += 8;
      }
    } catch (err) {
      cursorY += 8;
    }

    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 6;

    const addLoteFicha = (lote: Lote) => {
      doc.setFontSize(13);
      doc.setTextColor(0, 131, 140);
      doc.text(`Lote: ${lote.lote ?? '—'}`, margin, cursorY);
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      const leftX = margin;
      const rightX = pageWidth / 2 + 5;
      const rowGap = 5;
      let y = cursorY + 6;

      const fichaLeft = [
        ['Especie', lote.especie ?? '—'],
        ['Estanque', lote.estanque ?? '—'],
        ['Cantidad inicial', String(lote.cantidad ?? '—')],
        ['Densidad inicial', lote.densidadInicial ?? 'N/A'],
      ];
      const fichaRight = [
        ['Fecha creación', lote.fecha ?? '—'],
        ['Estado', lote.estado ?? '—'],
        ['Supervivencia', lote.supervivencia !== undefined ? `${lote.supervivencia}%` : 'N/A'],
        ['Rendimiento estimado', lote.rendimiento !== undefined ? `${lote.rendimiento} Kg` : 'N/A'],
      ];

      doc.setFontSize(10);
      fichaLeft.forEach((r, i) => {
        doc.text(`${r[0]}:`, leftX, y + i * rowGap);
        doc.text(String(r[1]), leftX + 45, y + i * rowGap);
      });
      fichaRight.forEach((r, i) => {
        doc.text(`${r[0]}:`, rightX, y + i * rowGap);
        doc.text(String(r[1]), rightX + 55, y + i * rowGap);
      });

      cursorY = y + fichaLeft.length * rowGap + 6;

      const densidad = lote.densidadInicial ?? 'N/A';
      const supervivencia = lote.supervivencia !== undefined ? `${lote.supervivencia}%` : 'N/A';
      const rendimiento = lote.rendimiento !== undefined ? `${lote.rendimiento} Kg` : 'N/A';

      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`Resumen — Densidad: ${densidad} | Supervivencia: ${supervivencia} | Rendimiento: ${rendimiento}`, margin, cursorY);
      cursorY += 6;

      if (lote.historial && lote.historial.length) {
        const head = [['Fecha', 'Acción', 'Detalle']];
        const body = lote.historial.map(h => [
          h.fecha ?? '', 
          h.accion ?? '', 
          (h.detalle ?? '').toString()
        ]);
        autoTable(doc, {
          startY: cursorY,
          head, 
          body,
          theme: 'grid',
          headStyles: { fillColor: [0, 150, 167] },
          styles: { fontSize: 9 },
          margin: { left: margin, right: margin }

        });
        cursorY = (doc as any).lastAutoTable?.finalY || (cursorY + 30);

        cursorY = (doc as any).lastAutoTable?.finalY ?? (cursorY + 30);
      } else {
        doc.setFontSize(10);
        doc.text('No hay historial registrado.', margin, cursorY);
        cursorY += 8;
      }

      cursorY += 4;
      doc.setDrawColor(230);
      doc.line(margin, cursorY, pageWidth - margin, cursorY);
      cursorY += 8;

      if (cursorY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        cursorY = 20;
      }
    };

    for (let i = 0; i < lotes.length; i++) {
      addLoteFicha(lotes[i]);
    }

    try {
      const canvases = Array.from(document.querySelectorAll('canvas'));
      if (canvases.length) {
       
        doc.addPage();
        cursorY = 18;
        doc.setFontSize(13);
        doc.setTextColor(0, 131, 140);
        doc.text('Gráficas y análisis visual', margin, cursorY);
        cursorY += 8;

        for (const c of canvases) {

          const canvasImage = await html2canvas(c as HTMLElement, { scale: 2 });
          const imgData = canvasImage.toDataURL('image/png');

          const maxImgW = pageWidth - margin * 2;
          const imgH = (canvasImage.height * maxImgW) / canvasImage.width;

          if (cursorY + imgH > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage();
            cursorY = 18;
          }

          doc.addImage(imgData, 'PNG', margin, cursorY, maxImgW, imgH);
          cursorY += imgH + 8;
        }
      }
    } catch (err) {
      console.warn('No se pudieron capturar las gráficas:', err);
    }
    doc.addPage();
    doc.setFontSize(14);
    doc.setTextColor(0, 131, 140);
    doc.text('Resumen ejecutivo', margin, 22);

    const totalLotes = lotes.length;
    const supValues = lotes.map(l => (typeof l.supervivencia === 'number' ? l.supervivencia : null)).filter(v => v !== null) as number[];
    const avgSup = supValues.length ? (supValues.reduce((a,b)=>a+b,0)/supValues.length).toFixed(1) : 'N/A';

    const resumenLines = [
      `Lotes incluidos: ${totalLotes}`,
      `Supervivencia promedio: ${avgSup}${avgSup === 'N/A' ? '' : '%'}`,
      `Fecha de generación: ${fecha}`,
    ];

    doc.setFontSize(11);
    doc.setTextColor(0,0,0);
    let ry = 30;
    resumenLines.forEach(line => {
      doc.text(line, margin, ry);
      ry += 7;
    });

    doc.save(fileName);
  }
}
