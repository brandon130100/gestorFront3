import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareasService {
  private API_SERVER = 'http://localhost:8080/tareas';

  constructor(private httpClient: HttpClient) {}

  public getAllTareas(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  public saveTarea(tarea: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, tarea);
  }

  public deleteTarea(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + '/delete/' + id);
  }

  // public getTareasByPriority(priorityId: number): Observable<any> {
  //   return this.httpClient.get(`${this.API_SERVER}?prioridadId=${priorityId}`);
  // }

  // public getTareasByResponsable(responsableId: number): Observable<any> {
  //   return this.httpClient.get(
  //     `${this.API_SERVER}?responsableId=${responsableId}`
  //   );
  // }

  // public getTareasByPriorityAndResponsable(
  //   priorityId: number,
  //   responsableId: number
  // ): Observable<any> {
  //   return this.httpClient.get(
  //     `${this.API_SERVER}?responsableId=${responsableId}&prioridadId=${priorityId}`
  //   );
  // }

  public filtrarTareas(
    priorityId?: number | null,
    responsableId?: number | null,
    estadoId?: number | null,
    proyectoId?: number | null,
    fechaCierre?: string | null,
    fechaRegistro?: string | null,
    ordenamiento?: string | null
  ): Observable<any> {
    // Crea un objeto para almacenar los parámetros
    let params: any = {};

    // Agrega los parámetros solo si no son nulos
    if (priorityId !== null) {
      params.prioridadId = priorityId;
    }
    if (responsableId !== null) {
      params.responsableId = responsableId;
    }
    if (estadoId !== null) {
      params.estadoId = estadoId;
    }
    if (proyectoId !== null) {
      params.proyectoId = proyectoId;
    }
    if (fechaCierre !== null) {
      params.fechaCierre = fechaCierre;
    }
    if (fechaRegistro !== null) {
      params.fechaRegistro = fechaRegistro;
    }
    if (ordenamiento !== null) {
      params.ordenamiento = ordenamiento;
    }

    // Realiza la solicitud GET con los parámetros
    return this.httpClient.get(`${this.API_SERVER}`, { params });
  }
}
