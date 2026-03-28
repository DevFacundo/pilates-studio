import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Payment, PaymentRequest } from '../models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/payments`;

  getById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.base}/${id}`);
  }

  getByMember(memberId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.base}/member/${memberId}`);
  }

  getExpired(before?: string): Observable<Payment[]> {
    const params = before ? new HttpParams().set('before', before) : undefined;
    return this.http.get<Payment[]>(`${this.base}/expired`, { params });
  }

  getByDateRange(startDate: string, endDate: string): Observable<Payment[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this.http.get<Payment[]>(`${this.base}/date-range`, { params });
  }

  getEarningsForMonth(year: number, month: number): Observable<number> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString());
    return this.http.get<number>(`${this.base}/earnings`, { params });
  }

  create(dto: PaymentRequest): Observable<Payment> {
    return this.http.post<Payment>(this.base, dto);
  }

  update(id: number, dto: PaymentRequest): Observable<Payment> {
    return this.http.put<Payment>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
