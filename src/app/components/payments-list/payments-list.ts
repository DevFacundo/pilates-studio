import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { PaymentService } from '../../core/services/payment.service';
import { MemberService } from '../../core/services/member.service';
import { MembershipPlanService } from '../../core/services/membership-plan.service';
import { Payment, PaymentRequest, daysOverdue, isExpired } from '../../core/models/payment';
import { fullName, Member } from '../../core/models/member';
import { MembershipPlan, PLAN_LABELS } from '../../core/models/membership-plan';
import { forkJoin } from 'rxjs';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

type PaymentTab = 'overdue' | 'all';

@Component({
  selector: 'app-payments-list',
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe],
  templateUrl: './payments-list.html',
  styleUrl: './payments-list.css',
})
export class PaymentsList implements OnInit {
  private paymentService = inject(PaymentService);
  private memberService  = inject(MemberService);
  private planService    = inject(MembershipPlanService);

  payments     = signal<Payment[]>([]);
  members      = signal<Member[]>([]);
  plans        = signal<MembershipPlan[]>([]);
  loading      = signal(true);
  activeTab    = signal<PaymentTab>('overdue');
  searchQuery  = signal('');
  showForm     = signal(false);
  editPayment  = signal<Payment | null>(null);

  planLabels   = PLAN_LABELS;
 readonly isExpiredFn = isExpired;
readonly daysOverdueFn = daysOverdue;
readonly fullNameFn = fullName;
  // New payment form
  newForm: PaymentRequest = { memberId: 0, membershipPlanId: 0 };
  saving = signal(false);
  formError = signal('');

