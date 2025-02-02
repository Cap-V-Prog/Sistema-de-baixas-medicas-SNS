import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { MatDialogRef } from '@angular/material/dialog';
import {FirestoreService} from '../../../firebase/firestore.service';
import {FireauthService} from '../../../firebase/fireauth.service';
import {Patient} from '../../interfaces/patient';
import {Medic} from '../../interfaces/medic';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private router: Router,private fireauthService: FireauthService, private firestore:FirestoreService) {}

  name: string = '';
  utente: string = ''; // Número de SNS
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  morada: string = '';
  bilheteIdentidade: string = '';
  dataNascimento: Date = new Date();
  medicoId: string = '';

  async onSubmit() {
    if (!this.isValidForm()) return;

    try {
      // Criar usuário no Firebase Authentication
      const userCredential = await this.fireauthService.register(this.email, this.password);
      const uid = userCredential?.user.uid;

      // Buscar médicos e selecionar um aleatoriamente
      const medics = await this.getRandomMedic();
      const medicoId = medics ? medics.id : '';

      // Criar paciente no Firestore
      if(uid){
        const newPatient: Patient = {
          id: uid,
          nome: this.name,
          email: this.email,
          morada: this.morada,
          bilheteIdentidade: this.bilheteIdentidade,
          dataNascimento: this.dataNascimento!,
          numeroSNS: this.utente,
          medicoId: medicoId,
        };

        await this.firestore.addPatient(newPatient);
        alert('Registro bem-sucedido!');
        this.router.navigate(['/login']);
      }else{
        return
      }
    } catch (error) {
      console.error('Erro ao registrar:', error);
      alert('Erro ao registrar. Tente novamente.');
    }
  }

  private async getRandomMedic(): Promise<Medic | null> {
    return new Promise((resolve, reject) => {
      this.firestore.getMedics().subscribe((medics) => {
        if (medics.length === 0) {
          resolve(null);
        } else {
          const randomMedic = medics[Math.floor(Math.random() * medics.length)];
          resolve(randomMedic);
        }
      }, reject);
    });
  }

  private isValidForm(): boolean {
    if (this.name.trim().length < 3) {
      alert('O nome deve conter pelo menos 3 caracteres.');
      return false;
    }
    if (!/^\d{9}$/.test(this.utente)) {
      alert('O número de utente deve ter 9 dígitos!');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      alert('Por favor, insira um email válido.');
      return false;
    }
    if (this.password.length < 6) {
      alert('A senha deve conter pelo menos 6 caracteres.');
      return false;
    }
    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return false;
    }
    if (!this.morada.trim()) {
      alert('A morada é obrigatória.');
      return false;
    }
    if (!this.bilheteIdentidade.trim()) {
      alert('O Bilhete de Identidade é obrigatório.');
      return false;
    }
    if (!this.dataNascimento) {
      alert('A Data de Nascimento é obrigatória.');
      return false;
    }
    return true;
  }

  navigateToLogin() {
    this.router.navigate(['/login']); // Navega para a página de login
  }
}
