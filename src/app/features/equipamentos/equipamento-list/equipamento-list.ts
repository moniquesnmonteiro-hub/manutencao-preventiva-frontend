import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../core/services/equipamento';
import { PlanoService } from '../../../core/services/plano.service';
import { Equipamento } from '../../../core/models/equipamento.model';
import { PlanoResumo } from '../../../core/models/plano.model';
import { EquipamentoFormComponent } from '../equipamento-form/equipamento-form';

@Component({
  selector: 'app-equipamento-list',
  standalone: true,
  imports: [CommonModule, EquipamentoFormComponent],
  template: `
    <div class="min-h-screen bg-[#0f172a] p-4 sm:p-8">
      <div class="max-w-6xl mx-auto">

        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-light text-white tracking-tight">Equipamentos</h2>
            <p class="text-slate-400 text-sm">{{ equipamentos.length }} equipamento(s) cadastrado(s) · Clique em um para ver os planos vinculados</p>
          </div>
          <button
            (click)="abrirModal()"
            class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <span class="text-xl">+</span> Novo Equipamento
          </button>
        </div>

        <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-[#0f172a] border-b border-slate-700">
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Código</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Localização</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="text-slate-300 divide-y divide-slate-700">
              @for (eq of equipamentos; track eq.id) {
                <tr
                  (click)="abrirDetalhe(eq)"
                  class="hover:bg-[#2d3a4f] transition-colors cursor-pointer group">
                  <td class="p-4 font-mono text-blue-400">{{ eq.codigo }}</td>
                  <td class="p-4 font-medium text-white">{{ eq.nome }}</td>
                  <td class="p-4">{{ eq.tipo }}</td>
                  <td class="p-4 text-slate-400 text-sm">{{ eq.localizacao }}</td>
                  <td class="p-4">
                    <button
                      (click)="$event.stopPropagation(); abrirModal(eq)"
                      class="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-12 text-center">
                    <p class="text-slate-500 italic">Nenhum equipamento cadastrado.</p>
                    <button (click)="abrirModal()" class="mt-3 text-blue-400 hover:text-blue-300 text-sm transition-colors">
                      + Cadastrar o primeiro equipamento
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

    <!-- Modal: Cadastro / Edição -->
    @if (exibirModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="fecharModal()"></div>
        <div class="relative bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-white">
              {{ isEditMode ? 'Editar Equipamento' : 'Cadastrar Equipamento' }}
            </h3>
            <button (click)="fecharModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <app-equipamento-form
            [equipamentoInicial]="equipamentoSelecionado"
            (salvo)="onSalvo()"
            (cancelado)="fecharModal()">
          </app-equipamento-form>
        </div>
      </div>
    }

    <!-- Painel: Detalhe do Equipamento + Planos Vinculados -->
    @if (equipamentoDetalhado) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="fecharDetalhe()"></div>
        <div class="relative bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">

          <!-- Header -->
          <div class="flex justify-between items-start p-6 border-b border-slate-700">
            <div>
              <span class="font-mono text-blue-400 text-sm">{{ equipamentoDetalhado.codigo }}</span>
              <h3 class="text-xl font-semibold text-white mt-1">{{ equipamentoDetalhado.nome }}</h3>
              <p class="text-slate-400 text-sm mt-0.5">
                {{ equipamentoDetalhado.tipo }} &middot; {{ equipamentoDetalhado.localizacao }}
                @if (equipamentoDetalhado.fabricante) {
                  &middot; {{ equipamentoDetalhado.fabricante }}
                }
              </p>
            </div>
            <button (click)="fecharDetalhe()" class="text-slate-400 hover:text-white transition-colors mt-1">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Planos -->
          <div class="p-6 max-h-[28rem] overflow-y-auto">
            <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Planos de Manutenção Vinculados
            </h4>

            @if (carregandoPlanos) {
              <div class="flex items-center justify-center py-10 text-slate-500 gap-2">
                <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Carregando planos...
              </div>
            } @else if (planosDoEquipamento.length === 0) {
              <p class="text-center text-slate-500 italic py-10">
                Nenhum plano de manutenção vinculado a este equipamento.
              </p>
            } @else {
              <div class="space-y-3">
                @for (plano of planosDoEquipamento; track plano.id) {
                  <div class="bg-[#0f172a] rounded-lg p-4 flex items-center justify-between gap-4">
                    <div class="min-w-0">
                      <p class="text-white font-medium truncate">{{ plano.titulo }}</p>
                      <p class="text-slate-400 text-sm mt-0.5">
                        A cada {{ plano.periodicidade_days }} dias &middot;
                        Próxima: {{ formatarData(plano.proxima_em) }}
                      </p>
                    </div>
                    <span class="shrink-0 text-xs font-semibold px-3 py-1 rounded-full"
                      [class]="getStatusClass(plano.proxima_em)">
                      {{ getStatusLabel(plano.proxima_em) }}
                    </span>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }
  `
})
export class EquipamentoListComponent implements OnInit {
  equipamentos: Equipamento[] = [];

  exibirModal = false;
  isEditMode = false;
  equipamentoSelecionado: Equipamento | null = null;

  equipamentoDetalhado: Equipamento | null = null;
  planosDoEquipamento: PlanoResumo[] = [];
  carregandoPlanos = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private service: EquipamentoService,
    private planoService: PlanoService
  ) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.service.listar().subscribe({
      next: (dados) => { this.equipamentos = dados; this.cdr.detectChanges(); },
      error: (err) => console.error('Erro ao buscar equipamentos:', err)
    });
  }

  abrirModal(equipamento?: Equipamento): void {
    this.equipamentoSelecionado = equipamento ? { ...equipamento } : null;
    this.isEditMode = !!equipamento;
    this.exibirModal = true;
  }

  fecharModal(): void {
    this.exibirModal = false;
    this.equipamentoSelecionado = null;
    this.isEditMode = false;
  }

  onSalvo(): void {
    this.fecharModal();
    this.carregarDados();
  }

  abrirDetalhe(eq: Equipamento): void {
    this.equipamentoDetalhado = eq;
    this.planosDoEquipamento = [];
    this.carregandoPlanos = true;

    this.planoService.listarPorEquipamento(eq.id!).subscribe({
      next: (planos) => {
        this.planosDoEquipamento = planos;
        this.carregandoPlanos = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregandoPlanos = false; this.cdr.detectChanges(); }
    });
  }

  fecharDetalhe(): void {
    this.equipamentoDetalhado = null;
    this.planosDoEquipamento = [];
  }

  formatarData(isoDate: string): string {
    const [ano, mes, dia] = isoDate.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  getStatusLabel(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0)  return `Atrasada ${Math.abs(diff)}d`;
    if (diff === 0) return 'Hoje';
    if (diff <= 7)  return `Em ${diff}d`;
    return 'No prazo';
  }

  getStatusClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0)  return 'bg-red-500/20 text-red-400';
    if (diff === 0) return 'bg-orange-500/20 text-orange-400';
    if (diff <= 7)  return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  }

  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}