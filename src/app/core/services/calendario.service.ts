// Importa Injectable e inject para injeção de dependência.
import { Injectable, inject } from '@angular/core';
// Importa HttpClient para chamadas HTTP.
import { HttpClient, HttpParams } from '@angular/common/http';
// Importa Observable do RxJS.
import { Observable } from 'rxjs';
// Importa os modelos do calendário.
import { FiltroCalendario, ItemCalendario } from '../models/calendario.model';

// Registra o serviço como singleton na aplicação.
@Injectable({ providedIn: 'root' })
export class CalendarioService {
  // Injeta o HttpClient.
  private http = inject(HttpClient);
  // URL base da API do calendário.
  private readonly API = 'http://localhost:3000/api/calendario';

  // Busca os planos do calendário com filtros opcionais.
  listar(filtro: FiltroCalendario = 'todas', equipamentoId?: string): Observable<ItemCalendario[]> {
    // Monta os query params.
    let params = new HttpParams().set('filtro', filtro);
    // Adiciona filtro por equipamento se informado.
    if (equipamentoId) params = params.set('equipamento_id', equipamentoId);
    return this.http.get<ItemCalendario[]>(this.API, { params });
  }
}
