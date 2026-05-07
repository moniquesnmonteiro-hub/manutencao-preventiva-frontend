// Importa Component, OnInit, inject, signal, computed e ChangeDetectorRef.
import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core';
// Importa FormsModule para ngModel nos filtros.
import { FormsModule } from '@angular/forms';
// Importa RouterLink para navegação.
import { RouterLink } from '@angular/router';
// Importa o serviço do calendário.
import { CalendarioService } from '../../core/services/calendario.service';
// Importa o serviço de equipamentos para popular o filtro.
import { EquipamentoService } from '../../core/services/equipamento';
// Importa os modelos.
import { FiltroCalendario, ItemCalendario, TecnicoBasico } from '../../core/models/calendario.model';
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
  // Injeta o ChangeDetectorRef para forçar atualização de view no modo zoneless.
  private cdr = inject(ChangeDetectorRef);

  // Lista de itens do calendário retornada pela API.
  itens = signal<ItemCalendario[]>([]);
  // Lista de equipamentos para o select de filtro.
  equipamentos = signal<Equipamento[]>([]);
  // Flag de carregamento geral.
  carregando = signal(true);

  // ID do card com o campo de busca de técnico aberto (null = nenhum).
  idEditandoTecnico = signal<string | null>(null);
  // Texto atual digitado no campo de busca de técnico.
  buscaTexto = signal('');
  // Lista de técnicos retornados pela busca.
  resultadosBusca = signal<TecnicoBasico[]>([]);
  // Flag de carregamento da busca de técnicos.
  buscandoTecnico = signal(false);

  // Timer para debounce da busca de técnicos.
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

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
    // Fecha qualquer busca de técnico aberta.
    this.cancelarBusca();
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

  // Abre o campo de busca de técnico para o card do plano informado.
  abrirBuscaTecnico(planoId: string): void {
    this.idEditandoTecnico.set(planoId);
    this.buscaTexto.set('');
    this.resultadosBusca.set([]);
  }

  // Fecha o campo de busca e limpa os resultados.
  cancelarBusca(): void {
    this.idEditandoTecnico.set(null);
    this.buscaTexto.set('');
    this.resultadosBusca.set([]);
    // Cancela debounce pendente.
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
  }

  // Dispara a busca de técnicos com debounce ao digitar.
  onBuscaInput(valor: string): void {
    // Atualiza o texto da busca.
    this.buscaTexto.set(valor);
    // Cancela debounce anterior.
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    // Limpa resultados se o campo estiver vazio.
    if (!valor.trim()) {
      this.resultadosBusca.set([]);
      return;
    }
    // Aguarda 300ms antes de disparar a requisição.
    this.debounceTimer = setTimeout(() => {
      this.buscandoTecnico.set(true);
      this.calendarioService.buscarTecnicos(valor).subscribe({
        next: (tecnicos) => {
          this.resultadosBusca.set(tecnicos);
          this.buscandoTecnico.set(false);
          this.cdr.detectChanges();
        },
        error: () => {
          this.buscandoTecnico.set(false);
          this.cdr.detectChanges();
        },
      });
    }, 300);
  }

  // Atribui o técnico selecionado ao plano e atualiza a lista local.
  selecionarTecnico(planoId: string, tecnico: TecnicoBasico): void {
    this.calendarioService.atribuirTecnico(planoId, tecnico.id).subscribe({
      next: () => {
        // Atualiza apenas o item afetado no signal, sem recarregar a lista.
        this.itens.update(lista =>
          lista.map(item =>
            item.id === planoId ? { ...item, tecnico } : item
          )
        );
        // Fecha o campo de busca.
        this.cancelarBusca();
        this.cdr.detectChanges();
      },
    });
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
