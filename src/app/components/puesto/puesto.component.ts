import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PuestosService } from 'src/app/services/puestos/puestos.service';

@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.css'],
})
export class PuestoComponent implements OnInit {
  puestoForm: FormGroup = this.fb.group({});
  puestos: any;
  puestoSeleccionado: any;
  criterioOrdenamiento: string = 'nombreAsc';
  page: number = 1;

  get nombre() {
    return this.puestoForm.get('nombre') as FormControl;
  }

  constructor(public fb: FormBuilder, public puestoService: PuestosService) {}

  ngOnInit(): void {
    this.puestoForm = this.fb.group({
      id: [''],
      nombre: [
        '',
        [Validators.required, Validators.pattern('[a-zA-Z0-9 ]{3,}')],
      ],
    });

    this.obtenerPuestos();
  }

  guardar(): void {
    this.puestoService.savePuesto(this.puestoForm.value).subscribe(
      (resp) => {
        this.puestoForm.reset();
        this.puestos = this.puestos.filter(
          (puesto: { id: any }) => resp.id !== puesto.id
        );
        this.puestos.push(resp);
      },
      (error) => {
        console.error(error);
      }
    );
    this.mostrarToast('El puesto se ha creado o modificado exitosamente.');
  }

  eliminar(puesto: any): void {
    this.puestoService.deletePuesto(puesto.id).subscribe(
      (resp) => {
        if (resp === null) {
          this.puestos = this.puestos.filter((p: any) => p.id !== puesto.id);
        }
      },
      (error) => {
        console.error(error);
      }
    );
    this.mostrarToast('El puesto se ha eliminado correctamente.');
  }

  editar(puesto: any) {
    this.puestoForm.setValue({
      id: puesto.id,
      nombre: puesto.nombre,
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
    this.puestoForm.reset();
  }

  seleccionarPuesto(puesto: any) {
    this.puestoSeleccionado = puesto;
  }

  obtenerPuestos(): void {
    this.puestoService.filtrarPuestos(this.criterioOrdenamiento).subscribe(
      (resp) => {
        this.puestos = resp;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onFiltrar(): void {
    this.obtenerPuestos();
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(20);

    doc.setTextColor(0, 0, 255);
    doc.text('Lista de Puestos', doc.internal.pageSize.width / 2, 10, {
      align: 'center',
    });

    doc.setFontSize(14);

    doc.setTextColor(0, 0, 0);

    const puestos = this.puestos;

    const data = puestos.map((puestos: { nombre: any }) => ({
      nombre: puestos.nombre,
    }));

    autoTable(doc, {
      head: [['Nombre']],
      body: data.map((puesto: { nombre: any }) => [puesto.nombre]),
      startY: 15,
      theme: 'grid',
      styles: { cellPadding: 1, fontSize: 10 },
    });

    doc.save('lista_de_puestos.pdf');
  }
}
