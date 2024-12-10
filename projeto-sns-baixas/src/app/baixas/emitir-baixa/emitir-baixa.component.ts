import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MedicalLeaveService} from "../../services/medical-leave.service";
import {DatePipe, NgClass, NgForOf} from "@angular/common";

@Component({
  selector: 'app-emitir-baixa',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    NgClass
  ],
  templateUrl: './emitir-baixa.component.html',
  styleUrl: './emitir-baixa.component.scss'
})
export class EmitirBaixaComponent {
  medicalLeaveForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private medicalLeaveService: MedicalLeaveService
  ) {
    this.medicalLeaveForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      diagnosis: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      recommendations: [''],
    });
  }

  submitMedicalLeave() {
    if (this.medicalLeaveForm.valid) {
      const medicalLeaveData = this.medicalLeaveForm.value;
      this.medicalLeaveService
        .addMedicalLeave(medicalLeaveData)
        .then(() => {
          alert('Baixa médica emitida com sucesso!');
          this.medicalLeaveForm.reset();
        })
        .catch((error:any) => {
          console.error('Erro ao emitir a baixa médica:', error);
        });
    }
  }

  medicalLeaveRecords = [
    {
      patientName: 'João Silva',
      lastLeaveDate: new Date('2023-11-01'),
      hasPendingLeaves: true,
    },
    {
      patientName: 'Maria Oliveira',
      lastLeaveDate: new Date('2023-10-25'),
      hasPendingLeaves: false,
    },
    {
      patientName: 'Carlos Pereira',
      lastLeaveDate: new Date('2023-09-12'),
      hasPendingLeaves: true,
    },
  ];
}
