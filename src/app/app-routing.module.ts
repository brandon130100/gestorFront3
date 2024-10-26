import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareaComponent } from './components/tarea/tarea.component';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { DepartamentoComponent } from './components/departamento/departamento.component';
import { PuestoComponent } from './components/puesto/puesto.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';

const routes: Routes = [
  { path: 'tareas', component: TareaComponent },
  { path: 'responsables', component: ResponsableComponent },
  { path: 'departamentos', component: DepartamentoComponent },
  { path: 'puestos', component: PuestoComponent },
  { path: 'proyectos', component: ProyectoComponent },
  { path: '', redirectTo: '/tareas', pathMatch: 'full' },
  { path: '**', redirectTo: '/tareas' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
