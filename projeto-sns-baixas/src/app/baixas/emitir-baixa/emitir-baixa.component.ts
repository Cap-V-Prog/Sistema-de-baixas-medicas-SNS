import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgStyle} from "@angular/common";
import {Observable} from "rxjs";
import {FirestoreService} from "../../../firebase/firestore.service";
import {Patient} from "../../interfaces/patient";
import {SickLeave} from "../../interfaces/sick-leave";

@Component({
  selector: 'app-emitir-baixa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    NgClass
  ],
  templateUrl: './emitir-baixa.component.html',
  styleUrls: ['./emitir-baixa.component.scss']
})
export class EmitirBaixaComponent implements OnInit {
  medicalLeaveForm: FormGroup;
  filteredPatients: Patient[] = []; // Pacientes filtrados com base no SNS
  sickLeaves: SickLeave[] = []; // Baixas médicas do médico
  doctorId: string = 'doctor123'; // ID do médico (isso deve vir de algum lugar, como login)
  today: Date = new Date(); // Data de hoje

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService
  ) {
    this.medicalLeaveForm = this.fb.group({
      sns: ['', [Validators.required, Validators.minLength(3)]], // Campo SNS para buscar pacientes
      diagnosis: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      recommendations: [''],
    });
  }

  ngOnInit(): void {
    // Buscar as baixas médicas do médico ao iniciar o componente
    this.getSickLeaves();
  }

  // Método para buscar pacientes com base no SNS digitado
  onSnsChange(sns: string): void {
    if (sns.length >= 3) {
      this.firestoreService.searchPatientsBySNS(sns).then((patients) => {
        this.filteredPatients = patients.filter((patient) =>
          patient.numeroSNS.includes(sns)
        );
      });
    } else {
      this.filteredPatients = [];
    }
  }

  // Método para buscar as baixas médicas do médico
  getSickLeaves(): void {
    this.firestoreService.getSickLeavesByDoctor(this.doctorId).then((sickLeaves) => {
      this.sickLeaves = sickLeaves;
    });
  }

  // Método para enviar a baixa médica
  submitMedicalLeave(): void {
    if (this.medicalLeaveForm.valid) {
      const medicalLeaveData: SickLeave = {
        id: '', // O Firestore vai gerar o ID
        patient: {
          id: this.medicalLeaveForm.value.sns, // Número do SNS do paciente
          name: '', // O nome do paciente será preenchido mais tarde
        },
        doctor: {
          id: this.doctorId, // ID do médico
          name: '', // Nome do médico, que pode ser obtido do contexto de login
        },
        diagnosis: this.medicalLeaveForm.value.diagnosis,
        period: {
          start: this.medicalLeaveForm.value.startDate,
          end: this.medicalLeaveForm.value.endDate,
        },
        recommendations: this.medicalLeaveForm.value.recommendations,
        createdAt: new Date(),
        isIssued: true,
      };

      this.firestoreService.addSickLeave(medicalLeaveData).then(() => {
        alert('Baixa médica emitida com sucesso!');
        this.medicalLeaveForm.reset();
      });
    }
  }

  fillSnsField(sickLeave: SickLeave): void {
    if (!sickLeave.isIssued) {
      this.medicalLeaveForm.patchValue({ sns: sickLeave.patient.id });
    }
  }
}
