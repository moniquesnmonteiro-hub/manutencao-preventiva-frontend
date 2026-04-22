import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Import necessário para o router-outlet e routerLink

@Component({
  selector: 'app-sidenav',
  standalone: true,
  // O CommonModule libera o [class.hidden] e o RouterModule libera o <router-outlet>
  imports: [CommonModule, RouterModule], 
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.css'
})
export class Sidenav {
  // Erro 2 resolvido: declarando a variável que controla o menu
  isMenuOpen = false;

  // Erro 1 resolvido: criando a função que o botão (click) chama
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}