import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectosService } from 'src/app/services/proyectos/proyectos.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit {
  proyectoForm: FormGroup = this.fb.group({});
  proyectos: any;

  constructor(
    public fb: FormBuilder,
    public proyectoService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.proyectoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.proyectoService.getAllProyectos().subscribe(
      (resp) => {
        this.proyectos = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  guardar(): void {
    this.proyectoService.saveProyecto(this.proyectoForm.value).subscribe(
      (resp) => {
        this.proyectoForm.reset();
        this.proyectos = this.proyectos.filter(
          (proyecto: { id: any }) => resp.id !== proyecto.id
        );
        this.proyectos.push(resp);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  eliminar(proyecto: any): void {
    this.proyectoService.deleteProyecto(proyecto.id).subscribe(
      (resp) => {
        if (resp === null) {
          this.proyectos = this.proyectos.filter(
            (p: any) => p.id !== proyecto.id
          );
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editar(proyecto: any) {
    this.proyectoForm.setValue({
      id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
    });
  }
}
