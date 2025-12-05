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
  mode?: 'solo' | 'couple';
  startDate: string; // ISO String
  completedMissionIds: number[];
  isPremium: boolean;
  streak: number;
  lastLoginDate: string;
  reflections?: Record<number, string>;
  missionOrder?: number[];
}

export enum Theme {
  COMMUNICATION = "Comunicação Sem Ruído",
  INTIMACY = "Reacendendo a Chama",
  PLANS = "Construindo o Futuro",
  GRATITUDE = "O Poder do Obrigado",
  CELEBRATION = "Celebrando Juntos"
}

export const CURRENT_MONTH_THEME = Theme.COMMUNICATION;
