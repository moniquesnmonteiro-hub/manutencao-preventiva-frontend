// Importa Component, OnInit, inject e signal.
import { Component, OnInit, inject, signal } from '@angular/core';
// Importa FormsModule para usar ngModel no template.
import { FormsModule } from '@angular/forms';
// Importa roteamento para navegar e ler query params.
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// Importa o serviço de execuções.
import { ExecucaoService } from '../../../core/services/execucao.service';
// Importa o serviço de planos.
import { PlanoService } from '../../../core/services/plano.service';
// Importa o serviço de autenticação para obter o técnico logado.
import { AuthService } from '../../../core/services/auth.service';
// Importa os tipos de execução.
import { CreateExecucaoDTO, StatusExecucao } from '../../../core/models/execucao.model';
// Importa o tipo de plano.
import { PlanoResumo } from '../../../core/models/plano.model';

// Declara o componente de formulário de execução.
@Component({
  // Seletor do componente.
  selector: 'app-execucao-form',
  // Componente standalone sem módulo.
  standalone: true,
  // Módulos usados no template.
  imports: [FormsModule, RouterLink],
  // Arquivo HTML externo.
  templateUrl: './execucao-form.component.html',
  // Arquivo CSS externo.
  styleUrl: './execucao-form.component.css',
})
// Classe do componente de registro de execução.
export class ExecucaoFormComponent implements OnInit {
  // Injeta o serviço de execuções.
  private execucaoService = inject(ExecucaoService);
  // Injeta o serviço de planos para popular o select.
  private planoService = inject(PlanoService);
  // Injeta o serviço de autenticação para obter o ID do técnico.
  private authService = inject(AuthService);
  // Injeta o router para navegar após salvar.
  private router = inject(Router);
  // Injeta a rota ativa para ler query params.
  private route = inject(ActivatedRoute);

  // Lista de planos carregada da API.
  planos = signal<PlanoResumo[]>([]);
  // Flag de carregamento durante o envio.
  loading = signal(false);
  // Mensagem de erro para exibir no template.
  erro = signal<string | null>(null);

  // Campos vinculados ao formulário via ngModel.
  plano_id = '';
  data_realizada = '';
  status: StatusExecucao = 'realizada';
  conformidade = true;
  observacoes = '';

  // Opções de status disponíveis para o técnico selecionar.
  readonly statusOpcoes: { value: StatusExecucao; label: string }[] = [
    { value: 'realizada', label: 'Realizada' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'nao_realizada', label: 'Não realizada' },
  ];

  // Ciclo de vida: executa ao iniciar o componente.
  ngOnInit(): void {
    // Define a data de hoje como padrão para o campo de data.
    this.data_realizada = new Date().toISOString().split('T')[0];

    // Carrega todos os planos ativos para o select.
    this.planoService.listarTodos().subscribe({
      next: (planos) => {
        // Atualiza o signal com os planos recebidos.
        this.planos.set(planos);
        // Pré-seleciona o plano se veio via query param ?plano_id=...
        const idParam = this.route.snapshot.queryParamMap.get('plano_id');
        if (idParam) this.plano_id = idParam;
      },
    });
  }

  // Trata o envio do formulário.
  onSubmit(): void {
    // Valida campos obrigatórios.
    if (!this.plano_id || !this.data_realizada) return;

    // Obtém o ID do técnico logado.
    const tecnicoId = this.authService.currentUser?.id;
    if (!tecnicoId) {
      this.erro.set('Usuário não autenticado.');
      return;
    }

    // Ativa o estado de carregamento.
    this.loading.set(true);
    // Limpa erros anteriores.
    this.erro.set(null);

    // Monta o payload conforme esperado pelo backend.
    const dto: CreateExecucaoDTO = {
      plano_id: this.plano_id,
      tecnico_id: Number(tecnicoId),
      data_realizada: this.data_realizada + 'T00:00:00.000Z',
      status: this.status,
      conformidade: this.conformidade,
      observacoes: this.observacoes || undefined,
    };

    // Chama o serviço para registrar a execução.
    this.execucaoService.criar(dto).subscribe({
      next: () => {
        // Desativa carregamento.
        this.loading.set(false);
        // Navega para o detalhe do plano ou lista de planos.
        this.router.navigate(['/app/planos', this.plano_id]);
      },
      error: (err) => {
        // Exibe mensagem de erro.
        this.erro.set(err.error?.message ?? 'Erro ao registrar execução.');
        // Desativa carregamento.
        this.loading.set(false);
      },
    });
  }

  // Retorna o label em português para o status de um plano.
  getStatusLabel(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return `Atrasada ${Math.abs(diff)}d`;
    if (diff === 0) return 'Hoje';
    if (diff <= 7) return `Em ${diff}d`;
    return 'No prazo';
  }

  // Retorna a classe CSS do badge de status do plano.
  getStatusClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return 'bg-red-500/20 text-red-400';
    if (diff === 0) return 'bg-orange-500/20 text-orange-400';
    if (diff <= 7) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  }

  // Calcula a diferença em dias entre a data prevista e hoje.
  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}
