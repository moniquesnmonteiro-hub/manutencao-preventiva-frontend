import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
  },
  {
    path: 'app/equipamentos',
    loadComponent: () =>
      import('./features/equipamentos/equipamento-list/equipamento-list').then(
        m => m.EquipamentoListComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'app/planos',
    loadComponent: () =>
      import('./features/planos/plano-list/plano-list').then(m => m.PlanoListComponent),
    canActivate: [authGuard],
  },
  {
    path: 'app/planos/:id',
    loadComponent: () =>
      import('./features/planos/plano-detalhe/plano-detalhe').then(m => m.PlanoDetalheComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'app/equipamentos', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/equipamentos' },
];