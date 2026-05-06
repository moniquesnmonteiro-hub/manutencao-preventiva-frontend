import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoResumo, CreatePlanoDTO } from '../models/plano.model';

@Injectable({ providedIn: 'root' })
export class PlanoService {
  private readonly API = 'http://localhost:3000/api/planos';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<PlanoResumo[]> {
    return this.http.get<PlanoResumo[]>(this.API);
  }

  listarPorEquipamento(equipamentoId: string | number): Observable<PlanoResumo[]> {
    return this.http.get<PlanoResumo[]>(`${this.API}/equipamento/${equipamentoId}`);
  }

  buscarPorId(id: string): Observable<PlanoResumo> {
    return this.http.get<PlanoResumo>(`${this.API}/${id}`);
  }

  criar(data: CreatePlanoDTO): Observable<PlanoResumo> {
    return this.http.post<PlanoResumo>(this.API, data);
  }
}
