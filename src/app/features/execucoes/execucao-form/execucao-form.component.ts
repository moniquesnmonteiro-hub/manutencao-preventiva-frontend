import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExecucaoService } from '../../../core/services/execucao.service';
import { PlanoService } from '../../../core/services/plano.service';
import { AuthService } from '../../../core/services/auth.service';
import { CreateExecucaoDTO, StatusExecucao } from '../../../core/models/execucao.model';
import { PlanoResumo } from '../../../core/models/plano.model';

@Component({
  selector: 'app-execucao-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './execucao-form.component.html',
  styleUrl: './execucao-form.component.css',
})
export class ExecucaoFormComponent implements OnInit {
  private execucaoService = inject(ExecucaoService);
  private planoService = inject(PlanoService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  planos = signal<PlanoResumo[]>([]);
  loading = signal(false);
  erro = signal<string | null>(null);

  plano_id = '';
  data_realizada = '';
  status: StatusExecucao = 'realizada';
  conformidade = true;
  observacoes = '';

  readonly statusOpcoes: { value: StatusExecucao; label: string }[] = [
    { value: 'realizada', label: 'Realizada' },
    { value: 'parcial', label: 'Parcial' },
    { value: 'nao_realizada', label: 'Não realizada' },
  ];

  ngOnInit(): void {
    this.data_realizada = new Date().toISOString().split('T')[0];

    this.planoService.listarTodos().subscribe({
      next: (planos) => {
        this.planos.set(planos);
        // Pré-seleciona o plano se veio via query param ?plano_id=...
        const idParam = this.route.snapshot.queryParamMap.get('plano_id');
        if (idParam) this.plano_id = idParam;
      },
    });
  }

  onSubmit(): void {
    if (!this.plano_id || !this.data_realizada || !this.observacoes.trim()) return;

    const tecnicoId = this.authService.currentUser?.id;
    if (!tecnicoId) {
      this.erro.set('Usuário não autenticado.');
      return;
    }

    this.loading.set(true);
    this.erro.set(null);

    const dto: CreateExecucaoDTO = {
      plano_id: this.plano_id,
      tecnico_id: Number(tecnicoId),
      data_realizada: this.data_realizada + 'T00:00:00.000Z',
      status: this.status,
      conformidade: this.conformidade,
      observacoes: this.observacoes.trim(),
    };

    this.execucaoService.criar(dto).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/app/planos', this.plano_id]);
      },
      error: (err) => {
        this.erro.set(err.error?.message ?? 'Erro ao registrar execução.');
        this.loading.set(false);
      },
    });
  }

  getStatusLabel(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return `Atrasada ${Math.abs(diff)}d`;
    if (diff === 0) return 'Hoje';
    if (diff <= 7) return `Em ${diff}d`;
    return 'No prazo';
  }

  getStatusClass(proximaEm: string): string {
    const diff = this.diffDias(proximaEm);
    if (diff < 0) return 'bg-red-500/20 text-red-400';
    if (diff === 0) return 'bg-orange-500/20 text-orange-400';
    if (diff <= 7) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  }

  private diffDias(isoDate: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(isoDate.split('T')[0] + 'T00:00:00');
    return Math.floor((data.getTime() - hoje.getTime()) / 86_400_000);
  }
}
