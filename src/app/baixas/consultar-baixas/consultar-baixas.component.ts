import {Component, OnInit} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {SickLeave} from '../../interfaces/sick-leave';
import {FirestoreService} from '../../../firebase/firestore.service';
import {BackOfficeComponent} from '../../back-office/back-office.component';
import {Timestamp} from 'firebase/firestore';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-consultar-baixas',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    FormsModule,
    NgIf
  ],
  templateUrl: './consultar-baixas.component.html',
  styleUrl: './consultar-baixas.component.scss'
})
export class ConsultarBaixasComponent implements OnInit {
  sickLeaves: SickLeave[]=[];
  filteredSickLeaves: SickLeave[] = [];
  selectedSickLeave: SickLeave | null = null;

  constructor(private sickLeaveService: FirestoreService, private backoffice:BackOfficeComponent) {}

  async ngOnInit(){
    await this.loadSickLeaves();
  }

  async loadSickLeaves() {
    if(this.backoffice.patient?.numeroSNS){
      this.sickLeaves = await this.sickLeaveService.getSickLeavesByDoctor(this.backoffice.patient?.numeroSNS);

      // Converter `createdAt` de Timestamp para Date
      this.sickLeaves.forEach(sickLeave => {
        if (sickLeave.createdAt instanceof Timestamp) {
          sickLeave.createdAt = sickLeave.createdAt.toDate(); // Converte Timestamp para Date
        }
      });

      this.filteredSickLeaves = [...this.sickLeaves];
    }
  }

  filterTable(event: Event, column: keyof SickLeave | 'patient.name') {
    const query = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredSickLeaves = this.sickLeaves.filter((sickLeave) => {
      let value;

      if (column === 'createdAt') {
        value = new Date(sickLeave.createdAt).toISOString().split('T')[0]; // Formata a data para YYYY-MM-DD
        return value.includes(query);
      } else if (column.includes('.')) {
        value = (sickLeave as any)[column.split('.')[0]][column.split('.')[1]];
      } else {
        value = sickLeave[column as keyof SickLeave];
      }

      return value.toString().toLowerCase().includes(query);
    });
  }

  openEditModal(sickLeave: SickLeave) {
    this.selectedSickLeave = { ...sickLeave }; // Criar uma cópia para edição
  }

  closeEditModal() {
    this.selectedSickLeave = null;
  }

  async updateSickLeave() {
    if (!this.selectedSickLeave) return;

    await this.sickLeaveService.updateSickLeave(this.selectedSickLeave);

    this.loadSickLeaves(); // Recarregar os dados após atualização
    this.closeEditModal();
  }
}
