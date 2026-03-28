export type PlanName =
  | 'ONCE_PER_WEEK'
  | 'TWICE_PER_WEEK'
  | 'THREE_TIMES_PER_WEEK'
  | 'FOUR_TIMES_PER_WEEK';

export const PLAN_LABELS: Record<PlanName, string> = {
  ONCE_PER_WEEK: '1 vez por semana',
  TWICE_PER_WEEK: '2 veces por semana',
  THREE_TIMES_PER_WEEK: '3 veces por semana',
  FOUR_TIMES_PER_WEEK: '4 veces por semana'
};

export const PLAN_SESSIONS: Record<PlanName, number> = {
  ONCE_PER_WEEK: 1,
  TWICE_PER_WEEK: 2,
  THREE_TIMES_PER_WEEK: 3,
  FOUR_TIMES_PER_WEEK: 4
};

export interface MembershipPlan {
  id: number;
  planName: PlanName;
  price: number;
}

export interface MembershipPlanRequest {
  planName: PlanName;
  price: number;
}
