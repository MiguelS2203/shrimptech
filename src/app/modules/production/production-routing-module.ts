import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then(m => m.ProductionHomeComponent) },
  { path: 'dashboard', loadComponent: () => import('./pages/production-dashboard/production-dashboard').then(m => m.ProductionDashboardComponent) },

  // LOTES
  { path: 'lotes', loadComponent: () => import('./pages/lote-list/lote-list').then(m => m.LoteListComponent) },
  { path: 'lotes/nuevo', loadComponent: () => import('./pages/lote-form/lote-form').then(m => m.LoteFormComponent) },

  // 🔥 LA QUE YA TENÍAS
  { path: 'lotes/detalle', loadComponent: () => import('./pages/production-lote-detalle/production-lote-detalle').then(m => m.ProductionLoteDetalleComponent) },

  // 🔥 LA QUE FALTABA (AGREGADA)
  { path: 'lotes/detalle/:id', loadComponent: () => import('./pages/production-lote-detalle/production-lote-detalle').then(m => m.ProductionLoteDetalleComponent) },

  // EVENTOS
  { path: 'eventos', loadComponent: () => import('./pages/eventos/eventos').then(m => m.EventoListComponent) },
  { path: 'eventos/nuevo', loadComponent: () => import('./pages/eventos-form/eventos-form').then(m => m.EventosFormComponent) },

  // MUESTREOS
  { path: 'muestreos', loadComponent: () => import('./pages/muestreos/muestreos').then(m => m.MuestreosComponent) },
  { path: 'muestreos/nuevo', loadComponent: () => import('./pages/muestreo-form/muestreo-form').then(m => m.MuestreoFormComponent) },

  // COSECHA
  { path: 'cosecha', loadComponent: () => import('./pages/cosecha/cosecha').then(m => m.CosechaComponent) },
  { path: 'cosecha/nuevo', loadComponent: () => import('./pages/cosecha-form/cosecha-form').then(m => m.CosechaFormComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductionRoutingModule {}
