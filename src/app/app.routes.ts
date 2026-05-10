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
  {
    path: 'app/calendario',
    loadComponent: () =>
      import('./features/calendario/calendario.component').then(
        m => m.CalendarioComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'app/execucoes/nova',
    loadComponent: () =>
      import('./features/execucoes/execucao-form/execucao-form.component').then(
        m => m.ExecucaoFormComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'app/dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        m => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'app/dashboard' },
];