// Importa Injectable e inject para injeção de dependência.
import { Injectable, inject } from '@angular/core';
// Importa HttpClient para chamadas HTTP.
import { HttpClient } from '@angular/common/http';
// Importa Observable do RxJS.
import { Observable } from 'rxjs';
// Importa os modelos de execução.
import { CreateExecucaoDTO, ExecucaoResumo } from '../models/execucao.model';

// Registra o serviço como singleton na aplicação.
@Injectable({ providedIn: 'root' })
export class ExecucaoService {
  // Injeta o HttpClient.
  private http = inject(HttpClient);
  // URL base da API de execuções.
  private readonly API = 'http://localhost:3000/api/execucoes';

  // Lista todas as execuções de um plano específico.
  listarPorPlano(planoId: string): Observable<ExecucaoResumo[]> {
    return this.http.get<ExecucaoResumo[]>(`${this.API}/plano/${planoId}`);
  }

  // Registra uma nova execução de manutenção.
  criar(dto: CreateExecucaoDTO): Observable<ExecucaoResumo> {
    return this.http.post<ExecucaoResumo>(this.API, dto);
  }
}
