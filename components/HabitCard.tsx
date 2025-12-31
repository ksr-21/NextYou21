
import React from 'react';
import { Habit } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
}

const getCategoryStyles = (cat: string) => {
  switch (cat) {
    case 'Mind': return { border: 'border-sky-100 group-hover:border-sky-400', bg: 'bg-sky-50 text-sky-600', shadow: 'shadow-sky-50', accent: '#0EA5E9' };
    case 'Body': return { border: 'border-orange-100 group-hover:border-orange-400', bg: 'bg-orange-50 text-orange-600', shadow: 'shadow-orange-50', accent: '#F97316' };
    case 'Spirit': return { border: 'border-purple-100 group-hover:border-purple-400', bg: 'bg-purple-50 text-purple-600', shadow: 'shadow-purple-50', accent: '#A855F7' };
    case 'Work': return { border: 'border-emerald-100 group-hover:border-emerald-400', bg: 'bg-emerald-50 text-emerald-600', shadow: 'shadow-emerald-50', accent: '#22C55E' };
    default: return { border: 'border-gray-100', bg: 'bg-gray-50', shadow: 'shadow-gray-50', accent: '#111' };
  }
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  const style = getCategoryStyles(habit.category);
  const completions = Object.values(habit.history).filter(Boolean).length;
  const monthlyRate = Math.round((completions / 31) * 100);

  return (
    <div className={`group glass relative flex items-center justify-between p-7 rounded-[3rem] transition-all duration-700 border-2 ${style.border} ${habit.completed ? 'opacity-40 scale-[0.98]' : 'hover:scale-[1.02] hover:shadow-2xl'} ${style.shadow}`}>
      <div className="flex items-center gap-7 flex-1">
        <div className={`w-16 h-16 flex items-center justify-center rounded-[1.8rem] text-3xl transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500 shadow-inner ${style.bg}`}>
          {habit.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1.5">
            <h3 className={`text-2xl font-black tracking-tighter ${habit.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {habit.name}
            </h3>
            <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full ${style.bg} tracking-widest`}>
              {habit.category}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shadow-sm" />
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">{habit.streak}d Streak</span>
            </div>
            <div className="flex-1 max-w-[150px]">
              <div className="flex justify-between items-center mb-1 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                <span>Cycle Health</span>
                <span>{monthlyRate}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full transition-all duration-1000 ease-out"
                  style={{ width: `${monthlyRate}%`, backgroundColor: style.accent }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <button 
        onClick={() => onToggle(habit.id)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-2 group-active:scale-90 ${
          habit.completed 
            ? 'bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-200' 
            : 'bg-white border-gray-200 text-transparent hover:border-gray-900'
        }`}
      >
        <svg className={`w-7 h-7 transform transition-all duration-500 ${habit.completed ? 'scale-100 rotate-0' : 'scale-0 rotate-45'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  );
};
