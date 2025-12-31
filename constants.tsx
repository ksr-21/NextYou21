
import { Habit, MonthlyGoal, AnnualCategory, HabitTemplate } from './types';

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
  { id: '1', name: 'Finish all work tasks by Friday', emoji: '✅', completed: true, streak: 5, difficulty: 'Medium', category: 'Work', history: { [initialMonth]: generateHistory(0.7) } },
  { id: '2', name: 'Save a set amount this week', emoji: '💰', completed: true, streak: 12, difficulty: 'Easy', category: 'Work', history: { [initialMonth]: generateHistory(0.9) } },
  { id: '3', name: 'Try a new hobby or activity', emoji: '🎨', completed: false, streak: 8, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.4) } },
  { id: '4', name: 'Call or visit a family member', emoji: '☎️', completed: true, streak: 20, difficulty: 'Easy', category: 'Spirit', history: { [initialMonth]: generateHistory(0.6) } },
  { id: '5', name: 'Exercise for 4-5 days this week', emoji: '🏋️', completed: true, streak: 10, difficulty: 'Medium', category: 'Body', history: { [initialMonth]: generateHistory(0.7) } },
  { id: '6', name: 'Limit distractions during work', emoji: '📵', completed: true, streak: 31, difficulty: 'Hard', category: 'Work', history: { [initialMonth]: generateHistory(0.8) } },
  { id: '7', name: 'Express gratitude to at least 1 person', emoji: '🙏', completed: false, streak: 3, difficulty: 'Easy', category: 'Spirit', history: { [initialMonth]: generateHistory(0.9) } },
  { id: '8', name: 'Learn one new skill or concept', emoji: '💡', completed: true, streak: 7, difficulty: 'Medium', category: 'Mind', history: { [initialMonth]: generateHistory(0.5) } },
  { id: '9', name: 'Drink 8 glasses of water daily', emoji: '💧', completed: true, streak: 15, difficulty: 'Easy', category: 'Body', history: { [initialMonth]: generateHistory(0.9) } },
  { id: '10', name: 'Walk 10,000 steps daily', emoji: '👟', completed: true, streak: 25, difficulty: 'Medium', category: 'Body', history: { [initialMonth]: generateHistory(0.7) } },
];

export const MONTHS_LIST = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

export const MONTHLY_GOALS: MonthlyGoal[] = [
  { month: 'January', goals: ['Finish a chapter', 'Save $500', 'Clean our garage', 'Maintain weight'] },
  { month: 'February', goals: ['Pay off debt', 'Book vacation', 'Update CV', 'Morning runs'] },
  { month: 'March', goals: ['Project launch', 'Invest $1000', 'Garden prep', 'Visit family'] },
  { month: 'April', goals: ['Skill course', 'Max out 401k', 'Tax season', 'Spring clean'] },
  { month: 'May', goals: ['Conference prep', 'New savings account', 'Social events', 'Daily meditation'] },
  { month: 'June', goals: ['Mid-year review', 'Holiday fund', 'Health checkup', 'Solo travel'] },
];

export const ANNUAL_CATEGORIES: AnnualCategory[] = [
  { name: 'Career', goals: ['Public speak 4 times', 'Earn promotion', 'Become a mentor', 'Start a new group'] },
  { name: 'Relationship', goals: ['Make 1 new friend', 'Cut out toxic people', 'Visit family monthly', 'No kids vacation'] },
  { name: 'Financial', goals: ['Pay off debt', 'Max out 401k', 'Purchase a new car', 'Increase annual salary'] },
  { name: 'Personal Development', goals: ['Learn new technical skill', 'Pass an actuary exam', 'Volunteer 10 times', 'Start a new hobby'] },
  { name: 'Health & Fitness', goals: ['Maintain weight', 'Cut out sugar', 'Start running', 'Reach 10% body fat'] },
  { name: 'Self-Care', goals: ['Take a solo vacation', 'Start journaling', 'Read 30 books', 'Weekly massage'] },
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
