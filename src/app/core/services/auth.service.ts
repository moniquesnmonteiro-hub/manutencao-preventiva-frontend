import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest, UsuarioLogado } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api/auth';
  private readonly ACCESS_KEY = 'access_token';
  private readonly REFRESH_KEY = 'refresh_token';
  private readonly USER_KEY = 'usuario';

  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<UsuarioLogado | null>(this.loadUser());
  currentUser$ = this.currentUserSubject.asObservable();

  get isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  get currentUser(): UsuarioLogado | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, credentials).pipe(
      tap(res => this.storeSession(res))
    );
  }

  logout(): void {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      this.http.post(`${this.API}/logout`, { refreshToken }).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/login']);
  }

  refresh(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(
      tap(res => this.storeSession(res))
    );
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  private storeSession(res: AuthResponse): void {
    localStorage.setItem(this.ACCESS_KEY, res.accessToken);
    localStorage.setItem(this.REFRESH_KEY, res.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(res.usuario));
    this.currentUserSubject.next(res.usuario);
  }

  private clearSession(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
  }

  // Atualiza nome e/ou senha do usuário logado e sincroniza o estado local.
  updateMe(data: { nome: string; senha_atual?: string; nova_senha?: string }): Observable<any> {
    return this.http.patch(`http://localhost:3000/api/usuarios/me`, data).pipe(
      tap((usuario: any) => {
        // Atualiza o nome no estado local sem exigir novo login.
        const atualizado = { ...this.currentUser!, nome: usuario.nome };
        localStorage.setItem(this.USER_KEY, JSON.stringify(atualizado));
        this.currentUserSubject.next(atualizado);
      })
    );
  }

  private loadUser(): UsuarioLogado | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
