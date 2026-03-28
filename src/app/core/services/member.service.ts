import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member, MemberRequest } from '../models/member';
import { Payment } from '../models/payment';


@Injectable({ providedIn: 'root' })
export class MemberService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/members`;

  getAll(): Observable<Member[]> {
    return this.http.get<Member[]>(this.base);
  }

  getAllActive(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.base}/active`);
  }

  getById(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.base}/${id}`);
  }

  // ⚠️ Asegurate de corregir la ruta en el back a /by-dni/{dni}
  getByDni(dni: string): Observable<Member> {
    return this.http.get<Member>(`${this.base}/by-dni/${dni}`);
  }

  create(dto: MemberRequest): Observable<Member> {
    return this.http.post<Member>(this.base, dto);
  }

  update(id: number, dto: MemberRequest): Observable<Member> {
    return this.http.put<Member>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  getPaymentsByMember(memberId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.base}/${memberId}/payments`);
  }

  getAllWithExpiredPayments(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.base}/expired`);
  }
}
