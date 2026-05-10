// Importa Injectable e inject para injeção de dependência.
import { Injectable, inject } from '@angular/core';
// Importa HttpClient para chamadas HTTP.
import { HttpClient } from '@angular/common/http';
// Importa Observable do RxJS.
import { Observable } from 'rxjs';
// Importa o modelo de resposta do dashboard.
import { ResumoDashboard } from '../models/dashboard.model';

// Registra o serviço como singleton na aplicação.
@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Injeta o HttpClient.
  private http = inject(HttpClient);
  // URL do endpoint de resumo do dashboard.
  private readonly API = 'http://localhost:3000/api/dashboard/summary';

  // Busca os indicadores e alertas do dashboard.
  getSummary(): Observable<ResumoDashboard> {
    return this.http.get<ResumoDashboard>(this.API);
  }
}
