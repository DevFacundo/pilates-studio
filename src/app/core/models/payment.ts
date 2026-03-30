export type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface Payment {
  id: number;
  amount: number;
  paymentDate: string;      // 'YYYY-MM-DD'
  expirationDate: string;   // 'YYYY-MM-DD'
  memberId: number;
  memberName: string;
  membershipPlanId: number;
  status?: PaymentStatus;   // Una vez que lo agregues al back
}

export interface PaymentRequest {
  amount?: number;
  paymentDate?: string;
  memberId: number;
  membershipPlanId: number;
}

// Helper para saber si un pago está vencido
export function isExpired(expirationDate: string): boolean {
  return new Date(expirationDate) < new Date();
}

export function daysOverdue(expirationDate: string): number {
  const diff = new Date().getTime() - new Date(expirationDate).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
