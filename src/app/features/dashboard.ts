import { Component, OnInit, inject, signal, computed, LOCALE_ID } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MemberService } from '../core/services/member.service';
import { PaymentService } from '../core/services/payment.service';
import { ClassScheduleService } from '../core/services/class-schedule.service';
import { Member } from '../core/models/member';
import { ClassSchedule } from '../core/models/class-schedule';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, SlicePipe],
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
  expiredMembers = signal<Member[]>([]);
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

  capacityDotClass(cls: ClassSchedule): string {
    const ratio = cls.memberIds.length / cls.maxCapacity;
    if (ratio >= 1)    return 'bg-red-400';
    if (ratio >= 0.75) return 'bg-yellow-400';
    return 'bg-emerald-400';
  }

  ngOnInit() {
    forkJoin({
      all:      this.memberService.getAll(),
      active:   this.memberService.getAllActive(),
      expired:  this.memberService.getAllWithExpiredPayments(),
      earnings: this.paymentService.getEarningsForMonth(
                  this.today.getFullYear(),
                  this.today.getMonth() + 1
                ),
      classes:  this.classScheduleService.getAll(),
    }).subscribe({
      next: ({ all, active, expired, earnings, classes }) => {
        this.totalMembers.set(all.length);
        this.activeMembers.set(active.length);
        this.expiredMembers.set(expired);
        this.monthEarnings.set(earnings);
        this.allClasses.set(classes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
