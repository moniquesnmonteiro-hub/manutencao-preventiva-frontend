import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../core/services/equipamento';
import { Equipamento } from '../../../core/models/equipamento.model';
import { EquipamentoFormComponent } from '../equipamento-form/equipamento-form';

@Component({
  selector: 'app-equipamento-list',
  standalone: true,
  imports: [CommonModule, EquipamentoFormComponent],
  template: `
    <div class="min-h-screen bg-[#0f172a] p-8">
      <div class="max-w-6xl mx-auto">
        
        <div class="flex justify-between items-center mb-8">
          <div>
            <h2 class="text-2xl font-light text-white tracking-tight">Equipamentos Cadastrados</h2>
            <p class="text-slate-400 text-sm">{{ equipamentos.length }} itens encontrados</p>
          </div>
          <button 
            (click)="abrirModal()"
            class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <span class="text-xl">+</span> Novo Equipamento
          </button>
        </div>

        <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <table class="w-full text-left border-collapse">
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
                <tr class="hover:bg-[#2d3a4f] transition-colors cursor-default group">
                  <td class="p-4 font-mono text-blue-400">{{ eq.codigo }}</td>
                  <td class="p-4 font-medium text-white">{{ eq.nome }}</td>
                  <td class="p-4">{{ eq.tipo }}</td>
                  <td class="p-4 text-slate-400 text-sm">{{ eq.localizacao }}</td>
                  <td class="p-4">
                    <button 
                      (click)="abrirModal(eq)"
                      class="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>✏️</span> Editar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="p-10 text-center text-slate-500 italic">
                    Nenhum equipamento encontrado no sistema.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (exibirModal) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" (click)="fecharModal()"></div>
        
        <div class="relative bg-[#1e293b] w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl p-8 overflow-hidden">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-semibold text-white">
              {{ isEditMode ? 'Editar Equipamento' : 'Cadastrar Equipamento' }}
            </h3>
            <button (click)="fecharModal()" class="text-slate-400 hover:text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
  `
})
export class EquipamentoListComponent implements OnInit {
  equipamentos: Equipamento[] = [];
  
  exibirModal = false;
  isEditMode = false;
  equipamentoSelecionado: Equipamento | null = null;

  constructor(private service: EquipamentoService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.service.listar().subscribe({
      next: (dados) => this.equipamentos = dados,
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
}