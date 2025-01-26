import { Component } from '@angular/core';
import {ConsultarBaixasComponent} from "../baixas/consultar-baixas/consultar-baixas.component";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {EmitirBaixaComponent} from "../baixas/emitir-baixa/emitir-baixa.component";
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-back-office',
  standalone: true,
  imports: [
    ConsultarBaixasComponent,
    DashboardComponent,
    EmitirBaixaComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './back-office.component.html',
  styleUrl: './back-office.component.scss'
})
export class BackOfficeComponent {
  Selected:'Emit'|'Consult'|'Dashboard' = "Dashboard";
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  title = 'projeto-sns-baixas';
}
