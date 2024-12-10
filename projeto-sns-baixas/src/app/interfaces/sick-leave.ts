export interface SickLeave {
  id: string;
  pacienteId: string;
  medicoId: string;
  diagnostico: string;
  periodo: { inicio: Date; fim: Date };
  recomendacoes: string;
}
