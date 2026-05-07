// Tipos de filtro disponíveis no calendário de manutenções.
export type FiltroCalendario = 'todas' | 'atrasadas' | 'esta_semana' | 'este_mes';

// Representa um técnico resumido para exibição e busca.
export interface TecnicoBasico {
  // ID do técnico.
  id: number;
  // Nome do técnico.
  nome: string;
  // Perfil do usuário.
  perfil?: string;
}

// Representa um item do calendário (plano com relações carregadas).
export interface ItemCalendario {
  // ID único do plano.
  id: string;
  // Título do plano de manutenção.
  titulo: string;
  // Periodicidade em dias.
  periodicidade_days: number;
  // Data prevista para a próxima execução.
  proxima_em: string;
  // Se o plano está ativo.
  ativo: boolean;
  // Equipamento vinculado ao plano.
  equipamento?: {
    id: string;
    nome: string;
    codigo: string;
    localizacao: string;
  };
  // Técnico padrão atribuído ao plano (pode ser null).
  tecnico?: TecnicoBasico | null;
  // Técnico que realizou a última execução (null se nunca executado).
  ultimo_executor?: TecnicoBasico | null;
}
