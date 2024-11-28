import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private API_SERVER = 'http://localhost:8080/proyectos';

  constructor(private httpClient: HttpClient) {}

  public getAllProyectos(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  public saveProyecto(proyecto: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, proyecto);
  }

  public deleteProyecto(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + '/delete/' + id);
  }

  public filtrarProyectos(ordenamiento?: string | null): Observable<any> {
    let params: any = {};

    if (ordenamiento !== null) {
      params.ordenamiento = ordenamiento;
    }

    return this.httpClient.get(`${this.API_SERVER}`, { params });
  }
}
