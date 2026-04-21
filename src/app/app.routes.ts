import { Routes } from '@angular/router';
import { EquipamentoFormComponent } from './features/equipamentos/equipamento-form/equipamento-form';

export const routes: Routes = [
  { path: '', component: EquipamentoFormComponent },
  { path: '**', redirectTo: '' }
];