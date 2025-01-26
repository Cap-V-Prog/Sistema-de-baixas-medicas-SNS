import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  GeoPoint, query, where, getDocs
} from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import {Patient} from "../app/interfaces/patient";
import {SickLeave} from "../app/interfaces/sick-leave";

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Método para buscar pacientes associados ao médico
  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('doctorId', '==', doctorId)); // Busca pacientes pelo ID do médico
    const querySnapshot = await getDocs(q);
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      patients.push(doc.data() as Patient);
    });
    return patients;
  }

  // Método para buscar pacientes pelo número de SNS
  async searchPatientsBySNS(sns: string): Promise<Patient[]> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('numeroSNS', '>=', sns)); // Filtra pacientes pelo SNS
    const querySnapshot = await getDocs(q);
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      patients.push(doc.data() as Patient);
    });
    return patients;
  }

  // Método para adicionar uma nova baixa médica
  async addSickLeave(sickLeave: SickLeave): Promise<void> {
    const sickLeaveRef = collection(this.firestore, 'sickLeaves');
    await addDoc(sickLeaveRef, {
      ...sickLeave,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Método para buscar baixas médicas de um médico
  async getSickLeavesByDoctor(doctorId: string): Promise<SickLeave[]> {
    const sickLeaveRef = collection(this.firestore, 'sickLeaves');
    const q = query(sickLeaveRef, where('doctor.id', '==', doctorId)); // Busca as baixas médicas do médico
    const querySnapshot = await getDocs(q);
    const sickLeaves: SickLeave[] = [];
    querySnapshot.forEach((doc) => {
      sickLeaves.push(doc.data() as SickLeave);
    });
    return sickLeaves;
  }

  // Método para atualizar uma baixa médica
  async updateSickLeave(sickLeaveId: string, updatedData: Partial<SickLeave>): Promise<void> {
    const sickLeaveRef = doc(this.firestore, 'sickLeaves', sickLeaveId);
    await updateDoc(sickLeaveRef, updatedData);
  }

  // Método para buscar uma baixa médica específica
  async getSickLeaveById(sickLeaveId: string): Promise<SickLeave | null> {
    const sickLeaveRef = doc(this.firestore, 'sickLeaves', sickLeaveId);
    const docSnap = await getDoc(sickLeaveRef);
    if (docSnap.exists()) {
      return docSnap.data() as SickLeave;
    } else {
      return null;
    }
  }
}
