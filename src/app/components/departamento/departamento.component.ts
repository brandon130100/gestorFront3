import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentosService } from 'src/app/services/departamentos/departamentos.service';

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
})
export class DepartamentoComponent implements OnInit {
  departamentoForm: FormGroup = this.fb.group({});
  departamentos: any;

  constructor(
    public fb: FormBuilder,
    public departamentoService: DepartamentosService
  ) {}

  ngOnInit(): void {
    this.departamentoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
    });

    this.departamentoService.getAllDepartamentos().subscribe(
      (resp) => {
        this.departamentos = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  guardar(): void {
    this.departamentoService
      .saveDepartamento(this.departamentoForm.value)
      .subscribe(
        (resp) => {
          this.departamentoForm.reset();
          this.departamentos = this.departamentos.filter(
            (departamento: { id: any }) => resp.id !== departamento.id
          );
          this.departamentos.push(resp);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  eliminar(departamento: any): void {
    this.departamentoService.deleteDepartamento(departamento.id).subscribe(
      (resp) => {
        if (resp === null) {
          this.departamentos = this.departamentos.filter(
            (d: any) => d.id !== departamento.id
          );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editar(departamento: any) {
    this.departamentoForm.setValue({
      id: departamento.id,
      nombre: departamento.nombre,
    });
  }
}
