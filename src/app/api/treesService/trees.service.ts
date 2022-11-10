import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TreesService {
  private url = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getAllTrees(): Observable<any> {
    return this.httpClient.get(`${this.url}/trees/getAllTrees`);
  }
  getTrees(año): Observable<any> {
    return this.httpClient.get(`${this.url}/trees/getByYear/${año}`);
  }

  getByMunicipality(strId): Observable<any> {
    return this.httpClient.get(`${this.url}/trees/getByMunicipality/${strId}`);
  }
}
