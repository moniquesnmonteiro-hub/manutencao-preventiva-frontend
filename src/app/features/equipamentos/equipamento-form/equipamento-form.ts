import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EquipamentoService } from '../../../core/services/equipamento';
import { Equipamento } from '../../../core/models/equipamento.model';

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
      <div class="grid grid-cols-1 gap-5">
        
        <div>
          <label class="block text-sm font-medium text-slate-400 mb-1">Código do Equipamento</label>
          <input 
            type="text" 
            formControlName="codigo"
            class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Ex: PRN-001">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-400 mb-1">Nome</label>
          <input 
            type="text" 
            formControlName="nome"
            class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Nome descritivo">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">Tipo</label>
            <input 
              type="text" 
              formControlName="tipo"
              class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Ex: Prensa">
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">Localização</label>
            <input 
              type="text" 
              formControlName="localizacao"
              class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              placeholder="Linha ou Setor">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-400 mb-1">Fabricante</label>
          <input 
            type="text" 
            formControlName="fabricante"
            class="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all">
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-4 border-t border-slate-700">
        <button 
          type="button" 
          (click)="cancelado.emit()"
          class="px-4 py-2 text-slate-400 hover:text-white transition-colors">
          Cancelar
        </button>
        <button 
          type="submit" 
          [disabled]="form.invalid"
          class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-8 py-2 rounded-lg font-medium transition-all">
          {{ equipamentoInicial ? 'Atualizar' : 'Salvar Equipamento' }}
        </button>
      </div>
    </form>
  `
})
export class EquipamentoFormComponent implements OnInit {
  // Entradas e Saídas para o Modal
  @Input() equipamentoInicial: Equipamento | null = null;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: EquipamentoService
  ) {
    // Inicialização do formulário reativo com validações básicas
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      localizacao: ['', [Validators.required]],
      fabricante: ['']
    });
  }

  ngOnInit(): void {
    // Se receber dados iniciais, preenche o formulário (Modo Edição)
    if (this.equipamentoInicial) {
      this.form.patchValue(this.equipamentoInicial);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const dados = this.form.value;

      if (this.equipamentoInicial?.id) {
        // Usa o método update que você ajustou no Dia 02
        this.service.update(this.equipamentoInicial.id, dados).subscribe({
          next: () => {
            alert('Equipamento atualizado com sucesso!');
            this.salvo.emit();
          },
          error: (err) => alert('Erro ao atualizar: ' + err.message)
        });
      } else {
        // Fluxo de novo cadastro
        this.service.cadastrar(dados).subscribe({
          next: () => {
            alert('Equipamento cadastrado com sucesso!');
            this.salvo.emit();
          },
          error: (err) => alert('Erro ao cadastrar: ' + err.message)
        });
      }
    }
  }
}