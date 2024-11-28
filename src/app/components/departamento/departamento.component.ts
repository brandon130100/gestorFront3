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

@Component({
  selector: 'app-departamento',
  templateUrl: './departamento.component.html',
  styleUrls: ['./departamento.component.css'],
})
export class DepartamentoComponent implements OnInit {
  departamentoForm: FormGroup = this.fb.group({});
  departamentos: any;
  departamentoSeleccionado: any;
  criterioOrdenamiento: string = 'nombreAsc';
  page: number = 1;

  get nombre() {
    return this.departamentoForm.get('nombre') as FormControl;
  }

  constructor(
    public fb: FormBuilder,
    public departamentoService: DepartamentosService
  ) {}

  ngOnInit(): void {
    this.departamentoForm = this.fb.group({
      id: [''],
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,}')],
      ],
    });

    this.obtenerDepartamentos();
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
    this.mostrarToast(
      'El departamento se ha creado o modificado exitosamente.'
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
    this.mostrarToast('El departamento se ha eliminado correctamente.');
  }

  editar(departamento: any) {
    this.departamentoForm.setValue({
      id: departamento.id,
      nombre: departamento.nombre,
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
    this.departamentoForm.reset();
  }

  seleccionarDepartamento(departamento: any) {
    this.departamentoSeleccionado = departamento;
  }

  obtenerDepartamentos(): void {
    this.departamentoService
      .filtrarDepartamentos(this.criterioOrdenamiento)
      .subscribe(
        (resp) => {
          this.departamentos = resp;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  onFiltrar(): void {
    this.obtenerDepartamentos();
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.setTextColor(0, 0, 255);
    doc.text('Lista de Departamentos', doc.internal.pageSize.width / 2, 10, {
      align: 'center',
    });

    doc.setFontSize(14);

    doc.setTextColor(0, 0, 0);

    const departamentos = this.departamentos;

    const data = departamentos.map((departamentos: { nombre: any }) => ({
      nombre: departamentos.nombre,
    }));

    autoTable(doc, {
      head: [['Nombre']],
      body: data.map((departamento: { nombre: any }) => [departamento.nombre]),
      startY: 15,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 10 },
    });

    doc.save('lista_de_departamentos.pdf');
  }
}
