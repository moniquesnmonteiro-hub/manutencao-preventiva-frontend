// Quatro indicadores numéricos exibidos nos cards do dashboard.
export interface IndicadoresDashboard {
  // Total de planos com proxima_em anterior a hoje.
  atrasadas: number;
  // Total de planos previstos para os próximos 7 dias.
  proximasSeteDias: number;
  // Total de execuções registradas no mês atual.
  realizadasNoMes: number;
  // Percentual de execuções conformes no mês (0–100).
  conformidadeMes: number;
}

// Representa um plano atrasado exibido na lista de alertas.
export interface PlanoAtrasadoDashboard {
  // ID do plano.
  id: string;
  // Título do plano de manutenção.
  titulo: string;
  // Data prevista para execução (ISO string).
  proxima_em: string;
  // Quantidade de dias em atraso.
  diasAtraso: number;
  // Equipamento vinculado ao plano.
  equipamento?: { nome: string; codigo: string } | null;
}

// Resposta completa do endpoint GET /dashboard/summary.
export interface ResumoDashboard {
  // Indicadores numéricos para os cards.
  indicadores: IndicadoresDashboard;
  // Lista de planos atrasados ordenada pelo mais antigo.
  alertas: PlanoAtrasadoDashboard[];
}
