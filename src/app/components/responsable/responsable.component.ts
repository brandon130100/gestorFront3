import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  filtroForm: FormGroup = this.fb.group({});
  responsables: any;
  departamentos: any;
  puestos: any;
  responsableSeleccionado: any;
  criterioOrdenamiento: string = 'departamento';
  page: number = 1;

  get nombre() {
    return this.responsableForm.get('nombre') as FormControl;
  }

  get apellido() {
    return this.responsableForm.get('apellido') as FormControl;
  }

  get correo() {
    return this.responsableForm.get('correo') as FormControl;
  }

  get celular() {
    return this.responsableForm.get('celular') as FormControl;
  }

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

    this.filtroForm = this.fb.group({
      departamento: [null],
      puesto: [null],
    });

    this.obtenerResponsables();

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
    this.mostrarToast('El responsable se ha creado o modificado exitosamente.');
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
    this.mostrarToast('El responsable se ha eliminado correctamente.');
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
    this.responsableForm.reset();
  }

  seleccionarResponsable(responsable: any) {
    this.responsableSeleccionado = responsable;
  }

  obtenerResponsables(): void {
    const valoresFormulario = this.filtroForm.value;
    this.responsableService
      .filtrarResponsables(
        valoresFormulario.departamento,
        valoresFormulario.puesto,
        this.criterioOrdenamiento
      )
      .subscribe(
        (responsables) => {
          this.responsables = responsables;
        },
        (error) => {
          console.error('Error al obtener los responsables: ', error);
        }
      );
  }

  onFiltrar(): void {
    this.obtenerResponsables();
  }

  borrarFiltros(): void {
    this.filtroForm.reset();
    this.obtenerResponsables();
  }

  clearFilter(campo: string): void {
    const control = this.filtroForm.get(campo);
    if (control) {
      control.reset();
    }
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);
    const departamento = this.filtroForm.get('departamento')?.value;
    const puesto = this.filtroForm.get('puesto')?.value;
    doc.setFontSize(20);

    doc.setTextColor(0, 0, 255);
    doc.text('Lista de Responsables', doc.internal.pageSize.width / 2, 10, {
      align: 'center',
    });

    doc.setFontSize(14);

    doc.setTextColor(0, 0, 0);

    if (departamento !== null) {
      const responsable = this.responsables[0];
      const departamento = responsable.departamento.nombre;
      doc.text(`Departamento: ${departamento}`, 10, 15);
    } else {
      doc.text(`Departamento: Todos`, 10, 15);
    }

    if (puesto !== null) {
      const responsable = this.responsables[0];
      const puesto = responsable.puesto.nombre;
      doc.text(`Puesto: ${puesto}`, 10, 20);
    } else {
      doc.text(`Puesto: Todos`, 10, 20);
    }

    const responsables = this.responsables;

    const data = responsables.map(
      (responsables: {
        nombre: any;
        apellido: any;
        correo: any;
        celular: any;
        departamento: { nombre: any };
        puesto: { nombre: any };
      }) => ({
        nombre: responsables.nombre,
        apellido: responsables.apellido,
        correo: responsables.correo,
        celular: responsables.celular,
        departamento: responsables.departamento.nombre,
        puesto: responsables.puesto.nombre,
      })
    );

    autoTable(doc, {
      head: [
        ['Nombre', 'Apellido', 'Correo', 'Celular', 'Departamento', 'Puesto'],
      ],
      body: data.map(
        (responsable: {
          nombre: any;
          apellido: any;
          correo: any;
          celular: any;
          departamento: any;
          puesto: any;
        }) => [
          responsable.nombre,
          responsable.apellido,
          responsable.correo,
          responsable.celular,
          responsable.departamento,
          responsable.puesto,
        ]
      ),
      startY: 25,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 10 },
    });

    doc.save('lista_de_responsables.pdf');
  }
}
