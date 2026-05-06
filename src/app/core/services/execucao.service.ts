import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExecucaoResumo } from '../models/execucao.model';

@Injectable({ providedIn: 'root' })
export class ExecucaoService {
  private readonly API = 'http://localhost:3000/api/execucoes';

  constructor(private http: HttpClient) {}

  listarPorPlano(planoId: string): Observable<ExecucaoResumo[]> {
    return this.http.get<ExecucaoResumo[]>(`${this.API}/plano/${planoId}`);
  }
}
