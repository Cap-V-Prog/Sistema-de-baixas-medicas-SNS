import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {FireauthService} from '../../../firebase/fireauth.service';
import {FirestoreService} from '../../../firebase/firestore.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  utente: string = '';
  password: string = '';

  constructor(private router: Router, private authService: FireauthService,private fireStore:FirestoreService) {}

  async onSubmit() {
    if (!this.isValidUtente(this.utente)) {
      alert('O número de utente deve ter 9 dígitos!');
      return;
    }

    try {
      const patient = await this.fireStore.getPatientBySNS(this.utente);
      if (!patient) {
        alert('Número de utente não encontrado!');
        return;
      }

      const userCredential = await this.authService.login(patient.email, this.password);

      const isMedic = await this.fireStore.checkIfMedic(this.utente);
      if(isMedic) {
        this.router.navigate(['utente']);
      }else{
        this.router.navigate(['users/dashboard']);
      }

      console.log('Login bem-sucedido!', userCredential);

    } catch (error: any) {
      alert(`Erro ao autenticar: ${error.message}`);
    }
  }

  private isValidUtente(utente: string): boolean {
    return /^\d{9}$/.test(utente);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
