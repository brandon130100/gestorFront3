import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResponsablesService {
  private API_SERVER = 'http://localhost:8080/responsables';

  constructor(private httpClient: HttpClient) {}

  public getAllResponsables(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  public saveResponsable(responsable: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, responsable);
  }

  public deleteResponsable(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + '/delete/' + id);
  }

  public filtrarResponsables(
    departamentoId?: number | null,
    puestoId?: number | null,
    ordenamiento?: string | null
  ): Observable<any> {
    let params: any = {};

    if (departamentoId !== null) {
      params.departamentoId = departamentoId;
    }
    if (puestoId !== null) {
      params.puestoId = puestoId;
    }
    if (ordenamiento !== null) {
      params.ordenamiento = ordenamiento;
    }
    return this.httpClient.get(`${this.API_SERVER}`, { params });
  }
}
