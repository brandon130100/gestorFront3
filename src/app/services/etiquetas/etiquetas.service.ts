import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EtiquetasService {
  private API_SERVER = 'http://localhost:8080/etiquetas';

  constructor(private httpClient: HttpClient) {}

  public getAllEtiquetas(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }
}
