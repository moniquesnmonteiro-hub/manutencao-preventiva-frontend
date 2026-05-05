import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlanoResumo } from '../models/plano.model';

@Injectable({ providedIn: 'root' })
export class PlanoService {
  private readonly API = 'http://localhost:3000/api/planos';

  constructor(private http: HttpClient) {}

  listarPorEquipamento(equipamentoId: string | number): Observable<PlanoResumo[]> {
    return this.http.get<PlanoResumo[]>(`${this.API}/equipamento/${equipamentoId}`);
  }
}