  overdue = computed(() =>
    this.payments().filter(p => isExpired(p.expirationDate))
  );

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const list = this.activeTab() === 'overdue' ? this.overdue() : this.payments();
    if (!q) return list;
    return list.filter(p => {
      const member = this.getMember(p.memberId);
      return member &&
        (`${member.firstName} ${member.lastName}`.toLowerCase().includes(q) ||
         p.amount.toString().includes(q));
    });
  });

  getMember(id: number): Member | undefined {
    return this.members().find(m => m.id === id);
  }

  getPlan(id: number): MembershipPlan | undefined {
    return this.plans().find(p => p.id === id);
  }

  getPlanLabel(id: number): string {
    const plan = this.getPlan(id);
    if (!plan) return '—';
    return this.planLabels[plan.planName] ?? plan.planName;
  }

  ngOnInit() {
    this.loadAll();
  }

  //

  loadAll() {
    this.loading.set(true);
    // Solo cargamos los últimos pagos y los planes (para el select del modal)
    forkJoin({
      latest: this.paymentService.getLatestPerMember(),
      plans:  this.planService.getAll(),
      members: this.memberService.getAll()
    }).subscribe({
      next: ({ latest, plans, members }) => {
        this.payments.set(latest);
        this.plans.set(plans);
        this.members.set(members);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  // openNewPayment() {
  //   this.newForm = { memberId: 0, membershipPlanId: 0 };
  //   this.editPayment.set(null);
  //   this.showForm.set(true);
  // }

markAsPaid(payment: Payment) {
  // 1. Buscamos los objetos completos para estar seguros
  const member = this.getMember(payment.memberId);
  const plan = this.getPlan(payment.membershipPlanId);

  // 2. Pre-cargamos el formulario
  this.newForm = {
    memberId: payment.memberId,
    membershipPlanId: payment.membershipPlanId,
    amount: payment.amount, // Mantiene el precio que venía pagando
    // USAMOS LA FECHA DE VENCIMIENTO ANTERIOR:
    // Esto asegura que el nuevo mes empiece justo donde terminó el anterior.
    paymentDate: payment.expirationDate
  };

  // 3. Abrimos el modal para que ella solo haga un click en "Registrar"
  this.showForm.set(true);
}

openNewPayment() {
  // Generamos la fecha de hoy en formato YYYY-MM-DD que entiende el input type="date"
  const today = new Date().toISOString().split('T')[0];

  this.newForm = {
    memberId: 0,
    membershipPlanId: 0,
    paymentDate: today // <-- Ahora el modal abre con la fecha de hoy puesta
  };

  this.editPayment.set(null);
  this.showForm.set(false); // Reset por seguridad
  setTimeout(() => this.showForm.set(true), 10); // Re-abrimos limpio
}
// markAsPaid(payment: Payment) {

//   console.log('Datos del pago recibido:', payment);
//   // Creamos el objeto explícitamente con los nombres de campos del DTO
//   const req: PaymentRequest = {
//     memberId: Number(payment.memberId),
//     membershipPlanId: Number(payment.membershipPlanId),
//     amount: payment.amount, // Mantenemos el mismo precio que venía pagando
//     paymentDate: new Date().toISOString().split('T')[0], // Hoy
//   };

//   this.saving.set(true); // Opcional: para feedback visual

//   this.paymentService.create(req).subscribe({
//     next: () => {
//       this.loadAll(); // Recarga la lista y el deudor desaparece/se actualiza
//       this.saving.set(false);
//     },
//     error: (err) => {
//       console.error('Error al registrar pago desde tarjeta:', err);
//       this.saving.set(false);
//       alert('No se pudo registrar el pago. Revisá la consola.');
//     }
//   });
// }
  // markAsPaid(payment: Payment) {
  //   // Actualizar fecha de pago a hoy → genera nueva expiración
  //   const req: PaymentRequest = {
  //     memberId:        payment.memberId,
  //     membershipPlanId: payment.membershipPlanId,
  //     paymentDate:     new Date().toISOString().split('T')[0],
  //   };
  //   this.paymentService.create(req).subscribe(() => this.loadAll());
  // }

  deletePayment(id: number) {
    if (!confirm('¿Eliminar este pago?')) return;
    this.paymentService.delete(id).subscribe(() => this.loadAll());
  }

  // submitForm() {
  //   if (!this.newForm.memberId || !this.newForm.membershipPlanId) {
  //     this.formError.set('Seleccioná alumna y plan.');
  //     return;
  //   }
  //   this.formError.set('');
  //   this.saving.set(true);
  //   this.paymentService.create(this.newForm).subscribe({
  //     next: () => { this.saving.set(false); this.showForm.set(false); this.loadAll(); },
  //     error: (e) => { this.saving.set(false); this.formError.set(e.userMessage ?? 'Error'); },
  //   });
  // }
submitForm() {
  // Validación manual antes de enviar
  if (!this.newForm.memberId || this.newForm.memberId === 0) {
    this.formError.set('Debes seleccionar una alumna.');
    return;
  }
  if (!this.newForm.membershipPlanId || this.newForm.membershipPlanId === 0) {
    this.formError.set('Debes seleccionar un plan.');
    return;
  }

  this.formError.set('');
  this.saving.set(true);

  // IMPORTANTE: Creamos una copia limpia para el POST
  const payload: PaymentRequest = {
    memberId: Number(this.newForm.memberId),
    membershipPlanId: Number(this.newForm.membershipPlanId),
    amount: this.newForm.amount ? Number(this.newForm.amount) : undefined,
    paymentDate: this.newForm.paymentDate || new Date().toISOString().split('T')[0]
  };

  this.paymentService.create(payload).subscribe({
    next: () => {
      this.saving.set(false);
      this.showForm.set(false);
      this.loadAll();
    },
    error: (e) => {
      this.saving.set(false);
      // Esto te va a mostrar el error exacto de validación de Spring en el modal
      this.formError.set(e.error?.message || 'Error en la validación del servidor');
    },
  });
}
  readonly tabs = [
  { k: 'overdue', l: 'Cuotas Vencidas' },
  { k: 'all',     l: 'Todos los Pagos' }
] as const;
}
