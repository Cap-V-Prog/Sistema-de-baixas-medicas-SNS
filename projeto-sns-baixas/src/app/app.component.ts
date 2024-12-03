import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NgClass, NgIf} from "@angular/common";
import {EmitirBaixaComponent} from "./baixas/emitir-baixa/emitir-baixa.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, RouterLink, NgClass, EmitirBaixaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  Selected:'Emit'|'List'|'Dashboard' = "Dashboard";
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  title = 'projeto-sns-baixas';
}
