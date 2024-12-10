import {Component, OnInit} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    // Registrar os componentes do Chart.js
    Chart.register(...registerables);

    // Criar o gráfico
    const chartExamesConsultas = new Chart('chartExamesConsultas', {
      type: 'bar',
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março'],
        datasets: [
          {
            label: 'Consultas',
            data: [120, 140, 160],
            backgroundColor: 'rgba(1, 98, 76, 0.7)'
          },
          {
            label: 'Exames',
            data: [30, 45, 35],
            backgroundColor: 'rgba(0, 128, 255, 0.7)'
          }
        ]
      },
      options: {
        responsive: true, // Tornar o gráfico responsivo
        plugins: {
          legend: { display: true }
        },
        scales: {
          y: {
            beginAtZero: true // Começar o eixo Y no zero
          }
        }
      }
    });
  }
}
