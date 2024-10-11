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
}
