import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TareasService } from './services/tareas/tareas.service';
import { EstadosService } from './services/estados/estados.service';
import { EtiquetasService } from './services/etiquetas/etiquetas.service';
import { PrioridadesService } from './services/prioridades/prioridades.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  tareaForm: FormGroup = this.fb.group({});
  tareas: any;
  prioridades: any;
  estados: any;
  etiquetas: any;

  constructor(
    public fb: FormBuilder,
    public tareasService: TareasService,
    public estadosService: EstadosService,
    public etiquetasService: EtiquetasService,
    public prioridadesService: PrioridadesService
  ) {}

  ngOnInit(): void {
    this.tareaForm = this.fb.group({
      id: [''],
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      fechaLimite: ['', Validators.required],
      prioridad: ['', Validators.required],
      estado: ['', Validators.required],
      etiqueta: ['', Validators.required],
    });

    this.tareasService.getAllTareas().subscribe(
      (resp) => {
        this.tareas = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.prioridadesService.getAllPrioridades().subscribe(
      (resp) => {
        this.prioridades = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.estadosService.getAllEstados().subscribe(
      (resp) => {
        this.estados = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.etiquetasService.getAllEtiquetas().subscribe(
      (resp) => {
        this.etiquetas = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  guardar(): void {
    let tareaActualizada = this.tareaForm.value;
    if (this.tareaForm.get('id')?.value) {
      let tareaExistente = this.tareas.find(
        (tarea: any) => tarea.id === this.tareaForm.get('id')?.value
      );
      tareaActualizada.fechaCreacion = tareaExistente.fechaCreacion;
    }

    this.tareasService.saveTarea(this.tareaForm.value).subscribe(
      (resp) => {
        this.tareaForm.reset();
        this.tareas = this.tareas.filter(
          (tarea: { id: any }) => resp.id !== tarea.id
        );
        this.tareas.push(resp);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  eliminar(tarea: any): void {
    this.tareasService.deleteTarea(tarea.id).subscribe(
      (resp) => {
        if (resp === null) {
          this.tareas = this.tareas.filter((t: any) => t.id !== tarea.id);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }

  editar(tarea: any) {
    this.tareaForm.setValue({
      id: tarea.id,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      fechaLimite: tarea.fechaLimite,
      prioridad: tarea.prioridad.id,
      estado: tarea.estado.id,
      etiqueta: tarea.etiqueta.id,
    });
  }
}
