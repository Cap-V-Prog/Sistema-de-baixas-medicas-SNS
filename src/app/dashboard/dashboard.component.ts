import {Component, OnInit} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {BackOfficeComponent} from '../back-office/back-office.component';
import {FirestoreService} from '../../firebase/firestore.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private chart!: Chart;
  constructor(protected backoffice:BackOfficeComponent,private firestore:FirestoreService) {
  }

  async ngOnInit(): Promise<void> {
    Chart.register(...registerables); // Registrar Chart.js
    await this.loadSickLeavesChart(); // Carregar o gráfico com os dados
  }

  async loadSickLeavesChart(): Promise<void> {
    const monthlyData = await this.firestore.getSickLeavesStats();

    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const sickLeavesCount = months.map((_, index) =>
      monthlyData[(index + 1).toString().padStart(2, '0')] || 0
    );

    this.chart = new Chart('chartSickLeaves', {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Baixas Emitidas',
          data: sickLeavesCount,
          backgroundColor: 'rgba(1, 98, 76, 0.7)'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}
