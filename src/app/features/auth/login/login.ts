import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  errorMsg = '';
  isLoading = false;
  showPassword = false;

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.errorMsg = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/app/dashboard']),
      error: (err) => {
        // Mapeia o status HTTP para uma mensagem amigável.
        const status = err?.status;
        if (status === 0) {
          this.errorMsg = 'Não foi possível conectar ao servidor.';
        } else if (status === 400 || status === 401) {
          this.errorMsg = 'E-mail ou senha incorretos.';
        } else {
          this.errorMsg = err.error?.message ?? 'Erro inesperado. Tente novamente.';
        }
        this.isLoading = false;
        // Força atualização da view no modo zoneless.
        this.cdr.detectChanges();
      },
    });
  }
}
