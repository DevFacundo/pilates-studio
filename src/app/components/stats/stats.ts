import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { PaymentService } from '../../core/services/payment.service';
import { DebtResponseDto } from '../../core/models/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stats',
  imports: [CommonModule, CurrencyPipe, FormsModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {
private paymentService = inject(PaymentService);

  monthEarnings = signal(0);
  totalPendingDebt = signal(0);
  debtDetails = signal<DebtResponseDto[]>([]); // Para mostrar quién debe

  // Filtros
  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth() + 1);

  years = [2024, 2025, 2026];
  months = [
    { v: 1, n: 'Enero' }, { v: 2, n: 'Febrero' }, { v: 3, n: 'Marzo' },
    { v: 4, n: 'Abril' }, { v: 5, n: 'Mayo' }, { v: 6, n: 'Junio' },
    { v: 7, n: 'Julio' }, { v: 8, n: 'Agosto' }, { v: 9, n: 'Septiembre' },
    { v: 10, n: 'Octubre' }, { v: 11, n: 'Noviembre' }, { v: 12, n: 'Diciembre' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // 1. Ingresos del mes seleccionado
    this.paymentService.getEarningsForMonth(this.selectedYear(), this.selectedMonth())
      .subscribe(total => this.monthEarnings.set(total));

    // 2. Deudas (Esto es general, pero lo guardamos para el detalle)
    this.paymentService.getDetailedDebts().subscribe(debts => {
      console.log('Deudas recibidas:', debts);
      this.debtDetails.set(debts);
      const total = debts.reduce((sum, d) => sum + d.totalDebtAmount, 0);
      this.totalPendingDebt.set(total);
    });
  }

  onFilterChange() {
    this.loadData();
  }
}
