import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MembershipPlan, MembershipPlanRequest } from '../models/membership-plan';

@Injectable({ providedIn: 'root' })
export class MembershipPlanService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/membership-plans`;

  getAll(): Observable<MembershipPlan[]> {
    return this.http.get<MembershipPlan[]>(this.base);
  }

  getById(id: number): Observable<MembershipPlan> {
    return this.http.get<MembershipPlan>(`${this.base}/${id}`);
  }

  create(dto: MembershipPlanRequest): Observable<MembershipPlan> {
    return this.http.post<MembershipPlan>(this.base, dto);
  }

  update(id: number, dto: MembershipPlanRequest): Observable<MembershipPlan> {
    return this.http.put<MembershipPlan>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
