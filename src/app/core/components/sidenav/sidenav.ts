import { Component, inject, signal, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private routerSub?: Subscription;

  isMenuOpen = false;
  modalAberto = signal(false);
  nomeForm = signal('');
  alterarSenha = signal(false);
  senhaAtual = signal('');
  novaSenha = signal('');
  confirmarSenha = signal('');
  salvando = signal(false);
  erroModal = signal<string | null>(null);
  sucesso = signal(false);

  ngOnInit(): void {
    // Fecha o menu mobile ao navegar entre páginas.
    this.routerSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => { this.isMenuOpen = false; });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  // Aceita perfil numérico (2) ou string ('GESTOR') dependendo da origem do JWT.
  get isGestor(): boolean {
    const p = this.currentUser?.perfil;
    return p === 'GESTOR' || (p as any) === 2;
  }

  get perfilLabel(): string {
    const labels: Record<string | number, string> = {
      0: 'Técnico', TECNICO: 'Técnico',
      1: 'Supervisor', SUPERVISOR: 'Supervisor',
      2: 'Gestor', GESTOR: 'Gestor',
    };
    return labels[this.currentUser?.perfil ?? ''] ?? String(this.currentUser?.perfil ?? '');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  abrirModal(): void {
    this.nomeForm.set(this.currentUser?.nome ?? '');
    this.alterarSenha.set(false);
    this.senhaAtual.set('');
    this.novaSenha.set('');
    this.confirmarSenha.set('');
    this.erroModal.set(null);
    this.sucesso.set(false);
    this.modalAberto.set(true);
  }

  fecharModal(): void {
    if (this.salvando()) return;
    this.modalAberto.set(false);
  }

  salvar(): void {
    if (!this.nomeForm().trim()) {
      this.erroModal.set('O nome não pode estar vazio.');
      return;
    }
    if (this.alterarSenha()) {
      if (!this.senhaAtual()) {
        this.erroModal.set('Informe a senha atual.');
        return;
      }
      if (this.novaSenha().length < 6) {
        this.erroModal.set('A nova senha deve ter pelo menos 6 caracteres.');
        return;
      }
      if (this.novaSenha() !== this.confirmarSenha()) {
        this.erroModal.set('A nova senha e a confirmação não coincidem.');
        return;
      }
    }

    this.salvando.set(true);
    this.erroModal.set(null);

    const payload: { nome: string; senha_atual?: string; nova_senha?: string } = {
      nome: this.nomeForm().trim(),
    };
    if (this.alterarSenha()) {
      payload.senha_atual = this.senhaAtual();
      payload.nova_senha = this.novaSenha();
    }

    this.authService.updateMe(payload).subscribe({
      next: () => {
        this.salvando.set(false);
        this.sucesso.set(true);
        setTimeout(() => {
          this.modalAberto.set(false);
          this.sucesso.set(false);
          this.cdr.detectChanges();
        }, 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.erroModal.set(err?.error?.message ?? 'Erro ao salvar. Tente novamente.');
        this.salvando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
