export interface Mission {
  id: number;
  day: number;
  title: string;
  shortDescription: string;
  action: string;
  theme: string;
  quote?: string;
  insights?: string[];
}

export interface UserProgress {
  name: string;
  username?: string;
  email?: string;
  partnerName?: string;
  subscriptionId?: string;
  subscriptionStatus?: string; // Stripe status (active, trialing, canceled, past_due, incomplete, etc.)
  currentPeriodEnd?: number; // epoch seconds
  cancelAtPeriodEnd?: boolean;
  mode?: 'solo' | 'couple' | 'distance';
  language?: 'pt' | 'en';
  startDate: string; // ISO String
  completedMissionIds: number[];
  isPremium: boolean;
  streak: number;
  lastLoginDate: string;
  reflections?: Record<number, string>;
  missionOrder?: number[];
  trialUsed?: boolean; // se já consumiu o trial de 7 dias
  trialWindowEnd?: number; // epoch seconds até quando o trial está válido (mesmo se cancelar)
}

export enum Theme {
  COMMUNICATION = "Comunicação Sem Ruído",
  INTIMACY = "Reacendendo a Chama",
  PLANS = "Construindo o Futuro",
  GRATITUDE = "O Poder do Obrigado",
  CELEBRATION = "Celebrando Juntos"
}

export const CURRENT_MONTH_THEME = Theme.COMMUNICATION;
