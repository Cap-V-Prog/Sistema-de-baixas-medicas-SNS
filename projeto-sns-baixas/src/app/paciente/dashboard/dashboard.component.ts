import { Component } from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass,
    NgForOf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // Lista de baixas médicas (dados de exemplo)
  medicalLeaves = [
    {
      id: 1,
      diagnosis: 'Fratura no braço',
      startDate: '2025-01-01',
      endDate: '2025-01-15',
      status: 'active'
    },
    {
      id: 2,
      diagnosis: 'Gripe forte',
      startDate: '2024-12-15',
      endDate: '2024-12-22',
      status: 'expired'
    },
    {
      id: 3,
      diagnosis: 'Aguardando aprovação',
      startDate: '',
      endDate: '',
      status: 'pending'
    },
    {
      id: 4,
      diagnosis: 'Dor lombar crônica',
      startDate: '2024-11-01',
      endDate: '2024-12-01',
      status: 'expired'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
    {
      id: 5,
      diagnosis: 'Recuperação pós-cirúrgica',
      startDate: '2025-02-01',
      endDate: '2025-02-28',
      status: 'active'
    },
  ];

  // Filtro atual selecionado
  currentFilter: string = 'all';

  // Lista filtrada de baixas médicas
  filteredLeaves = this.medicalLeaves;

  constructor() {
    // Inicializa a lista filtrada com todas as baixas
    this.applyFilter();
  }

  // Define o filtro atual e aplica a filtragem
  setFilter(filter: string): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  // Filtra a lista de baixas médicas com base no filtro atual
  applyFilter(): void {
    if (this.currentFilter === 'all') {
      this.filteredLeaves = this.medicalLeaves;
    } else {
      this.filteredLeaves = this.medicalLeaves.filter(
        (leave) => leave.status === this.currentFilter
      );
    }
  }

  // Método para formatar o status em Title Case
  formatStatus(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }

  // Ação para solicitar uma nova baixa médica
  requestMedicalLeave(): void {
    alert('Solicitar nova baixa médica - funcionalidade em desenvolvimento.');
  }
}
