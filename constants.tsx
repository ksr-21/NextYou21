
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

// Initial state for one month (January)
const initialMonth = "January";

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Finish all work tasks by Friday', emoji: '✅', completed: true, streak: 5, difficulty: 'Medium', category: 'Work', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST] },
  { id: '2', name: 'Save a set amount this week', emoji: '💰', completed: true, streak: 12, difficulty: 'Easy', category: 'Work', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST] },
  { id: '3', name: 'Try a new hobby or activity', emoji: '🎨', completed: false, streak: 8, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.4) }, activeMonths: [...MONTHS_LIST] },
  { id: '4', name: 'Call or visit a family member', emoji: '☎️', completed: true, streak: 20, difficulty: 'Easy', category: 'Spirit', history: { [initialMonth]: generateHistory(0.6) }, activeMonths: [...MONTHS_LIST] },
  { id: '5', name: 'Exercise for 4-5 days this week', emoji: '🏋️', completed: true, streak: 10, difficulty: 'Medium', category: 'Body', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST] },
  { id: '6', name: 'Limit distractions during work', emoji: '📵', completed: true, streak: 31, difficulty: 'Hard', category: 'Work', history: { [initialMonth]: generateHistory(0.8) }, activeMonths: [...MONTHS_LIST] },
  { id: '7', name: 'Express gratitude to at least 1 person', emoji: '🙏', completed: false, streak: 3, difficulty: 'Easy', category: 'Spirit', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST] },
  { id: '8', name: 'Learn one new skill or concept', emoji: '💡', completed: true, streak: 7, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.5) }, activeMonths: [...MONTHS_LIST] },
  { id: '9', name: 'Drink 8 glasses of water daily', emoji: '💧', completed: true, streak: 15, difficulty: 'Easy', category: 'Body', history: { [initialMonth]: generateHistory(0.9) }, activeMonths: [...MONTHS_LIST] },
  { id: '10', name: 'Walk 10,000 steps daily', emoji: '👟', completed: true, streak: 25, difficulty: 'Medium', category: 'Body', history: { [initialMonth]: generateHistory(0.7) }, activeMonths: [...MONTHS_LIST] },
];

export const MONTHLY_GOALS: MonthlyGoal[] = [
  { month: 'January', goals: [{ text: 'Finish a chapter', completed: false }, { text: 'Save $500', completed: true }, { text: 'Clean our garage', completed: false }, { text: 'Maintain weight', completed: true }] },
  { month: 'February', goals: [{ text: 'Pay off debt', completed: false }, { text: 'Book vacation', completed: false }, { text: 'Update CV', completed: true }, { text: 'Morning runs', completed: true }] },
  { month: 'March', goals: [{ text: 'Project launch', completed: false }, { text: 'Invest $1000', completed: false }, { text: 'Garden prep', completed: false }, { text: 'Visit family', completed: true }] },
  { month: 'April', goals: [{ text: 'Skill course', completed: true }, { text: 'Max out 401k', completed: false }, { text: 'Tax season', completed: false }, { text: 'Spring clean', completed: false }] },
  { month: 'May', goals: [{ text: 'Conference prep', completed: false }, { text: 'New savings account', completed: false }, { text: 'Social events', completed: true }, { text: 'Daily meditation', completed: true }] },
  { month: 'June', goals: [{ text: 'Mid-year review', completed: false }, { text: 'Holiday fund', completed: false }, { text: 'Health checkup', completed: true }, { text: 'Solo travel', completed: false }] },
];

export const ANNUAL_CATEGORIES: AnnualCategory[] = [
  { name: 'Career', goals: [{ text: 'Public speak 4 times', completed: false }, { text: 'Earn promotion', completed: false }, { text: 'Become a mentor', completed: true }, { text: 'Start a new group', completed: false }] },
  { name: 'Relationship', goals: [{ text: 'Make 1 new friend', completed: true }, { text: 'Cut out toxic people', completed: false }, { text: 'Visit family monthly', completed: true }, { text: 'No kids vacation', completed: false }] },
  { name: 'Financial', goals: [{ text: 'Pay off debt', completed: false }, { text: 'Max out 401k', completed: false }, { text: 'Purchase a new car', completed: false }, { text: 'Increase annual salary', completed: true }] },
  { name: 'Personal Development', goals: [{ text: 'Learn new technical skill', completed: true }, { text: 'Pass an actuary exam', completed: false }, { text: 'Volunteer 10 times', completed: false }, { text: 'Start a new hobby', completed: true }] },
  { name: 'Health & Fitness', goals: [{ text: 'Maintain weight', completed: true }, { text: 'Cut out sugar', completed: false }, { text: 'Start running', completed: true }, { text: 'Reach 10% body fat', completed: false }] },
  { name: 'Self-Care', goals: [{ text: 'Take a solo vacation', completed: false }, { text: 'Start journaling', completed: true }, { text: 'Read 30 books', completed: false }, { text: 'Weekly massage', completed: true }] },
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
      { name: 'Cold Shower', emoji: '🚿', category: 'Body', difficulty: 'Hard' },
      { name: 'Morning Sun', emoji: '☀️', category: 'Body', difficulty: 'Easy' },
      { name: 'Daily Planning', emoji: '📝', category: 'Mind', difficulty: 'Medium' },
    ]
  },
  {
    id: 't2',
    title: 'Deep Flow',
    description: 'Optimize your work blocks for maximum cognitive output.',
    icon: '🧠',
    color: 'from-blue-400 to-indigo-600',
    rituals: [
      { name: '90m Deep Work', emoji: '💻', category: 'Work', difficulty: 'Hard' },
      { name: 'Digital Fast', emoji: '📵', category: 'Mind', difficulty: 'Medium' },
      { name: 'Review Goals', emoji: '🎯', category: 'Work', difficulty: 'Easy' },
    ]
  }
];
