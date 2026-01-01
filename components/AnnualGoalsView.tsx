
import React, { useState } from 'react';
import { AnnualCategory, WeeklyGoal } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { MONTHS_LIST } from '../constants';

interface AnnualGoalsViewProps {
  year: string;
  categories: AnnualCategory[];
  onUpdateCategory: (index: number, updates: Partial<AnnualCategory>) => void;
  onAddCategory: () => void;
  onDeleteCategory: (index: number) => void;
  weeklyGoals: WeeklyGoal[];
  onUpdateWeeklyGoals: (month: string, weekIndex: number, goals: { text: string; completed: boolean }[]) => void;
}

export const AnnualGoalsView: React.FC<AnnualGoalsViewProps> = ({ 
  year, 
  categories, 
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
  weeklyGoals,
  onUpdateWeeklyGoals
}) => {
  const [selectedMonthForWeekly, setSelectedMonthForWeekly] = useState(MONTHS_LIST[0]);

  const getWeekGoals = (month: string, weekIdx: number) => {
    return weeklyGoals.find(w => w.month === month && w.weekIndex === weekIdx)?.goals || [];
  };

  const handleWeeklyGoalChange = (weekIdx: number, goalIdx: number, val: string) => {
    const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
    if (currentGoals[goalIdx]) {
      currentGoals[goalIdx] = { ...currentGoals[goalIdx], text: val };
    } else {
      currentGoals.push({ text: val, completed: false });
    }
    onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, currentGoals);
  };

  const addWeeklyGoal = (weekIdx: number) => {
    const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
    currentGoals.push({ text: 'New Sprint Goal', completed: false });
    onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, currentGoals);
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12 md:space-y-20">
      {/* Annual Vision Board Section */}
      <section>
        <div className="flex flex-col items-center mb-10 gap-4">
          <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-widest uppercase text-center">{year} Vision Board</h2>
          <button 
            onClick={onAddCategory}
            className="w-full sm:w-auto bg-gray-800 text-white px-5 py-3 rounded-sm font-black uppercase text-[10px] tracking-widest shadow-lg"
          >
            + New Category
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {categories.map((cat, i) => {
            const completedCount = cat.goals.filter(g => g.completed).length;
            const progress = cat.goals.length > 0 ? Math.round((completedCount / cat.goals.length) * 100) : 0;
            
            return (
              <div key={i} className="bg-white border border-gray-200 rounded-sm p-6 md:p-8 shadow-sm relative group">
                <button onClick={() => onDeleteCategory(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 text-xs">✕</button>

                <div className="flex justify-between items-start mb-6">
                    <div className="flex-1 pr-4">
                      <input 
                        className="text-xs font-black uppercase tracking-widest text-[#76C7C0] mb-1 bg-transparent w-full outline-none" 
                        value={cat.name}
                        onChange={(e) => onUpdateCategory(i, { name: e.target.value })}
                      />
                      <div className="w-8 h-1 bg-[#76C7C0]" />
                    </div>
                    <div className="w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0">
                       <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[{ value: progress }, { value: 100 - progress }]}
                              innerRadius={15}
                              outerRadius={25}
                              startAngle={90}
                              endAngle={-270}
                              dataKey="value"
                            >
                              <Cell fill="#76C7C0" />
                              <Cell fill="#F1F1EB" />
                            </Pie>
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="absolute inset-0 flex items-center justify-center text-[9px] md:text-[10px] font-black text-gray-800">
                          {progress}%
                       </div>
                    </div>
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-bold text-gray-300 uppercase">Objectives</span>
                  <button onClick={() => onUpdateCategory(i, { goals: [...cat.goals, { text: 'New Milestone', completed: false }] })} className="text-[10px] font-black text-[#76C7C0] hover:underline">+ ADD</button>
                </div>

                <ul className="space-y-4">
                    {cat.goals.map((g, idx) => (
                      <li key={idx} className="flex items-start gap-3 group/item">
                        <button 
                          onClick={() => {
                            const newGoals = [...cat.goals];
                            newGoals[idx] = { ...g, completed: !g.completed };
                            onUpdateCategory(i, { goals: newGoals });
                          }}
                          className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${g.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'}`}
                        >
                          {g.completed && <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                        </button>
                        <input 
                          className={`text-[11px] flex-1 bg-transparent outline-none border-b border-transparent focus:border-gray-50 leading-snug ${g.completed ? 'text-gray-300 line-through' : 'text-gray-700 font-bold'}`} 
                          value={g.text}
                          onChange={(e) => {
                            const newGoals = [...cat.goals];
                            newGoals[idx] = { ...g, text: e.target.value };
                            onUpdateCategory(i, { goals: newGoals });
                          }}
                        />
                        <button 
                          onClick={() => {
                            const newGoals = cat.goals.filter((_, gi) => gi !== idx);
                            onUpdateCategory(i, { goals: newGoals });
                          }}
                          className="text-gray-100 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all text-[8px]"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weekly Sprint Architecture */}
      <section className="pt-12 border-t border-gray-100">
        <div className="bg-gray-800 text-white p-6 md:p-8 rounded-sm mb-10 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-xl">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Weekly Sprint Architecture</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Operational milestones for high-velocity cycles</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tactical Window:</span>
            <select 
              value={selectedMonthForWeekly}
              onChange={(e) => setSelectedMonthForWeekly(e.target.value)}
              className="w-full sm:w-auto bg-gray-700 border border-gray-600 rounded px-4 py-2 text-xs font-black uppercase outline-none text-white"
            >
              {MONTHS_LIST.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {[0, 1, 2, 3, 4].map((weekIdx) => (
            <div key={weekIdx} className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm hover:border-[#76C7C0] transition-all">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-50">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Week {weekIdx + 1}</span>
                <button onClick={() => addWeeklyGoal(weekIdx)} className="text-[#76C7C0] text-[10px] font-black uppercase">+ ADD</button>
              </div>
              <div className="space-y-4">
                {getWeekGoals(selectedMonthForWeekly, weekIdx).map((goal, gIdx) => (
                  <div key={gIdx} className="relative flex items-center gap-2">
                     <button 
                        onClick={() => {
                          const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
                          currentGoals[gIdx] = { ...goal, completed: !goal.completed };
                          onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, currentGoals);
                        }}
                        className={`w-3.5 h-3.5 rounded border flex-shrink-0 flex items-center justify-center transition-all ${goal.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200 bg-white'}`}
                      >
                        {goal.completed && <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}
                      </button>
                    <input 
                      className={`w-full bg-transparent text-[11px] outline-none border-b border-transparent focus:border-gray-100 transition-all ${goal.completed ? 'text-gray-300 line-through' : 'text-gray-600 font-bold'}`}
                      value={goal.text}
                      onChange={(e) => handleWeeklyGoalChange(weekIdx, gIdx, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
