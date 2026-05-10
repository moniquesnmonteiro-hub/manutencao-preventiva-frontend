// Importa Injectable e inject para injeção de dependência.
import { Injectable, inject } from '@angular/core';
// Importa HttpClient para chamadas HTTP.
import { HttpClient } from '@angular/common/http';
// Importa Observable do RxJS.
import { Observable } from 'rxjs';

// DTO para criação de um novo usuário.
export interface NovoUsuarioDTO {
  // Nome completo do usuário.
  nome: string;
  // E-mail de acesso.
  email: string;
  // Senha inicial.
  senha: string;
  // Perfil: 0 = TECNICO, 1 = SUPERVISOR (valor numérico esperado pelo backend).
  perfil: 0 | 1;
}

// Registra o serviço como singleton na aplicação.
@Injectable({ providedIn: 'root' })
export class UsuarioService {
  // Injeta o HttpClient.
  private http = inject(HttpClient);
  // URL base da API de usuários.
  private readonly API = 'http://localhost:3000/api/usuarios';

  // Cria um novo usuário (apenas Gestor pode chamar este endpoint).
  criar(dto: NovoUsuarioDTO): Observable<any> {
    return this.http.post(this.API, dto);
  }
}
