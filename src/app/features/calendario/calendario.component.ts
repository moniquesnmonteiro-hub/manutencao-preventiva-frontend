// Importa Component, OnInit, inject e signal.
import { Component, OnInit, inject, signal, computed } from '@angular/core';
// Importa FormsModule para ngModel nos filtros.
import { FormsModule } from '@angular/forms';
// Importa RouterLink para navegação.
import { RouterLink } from '@angular/router';
// Importa o serviço do calendário.
import { CalendarioService } from '../../core/services/calendario.service';
// Importa o serviço de equipamentos para popular o filtro.
import { EquipamentoService } from '../../core/services/equipamento';
// Importa os modelos.
import { FiltroCalendario, ItemCalendario } from '../../core/models/calendario.model';
import { Equipamento } from '../../core/models/equipamento.model';

// Declara o componente do calendário de manutenções.
@Component({
  // Seletor do componente.
  selector: 'app-calendario',
  // Componente standalone.
  standalone: true,
  // Módulos usados no template.
  imports: [FormsModule, RouterLink],
  // Arquivo HTML externo.
  templateUrl: './calendario.component.html',
  // Arquivo CSS externo.
  styleUrl: './calendario.component.css',
})
// Classe do componente de calendário.
export class CalendarioComponent implements OnInit {
  // Injeta o serviço do calendário.
  private calendarioService = inject(CalendarioService);
  // Injeta o serviço de equipamentos.
  private equipamentoService = inject(EquipamentoService);

  // Lista de itens do calendário retornada pela API.
  itens = signal<ItemCalendario[]>([]);
  // Lista de equipamentos para o select de filtro.
  equipamentos = signal<Equipamento[]>([]);
  // Flag de carregamento.
  carregando = signal(true);

  // Filtro de status selecionado pelo usuário.
  filtroStatus: FiltroCalendario = 'todas';
  // Filtro por equipamento selecionado.
  filtroEquipamento = '';

  // Opções de filtro de status para o template.
  readonly filtrosStatus: { value: FiltroCalendario; label: string }[] = [
    { value: 'todas', label: 'Todas' },
    { value: 'atrasadas', label: 'Atrasadas' },
    { value: 'esta_semana', label: 'Esta semana' },
    { value: 'este_mes', label: 'Este mês' },
  ];

  // Total de itens exibidos (para o subtítulo).
  total = computed(() => this.itens().length);

  // Ciclo de vida: carrega dados ao iniciar.
  ngOnInit(): void {
    // Carrega equipamentos para o select de filtro.
    this.equipamentoService.listar().subscribe({
      next: (equipamentos) => this.equipamentos.set(equipamentos),
    });
    // Carrega os itens do calendário com os filtros padrão.
    this.buscar();
  }

  // Aplica os filtros e recarrega a lista.
  buscar(): void {
    // Ativa o carregamento.
    this.carregando.set(true);
    // Chama a API com os filtros atuais.
    this.calendarioService.listar(
      this.filtroStatus,
      this.filtroEquipamento || undefined,
    ).subscribe({
      next: (itens) => {
        // Atualiza o signal com os dados recebidos.
        this.itens.set(itens);
        // Desativa o carregamento.
        this.carregando.set(false);
      },
      error: () => {
        // Desativa o carregamento mesmo em caso de erro.
        this.carregando.set(false);
      },
    });
  }

  // Reseta todos os filtros e recarrega.
  limparFiltros(): void {
    this.filtroStatus = 'todas';
    this.filtroEquipamento = '';
    this.buscar();
  }

  // Formata uma data ISO para o padrão brasileiro DD/MM/AAAA.
  formatarData(isoDate: string): string {
    const [ano, mes, dia] = isoDate.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Retorna o label de status de prazo baseado na data prevista.
  getStatusLabel(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return `Atrasada ${Math.abs(diff)}d`;
    if (diff === 0) return 'Hoje';
    if (diff <= 7) return `Em ${diff}d`;
    return 'No prazo';
  }

  // Retorna a classe CSS do badge de status.
  getStatusClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (diff === 0) return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    if (diff <= 7) return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border border-green-500/30';
  }

  // Retorna a classe CSS da borda lateral do card conforme o prazo.
  getBordaClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return 'border-l-4 border-l-red-500';
    if (diff === 0) return 'border-l-4 border-l-orange-500';
    if (diff <= 7) return 'border-l-4 border-l-yellow-500';
    return 'border-l-4 border-l-green-500';
  }

  // Calcula a diferença em dias entre a data prevista e hoje.
  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}
