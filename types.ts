
export type Tab = 'Setup' | 'Annual Goals' | 'Dashboard' | string;

export type HabitMode = 'All' | 'Focus' | 'Low Energy' | 'Growth';

export interface HabitHistory {
  [day: number]: boolean;
}

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  completed: boolean; 
  streak: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'Mind' | 'Body' | 'Spirit' | 'Work';
  history: Record<string, HabitHistory>;
  activeMonths: string[]; // List of months where this habit is active
}

export interface HabitTemplate {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  rituals: {
    name: string;
    emoji: string;
    category: Habit['category'];
    difficulty: Habit['difficulty'];
  }[];
}

export interface Goal {
  id: string;
  title: string;
  category: string;
  completed: boolean;
}

export interface MonthlyGoalItem {
  text: string;
  completed: boolean;
}

export interface MonthlyGoal {
  month: string;
  goals: MonthlyGoalItem[];
}

export interface WeeklyGoal {
  month: string;
  weekIndex: number; // 0 to 4
  goals: { text: string; completed: boolean }[];
}

export interface AnnualCategory {
  name: string;
  goals: { text: string; completed: boolean }[];
}

export interface PlannerConfig {
  year: string;
  showVisionBoard: boolean;
  activeMonths: string[];
  manifestationText?: string;
}
