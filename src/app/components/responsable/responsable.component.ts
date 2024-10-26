import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepartamentosService } from 'src/app/services/departamentos/departamentos.service';
import { PuestosService } from 'src/app/services/puestos/puestos.service';
import { ResponsablesService } from 'src/app/services/responsables/responsables.service';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css'],
})
export class ResponsableComponent implements OnInit {
  responsableForm: FormGroup = this.fb.group({});
  responsables: any;
  departamentos: any;
  puestos: any;

  constructor(
    public fb: FormBuilder,
    public responsableService: ResponsablesService,
    public departamentoService: DepartamentosService,
    public puestoService: PuestosService
  ) {}

  ngOnInit(): void {
    this.responsableForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.required],
      celular: ['', Validators.required],
      departamento: ['', Validators.required],
      puesto: ['', Validators.required],
    });

    this.responsableService.getAllResponsables().subscribe(
      (resp) => {
        this.responsables = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.departamentoService.getAllDepartamentos().subscribe(
      (resp) => {
        this.departamentos = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.puestoService.getAllPuestos().subscribe(
      (resp) => {
        this.puestos = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  guardar(): void {
    this.responsableService
      .saveResponsable(this.responsableForm.value)
      .subscribe(
        (resp) => {
          this.responsableForm.reset();
          this.responsables = this.responsables.filter(
            (tarea: { id: any }) => resp.id !== tarea.id
          );
          this.responsables.push(resp);
        },
        (error) => {
          console.error(error);
        }
      );
  }

  eliminar(responsable: any): void {
    this.responsableService.deleteResponsable(responsable.id).subscribe(
      (resp) => {
        if (resp === null) {
          this.responsables = this.responsables.filter(
            (r: any) => r.id !== responsable.id
          );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editar(responsable: any) {
    this.responsableForm.setValue({
      id: responsable.id,
      nombre: responsable.nombre,
      apellido: responsable.apellido,
      correo: responsable.correo,
      celular: responsable.celular,
      departamento: responsable.departamento.id,
      puesto: responsable.puesto.id,
    });
  }
}
