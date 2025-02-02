import {Component, OnInit} from '@angular/core';
import {DatePipe, NgClass, NgForOf} from "@angular/common";
import {FirestoreService} from '../../../firebase/firestore.service';
import {SickLeave} from '../../interfaces/sick-leave';
import { Timestamp } from 'firebase/firestore';
import {FireauthService} from '../../../firebase/fireauth.service';
import {Patient} from '../../interfaces/patient';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    DatePipe
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  // Informações do paciente
  patientName: string = 'Carregando...';
  patient: Patient | null = null;

  // Lista de baixas médicas
  medicalLeaves: SickLeave[] = [];
  filteredLeaves: SickLeave[] = [];

  // Filtro atual
  currentFilter: string = 'all';

  constructor(private firestoreService: FirestoreService,private fireauthService: FireauthService,private router: Router) {}

  async ngOnInit() {
    const user = this.fireauthService.getCurrentUser();

    // 🔹 Se não estiver logado, redireciona para o login
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // 🔹 Se estiver logado, carrega os dados
    await this.loadPatientData(user.uid);
    if (this.patient) {
      await this.loadMedicalLeaves();
    }
  }

  // Carregar dados do paciente
  async loadPatientData(patientId: string) {
    this.patient = await this.firestoreService.getPatientByUID(patientId);
    if(this.patient) {
      this.patientName=this.patient.nome;
    }
  }

  // Carregar baixas médicas do Firestore
  async loadMedicalLeaves() {
    if (!this.patient) return;
    const leaves = await this.firestoreService.getSickLeavesByPatient(this.patient.numeroSNS);
    this.medicalLeaves = leaves.map(leave => ({
      ...leave,
      createdAt: leave.createdAt instanceof Timestamp ? leave.createdAt.toDate() : new Date(),
      updatedAt: leave.updatedAt instanceof Timestamp ? leave.updatedAt.toDate() : new Date(),
    }));
    this.applyFilter();
  }

  getLeaveStatus(leave: SickLeave): string {
    if (!leave.isIssued) return 'pending';
    const now = new Date();
    const endDate = leave.period.end ? new Date(leave.period.end) : null;
    return endDate && endDate < now ? 'expired' : 'active';
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

  async requestMedicalLeave() {
    const hasPendingLeave = this.medicalLeaves.some(leave => leave.status === 'pending');
    if (hasPendingLeave) {
      alert('Já existe uma baixa médica pendente. Não é possível solicitar outra.');
      return;
    }

    if(this.patient){
      const newLeave: SickLeave = {
        id: '',
        patient: { id: this.patient.numeroSNS, name: this.patientName },
        doctor: { id: this.patient.medicoId, name: 'null' },
        diagnosis: '',
        period: { start: null, end: null },
        recommendations: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        isIssued: false,
        status: 'pending'
      };
      await this.firestoreService.addSickLeave(newLeave,null);
      alert('Solicitação de baixa médica enviada com sucesso!');
      this.loadMedicalLeaves();
    }
  }
}
