import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private readonly API = 'http://localhost:3000/api/equipamentos';
  
  private readonly token = 'cole_seu_token_aqui'; 

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  cadastrar(equipamento: Equipamento): Observable<Equipamento> {
    return this.http.post<Equipamento>(this.API, equipamento, { headers: this.getHeaders() });
  }

  listar(): Observable<Equipamento[]> {
    return this.http.get<Equipamento[]>(this.API, { headers: this.getHeaders() });
  }

update(id: string, equipamento: Partial<Equipamento>): Observable<Equipamento> {
  return this.http.put<Equipamento>(`${this.API}/${id}`, equipamento, { headers: this.getHeaders() });
}
}