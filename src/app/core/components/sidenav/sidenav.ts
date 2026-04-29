import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {
  private authService = inject(AuthService);

  isMenuOpen = false;

  get currentUser() {
    return this.authService.currentUser;
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

  logout() {
    this.authService.logout();
  }
}