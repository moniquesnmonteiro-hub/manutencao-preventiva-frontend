import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef, inject } from '@angular/core';
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

      @if (errorMsg) {
        <div class="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-4">
          <div class="shrink-0 w-9 h-9 rounded-full bg-red-500/20 flex items-center justify-center mt-0.5">
            <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
          </div>
          <div>
            <p class="text-red-400 font-semibold text-sm">{{ errorTitle }}</p>
            <p class="text-red-300/80 text-xs mt-0.5">{{ errorMsg }}</p>
          </div>
        </div>
      }

      @if (successMsg) {
        <div class="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
          <svg class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <p class="text-green-400 text-sm">{{ successMsg }}</p>
        </div>
      }

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
          [disabled]="form.invalid || isSaving"
          class="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-8 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
          @if (isSaving) {
            <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            Salvando...
          } @else {
            {{ equipamentoInicial ? 'Atualizar' : 'Salvar Equipamento' }}
          }
        </button>
      </div>
    </form>
  `
})
export class EquipamentoFormComponent implements OnInit {
  @Input() equipamentoInicial: Equipamento | null = null;
  @Output() salvo = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  form: FormGroup;
  isSaving = false;
  errorTitle = '';
  errorMsg = '';
  successMsg = '';

  private cdr = inject(ChangeDetectorRef);

  constructor(
    private fb: FormBuilder,
    private service: EquipamentoService
  ) {
    this.form = this.fb.group({
      codigo: ['', [Validators.required]],
      nome: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      localizacao: ['', [Validators.required]],
      fabricante: ['']
    });
  }

  ngOnInit(): void {
    if (this.equipamentoInicial) {
      this.form.patchValue(this.equipamentoInicial);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSaving = true;
    this.errorMsg = '';
    this.successMsg = '';

    const dados = this.form.value;
    const isEdicao = !!this.equipamentoInicial?.id;

    const request$ = isEdicao
      ? this.service.update(this.equipamentoInicial!.id!, dados)
      : this.service.cadastrar(dados);

    request$.subscribe({
      next: () => {
        this.isSaving = false;
        this.successMsg = isEdicao
          ? 'Equipamento atualizado com sucesso!'
          : 'Equipamento cadastrado com sucesso!';
        this.cdr.detectChanges();
        setTimeout(() => this.salvo.emit(), 1000);
      },
      error: (err) => {
        this.isSaving = false;
        const status = err.status ?? 0;
        if (status === 403) {
          this.errorTitle = 'Acesso negado';
          this.errorMsg = 'Apenas gestores e supervisores podem editar equipamentos. Entre em contato com o responsável.';
        } else if (status === 0) {
          this.errorTitle = 'Sem conexão';
          this.errorMsg = 'Não foi possível conectar ao servidor. Verifique sua rede.';
        } else {
          this.errorTitle = 'Erro ao salvar';
          this.errorMsg = err.error?.message ?? 'Ocorreu um erro inesperado. Tente novamente.';
        }
        this.cdr.detectChanges();
      },
    });
  }
}