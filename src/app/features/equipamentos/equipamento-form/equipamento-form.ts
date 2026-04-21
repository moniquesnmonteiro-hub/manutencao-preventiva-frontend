import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipamentoService } from '../../../core/services/equipamento';

@Component({
  selector: 'app-equipamento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './equipamento-form.html',
  styleUrl: './equipamento-form.css'
})
export class EquipamentoFormComponent {
  equipamentoForm: FormGroup;

  constructor(private fb: FormBuilder, private service: EquipamentoService) {
    this.equipamentoForm = this.fb.group({
      codigo: ['', Validators.required],
      nome: ['', Validators.required],
      tipo: ['', Validators.required],
      localizacao: ['', Validators.required],
      fabricante: ['', Validators.required],
      modelo: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.equipamentoForm.valid) {
      this.service.cadastrar(this.equipamentoForm.value).subscribe({
        next: () => {
          alert('Equipamento cadastrado com sucesso!');
          this.equipamentoForm.reset();
        },
        error: (err) => console.error('Erro ao cadastrar:', err)
      });
    }
  }
}