import { Component, OnInit, inject, signal, computed, LOCALE_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MemberService } from '../core/services/member.service';
import { PaymentService } from '../core/services/payment.service';
import { ClassScheduleService } from '../core/services/class-schedule.service';
import { DebtResponseDto, Member } from '../core/models/member';
import { ClassSchedule } from '../core/models/class-schedule';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, SlicePipe],
  templateUrl: './dashboard.html',
  providers: [{ provide: LOCALE_ID, useValue: 'es-AR' }]
})
export class DashboardComponent implements OnInit {
  private memberService      = inject(MemberService);
  private paymentService     = inject(PaymentService);
  private classScheduleService = inject(ClassScheduleService);

  loading        = signal(true);
  totalMembers   = signal(0);
  activeMembers  = signal(0);
  monthEarnings  = signal(0);
  expiredMembers = signal<DebtResponseDto[]>([]);
  allClasses     = signal<ClassSchedule[]>([]);

  expiredCount = computed(() => this.expiredMembers().length);

  today = new Date();

  todayClasses = computed(() => {
    const days = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
    const todayDay = days[this.today.getDay()];
    return this.allClasses().filter(c => c.day === todayDay);
  });

  todayStudentsTotal = computed(() =>
    this.todayClasses().reduce((sum, c) => sum + c.memberIds.length, 0)
  );

  get currentMonthName(): string {
    return this.today.toLocaleString('es', { month: 'long', year: 'numeric' });
  }

  capacityBadgeClass(cls: ClassSchedule): string {
  const ratio = cls.memberIds.length / cls.maxCapacity;

  if (ratio >= 1) return 'bg-terracotta/15 text-terracotta border-terracotta/20'; // Lleno
  if (ratio >= 0.75) return 'bg-gold/15 text-gold border-gold/20';               // Casi lleno
  return 'bg-sage/15 text-forest border-sage/20';                                // Con lugar
}
ngOnInit() {
  this.loading.set(true);

  forkJoin({
    all:      this.memberService.getAll(),
    active:   this.memberService.getAllActive(),
 
    expired:  this.paymentService.getDetailedDebts(),
    classes:  this.classScheduleService.getAll(),
  }).subscribe({
    next: ({ all, active, expired, classes }) => {
      this.totalMembers.set(all.length);
      this.activeMembers.set(active.length);
      this.expiredMembers.set(expired); // Aquí recibís el DTO con monthsOwed
      this.allClasses.set(classes);
      this.loading.set(false);
    },
    error: () => this.loading.set(false),
  });
}
// ngOnInit() {
//   this.loading.set(true);
//   forkJoin({
//     all:      this.memberService.getAll(),
//     active:   this.memberService.getAllActive(),
//     expired:  this.memberService.getAllWithExpiredPayments(),
//     classes:  this.classScheduleService.getAll(),
//   }).subscribe({
//     next: ({ all, active, expired, classes }) => {
//       this.totalMembers.set(all.length);
//       this.activeMembers.set(active.length);
//       this.expiredMembers.set(expired);
//       this.allClasses.set(classes);
//       this.loading.set(false);
//     },
//     error: () => this.loading.set(false),
//   });
//   }
}
