import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuestosService } from 'src/app/services/puestos/puestos.service';

@Component({
  selector: 'app-puesto',
  templateUrl: './puesto.component.html',
  styleUrls: ['./puesto.component.css'],
})
export class PuestoComponent implements OnInit {
  puestoForm: FormGroup = this.fb.group({});
  puestos: any;

  constructor(public fb: FormBuilder, public puestoService: PuestosService) {}

  ngOnInit(): void {
    this.puestoForm = this.fb.group({
      id: [''],
      nombre: ['', Validators.required],
    });

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
  }

  editar(puesto: any) {
    this.puestoForm.setValue({
      id: puesto.id,
      nombre: puesto.nombre,
    });
  }
}
