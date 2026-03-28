import { ClassSchedule } from "./class-schedule";
import { HealthRecord, HealthRecordRequest } from "./health-record";

export interface Member {
  id: number;
  dni: string;
  firstName: string;
  lastName: string;
  email?: string;         // Agregar al backend
  phoneNumber: string;
  auxiliaryPhoneNumber?: string;
  active: boolean;
  birthDate: string;      // 'YYYY-MM-DD'
  signUpDate: string;
  healthRecord?: HealthRecord;
  classSchedules: ClassSchedule[];
}

export interface MemberRequest {
  dni: string;
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber: string;
  auxiliaryPhoneNumber?: string;
  birthDate?: string;
  signUpDate?: string;
  healthRecord?: HealthRecordRequest;
  classScheduleId?: number[];
}

export function fullName(member: Member): string {
  return `${member.firstName} ${member.lastName}`;
}
