import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Observable} from "rxjs";
import {FirestoreService} from "../../../firebase/firestore.service";
import {Patient} from "../../interfaces/patient";
import {SickLeave} from "../../interfaces/sick-leave";
import {BackOfficeComponent} from '../../back-office/back-office.component';

@Component({
  selector: 'app-emitir-baixa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './emitir-baixa.component.html',
  styleUrls: ['./emitir-baixa.component.scss']
})
export class EmitirBaixaComponent implements OnInit {
  sns: string = '';
  diagnosis: string = '';
  startDate: Date | null = null; // Mudado para Date
  endDate: Date | null = null; // Mudado para Date
  recommendations: string = '';
  filteredPatients: Patient[] = []; // Pacientes filtrados com base no SNS
  sickLeaves: SickLeave[] = []; // Baixas médicas do médico
  doctorId: string = ''; // ID do médico (isso deve vir de algum lugar, como login)
  sickLeaveId: string|null = null;

  constructor(
    private firestoreService: FirestoreService,
    private backOffice:BackOfficeComponent,
  ) {}

  ngOnInit(): void {
    // Buscar as baixas médicas do médico ao iniciar o componente
    if(this.backOffice.patient?.numeroSNS){
      this.doctorId=this.backOffice.patient.numeroSNS;
    }
    this.getSickLeaves();
  }

  // Método para buscar pacientes com base no SNS digitado
  onSnsChange(sns: string): void {
    if (sns.length >= 3) {
      this.firestoreService.searchPatientsBySNS(this.doctorId, sns).then((patients) => {
        console.log(patients);
        this.filteredPatients = patients.filter((patient) =>
          patient.numeroSNS.includes(sns)
        );
      });
    } else {
      this.filteredPatients = [];
    }
    this.isFormValid();
  }

  // Método para buscar as baixas médicas do médico
  getSickLeaves(): void {
    this.firestoreService.getSickLeavesByDoctor(this.doctorId).then((sickLeaves) => {
      this.sickLeaves = sickLeaves;
    });
  }

  // Método para enviar a baixa médica
  async submitMedicalLeave() {
    const patient = await this.firestoreService.getPatientBySNS(this.sns);
    if (this.backOffice.patient && patient) {
      if (this.isFormValid()) {
        const medicalLeaveData: SickLeave = {
          id: '', // Será atribuído ao Firestore automaticamente
          patient: {
            id: this.sns,
            name: patient.nome,
          },
          doctor: {
            id: this.doctorId,
            name: this.backOffice.patient.nome,
          },
          diagnosis: this.diagnosis,
          period: {
            start: this.startDate,
            end: this.endDate,
          },
          recommendations: this.recommendations,
          createdAt: new Date(),
          isIssued: true,
          status: 'active',
        };

        // Adiciona ou atualiza a baixa médica
        await this.firestoreService.addSickLeave(medicalLeaveData, this.sickLeaveId).then(() => {
          alert('Baixa médica emitida com sucesso!');
          this.resetForm();

          // Atualiza a lista de baixas médicas após a alteração
          this.getSickLeaves();
        });
      }
    }
  }

  // Método para verificar se o formulário é válido
  isFormValid(): boolean {
    // Verifica se o SNS tem pelo menos 3 caracteres e se o diagnóstico tem pelo menos 10 caracteres
    const isSnsValid = this.sns.length >= 3;
    const isDiagnosisValid = this.diagnosis.length >= 10;

    // Verifica se startDate e endDate são válidos (convertendo para Date)
    const isStartDateValid = this.startDate && !isNaN(new Date(this.startDate!).getTime()) || false; // Garante que seja boolean
    const isEndDateValid = this.endDate && !isNaN(new Date(this.endDate!).getTime()) || false; // Garante que seja boolean

    // Verifica se a data de início é anterior à data de término
    let isDateRangeValid = false;
    if (isStartDateValid && isEndDateValid) {
      const startDateObj = new Date(this.startDate!);
      const endDateObj = new Date(this.endDate!);
      isDateRangeValid = startDateObj <= endDateObj; // Data de início deve ser menor ou igual à data de término
    }

    return isSnsValid && isDiagnosisValid && isStartDateValid && isEndDateValid && isDateRangeValid;
  }

  // Método para resetar o formulário
  resetForm(): void {
    this.sns = '';
    this.diagnosis = '';
    this.startDate = null;
    this.endDate = null;
    this.recommendations = '';
    this.filteredPatients = [];
  }

  fillSnsField(sickLeave: SickLeave): void {
    if (!sickLeave.isIssued) {
      this.sns = sickLeave.patient.id;
      this.sickLeaveId=sickLeave.id;
      console.log(sickLeave.id);
    }
  }

  fillSnsField2(patient: Patient): void {
    this.sns = patient.numeroSNS; // Preenche o campo de SNS com o número do paciente
    this.filteredPatients = []; // Limpa as sugestões após seleção
  }
}
