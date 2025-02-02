export interface SickLeave {
  id: string;
  patient: {
    id: string; // Número único do utente do paciente
    name: string; // Nome do paciente
  };
  doctor: {
    id: string; // Identificador único do médico
    name: string; // Nome do médico
  };
  diagnosis: string; // Diagnóstico da baixa médica
  period: {
    start: Date | null;
    end: Date | null;
  };
  recommendations: string; // Recomendações médicas
  createdAt: Date; // Data de criação do registro
  updatedAt?: Date; // Data da última atualização (opcional)
  isIssued: boolean; // Indica se a baixa foi emitida
  status: 'active' | 'expired' | 'pending'; // Status da baixa médica
}
