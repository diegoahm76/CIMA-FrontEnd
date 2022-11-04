import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TreesService {
  constructor(private httpClient: HttpClient) {}

  getTrees(año): Observable<any> {
    return this.httpClient.get(`/trees/getByYear/${año}`);
  }
}
