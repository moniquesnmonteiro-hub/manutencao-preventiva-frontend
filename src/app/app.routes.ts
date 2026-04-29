import { Routes } from '@angular/router';
import { EquipamentoFormComponent } from './features/equipamentos/equipamento-form/equipamento-form';
import { EquipamentoListComponent } from './features/equipamentos/equipamento-list/equipamento-list';

export const routes: Routes = [

  // Rota para a Listagem
  { path: 'lista', component: EquipamentoListComponent },

  // Rota padrão (redireciona para a lista ou cadastro)
  { path: '', redirectTo: 'lista', pathMatch: 'full' },

  // Fallback para rotas não encontradas
  { path: '**', redirectTo: 'lista' }
];