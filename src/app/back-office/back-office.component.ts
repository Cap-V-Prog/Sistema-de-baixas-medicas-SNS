import {Component, OnInit} from '@angular/core';
import {ConsultarBaixasComponent} from "../baixas/consultar-baixas/consultar-baixas.component";
import {DashboardComponent} from "../dashboard/dashboard.component";
import {EmitirBaixaComponent} from "../baixas/emitir-baixa/emitir-baixa.component";
import {NgClass, NgIf} from "@angular/common";
import {Patient} from '../interfaces/patient';
import {FirestoreService} from '../../firebase/firestore.service';
import {FireauthService} from '../../firebase/fireauth.service';
import {Router} from '@angular/router';
import {Medic} from '../interfaces/medic';

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
export class BackOfficeComponent implements OnInit {
  Selected:'Emit'|'Consult'|'Dashboard' = "Dashboard";
  isExpanded = false;

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(private firestoreService: FirestoreService,private fireauthService: FireauthService,private router: Router) {}

  medicId:Medic|null=null;
  patient:Patient|null=null;
  patientName:string='';

  pendingLeaves:number=0;
  EmitedLeaves:number=0;
  totalLeaves:number=0;

  async ngOnInit() {
    const user = this.fireauthService.getCurrentUser();

    // 🔹 Se não estiver logado, redireciona para o login
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // 🔹 Se estiver logado, carrega os dados
    await this.loadPatientData(user.uid);
    if(this.patient){
      if(await this.firestoreService.checkIfMedic(this.patient.numeroSNS)){
        this.medicId=await this.firestoreService.getMedicById(this.patient.numeroSNS);
      }
    }
  }

  async loadPatientData(patientId: string) {
    this.patient = await this.firestoreService.getPatientByUID(patientId);
    if(this.patient) {
      this.patientName=this.patient.nome;
      this.pendingLeaves=await this.firestoreService.getPendingSickLeavesCount(this.patient?.numeroSNS);
      this.EmitedLeaves=await this.firestoreService.getIssuedSickLeavesCount(this.patient?.numeroSNS);
      this.totalLeaves=this.EmitedLeaves+this.pendingLeaves;
    }
  }
}
