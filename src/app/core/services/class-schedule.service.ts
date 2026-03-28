import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ClassSchedule, ClassScheduleRequest } from '../models/class-schedule';
import { Member } from '../models/member';

@Injectable({ providedIn: 'root' })
export class ClassScheduleService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/class-schedules`;

  getAll(): Observable<ClassSchedule[]> {
    return this.http.get<ClassSchedule[]>(this.base);
  }

  getById(id: number): Observable<ClassSchedule> {
    return this.http.get<ClassSchedule>(`${this.base}/${id}`);
  }

  getMembersBySchedule(id: number): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.base}/${id}/members`);
  }

  create(dto: ClassScheduleRequest): Observable<ClassSchedule> {
    return this.http.post<ClassSchedule>(this.base, dto);
  }

  update(id: number, dto: ClassScheduleRequest): Observable<ClassSchedule> {
    return this.http.put<ClassSchedule>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
