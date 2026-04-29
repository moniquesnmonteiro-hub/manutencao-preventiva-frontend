import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'lista',
    loadComponent: () =>
      import('./features/equipamentos/equipamento-list/equipamento-list').then(
        m => m.EquipamentoListComponent
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'lista', pathMatch: 'full' },
  { path: '**', redirectTo: 'lista' },
];