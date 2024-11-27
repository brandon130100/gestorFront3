import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TareaComponent } from './components/tarea/tarea.component';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { ProyectoComponent } from './components/proyecto/proyecto.component';
import { DepartamentoComponent } from './components/departamento/departamento.component';
import { PuestoComponent } from './components/puesto/puesto.component';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    TareaComponent,
    ResponsableComponent,
    ProyectoComponent,
    DepartamentoComponent,
    PuestoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
