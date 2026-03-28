export type DayOfWeek =
  | 'MONDAY' | 'TUESDAY' | 'WEDNESDAY'
  | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo'
};

export const DAY_ORDER: DayOfWeek[] = [
  'MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY'
];

export interface ClassSchedule {
  id: number;
  day: DayOfWeek;
  startTime: string;  // "HH:mm:ss" desde Spring
  endTime: string;
  maxCapacity: number;
  memberIds: number[];
}

export interface ClassScheduleRequest {
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  maxCapacity: number;
}
