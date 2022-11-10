import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TypeValuesService {
  private url = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  getMunicipalityList(): Observable<any> {
    return this.httpClient.get(`${this.url}/typeValues/getMunicipalityList`);
  }
}
