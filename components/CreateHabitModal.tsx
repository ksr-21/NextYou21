
import React, { useState } from 'react';
import { Habit } from '../types';

interface CreateHabitModalProps {
  onClose: () => void;
  onSubmit: (habit: Omit<Habit, 'id' | 'history' | 'streak' | 'completed'>) => void;
}

export const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [difficulty, setDifficulty] = useState<Habit['difficulty']>('Medium');
  const [category, setCategory] = useState<Habit['category']>('Mind');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, emoji, difficulty, category });
  };

  const categories: { label: Habit['category']; color: string; bg: string }[] = [
    { label: 'Mind', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Body', color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Spirit', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Work', color: 'text-slate-600', bg: 'bg-slate-50' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">New Habit</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Start something new</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-full text-slate-400 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <input
                  type="text"
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  className="w-20 h-20 text-4xl text-center bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-blue-500 focus:bg-white transition-all outline-none"
                  maxLength={2}
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Habit Name</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="Read a book..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-slate-100 focus:border-blue-500 py-2 text-xl font-bold outline-none transition-all placeholder:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(c => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={() => setCategory(c.label)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all border-2 text-center uppercase tracking-wider ${
                      category === c.label 
                        ? `${c.bg} ${c.color} border-current` 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4">Difficulty</label>
              <div className="flex gap-3">
                {['Easy', 'Medium', 'Hard'].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d as any)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-[10px] font-bold transition-all border-2 uppercase tracking-wider ${
                      difficulty === d 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
              >
                Start This Habit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
