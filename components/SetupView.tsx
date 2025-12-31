
import React, { useState } from 'react';
import { Habit, MonthlyGoal, PlannerConfig } from '../types';
import { MONTHS_LIST } from '../constants';

interface SetupViewProps {
  habits: Habit[];
  onUpdateHabit: (id: string, updates: Partial<Habit>) => void;
  onDeleteHabit: (id: string) => void;
  onAddHabit: () => void;
  monthlyGoals: MonthlyGoal[];
  onUpdateMonthlyGoals: (month: string, goals: string[]) => void;
  onAddMonthlyGoalContainer: (month: string) => void;
  onDeleteMonthlyGoalContainer: (month: string) => void;
  config: PlannerConfig;
  onUpdateConfig: (config: PlannerConfig) => void;
}

export const SetupView: React.FC<SetupViewProps> = ({ 
  habits, 
  onUpdateHabit, 
  onDeleteHabit, 
  onAddHabit,
  monthlyGoals,
  onUpdateMonthlyGoals,
  onAddMonthlyGoalContainer,
  onDeleteMonthlyGoalContainer,
  config,
  onUpdateConfig
}) => {
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const toggleMonth = (month: string) => {
    const newMonths = config.activeMonths.includes(month)
      ? config.activeMonths.filter(m => m !== month)
      : [...config.activeMonths, month];
    const sorted = MONTHS_LIST.filter(m => newMonths.includes(m));
    onUpdateConfig({ ...config, activeMonths: sorted });
  };

  const unusedMonths = MONTHS_LIST.filter(
    m => !monthlyGoals.some(goal => goal.month === m)
  );

  return (
    <div className="animate-in fade-in duration-500 space-y-12 md:space-y-20">
      {/* Global Configuration */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase">Global Architecture</h2>
          <button 
            onClick={() => onUpdateConfig({...config, showVisionBoard: !config.showVisionBoard})}
            className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase border-2 transition-all ${config.showVisionBoard ? 'bg-[#76C7C0] border-[#76C7C0] text-white' : 'bg-white border-gray-200 text-gray-400'}`}
          >
            Vision Board: {config.showVisionBoard ? 'ON' : 'OFF'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <div className="bg-white border border-gray-200 p-6 md:p-10 rounded-sm shadow-sm">
             <h3 className="text-xs font-bold uppercase tracking-widest text-[#94A3B8] mb-6 md:mb-8 text-center sm:text-left">Year Definition</h3>
             <input 
                className="text-5xl md:text-7xl font-bold text-[#1E293B] bg-transparent outline-none w-full text-center sm:text-left"
                value={config.year}
                onChange={(e) => onUpdateConfig({ ...config, year: e.target.value })}
              />
          </div>

          <div className="bg-white border border-gray-300 p-6 md:p-10 rounded-sm shadow-sm">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 text-center sm:text-left">Active Months</h3>
             <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center sm:justify-start">
                {MONTHS_LIST.map(month => (
                  <button
                    key={month}
                    onClick={() => toggleMonth(month)}
                    className={`px-2 py-1.5 md:px-3 rounded-sm text-[8px] md:text-[9px] font-black uppercase transition-all ${
                      config.activeMonths.includes(month)
                        ? 'bg-gray-800 text-white'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                  >
                    {month.slice(0, 3)}
                  </button>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Protocol Setup */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tighter uppercase">Protocol Setup</h2>
          <button 
            onClick={onAddHabit}
            className="w-full sm:w-auto bg-gray-800 text-white px-6 py-3 rounded-sm font-black uppercase text-xs shadow-lg"
          >
            + Add Habit
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
          <div className="lg:col-span-1 border border-gray-300 rounded-sm bg-white overflow-hidden">
            <div className="bg-[#E8F5F4] p-4 text-center border-b border-gray-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#58A6A0]">Daily Routines</h3>
            </div>
            <div className="p-4 space-y-3">
              {habits.map((h) => (
                <div key={h.id} className="flex items-center gap-3 pb-2 border-b border-gray-50 last:border-none">
                  <input className="w-8 text-center bg-transparent text-sm outline-none" value={h.emoji} onChange={(e) => onUpdateHabit(h.id, { emoji: e.target.value })} />
                  <input className="flex-1 text-xs font-semibold text-gray-700 bg-transparent outline-none" value={h.name} onChange={(e) => onUpdateHabit(h.id, { name: e.target.value })} />
                  <button onClick={() => onDeleteHabit(h.id)} className="text-red-300 hover:text-red-500 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-gray-100 p-4 rounded-sm border border-gray-300 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-500">Target Architecture</h3>
              <div className="relative w-full sm:w-auto">
                <button 
                  onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                  className="w-full sm:w-auto bg-[#76C7C0] text-white px-4 py-2 rounded text-[10px] font-black uppercase"
                >
                  + Add Month
                </button>
                {isMonthDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-full sm:w-40 bg-white border border-gray-200 shadow-xl z-50 py-2">
                    {unusedMonths.map(m => (
                      <button key={m} className="w-full text-left px-4 py-2 text-[10px] font-bold uppercase hover:bg-gray-50" onClick={() => { onAddMonthlyGoalContainer(m); setIsMonthDropdownOpen(false); }}>{m}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {monthlyGoals.map((m) => (
                <div key={m.month} className="border border-gray-200 bg-white p-5 rounded-sm group relative">
                  <button onClick={() => onDeleteMonthlyGoalContainer(m.month)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400 text-xs">✕</button>
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                    <span className="text-[10px] font-black uppercase text-[#76C7C0]">{m.month}</span>
                    <button onClick={() => onUpdateMonthlyGoals(m.month, [...m.goals, 'New Target'])} className="text-[#76C7C0] text-[10px] font-black uppercase">+ ADD</button>
                  </div>
                  <ul className="space-y-3">
                    {m.goals.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <input 
                          className="text-[10px] text-gray-500 bg-transparent flex-1 outline-none border-b border-transparent focus:border-gray-100" 
                          value={g}
                          onChange={(e) => {
                            const newGoals = [...m.goals];
                            newGoals[idx] = e.target.value;
                            onUpdateMonthlyGoals(m.month, newGoals);
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
