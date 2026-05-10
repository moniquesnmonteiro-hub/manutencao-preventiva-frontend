import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PlanoService } from '../../../core/services/plano.service';
import { EquipamentoService } from '../../../core/services/equipamento';
import { UsuarioService } from '../../../core/services/usuario.service';
import { PlanoResumo, CreatePlanoDTO } from '../../../core/models/plano.model';
import { Equipamento } from '../../../core/models/equipamento.model';

@Component({
  selector: 'app-plano-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#0f172a] p-4 sm:p-8">
      <div class="max-w-6xl mx-auto">

        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-light text-white tracking-tight">Planos de Manutenção</h2>
            <p class="text-slate-400 text-sm">{{ planos.length }} plano(s) ativo(s) · Clique em um para ver o histórico</p>
          </div>
          <button
            (click)="abrirModal()"
            class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <span class="text-xl">+</span> Novo Plano
          </button>
        </div>

        <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr class="bg-[#0f172a] border-b border-slate-700">
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Equipamento</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Título</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Periodicidade</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Próxima data</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="text-slate-300 divide-y divide-slate-700">
              @for (plano of planos; track plano.id) {
                <tr
                  (click)="verDetalhe(plano.id)"
                  class="hover:bg-[#2d3a4f] transition-colors cursor-pointer">
                  <td class="p-4">
                    @if (plano.equipamento) {
                      <p class="text-white font-medium">{{ plano.equipamento.nome }}</p>
                      <p class="text-slate-500 text-xs font-mono">{{ plano.equipamento.codigo }}</p>
                    } @else {
                      <span class="text-slate-500">—</span>
                    }
                  </td>
                  <td class="p-4 text-white">{{ plano.titulo }}</td>
                  <td class="p-4 text-slate-400">A cada {{ plano.periodicidade_days }} dias</td>
                  <td class="p-4 text-slate-300">{{ formatarData(plano.proxima_em) }}</td>
                  <td class="p-4">
                    <span class="text-xs font-semibold px-3 py-1 rounded-full"
                      [class]="getStatusClass(plano.proxima_em)">
                      {{ getStatusLabel(plano.proxima_em) }}
                    </span>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-12 text-center">
                    <p class="text-slate-500 italic">Nenhum plano de manutenção cadastrado.</p>
                    <button (click)="abrirModal()" class="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      + Criar o primeiro plano
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Novo Plano -->
    @if (exibirModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="fecharModal()"></div>
        <div class="relative bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-8 max-h-[90vh] overflow-y-auto">

          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-white">Novo Plano de Manutenção</h3>
            <button (click)="fecharModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          @if (errorMsg) {
            <div class="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-5">
              <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorMsg }}
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">

            <!-- Equipamento -->
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5">Equipamento *</label>
              <select
                (change)="onEquipamentoChange($event)"
                class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                <option value="">Selecione um equipamento</option>
                @for (eq of equipamentos; track eq.id) {
                  <option [value]="eq.id">{{ eq.nome }} ({{ eq.codigo }})</option>
                }
              </select>
            </div>

            <!-- Título -->
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5">Título da manutenção *</label>
              <input
                type="text"
                formControlName="descricao"
                placeholder="Ex: Lubrificação Geral, Inspeção Elétrica"
                class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"/>
              @if (form.get('descricao')?.invalid && form.get('descricao')?.touched) {
                <p class="text-red-400 text-xs mt-1">Mínimo de 5 caracteres.</p>
              }
            </div>

            <!-- Periodicidade + Data início (lado a lado) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1.5">Periodicidade (dias) *</label>
                <input
                  type="number"
                  formControlName="periodicidade"
                  min="1"
                  placeholder="30"
                  class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"/>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-400 mb-1.5">Data da 1ª execução *</label>
                <input
                  type="date"
                  formControlName="data_inicio"
                  class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all
                         [color-scheme:dark]"/>
              </div>
            </div>

            <!-- Técnico responsável padrão (opcional) -->
            <div>
              <label class="block text-sm font-medium text-slate-400 mb-1.5">Técnico responsável padrão</label>
              <select
                (change)="onTecnicoChange($event)"
                class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white
                       focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
                <option value="">Nenhum (definir depois)</option>
                @for (tec of tecnicos; track tec.id) {
                  <option [value]="tec.id">{{ tec.nome }} — {{ perfilLabel(tec.perfil) }}</option>
                }
              </select>
            </div>

            <div class="flex justify-end gap-3 pt-2 border-t border-slate-700">
              <button type="button" (click)="fecharModal()"
                class="px-4 py-2 text-slate-400 hover:text-white transition-colors">
                Cancelar
              </button>
              <button
                type="submit"
                [disabled]="form.invalid || isSaving"
                class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500
                       text-white px-8 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
                @if (isSaving) {
                  <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Salvando...
                } @else {
                  Salvar Plano
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class PlanoListComponent implements OnInit {
  planos: PlanoResumo[] = [];
  equipamentos: Equipamento[] = [];
  tecnicos: any[] = [];
  exibirModal = false;
  isSaving = false;
  errorMsg = '';
  selectedEquipamentoId = '';
  selectedTecnicoId: number | null = null;
  form: FormGroup;

  private planoService = inject(PlanoService);
  private equipamentoService = inject(EquipamentoService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.form = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(5)]],
      periodicidade: [30, [Validators.required, Validators.min(1)]],
      data_inicio: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.carregarPlanos();
    this.carregarEquipamentos();
  }

  carregarPlanos(): void {
    this.planoService.listarTodos().subscribe({
      next: (planos) => { this.planos = planos; this.cdr.detectChanges(); },
      error: (err) => console.error('Erro ao buscar planos:', err),
    });
  }

  carregarEquipamentos(): void {
    this.equipamentoService.listar().subscribe({
      next: (equipamentos) => this.equipamentos = equipamentos,
    });
  }

  carregarTecnicos(): void {
    this.usuarioService.listarTodos().subscribe({
      next: (usuarios) => { this.tecnicos = usuarios; this.cdr.detectChanges(); },
    });
  }

  verDetalhe(id: string): void {
    this.router.navigate(['/app/planos', id]);
  }

  onEquipamentoChange(event: Event): void {
    this.selectedEquipamentoId = (event.target as HTMLSelectElement).value;
  }

  onTecnicoChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.selectedTecnicoId = val ? Number(val) : null;
  }

  perfilLabel(perfil: any): string {
    const labels: Record<string | number, string> = {
      0: 'Técnico', TECNICO: 'Técnico',
      1: 'Supervisor', SUPERVISOR: 'Supervisor',
      2: 'Gestor', GESTOR: 'Gestor',
    };
    return labels[perfil] ?? String(perfil);
  }

  abrirModal(): void {
    this.selectedEquipamentoId = '';
    this.selectedTecnicoId = null;
    this.form.reset({ periodicidade: 30 });
    this.errorMsg = '';
    this.exibirModal = true;
    this.carregarTecnicos();
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.isSaving = false;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (!this.selectedEquipamentoId) {
      this.errorMsg = 'Selecione um equipamento.';
      return;
    }
    this.isSaving = true;
    this.errorMsg = '';

    const v = this.form.value;
    const data: CreatePlanoDTO = {
      equipamento_id: this.selectedEquipamentoId,
      descricao: v.descricao,
      periodicidade: Number(v.periodicidade),
      data_inicio: v.data_inicio + 'T00:00:00.000Z',
      tecnico_id: this.selectedTecnicoId,
    };

    this.planoService.criar(data).subscribe({
      next: () => {
        this.isSaving = false;
        this.fecharModal();
        this.cdr.detectChanges();
        this.carregarPlanos();
      },
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Erro ao salvar plano';
        this.isSaving = false;
        this.cdr.detectChanges();
      },
    });
  }

  formatarData(isoDate: string): string {
    const [ano, mes, dia] = isoDate.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusLabel(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0)   return `Atrasada ${Math.abs(diff)}d`;
    if (diff === 0)  return 'Hoje';
    if (diff <= 7)   return `Em ${diff}d`;
    return 'No prazo';
  }

  getStatusClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0)   return 'bg-red-500/20 text-red-400';
    if (diff === 0)  return 'bg-orange-500/20 text-orange-400';
    if (diff <= 7)   return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  }

  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}
