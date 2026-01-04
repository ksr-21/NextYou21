import { Habit, MonthlyGoal, AnnualCategory, HabitTemplate } from './types';

export const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const generateHistory = (probability: number) => {
  const history: Record<number, boolean> = {};
  for (let i = 1; i <= 31; i++) {
    history[i] = Math.random() < probability;
  }
  return history;
};

const initialMonth = "January";

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Deep Work Protocol (90m)', emoji: '💻', completed: true, streak: 5, difficulty: 'Hard', category: 'Work', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '2', name: 'Strategic Portfolio Review', emoji: '💰', completed: true, streak: 12, difficulty: 'Medium', category: 'Work', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST], goal: 4, frequency: '1/7' },
  { id: '3', name: 'Cold Exposure Therapy', emoji: '❄️', completed: false, streak: 8, difficulty: 'Hard', category: 'Body', history: { [initialMonth]: generateHistory(0.4) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '4', name: 'Zero-Distraction Reading', emoji: '📚', completed: true, streak: 20, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.6) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '5', name: 'High-Intensity Intervals', emoji: '🏃', completed: true, streak: 10, difficulty: 'Hard', category: 'Body', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST], goal: 12, frequency: '3/7' },
  { id: '6', name: 'Morning Sunlight Exposure', emoji: '☀️', completed: true, streak: 31, difficulty: 'Easy', category: 'Body', history: { [initialMonth]: generateHistory(0.8) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '7', name: 'Daily Stoic Meditation', emoji: '🧘', completed: false, streak: 3, difficulty: 'Easy', category: 'Spirit', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '8', name: 'Network Outreach (Elite)', emoji: '🤝', completed: true, streak: 7, difficulty: 'Medium', category: 'Work', history: { [initialMonth]: generateHistory(0.5) }, activeMonths: [...MONTHS_LIST], goal: 20, frequency: '5/7' },
  { id: '9', name: 'Hydration Protocol (4L)', emoji: '💧', completed: true, streak: 15, difficulty: 'Easy', category: 'Body', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
  { id: '10', name: 'Evening Digital Detox', emoji: '📵', completed: true, streak: 25, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST], goal: 31, frequency: '7/7' },
];

export const MONTHLY_GOALS: MonthlyGoal[] = [
  { month: 'January', goals: [{ text: 'Q1 Strategy Finalized', completed: true }, { text: 'Reserve ₹100k Capital', completed: true }, { text: 'Audit Operational Leaks', completed: false }, { text: 'Sub-15% Body Fat', completed: true }] },
  { month: 'February', goals: [{ text: 'Launch Alpha Protocol', completed: false }, { text: 'Master Prompt Engineering', completed: false }, { text: 'Legacy Trust Setup', completed: true }, { text: 'Morning Run Consistency', completed: true }] },
  { month: 'March', goals: [{ text: 'Market Expansion Phase', completed: false }, { text: 'Diversify to 3 Assets', completed: false }, { text: 'System Maintenance', completed: false }, { text: 'Family Retreat Plan', completed: true }] },
];

export const ANNUAL_CATEGORIES: AnnualCategory[] = [
  { 
    name: 'Wealth Architecture', 
    goals: [
      { text: 'Achieve ₹5M in Liquid Assets', completed: false },
      { text: 'Scale Passive Revenue to ₹200k/mo', completed: false },
      { text: 'Diversify into Real Estate & Blue Chips', completed: true },
      { text: 'Optimize Tax Strategy (Elite Tier)', completed: true }
    ] 
  },
  { 
    name: 'Business Legacy', 
    goals: [
      { text: 'Launch Global V2 Platform', completed: false },
      { text: 'Acquire 10 High-Value Retainers', completed: true },
      { text: 'Automate 80% of Core Operations', completed: false },
      { text: 'Publish Thought Leadership Series', completed: false }
    ] 
  },
  { 
    name: 'High-Performance Body', 
    goals: [
      { text: 'Sub-12% Body Fat Composition', completed: true },
      { text: 'Complete Full Triathlon Circuit', completed: false },
      { text: 'Perfect 95% Sleep Fidelity (8h)', completed: false },
      { text: 'Zero Refined Sugar Protocol', completed: true }
    ] 
  },
  { 
    name: 'Intellectual Mastery', 
    goals: [
      { text: 'Read 52 High-Impact Monographs', completed: false },
      { text: 'Obtain AI Systems Certification', completed: true },
      { text: 'Master Advanced Game Theory', completed: false },
      { text: 'Attend 2 Global Masterminds', completed: true }
    ] 
  },
  { 
    name: 'Social & Impact', 
    goals: [
      { text: 'Establish Family Education Trust', completed: false },
      { text: 'Mentor 3 Elite System Architects', completed: true },
      { text: 'Biannual Geographic Exploration', completed: true },
      { text: 'Zero Toxic Relationship Drift', completed: false }
    ] 
  },
];

export const MOCK_CHART_DATA = [
  { name: 'Mon', count: 4 },
  { name: 'Tue', count: 7 },
  { name: 'Wed', count: 5 },
  { name: 'Thu', count: 8 },
  { name: 'Fri', count: 6 },
  { name: 'Sat', count: 9 },
  { name: 'Sun', count: 10 },
];

export const HABIT_TEMPLATES: HabitTemplate[] = [
  {
    id: 't1',
    title: 'Sunrise Protocol',
    description: 'A collection of high-impact morning rituals to start your day.',
    icon: '☀️',
    color: 'from-orange-400 to-red-500',
    rituals: [
      { name: 'Cold Shower', emoji: '🚿', category: 'Body', difficulty: 'Hard', goal: 31, frequency: '7/7' },
      { name: 'Morning Sun', emoji: '☀️', category: 'Body', difficulty: 'Easy', goal: 31, frequency: '7/7' },
      { name: 'Daily Planning', emoji: '📝', category: 'Mind', difficulty: 'Medium', goal: 31, frequency: '7/7' },
    ]
  },
  {
    id: 't2',
    title: 'Deep Flow',
    description: 'Optimize your work blocks for maximum cognitive output.',
    icon: '🧠',
    color: 'from-blue-400 to-indigo-600',
    rituals: [
      { name: '90m Deep Work', emoji: '💻', category: 'Work', difficulty: 'Hard', goal: 31, frequency: '7/7' },
      { name: 'Digital Fast', emoji: '📵', category: 'Mind', difficulty: 'Medium', goal: 31, frequency: '7/7' },
      { name: 'Review Goals', emoji: '🎯', category: 'Work', difficulty: 'Easy', goal: 31, frequency: '7/7' },
    ]
  }
];