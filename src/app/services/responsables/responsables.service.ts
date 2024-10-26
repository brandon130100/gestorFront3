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
}
