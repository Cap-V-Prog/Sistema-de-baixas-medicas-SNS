export interface SickLeave {
  id: string; // Identificador único para a baixa médica
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
    start: Date; // Data de início da baixa
    end: Date; // Data de término da baixa
  };
  recommendations: string; // Recomendações médicas
  createdAt: Date; // Data de criação do registro
  updatedAt?: Date; // Data da última atualização (opcional)
  isIssued: boolean; // Indica se a baixa foi emitida
}
