export interface PlanoResumo {
  id: number;
  titulo: string;
  descricao?: string;
  periodicidade_dias: number;
  proxima_em: string;
  ativo: boolean;
}
