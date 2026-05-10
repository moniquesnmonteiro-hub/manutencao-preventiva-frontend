import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// perfil: 0 = TECNICO, 1 = SUPERVISOR — valores numéricos esperados pelo backend.
export interface NovoUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  perfil: 0 | 1;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private http = inject(HttpClient);
  private readonly API = 'http://localhost:3000/api/usuarios';

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  criar(dto: NovoUsuarioDTO): Observable<any> {
    return this.http.post(this.API, dto);
  }
}
