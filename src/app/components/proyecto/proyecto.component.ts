import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProyectosService } from 'src/app/services/proyectos/proyectos.service';

@Component({
  selector: 'app-proyecto',
  templateUrl: './proyecto.component.html',
  styleUrls: ['./proyecto.component.css'],
})
export class ProyectoComponent implements OnInit {
  proyectoForm: FormGroup = this.fb.group({});
  proyectos: any;
  proyectoSeleccionado: any;
  criterioOrdenamiento: string = 'nombreAsc';
  page: number = 1;

  get nombre() {
    return this.proyectoForm.get('nombre') as FormControl;
  }

  get descripcion() {
    return this.proyectoForm.get('descripcion') as FormControl;
  }

  constructor(
    public fb: FormBuilder,
    public proyectoService: ProyectosService
  ) {}

  ngOnInit(): void {
    this.proyectoForm = this.fb.group({
      id: [''],
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,}')],
      ],
      descripcion: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{5,}')],
      ],
    });

    this.obtenerProyectos();
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
    this.mostrarToast('El proyecto se ha creado o modificado exitosamente.');
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
    this.mostrarToast('El departamento se ha eliminado correctamente.');
  }

  editar(proyecto: any) {
    this.proyectoForm.setValue({
      id: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
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
    this.proyectoForm.reset();
  }

  seleccionarProyecto(proyecto: any) {
    this.proyectoSeleccionado = proyecto;
  }

  obtenerProyectos(): void {
    this.proyectoService.filtrarProyectos(this.criterioOrdenamiento).subscribe(
      (resp) => {
        this.proyectos = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onFiltrar(): void {
    this.obtenerProyectos();
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.setTextColor(0, 0, 255);
    doc.text('Lista de Proyectos', doc.internal.pageSize.width / 2, 10, {
      align: 'center',
    });

    doc.setFontSize(14);

    doc.setTextColor(0, 0, 0);

    const proyectos = this.proyectos;

    const data = proyectos.map(
      (proyectos: { nombre: any; descripcion: any }) => ({
        nombre: proyectos.nombre,
        descripcion: proyectos.descripcion,
      })
    );

    autoTable(doc, {
      head: [['Nombre', 'Descripcion']],
      body: data.map((proyecto: { nombre: any; descripcion: any }) => [
        proyecto.nombre,
        proyecto.descripcion,
      ]),
      startY: 15,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 10 },
    });

    doc.save('lista_de_proyectos.pdf');
  }
}
