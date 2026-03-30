import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { Member } from '../../core/models/member';
import { PaymentService } from '../../core/services/payment.service';
import { DAY_LABELS } from '../../core/models/class-schedule';
import { daysOverdue, isExpired, Payment } from '../../core/models/payment';
import { calcIMC, imcCategory } from '../../core/models/health-record';


type Tab = 'personal' | 'salud' | 'pagos' | 'clases';
@Component({
  selector: 'app-member-detail',
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './member-detail.html',
})
export class MemberDetail implements OnInit {
  @Input()  member!: Member;
  @Output() closed        = new EventEmitter<void>();
  @Output() editRequested = new EventEmitter<Member>();

  private paymentService = inject(PaymentService);

  activeTab = signal<Tab>('personal');
  payments  = signal<Payment[]>([]);
  dayLabels = DAY_LABELS;

  tabs: { key: Tab; label: string }[] = [
    { key: 'personal', label: 'Personal' },
    { key: 'salud',    label: 'Salud' },
    { key: 'pagos',    label: 'Pagos' },
    { key: 'clases',   label: 'Clases' },
  ];

  get imc(): number | null {
    const hr = this.member.healthRecord;
    if (!hr?.height || !hr?.weight) return null;
    return calcIMC(hr.height, hr.weight);
  }

  get imcInfo() {
    if (!this.imc) return null;
    return imcCategory(this.imc);
  }

  isExpired   = isExpired;
  daysOverdue = daysOverdue;

  ngOnInit() {
    this.paymentService.getByMember(this.member.id).subscribe(p => this.payments.set(p));
  }

}
