// Importa Component, OnInit, inject, signal e ChangeDetectorRef.
import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core';
// Importa RouterLink para os botões de navegação.
import { RouterLink } from '@angular/router';
// Importa o serviço do dashboard.
import { DashboardService } from '../../core/services/dashboard.service';
// Importa os modelos do dashboard.
import { IndicadoresDashboard, PlanoAtrasadoDashboard } from '../../core/models/dashboard.model';

// Declara o componente do dashboard.
@Component({
  // Seletor do componente.
  selector: 'app-dashboard',
  // Componente standalone.
  standalone: true,
  // Módulos usados no template.
  imports: [RouterLink],
  // Arquivo HTML externo.
  templateUrl: './dashboard.component.html',
  // Arquivo CSS externo.
  styleUrl: './dashboard.component.css',
})
// Classe do componente de dashboard.
export class DashboardComponent implements OnInit {
  // Injeta o serviço do dashboard.
  private dashboardService = inject(DashboardService);
  // Injeta o ChangeDetectorRef para forçar atualização de view no modo zoneless.
  private cdr = inject(ChangeDetectorRef);

  // Indicadores numéricos dos cards.
  indicadores = signal<IndicadoresDashboard | null>(null);
  // Lista de planos atrasados para a seção de alertas.
  alertas = signal<PlanoAtrasadoDashboard[]>([]);
  // Flag de carregamento.
  carregando = signal(true);
  // Mensagem de erro, se houver.
  erro = signal<string | null>(null);

  // Ciclo de vida: carrega os dados ao iniciar.
  ngOnInit(): void {
    this.carregarDados();
  }

  // Busca o resumo do dashboard na API.
  carregarDados(): void {
    this.carregando.set(true);
    this.erro.set(null);
    this.dashboardService.getSummary().subscribe({
      next: (dados) => {
        this.indicadores.set(dados.indicadores);
        this.alertas.set(dados.alertas);
        this.carregando.set(false);
        this.cdr.detectChanges();
      },
      error: () => {
        this.erro.set('Não foi possível carregar os dados do dashboard.');
        this.carregando.set(false);
        this.cdr.detectChanges();
      },
    });
  }

  // Formata uma data ISO para o padrão brasileiro DD/MM/AAAA.
  formatarData(isoDate: string): string {
    const [ano, mes, dia] = String(isoDate).split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  }

  // Retorna o label de cor da conformidade conforme o percentual.
  getCorConformidade(valor: number): string {
    if (valor >= 80) return 'text-green-400';
    if (valor >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }
}
