import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {
  private apiUrl = `${ environment.apiBaseUrl}/Franchise`;

  constructor(private http: HttpClient) {}

  // get all franchises
  getFranchises(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
