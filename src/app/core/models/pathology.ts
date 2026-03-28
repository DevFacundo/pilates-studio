export type Severity = 'LEVE' | 'MODERADA' | 'SEVERA';

export interface Pathology {
  id: number;
  name: string;
  description: string;
  severity: Severity;
  recommendations: string;
}

export interface PathologyRequest {
  name: string;
  description: string;
  severity: Severity;
  recommendations: string;
}
