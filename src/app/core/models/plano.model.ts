export interface EquipamentoBasico {
  id: string;
  codigo: string;
  nome: string;
  tipo: string;
  localizacao: string;
}

export interface PlanoResumo {
  id: string;
  equipamento_id: string;
  equipamento?: EquipamentoBasico;
  titulo: string;
  descricao?: string;
  periodicidade_days: number;
  proxima_em: string;
  ativo: boolean;
}

export interface CreatePlanoDTO {
  equipamento_id: string;
  descricao: string;
  periodicidade: number;
  data_inicio: string;
}
