import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PopulationService {
  private url = 'http://localhost:8000';
  constructor(private httpClient: HttpClient) {}

  createPerson(personModel: any): Observable<any> {
    return this.httpClient.post(
      `${this.url}/population/createPerson`,
      personModel
    );
  }
}
