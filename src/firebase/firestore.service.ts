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
  GeoPoint, query, where, getDocs, collectionData
} from "@angular/fire/firestore";
import { Observable } from 'rxjs';
import {Patient} from "../app/interfaces/patient";
import {SickLeave} from "../app/interfaces/sick-leave";
import {Medic} from '../app/interfaces/medic';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: Firestore) {}

  // Método para buscar pacientes associados ao médico
  async getPatientsByDoctor(doctorId: string): Promise<Patient[]> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('medicoId', '==', doctorId)); // Busca pacientes pelo ID do médico
    const querySnapshot = await getDocs(q);
    const patients: Patient[] = [];
    querySnapshot.forEach((doc) => {
      patients.push(doc.data() as Patient);
    });
    return patients;
  }

  // Método para buscar pacientes pelo número de SNS associados ao médico
  async searchPatientsBySNS(doctorId: string, sns: string): Promise<Patient[]> {
    if (!sns.trim()) return []; // Evita buscas vazias

    try {
      const patientsRef = collection(this.firestore, 'patients');

      // Prepara o intervalo de SNS (ID de documento)
      const snsStart = sns;
      const snsEnd = sns + '\uf8ff'; // '\uf8ff' é o maior caractere unicode para garantir que todos os SNS com o prefixo sejam pegos

      const q = query(
        patientsRef,
        where('medicoId', '==', doctorId),
        where('__name__', '>=', snsStart), // __name__ é o ID do documento
        where('__name__', '<=', snsEnd) // Fim do intervalo de SNS
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return []; // Retorna um array vazio se não encontrar pacientes

      return querySnapshot.docs.map((doc) => doc.data() as Patient);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      return []; // Em caso de erro, retorna array vazio
    }
  }

  // Método para adicionar uma nova baixa médica
  async addSickLeave(sickLeave: SickLeave, id: string | null): Promise<void> {
    if (id) {
      // Se o id do documento for fornecido, atualiza o documento existente
      const sickLeaveRef = doc(this.firestore, 'sickLeaves', id);
      await setDoc(sickLeaveRef, {
        ...sickLeave,
        updatedAt: new Date(), // Atualiza a data de modificação
      });
    } else {
      // Se o id não for fornecido, cria um novo documento
      const sickLeaveRef = collection(this.firestore, 'sickLeaves');
      const docRef = await addDoc(sickLeaveRef, {
        ...sickLeave,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      // Atualiza o id do documento recém-criado com o id gerado pelo Firestore
      await setDoc(docRef, {
        ...sickLeave,
        id: docRef.id, // Define o id gerado pelo Firestore
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.updateSickLeaveStats(new Date());
    }
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
  async updateSickLeave(sickLeave: SickLeave): Promise<void> {
    if (!sickLeave.id) {
      console.error('Erro: ID da baixa médica não encontrado.');
      return;
    }

    const sickLeaveRef = doc(this.firestore, 'sickLeaves', sickLeave.id);

    await updateDoc(sickLeaveRef, {
      ...sickLeave,
      updatedAt: new Date(), // Atualiza a data de modificação
    });
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

  async getPatientByUID(uid: string): Promise<Patient | null> {
    const patientsRef = collection(this.firestore, 'patients');
    const q = query(patientsRef, where('id', '==', uid)); // Procurar pelo campo 'id' (que é o UID)
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as Patient;
    }
    return null;
  }

  // Buscar baixas médicas de um paciente
  async getSickLeavesByPatient(patientId: string): Promise<SickLeave[]> {
    const sickLeaveRef = collection(this.firestore, 'sickLeaves');
    const q = query(sickLeaveRef, where('patient.id', '==', patientId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as SickLeave);
  }

  async addPatient(patient: Patient): Promise<void> {
    const patientRef = doc(this.firestore, `patients/${patient.numeroSNS}`);
    await setDoc(patientRef, patient);
  }

  async getPatientBySNS(numeroSNS: string): Promise<Patient | null> {
    const patientRef = doc(this.firestore, `patients/${numeroSNS}`);
    const patientSnap = await getDoc(patientRef);

    if (patientSnap.exists()) {
      return patientSnap.data() as Patient;
    }

    return null;
  }

  getMedics(): Observable<Medic[]> {
    const medicsCollection = collection(this.firestore, 'medicos');
    return collectionData(medicsCollection, { idField: 'id' }) as Observable<Medic[]>;
  }

  async checkIfMedic(numeroSNS: string): Promise<boolean> {
    const medicRef = doc(this.firestore, `medicos/${numeroSNS}`);
    const medicSnap = await getDoc(medicRef);
    return medicSnap.exists();
  }

  async getMedicById(numeroSNS: string): Promise<Medic | null> {
    const medicRef = doc(this.firestore, `medicos/${numeroSNS}`);
    const medicSnap = await getDoc(medicRef);

    if (medicSnap.exists()) {
      return medicSnap.data() as Medic;
    }

    return null;
  }

  async getPendingSickLeavesCount(doctorId: string): Promise<number> {
    const sickLeaveRef = collection(this.firestore, 'sickLeaves');
    const q = query(
      sickLeaveRef,
      where('doctor.id', '==', doctorId),
      where('isIssued', '==', false) // Filtra apenas as não emitidas
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size; // Retorna o número de documentos encontrados
  }

  async getIssuedSickLeavesCount(doctorId: string): Promise<number> {
    const sickLeaveRef = collection(this.firestore, 'sickLeaves');
    const q = query(
      sickLeaveRef,
      where('doctor.id', '==', doctorId),
      where('isIssued', '==', true) // Filtra apenas as emitidas
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size; // Retorna o número de documentos encontrados
  }

  async updateSickLeaveStats(createdAt: Date): Promise<void> {
    const year = createdAt.getFullYear().toString(); // Ano da baixa médica
    const month = (createdAt.getMonth() + 1).toString().padStart(2, '0'); // Mês no formato "01", "02", ...

    const statsRef = doc(this.firestore, 'sickLeavesStats', year); // Referência ao documento do ano

    try {
      const statsSnap = await getDoc(statsRef);

      if (statsSnap.exists()) {
        // Se o documento já existe, incrementa o contador do mês
        await updateDoc(statsRef, {
          [month]: (statsSnap.data()[month] || 0) + 1,
        });
      } else {
        // Se não existir, cria um novo documento com o primeiro registro do mês
        await setDoc(statsRef, {
          [month]: 1,
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar estatísticas de baixas:', error);
    }
  }

  async getSickLeavesStats(): Promise<{ [key: string]: number }> {
    const currentYear = new Date().getFullYear().toString();
    const statsRef = doc(this.firestore, 'sickLeavesStats', currentYear);

    try {
      const statsSnap = await getDoc(statsRef);
      return statsSnap.exists() ? statsSnap.data() as { [key: string]: number } : {};
    } catch (error) {
      console.error('Erro ao obter estatísticas de baixas médicas:', error);
      return {};
    }
  }
}
