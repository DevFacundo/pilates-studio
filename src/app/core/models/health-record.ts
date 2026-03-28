import { Pathology } from "./pathology";

export interface HealthRecord {
  id: number;
  height: number;   // cm
  weight: number;   // kg
  pathologies: Pathology[];
}

export interface HealthRecordRequest {
  height: number;
  weight: number;
  pathologyId: number[];
}

// Computed — calcularlo en el frontend
export function calcIMC(height: number, weight: number): number {
  const heightM = height / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

export function imcCategory(imc: number): { label: string; color: string } {
  if (imc < 18.5) return { label: 'Bajo peso', color: '#F59E0B' };
  if (imc < 25)   return { label: 'Normal', color: '#10B981' };
  if (imc < 30)   return { label: 'Sobrepeso', color: '#F97316' };
  return               { label: 'Obesidad', color: '#EF4444' };
}
