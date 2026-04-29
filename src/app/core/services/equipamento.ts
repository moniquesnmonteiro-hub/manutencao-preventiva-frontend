import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private readonly API = 'http://localhost:3000/api/equipamentos';

  constructor(private http: HttpClient) {}

  cadastrar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(this.API, equipamento);
  }

  listar(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(this.API);
  }

  update(id: string, equipamento: Partial<Equipamento>): Observable<Equipamento> {
    return this.http.put<Equipamento>(`${this.API}/${id}`, equipamento);
  }
}