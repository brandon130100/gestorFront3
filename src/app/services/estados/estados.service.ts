import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadosService {
  private API_SERVER = 'http://localhost:8080/estados';

  constructor(private httpClient: HttpClient) {}

  public getAllEstados(): Observable<any> {
    return this.httpClient.get(this.API_SERVER);
  }
}
