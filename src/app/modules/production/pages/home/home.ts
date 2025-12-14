import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoteService } from '../../services/lote.service';

@Component({
  selector: 'app-production-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class ProductionHomeComponent implements OnInit {
  ultimoLoteId: number | null = null;

  constructor(private loteService: LoteService) {}

  ngOnInit(): void {
    const lotes = this.loteService.getAll();
    if (lotes.length > 0) {
      this.ultimoLoteId = lotes[lotes.length - 1].id; // último lote registrado
    }
  }
}
