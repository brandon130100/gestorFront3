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
  selectedResponsableId: number | null = null;
  selectedEstadoId: number | null = null;
  selectedProyectoId: number | null = null;
  selectedFechaCierre: string | null = null;

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

    // this.getAllTareas();
    this.obtenerTareas();

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

  // filterTareasByPriority(): void {
  //   if (this.selectedPriorityId !== null) {
  //     this.tareasService.getTareasByPriority(this.selectedPriorityId).subscribe(
  //       (data) => {
  //         this.tareas = data;
  //       },
  //       (error) => {
  //         console.error(error);
  //       }
  //     );
  //   } else {
  //     this.getAllTareas(); // Si no hay prioridad seleccionada, muestra todas las tareas
  //   }
  //   console.log(this.tareas);
  // }

  // filterTareasByResponsable(): void {
  //   if (this.selectedResponsableId !== null) {
  //     this.tareasService
  //       .getTareasByResponsable(this.selectedResponsableId)
  //       .subscribe(
  //         (data) => {
  //           this.tareas = data;
  //         },
  //         (error) => {
  //           console.error(error);
  //         }
  //       );
  //   } else {
  //     this.getAllTareas(); // Si no hay responsable seleccionado, muestra todas las tareas
  //   }
  //   console.log(this.tareas);
  // }

  // filtrarTareasByPrioridadAndResponsable(): void {
  //   // Caso: ambos seleccionados
  //   if (
  //     this.selectedResponsableId !== null &&
  //     this.selectedPriorityId !== null
  //   ) {
  //     this.tareasService
  //       .getTareasByPriorityAndResponsable(
  //         this.selectedPriorityId,
  //         this.selectedResponsableId
  //       )
  //       .subscribe((data) => (this.tareas = data));
  //     return;
  //   }
  //   if (this.selectedResponsableId !== null) {
  //     this.filterTareasByResponsable();
  //     return;
  //   }
  //   if (this.selectedPriorityId !== null) {
  //     this.filterTareasByPriority();
  //     return;
  //   }
  //   this.getAllTareas();
  // }

  obtenerTareas(): void {
    this.tareasService
      .filtrarTareas(
        this.selectedPriorityId,
        this.selectedResponsableId,
        this.selectedEstadoId,
        this.selectedProyectoId,
        this.selectedFechaCierre
      )
      .subscribe(
        (tareas) => {
          this.tareas = tareas;
        },
        (error) => {
          console.error('Error al obtener tareas:', error);
        }
      );
  }

  onFiltrar(): void {
    this.obtenerTareas(); // Vuelve a obtener las tareas con los filtros aplicados
  }

  borrarFiltros(): void {
    this.getAllTareas();
  }
}
