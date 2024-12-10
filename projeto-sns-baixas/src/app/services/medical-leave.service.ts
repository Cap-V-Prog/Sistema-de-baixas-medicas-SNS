import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  setDoc,
  updateDoc
} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class MedicalLeaveService {


  constructor(private firestore: Firestore) {}

  private async createDocument(docPath: string, data:any): Promise<void> {
    const docReference = doc(this.firestore, docPath);
    await setDoc(docReference,data);
  }

  private async addDocument(collectionPath: string, data: any){
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef,data);
    return doc.id;
  }

  private async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);

    if (docSnap.exists()) {
      return docSnap.data() as T; // Retorna os dados como tipo T
    }
    return null; // Retorna null se o documento não existir
  }

  private async updateDocument(collectionPath: string, data: any): Promise<void> {
    const docRef= doc(this.firestore, collectionPath);
    await updateDoc(docRef, data);
  }

  private async removeDocument(docPath: string, id: string): Promise<void> {
    const docRef= doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }

  async addMedicalLeave(data: any): Promise<string> {
    return await this.addDocument('medicalLeaves', data); // Usa o método addDocument
  }

  // Atualiza um pedido de licença médica existente
  async updateMedicalLeave(docId: string, data: any): Promise<void> {
    const docPath = `medicalLeaves/${docId}`;
    await this.updateDocument(docPath, data); // Usa o método updateDocument
  }

  // Busca os detalhes de um pedido de licença médica
  async getMedicalLeave<T>(docId: string): Promise<T | null> {
    const docPath = `medicalLeaves/${docId}`;
    return await this.getDocument<T>(docPath); // Usa o método getDocument
  }
}
