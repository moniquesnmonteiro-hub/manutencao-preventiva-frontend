import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EquipamentoService } from '../../../core/services/equipamento';
import { Equipamento } from '../../../core/models/equipamento.model';

@Component({
  selector: 'app-equipamento-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#0f172a] p-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h2 class="text-2xl font-light text-white tracking-tight">Equipamentos Cadastrados</h2>
          <span class="text-slate-400 text-sm">{{ equipamentos.length }} itens encontrados</span>
        </div>

        <div class="bg-[#1e293b] rounded-xl shadow-2xl border border-slate-700 overflow-hidden">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#0f172a] border-b border-slate-700">
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Código</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Nome</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Tipo</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Localização</th>
                <th class="p-4 text-xs font-medium text-slate-400 uppercase tracking-wider">Fabricante</th>
              </tr>
            </thead>
            <tbody class="text-slate-300 divide-y divide-slate-700">
              <tr *ngFor="let eq of equipamentos" class="hover:bg-[#2d3a4f] transition-colors cursor-default">
                <td class="p-4 font-mono text-blue-400">{{ eq.codigo }}</td>
                <td class="p-4 font-medium text-white">{{ eq.nome }}</td>
                <td class="p-4">{{ eq.tipo }}</td>
                <td class="p-4 text-slate-400 text-sm">{{ eq.localizacao }}</td>
                <td class="p-4">{{ eq.fabricante }}</td>
              </tr>
              
              <tr *ngIf="equipamentos.length === 0">
                <td colspan="5" class="p-10 text-center text-slate-500 italic">
                  Nenhum equipamento encontrado no sistema.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class EquipamentoListComponent implements OnInit {
  equipamentos: Equipamento[] = [];

  constructor(private service: EquipamentoService) {}

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (dados) => this.equipamentos = dados,
      error: (err) => console.error('Erro ao buscar equipamentos:', err)
    });
  }
}