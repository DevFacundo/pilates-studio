import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pathology, PathologyRequest } from '../models/pathology';

@Injectable({ providedIn: 'root' })
export class PathologyService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/pathologies`;

  getAll(): Observable<Pathology[]> {
    return this.http.get<Pathology[]>(this.base);
  }

  getById(id: number): Observable<Pathology> {
    return this.http.get<Pathology>(`${this.base}/${id}`);
  }

  getByName(name: string): Observable<Pathology> {
    const params = new HttpParams().set('name', name);
    return this.http.get<Pathology>(`${this.base}/by-name`, { params });
  }

  create(dto: PathologyRequest): Observable<Pathology> {
    return this.http.post<Pathology>(this.base, dto);
  }

  update(id: number, dto: PathologyRequest): Observable<Pathology> {
    return this.http.put<Pathology>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
