import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DepartamentosService {
  private API_SERVER = 'http://localhost:8080/departamentos';

  constructor(private httpClient: HttpClient) {}

  public getAllDepartamentos(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }

  public saveDepartamento(departamento: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, departamento);
  }

  public deleteDepartamento(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + '/delete/' + id);
  }
}
