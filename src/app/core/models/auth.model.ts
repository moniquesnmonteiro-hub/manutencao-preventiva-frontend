export interface LoginRequest {
  email: string;
  password: string;
}

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  perfil: 'TECNICO' | 'SUPERVISOR' | 'GESTOR';
  ativo: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  usuario: UsuarioLogado;
}
