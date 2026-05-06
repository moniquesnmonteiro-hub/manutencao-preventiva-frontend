export type StatusExecucao = 'realizada' | 'parcial' | 'nao_realizada';

export interface ExecucaoResumo {
  id: number | string;
  plano_id: string;
  tecnico_id?: number;
  data_execucao: string;
  status: StatusExecucao;
  conformidade: boolean;
  observacoes?: string;
  timestamp?: string;
}
