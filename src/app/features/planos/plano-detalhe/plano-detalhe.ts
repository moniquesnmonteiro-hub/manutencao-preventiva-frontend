import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PlanoService } from '../../../core/services/plano.service';
import { ExecucaoService } from '../../../core/services/execucao.service';
import { PlanoResumo } from '../../../core/models/plano.model';
import { ExecucaoResumo } from '../../../core/models/execucao.model';

@Component({
  selector: 'app-plano-detalhe',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0f172a] p-8">
      <div class="max-w-4xl mx-auto">

        <!-- Voltar -->
        <button
          (click)="voltar()"
          class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Voltar para Planos
        </button>

        @if (carregando) {
          <div class="flex items-center justify-center py-20 text-slate-500 gap-2">
            <svg class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Carregando...
          </div>
        } @else if (plano) {

          <!-- Card: Info do Plano -->
          <div class="bg-[#1e293b] rounded-xl border border-slate-700 p-6 mb-6">
            <div class="flex items-start justify-between">
              <div>
                @if (plano.equipamento) {
                  <p class="text-blue-400 font-mono text-sm mb-1">{{ plano.equipamento.codigo }} · {{ plano.equipamento.nome }}</p>
                }
                <h2 class="text-2xl font-semibold text-white">{{ plano.titulo }}</h2>
                @if (plano.descricao && plano.descricao !== plano.titulo) {
                  <p class="text-slate-400 text-sm mt-1">{{ plano.descricao }}</p>
                }
              </div>
              <span class="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full"
                [class]="getStatusClass(plano.proxima_em)">
                {{ getStatusLabel(plano.proxima_em) }}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Periodicidade</p>
                <p class="text-white font-medium">A cada {{ plano.periodicidade_days }} dias</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Próxima execução</p>
                <p class="text-white font-medium">{{ formatarData(plano.proxima_em) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Situação</p>
                <p class="font-medium" [class]="plano.ativo ? 'text-green-400' : 'text-slate-500'">
                  {{ plano.ativo ? 'Ativo' : 'Inativo' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Histórico de execuções -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-white">Histórico de Execuções</h3>
              <a
                [routerLink]="['/app/execucoes/nova']"
                [queryParams]="{ plano_id: plano.id }"
                class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                <span>+</span> Registrar Execução
              </a>
            </div>

            <div class="bg-[#1e293b] rounded-xl border border-slate-700 overflow-hidden">
              @if (execucoes.length === 0) {
                <div class="p-12 text-center">
                  <p class="text-slate-500 italic">Nenhuma execução registrada para este plano.</p>
                </div>
              } @else {
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-[#0f172a] border-b border-slate-700">
                      <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Data</th>
                      <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Técnico</th>
                      <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                      <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Conformidade</th>
                      <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Observações</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-700">
                    @for (exec of execucoes; track exec.id) {
                      <tr class="hover:bg-[#2d3a4f] transition-colors">
                        <td class="p-4 text-slate-300 font-medium">{{ formatarData(exec.data_execucao) }}</td>
                        <td class="p-4 text-slate-400 text-sm">{{ exec.tecnico?.nome ?? '—' }}</td>
                        <td class="p-4">
                          <span class="text-xs font-semibold px-2.5 py-1 rounded-full"
                            [class]="getStatusExecucaoClass(exec.status)">
                            {{ getStatusExecucaoLabel(exec.status) }}
                          </span>
                        </td>
                        <td class="p-4">
                          @if (exec.conformidade) {
                            <span class="text-green-400 text-sm font-medium">✓ Conforme</span>
                          } @else {
                            <span class="text-red-400 text-sm font-medium">✗ Não conforme</span>
                          }
                        </td>
                        <td class="p-4 text-slate-400 text-sm">
                          {{ exec.observacoes || '—' }}
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `
})
export class PlanoDetalheComponent implements OnInit {
  plano: PlanoResumo | null = null;
  execucoes: ExecucaoResumo[] = [];
  carregando = true;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private planoService = inject(PlanoService);
  private execucaoService = inject(ExecucaoService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;

    forkJoin({
      plano: this.planoService.buscarPorId(id),
      execucoes: this.execucaoService.listarPorPlano(id),
    }).subscribe({
      next: ({ plano, execucoes }) => {
        this.plano = plano;
        this.execucoes = execucoes;
        this.carregando = false;
        this.cdr.detectChanges();
      },
      error: () => { this.carregando = false; this.cdr.detectChanges(); },
    });
  }

  voltar(): void {
    this.router.navigate(['/app/planos']);
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

  getStatusExecucaoLabel(status: string): string {
    const labels: Record<string, string> = {
      realizada: 'Realizada',
      parcial: 'Parcial',
      nao_realizada: 'Não realizada',
    };
    return labels[status] ?? status;
  }

  getStatusExecucaoClass(status: string): string {
    const classes: Record<string, string> = {
      realizada: 'bg-green-500/20 text-green-400',
      parcial: 'bg-yellow-500/20 text-yellow-400',
      nao_realizada: 'bg-red-500/20 text-red-400',
    };
    return classes[status] ?? 'bg-slate-500/20 text-slate-400';
  }

  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}
