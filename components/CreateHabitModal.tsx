import React, { useState } from 'react';
import { Habit } from '../types';
import { MONTHS_LIST } from '../constants';

interface CreateHabitModalProps {
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'completed'>) => void;
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [difficulty, setDifficulty] = useState<Habit['difficulty']>('Medium');
  const [category, setCategory] = useState<Habit['category']>('Mind');
  const [goal, setGoal] = useState<number>(31);
  const [frequency, setFrequency] = useState<string>('7/7');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, emoji, difficulty, category, goal, frequency, activeMonths: [...MONTHS_LIST] });
  };

  const categories: { label: Habit['category']; color: string; bg: string; activeBorder: string }[] = [
    { label: 'Mind', color: 'text-sky-600', bg: 'bg-sky-50', activeBorder: 'border-sky-400' },
    { label: 'Body', color: 'text-orange-600', bg: 'bg-orange-50', activeBorder: 'border-orange-400' },
    { label: 'Spirit', color: 'text-purple-600', bg: 'bg-purple-50', activeBorder: 'border-purple-400' },
    { label: 'Work', color: 'text-emerald-600', bg: 'bg-emerald-50', activeBorder: 'border-emerald-400' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Compact Modal Container */}
      <div className="relative bg-[#FDFDFB] w-full max-w-sm rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-7">
          {/* Header */}
          <div className="flex justify-between items-start mb-7">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">New Habit</h2>
              <div className="w-10 h-1 bg-[#76C7C0] mt-1" />
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Initialize Protocol</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-300 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Emoji */}
            <div className="flex items-center gap-5">
              <div className="relative">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-14 h-14 text-2xl text-center bg-[#E8F5F4] border-2 border-transparent rounded-2xl focus:border-[#76C7C0] focus:bg-white transition-all outline-none shadow-inner"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-0.5 italic">Habit Designation</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Read a book..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-gray-100 focus:border-[#76C7C0] py-1.5 text-lg font-bold outline-none transition-all placeholder:text-gray-200 text-gray-900"
                />
              </div>
            </div>

            {/* Goal & Frequency Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block italic ml-1">Monthly Goal</label>
                <input 
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-black text-slate-800 outline-none focus:border-[#76C7C0]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block italic ml-1">Frequency</label>
                <input 
                  type="text"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-black text-slate-800 outline-none focus:border-[#76C7C0]"
                />
              </div>
            </div>

            {/* Category Grid */}
            <div>
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-3 italic">Categorical Filter</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map(c => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setCategory(c.label)}
                    className={`px-3 py-2 text-[9px] font-black transition-all border-2 text-center uppercase tracking-widest rounded-xl ${
                      category === c.label 
                        ? `${c.bg} ${c.color} ${c.activeBorder}` 
                        : 'bg-white border-gray-50 text-gray-300 hover:border-gray-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-base uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95 group flex items-center justify-center gap-3"
              >
                Start This Habit
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};