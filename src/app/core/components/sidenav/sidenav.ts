// Importa Component, inject, signal e ChangeDetectorRef.
import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
// Importa CommonModule para diretivas básicas.
import { CommonModule } from '@angular/common';
// Importa RouterModule para navegação.
import { RouterModule } from '@angular/router';
// Importa FormsModule para ngModel no formulário de perfil.
import { FormsModule } from '@angular/forms';
// Importa o AuthService para dados do usuário e logout.
import { AuthService } from '../../services/auth.service';

// Declara o componente de sidenav.
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {
  // Injeta o AuthService.
  private authService = inject(AuthService);
  // Injeta o ChangeDetectorRef para o modo zoneless.
  private cdr = inject(ChangeDetectorRef);

  // Controla visibilidade do menu mobile.
  isMenuOpen = false;

  // Controla visibilidade do modal de edição de perfil.
  modalAberto = signal(false);
  // Campos do formulário de perfil.
  nomeForm = signal('');
  // Controla se a seção de alterar senha está visível.
  alterarSenha = signal(false);
  // Campos de senha.
  senhaAtual = signal('');
  novaSenha = signal('');
  confirmarSenha = signal('');
  // Estado do envio do formulário.
  salvando = signal(false);
  erroModal = signal<string | null>(null);
  sucesso = signal(false);

  // Retorna o usuário logado.
  get currentUser() {
    return this.authService.currentUser;
  }

  // Retorna o label do perfil do usuário logado.
  get perfilLabel(): string {
    const labels: Record<string | number, string> = {
      0: 'Técnico', TECNICO: 'Técnico',
      1: 'Supervisor', SUPERVISOR: 'Supervisor',
      2: 'Gestor', GESTOR: 'Gestor',
    };
    return labels[this.currentUser?.perfil ?? ''] ?? String(this.currentUser?.perfil ?? '');
  }

  // Alterna o menu mobile.
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Abre o modal de edição de perfil com os dados atuais.
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

  // Fecha o modal de edição de perfil.
  fecharModal(): void {
    if (this.salvando()) return;
    this.modalAberto.set(false);
  }

  // Envia o formulário de edição de perfil.
  salvar(): void {
    // Valida o nome.
    if (!this.nomeForm().trim()) {
      this.erroModal.set('O nome não pode estar vazio.');
      return;
    }
    // Valida os campos de senha se a seção estiver aberta.
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

    // Monta o payload — inclui senha apenas se a seção estiver ativa.
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
        // Fecha o modal automaticamente após 1.5s.
        setTimeout(() => {
          this.modalAberto.set(false);
          this.sucesso.set(false);
          this.cdr.detectChanges();
        }, 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao salvar. Tente novamente.';
        this.erroModal.set(msg);
        this.salvando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  // Realiza o logout.
  logout() {
    this.authService.logout();
  }
}
