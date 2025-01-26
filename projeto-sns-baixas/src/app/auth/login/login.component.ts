import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";

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

  constructor(private router: Router) {}

  onSubmit() {
    if (!this.isValidUtente(this.utente)) {
      alert('O número de utente deve ter 9 dígitos!');
      return;
    }

    if (this.authenticateUser(this.utente, this.password)) {
      console.log('Login bem-sucedido!');
      this.router.navigate(['']); // Navega para o dashboard após login
    } else {
      alert('Credenciais inválidas!');
    }
  }

  private isValidUtente(utente: string): boolean {
    const utenteRegex = /^\d{9}$/;
    return utenteRegex.test(utente);
  }

  private authenticateUser(utente: string, password: string): boolean {
    // Lógica de autenticação simulada
    // Substituir por chamada à API real
    return utente === '123456789' && password === 'password123';
  }

  navigateToRegister() {
    this.router.navigate(['/Register']); // Navega para a página de login
  }
}
