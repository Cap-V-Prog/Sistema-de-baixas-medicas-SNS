import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import { MatDialogRef } from '@angular/material/dialog';

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
  constructor(private router: Router) {}

  name: string = '';
  utente: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    if (!this.isValidName(this.name)) {
      alert('O nome deve conter pelo menos 3 caracteres.');
      return;
    }

    if (!this.isValidUtente(this.utente)) {
      alert('O número de utente deve ter 9 dígitos!');
      return;
    }

    if (!this.isValidEmail(this.email)) {
      alert('Por favor, insira um email válido.');
      return;
    }

    if (!this.isValidPassword(this.password)) {
      alert('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    console.log('Nome:', this.name);
    console.log('Número de Utente:', this.utente);
    console.log('Email:', this.email);
    console.log('Senha:', this.password);

    this.router.navigate(['/login']); // Navega para a página de login após registo bem-sucedido
  }

  private isValidName(name: string): boolean {
    return name.trim().length >= 3;
  }

  private isValidUtente(utente: string): boolean {
    const utenteRegex = /^\d{9}$/;
    return utenteRegex.test(utente);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  navigateToLogin() {
    this.router.navigate(['/Login']); // Navega para a página de login
  }
}
