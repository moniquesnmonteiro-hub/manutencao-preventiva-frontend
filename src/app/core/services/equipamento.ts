import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipamento } from '../models/equipamento.model';
import { HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipamentoService {
  private readonly API = 'http://localhost:3000/api/equipamentos';

  constructor(private http: HttpClient) { }

cadastrar(equipamento: Equipamento): Observable<Equipamento> {

  const token = 'substituir_pelo_token'; // Apos a implementacao do Login, nao ira precisar ter um token provisório.
  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<Equipamento>(this.API, equipamento, { headers });
}
}