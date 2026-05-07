// Importa Injectable e inject para injeção de dependência.
import { Injectable, inject } from '@angular/core';
// Importa HttpClient e HttpParams para chamadas HTTP.
import { HttpClient, HttpParams } from '@angular/common/http';
// Importa Observable do RxJS.
import { Observable } from 'rxjs';
// Importa os modelos do calendário.
import { FiltroCalendario, ItemCalendario, TecnicoBasico } from '../models/calendario.model';

// Registra o serviço como singleton na aplicação.
@Injectable({ providedIn: 'root' })
export class CalendarioService {
  // Injeta o HttpClient.
  private http = inject(HttpClient);
  // URL base da API do calendário.
  private readonly API_CALENDARIO = 'http://localhost:3000/api/calendario';
  // URL base da API de usuários (para busca de técnicos).
  private readonly API_USUARIOS = 'http://localhost:3000/api/usuarios';
  // URL base da API de planos (para atribuição de técnico).
  private readonly API_PLANOS = 'http://localhost:3000/api/planos';

  // Busca os planos do calendário com filtros opcionais.
  listar(filtro: FiltroCalendario = 'todas', equipamentoId?: string): Observable<ItemCalendario[]> {
    // Monta os query params.
    let params = new HttpParams().set('filtro', filtro);
    // Adiciona filtro por equipamento se informado.
    if (equipamentoId) params = params.set('equipamento_id', equipamentoId);
    return this.http.get<ItemCalendario[]>(this.API_CALENDARIO, { params });
  }

  // Busca técnicos pelo nome (para o campo de busca inline).
  buscarTecnicos(search: string): Observable<TecnicoBasico[]> {
    const params = new HttpParams().set('search', search);
    return this.http.get<TecnicoBasico[]>(this.API_USUARIOS, { params });
  }

  // Atribui um técnico responsável padrão a um plano.
  atribuirTecnico(planoId: string, tecnicoId: number | null): Observable<any> {
    return this.http.patch(`${this.API_PLANOS}/${planoId}/tecnico`, { tecnico_id: tecnicoId });
  }
}
