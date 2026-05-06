// Tipo para o status de uma execução de manutenção.
export type StatusExecucao = 'realizada' | 'parcial' | 'nao_realizada';

// Interface que representa uma execução já registrada.
export interface ExecucaoResumo {
  // ID da execução.
  id: number | string;
  // ID do plano executado.
  plano_id: string;
  // ID do técnico (opcional no retorno).
  tecnico_id?: string;
  // Data em que foi realizada.
  data_execucao: string;
  // Status da execução.
  status: StatusExecucao;
  // Se foi executada conforme o plano.
  conformidade: boolean;
  // Observações do técnico.
  observacoes?: string;
  // Momento do registro.
  timestamp?: string;
}

// DTO para criar uma nova execução.
export interface CreateExecucaoDTO {
  // ID do plano a ser executado.
  plano_id: string;
  // ID do técnico que executou (inteiro).
  tecnico_id: number;
  // Data em que foi realizada (ISO datetime).
  data_realizada: string;
  // Status da execução.
  status: StatusExecucao;
  // Se foi conforme o plano.
  conformidade: boolean;
  // Observações opcionais.
  observacoes?: string;
}
