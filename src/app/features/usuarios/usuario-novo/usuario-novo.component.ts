// Importa Component, OnInit, inject, signal e ChangeDetectorRef.
import { Component, inject, signal, ChangeDetectorRef } from '@angular/core';
// Importa FormsModule para ngModel.
import { FormsModule } from '@angular/forms';
// Importa Router para navegação após salvar.
import { Router } from '@angular/router';
// Importa o serviço de usuários.
import { UsuarioService, NovoUsuarioDTO } from '../../../core/services/usuario.service';

// Declara o componente de cadastro de novo usuário.
@Component({
  // Seletor do componente.
  selector: 'app-usuario-novo',
  // Componente standalone.
  standalone: true,
  // Módulos usados no template.
  imports: [FormsModule],
  // Arquivo HTML externo.
  templateUrl: './usuario-novo.component.html',
  // Arquivo CSS externo.
  styleUrl: './usuario-novo.component.css',
})
// Classe do componente de cadastro de usuário.
export class UsuarioNovoComponent {
  // Injeta o serviço de usuários.
  private usuarioService = inject(UsuarioService);
  // Injeta o router para redirecionar após salvar.
  private router = inject(Router);
  // Injeta o ChangeDetectorRef para o modo zoneless.
  private cdr = inject(ChangeDetectorRef);

  // Campos do formulário.
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  // Perfil como número: 0 = TECNICO, 1 = SUPERVISOR.
  perfil: 0 | 1 = 0;

  // Controla visibilidade das senhas.
  mostrarSenha = signal(false);
  mostrarConfirmar = signal(false);

  // Estado do envio.
  salvando = signal(false);
  erro = signal<string | null>(null);
  sucesso = signal(false);

  // Opções de perfil disponíveis para criação (sem Gestor).
  readonly perfisDisponiveis: { value: 0 | 1; label: string }[] = [
    { value: 0, label: 'Técnico de Manutenção' },
    { value: 1, label: 'Supervisor de Manutenção' },
  ];

  // Envia o formulário de cadastro.
  salvar(): void {
    // Validações locais.
    if (!this.nome.trim()) {
      this.erro.set('O nome é obrigatório.');
      return;
    }
    if (!this.email.trim()) {
      this.erro.set('O e-mail é obrigatório.');
      return;
    }
    if (this.senha.length < 6) {
      this.erro.set('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (!/[A-Z]/.test(this.senha)) {
      this.erro.set('A senha deve conter ao menos uma letra maiúscula.');
      return;
    }
    if (!/[a-z]/.test(this.senha)) {
      this.erro.set('A senha deve conter ao menos uma letra minúscula.');
      return;
    }
    if (!/[^A-Za-z0-9]/.test(this.senha)) {
      this.erro.set('A senha deve conter ao menos um caractere especial.');
      return;
    }
    if (this.senha !== this.confirmarSenha) {
      this.erro.set('A senha e a confirmação não coincidem.');
      return;
    }

    this.salvando.set(true);
    this.erro.set(null);

    const dto: NovoUsuarioDTO = {
      nome: this.nome.trim(),
      email: this.email.trim(),
      senha: this.senha,
      // Garante que o perfil seja número, pois ngModel pode retornar string.
      perfil: Number(this.perfil) as 0 | 1,
    };

    this.usuarioService.criar(dto).subscribe({
      next: () => {
        this.sucesso.set(true);
        this.salvando.set(false);
        // Redireciona para o dashboard após 1.5s.
        setTimeout(() => this.router.navigate(['/app/dashboard']), 1500);
        this.cdr.detectChanges();
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Erro ao cadastrar usuário. Tente novamente.';
        this.erro.set(msg);
        this.salvando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  // Cancela e volta para o dashboard.
  cancelar(): void {
    this.router.navigate(['/app/dashboard']);
  }
}
