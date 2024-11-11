import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from 'src/app/services/estados/estados.service';
import { PrioridadesService } from 'src/app/services/prioridades/prioridades.service';
import { ProyectosService } from 'src/app/services/proyectos/proyectos.service';
import { ResponsablesService } from 'src/app/services/responsables/responsables.service';
import { TareasService } from 'src/app/services/tareas/tareas.service';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css'],
})
export class TareaComponent implements OnInit {
  tareaForm: FormGroup = this.fb.group({});
  tareas: any;
  prioridades: any;
  estados: any;
  responsables: any;
  proyectos: any;
  tareaSeleccionada: any;
  selectedPriorityId: number | null = null;

  constructor(
    public fb: FormBuilder,
    public tareasService: TareasService,
    public estadosService: EstadosService,
    public prioridadesService: PrioridadesService,
    public responsablesService: ResponsablesService,
    public proyectosService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.tareaForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
      prioridad: ['', Validators.required],
      responsable: ['', Validators.required],
      estado: ['', Validators.required],
      fechaRegistro: [null],
      fechaCierre: ['', Validators.required],
      proyecto: ['', Validators.required],
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

    this.responsablesService.getAllResponsables().subscribe(
      (resp) => {
        this.responsables = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.proyectosService.getAllProyectos().subscribe(
      (resp) => {
        this.proyectos = resp;
      },
      (error) => {
        console.error(error);
      }
    );

    this.getAllTareas();
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
    this.mostrarToast('La tarea se ha creado exitosamente.');
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
    this.mostrarToast('La tarea se ha eliminado correctamente.');
  }

  editar(tarea: any) {
    this.tareaForm.setValue({
      id: tarea.id,
      nombre: tarea.nombre,
      prioridad: tarea.prioridad.id,
      responsable: tarea.responsable.id,
      estado: tarea.estado.id,
      fechaRegistro: tarea.fechaRegistro,
      fechaCierre: tarea.fechaCierre,
      proyecto: tarea.proyecto.id,
    });
  }

  mostrarToast(mensaje: string) {
    const toastElement = document.getElementById('taskToast');
    if (toastElement) {
      const toastBody = toastElement.querySelector('.toast-body');
      if (toastBody) {
        toastBody.textContent = mensaje;
      }
      const toast = new (window as any).bootstrap.Toast(toastElement);
      toast.show();
    }
  }

  cerrar(): void {
    this.tareaForm.reset();
  }

  seleccionarTarea(tarea: any) {
    this.tareaSeleccionada = tarea;
  }

  getAllTareas(): void {
    this.tareasService.getAllTareas().subscribe((data) => (this.tareas = data));
  }

  filterTareasByPriority(): void {
    if (this.selectedPriorityId !== null) {
      this.tareasService
        .getTareasByPriority(this.selectedPriorityId)
        .subscribe((data) => {
          // Filtramos para asegurarnos de que todas las tareas tengan una prioridad asignada
          this.tareas = data.filter(
            (tarea: any) => tarea.priority && tarea.priority.name
          );
        });
    } else {
      this.getAllTareas();
    }
  }
}
