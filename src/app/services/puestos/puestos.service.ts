import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PuestosService {
  private API_SERVER = 'http://localhost:8080/puestos';

  constructor(private httpClient: HttpClient) {}

  public getAllPuestos(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  public savePuesto(puesto: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, puesto);
  }

  public deletePuesto(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + '/delete/' + id);
  }

  public filtrarPuestos(ordenamiento?: string | null): Observable<any> {
    let params: any = {};

    if (ordenamiento !== null) {
      params.ordenamiento = ordenamiento;
    }

    return this.httpClient.get(`${this.API_SERVER}`, { params });
  }
}
