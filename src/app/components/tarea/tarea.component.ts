import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadosService } from 'src/app/services/estados/estados.service';
import { PrioridadesService } from 'src/app/services/prioridades/prioridades.service';
import { ProyectosService } from 'src/app/services/proyectos/proyectos.service';
import { ResponsablesService } from 'src/app/services/responsables/responsables.service';
import { TareasService } from 'src/app/services/tareas/tareas.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-tarea',
  templateUrl: './tarea.component.html',
  styleUrls: ['./tarea.component.css'],
})
export class TareaComponent implements OnInit {
  tareaForm: FormGroup = this.fb.group({});
  filtroForm: FormGroup = this.fb.group({});
  tareas: any;
  prioridades: any;
  estados: any;
  responsables: any;
  proyectos: any;
  tareaSeleccionada: any;
  criterioOrdenamiento: string = 'fechaCierre';

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

    this.filtroForm = this.fb.group({
      prioridad: [null],
      responsable: [null],
      estado: [null],
      fechaRegistro: [null],
      fechaCierre: [null],
      proyecto: [null],
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

    console.log(this.tareas);
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

  obtenerTareas(): void {
    const valoresFormulario = this.filtroForm.value;
    this.tareasService
      .filtrarTareas(
        valoresFormulario.prioridad,
        valoresFormulario.responsable,
        valoresFormulario.estado,
        valoresFormulario.proyecto,
        valoresFormulario.fechaCierre,
        valoresFormulario.fechaRegistro,
        this.criterioOrdenamiento
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
    this.filtroForm.reset();
    this.getAllTareas();
  }
  clearFilter(campo: string): void {
    const control = this.filtroForm.get(campo);
    if (control) {
      control.reset(); // Resetea solo el control especificado
    }
  }

  generarPDF() {
    const doc = new jsPDF();

    // titulo del pdf
    doc.setFontSize(20);
    const responsable = this.filtroForm.get('responsable')?.value;
    const prioridad = this.filtroForm.get('prioridad')?.value;
    const estado = this.filtroForm.get('estado')?.value;
    const proyecto = this.filtroForm.get('proyecto')?.value;

    doc.text(`Lista de Tareas`, 10, 10);

    doc.setFontSize(14);

    if (responsable !== null) {
      const tarea = this.tareas[0];
      const responsable = tarea.responsable.nombre;
      doc.text(`Responsable: ${responsable}`, 10, 15);
    } else {
      doc.text(`Responsable: Todos`, 10, 15);
    }

    if (prioridad !== null) {
      const tarea = this.tareas[0];
      const prioridad = tarea.prioridad.nombre;
      doc.text(`Prioridad: ${prioridad}`, 10, 20);
    } else {
      doc.text(`Pioridad: Todos`, 10, 20);
    }

    if (estado !== null) {
      const tarea = this.tareas[0];
      const estado = tarea.estado.nombre;
      doc.text(`Estado: ${estado}`, 10, 25);
    } else {
      doc.text(`Estado: Todos`, 10, 25);
    }

    if (proyecto !== null) {
      const tarea = this.tareas[0];
      const proyecto = tarea.proyecto.nombre;
      doc.text(`Proyecto: ${proyecto}`, 10, 30);
    } else {
      doc.text(`Proyecto: Todos`, 10, 30);
    }

    const tareas = this.tareas;

    const data = tareas.map(
      (tareas: {
        proyecto: any;
        fechaCierre: any;
        fechaRegistro: any;
        prioridad: any;
        responsable: any;
        nombre: any;
        estado: { nombre: any };
      }) => ({
        nombre: tareas.nombre,
        estado: tareas.estado.nombre,
        responsable: tareas.responsable.nombre,
        prioridad: tareas.prioridad.nombre,
        fechaRegistro: tareas.fechaRegistro,
        fechaCierre: tareas.fechaCierre,
        proyecto: tareas.proyecto.nombre,
      })
    );

    // creacion de Head dinamico:

    // Headers para la tabla de tareas
    autoTable(doc, {
      head: [
        [
          'Tarea',
          'Estado',
          'Responsable',
          'Prioridad',
          'Fecha de Registro',
          'Fecha de Cierre',
          'Proyecto',
        ],
      ],
      body: data.map(
        (task: {
          proyecto: any;
          fechaCierre: any;
          fechaRegistro: any;
          prioridad: any;
          responsable: any;
          nombre: any;
          estado: any;
        }) => [
          task.nombre,
          task.estado,
          task.responsable,
          task.prioridad,
          task.fechaRegistro,
          task.fechaCierre,
          task.proyecto,
        ]
      ),
      startY: 35,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 10 },
      // columnStyles: {
      //   0: { halign: 'left' },
      //   1: { halign: 'center' },
      // },
    });

    doc.save('lista_de_tareas.pdf');
  }
}
