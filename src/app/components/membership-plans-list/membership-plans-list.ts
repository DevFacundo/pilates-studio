import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MembershipPlanService } from '../../core/services/membership-plan.service';
import { MembershipPlan, MembershipPlanRequest, PLAN_LABELS, PLAN_SESSIONS, PlanName } from '../../core/models/membership-plan';

@Component({
  selector: 'app-membership-plans-list',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './membership-plans-list.html',
  styleUrl: './membership-plans-list.css',
})
export class MembershipPlansList implements OnInit {
  private planService = inject(MembershipPlanService);

  plans      = signal<MembershipPlan[]>([]);
  loading    = signal(true);
  showModal  = signal(false);
  editTarget = signal<MembershipPlan | null>(null);
  saving     = signal(false);
  formError  = signal('');

  planNames: PlanName[] = [
    'ONCE_PER_WEEK',
    'TWICE_PER_WEEK',
    'THREE_TIMES_PER_WEEK',
    'FOUR_TIMES_PER_WEEK',
  ];
  planLabels  = PLAN_LABELS;
  planSessions = PLAN_SESSIONS;

  form: MembershipPlanRequest = { planName: 'ONCE_PER_WEEK', price: 0 };

  // Costo por clase (asumiendo 4 semanas/mes)
  pricePerClass(plan: MembershipPlan): number {
    const sessions = this.planSessions[plan.planName] * 4;
    return sessions > 0 ? Math.round(plan.price / sessions) : 0;
  }

  get isEdit() { return !!this.editTarget(); }

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.planService.getAll().subscribe({
      next: (d) => { this.plans.set(d); this.loading.set(false); },
      error: ()  => this.loading.set(false),
    });
  }

  openCreate() {
    this.form = { planName: 'ONCE_PER_WEEK', price: 0 };
    this.editTarget.set(null);
    this.formError.set('');
    this.showModal.set(true);
  }

  openEdit(p: MembershipPlan) {
    this.form = { planName: p.planName, price: p.price };
    this.editTarget.set(p);
    this.formError.set('');
    this.showModal.set(true);
  }

  delete(p: MembershipPlan) {
    if (!confirm(`¿Eliminar el plan "${this.planLabels[p.planName]}"?`)) return;
    this.planService.delete(p.id).subscribe(() => this.load());
  }

  submit() {
    if (this.form.price <= 0) { this.formError.set('El precio debe ser mayor a 0.'); return; }
    this.formError.set('');
    this.saving.set(true);

    const req$ = this.isEdit
      ? this.planService.update(this.editTarget()!.id, this.form)
      : this.planService.create(this.form);

    req$.subscribe({
      next:  () => { this.saving.set(false); this.showModal.set(false); this.load(); },
      error: (e) => { this.saving.set(false); this.formError.set(e.userMessage ?? 'Error'); },
    });
  }

}
