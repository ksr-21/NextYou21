
import React, { useState, useMemo } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis,
  PieChart, Pie, Cell, Tooltip, AreaChart, Area,
  ResponsiveContainer
} from 'recharts';
import { AnnualCategory, WeeklyGoal } from '../types';
import { MONTHS_LIST } from '../constants';

// --- TYPES ---
interface AnnualGoalsViewProps {
  year: string;
  categories: AnnualCategory[];
  onUpdateCategory: (index: number, updates: Partial<AnnualCategory>) => void;
  onAddCategory: () => void;
  onDeleteCategory: (index: number) => void;
  weeklyGoals: WeeklyGoal[];
  onUpdateWeeklyGoals: (month: string, weekIndex: number, goals: { text: string; completed: boolean }[]) => void;
}

// --- PREMIUM PALETTE ---
const PALETTE = {
  accents: [
    { name: 'Indigo', bg: 'bg-indigo-500',  hex: '#6366F1' },
    { name: 'Rose',   bg: 'bg-rose-500',    hex: '#FB7185' },
    { name: 'Sky',    bg: 'bg-sky-500',     hex: '#38BDF8' },
    { name: 'Emerald',bg: 'bg-emerald-500', hex: '#34D399' },
    { name: 'Amber',  bg: 'bg-amber-500',   hex: '#FBBF24' },
    { name: 'Violet', bg: 'bg-violet-500',  hex: '#A78BFA' },
  ]
};

const WEEK_LABELS = ['WK 01', 'WK 02', 'WK 03', 'WK 04', 'EXTRA'];

// --- ICONS ---
const PlusIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CrossIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

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

  // --- DATA TRANSFORMATION ---
  const getWeekGoals = (month: string, weekIdx: number) => {
    return weeklyGoals.find(w => w.month === month && w.weekIndex === weekIdx)?.goals || [];
  };

  const radarData = useMemo(() => {
    return categories.map((cat, index) => {
      const completed = cat.goals.filter(g => g.completed).length;
      const progress = cat.goals.length > 0 ? (completed / cat.goals.length) * 100 : 0;
      return { 
        subject: cat.name || `Zone ${index + 1}`, 
        A: progress, 
        fullMark: 100 
      };
    });
  }, [categories]);

  // --- PIE CHART DATA ---
  const pieChartData = useMemo(() => {
    return categories.map((cat, i) => ({
      name: cat.name || `Category ${i+1}`,
      value: cat.goals.length,
      paletteIndex: i % PALETTE.accents.length,
    })).filter(item => item.value > 0);
  }, [categories]);

  const totalGoalsCount = useMemo(() => {
    return categories.reduce((acc, cat) => acc + cat.goals.length, 0);
  }, [categories]);

  const sprintTrendData = useMemo(() => {
    return WEEK_LABELS.map((label, idx) => {
      const goals = getWeekGoals(selectedMonthForWeekly, idx);
      const val = goals.length > 0 ? (goals.filter(g => g.completed).length / goals.length) * 100 : 0;
      return { name: label, value: Math.round(val) };
    });
  }, [weeklyGoals, selectedMonthForWeekly]);

  const totalProgress = useMemo(() => {
    const totalGoals = categories.reduce((acc, cat) => acc + cat.goals.length, 0);
    const totalCompleted = categories.reduce((acc, cat) => acc + cat.goals.filter(g => g.completed).length, 0);
    return totalGoals > 0 ? Math.round((totalCompleted / totalGoals) * 100) : 0;
  }, [categories]);

  // --- HANDLERS ---
  const handleWeeklyGoalToggle = (weekIdx: number, goalIdx: number) => {
    const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
    if (currentGoals[goalIdx]) {
      currentGoals[goalIdx] = { ...currentGoals[goalIdx], completed: !currentGoals[goalIdx].completed };
      onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, currentGoals);
    }
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

  const deleteWeeklyGoal = (weekIdx: number, goalIdx: number) => {
    const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
    const updatedGoals = currentGoals.filter((_, i) => i !== goalIdx);
    onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, updatedGoals);
  };

  const addWeeklyGoal = (weekIdx: number) => {
    const currentGoals = [...getWeekGoals(selectedMonthForWeekly, weekIdx)];
    currentGoals.push({ text: 'New Target', completed: false });
    onUpdateWeeklyGoals(selectedMonthForWeekly, weekIdx, currentGoals);
  };

  const deleteCategoryGoal = (catIndex: number, goalIndex: number) => {
    const category = categories[catIndex];
    const newGoals = category.goals.filter((_, i) => i !== goalIndex);
    onUpdateCategory(catIndex, { goals: newGoals });
  };

  // --- SUB-COMPONENT: CATEGORY CARD ---
  const CategoryCard = ({ category, index }: { category: AnnualCategory, index: number }) => {
    const theme = PALETTE.accents[index % PALETTE.accents.length];
    const completed = category.goals.filter(g => g.completed).length;
    const progress = category.goals.length > 0 ? Math.round((completed / category.goals.length) * 100) : 0;

    return (
      <div className="group relative bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
        <div className="absolute top-0 left-6 right-6 h-1 bg-slate-100 overflow-hidden rounded-b-lg">
           <div className={`h-full ${theme.bg} transition-all duration-500`} style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between items-start mb-6 mt-2">
          <div className="flex-1">
            <input 
              value={category.name}
              onChange={(e) => onUpdateCategory(index, { name: e.target.value })}
              className="text-xl font-bold text-slate-900 bg-transparent outline-none w-full placeholder-slate-300 focus:text-indigo-600 transition-colors"
              placeholder="Category Name"
            />
            <div className="flex items-center gap-2 mt-1">
               <span className={`text-[10px] font-black uppercase tracking-widest ${theme.bg} bg-opacity-10 text-slate-500 px-2 py-0.5 rounded`}>
                 {progress}% Done
               </span>
               <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{completed}/{category.goals.length} Goals</span>
            </div>
          </div>
          <button 
             onClick={() => onDeleteCategory(index)}
             className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-rose-500 p-2"
          >
            <TrashIcon />
          </button>
        </div>

        <div className="space-y-3 pl-1">
          {category.goals.map((g, gIdx) => (
            <div key={gIdx} className="flex items-center gap-3 group/item">
              <div 
                onClick={() => {
                   const newGoals = [...category.goals];
                   newGoals[gIdx] = { ...g, completed: !g.completed };
                   onUpdateCategory(index, { goals: newGoals });
                }}
                className={`w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 border flex-shrink-0
                  ${g.completed ? `${theme.bg} border-transparent` : 'bg-transparent border-slate-300 hover:border-slate-400'}
                `}
              >
                {g.completed && <CheckIcon className="w-3 h-3 text-white" />}
              </div>
              <input 
                value={g.text}
                onChange={(e) => {
                  const newGoals = [...category.goals];
                  newGoals[gIdx] = { ...g, text: e.target.value };
                  onUpdateCategory(index, { goals: newGoals });
                }}
                className={`flex-1 text-sm font-medium bg-transparent outline-none border-b border-transparent focus:border-slate-200 pb-0.5 transition-all
                  ${g.completed ? 'text-slate-400 line-through decoration-slate-200' : 'text-slate-600'}
                `}
              />
              <button 
                onClick={() => deleteCategoryGoal(index, gIdx)}
                className="opacity-0 group-hover/item:opacity-100 text-slate-300 hover:text-rose-500 transition-opacity p-1"
              >
                <CrossIcon />
              </button>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => onUpdateCategory(index, { goals: [...category.goals, { text: 'New Goal', completed: false }] })}
          className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
        >
          <PlusIcon /> Add Item
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* HEADER */}
      <div className="max-w-[1600px] mx-auto p-6 md:p-10">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System 2.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[0.85]">
              {year}<span className="text-slate-200">.</span>GOALS
            </h1>
          </div>

          <div className="flex items-center gap-6">
             <div className="text-right">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Year Completion</div>
                <div className="text-4xl font-black text-slate-900 flex items-center justify-end gap-1">
                   {totalProgress}<span className="text-lg text-slate-300">%</span>
                </div>
             </div>
             
             <button 
                onClick={onAddCategory}
                className="bg-slate-900 text-white hover:bg-indigo-600 transition-colors px-6 py-4 rounded-xl shadow-xl shadow-slate-200"
             >
                <div className="flex items-center gap-2">
                   <PlusIcon />
                   <span className="text-xs font-bold uppercase tracking-widest">New Category</span>
                </div>
             </button>
          </div>
        </header>

        {/* ANALYTICS BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
           
           {/* Radar Chart */}
           <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Macro Balance</h3>
                <h2 className="text-2xl font-black text-slate-900 mt-1">Focus Areas</h2>
              </div>
              <div className="h-[250px] w-full -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="65%" data={radarData}>
                       <PolarGrid stroke="#F1F5F9" />
                       <PolarAngleAxis 
                          dataKey="subject" 
                          /* Fix: fontWeights does not exist on SVGProps. Changed to fontWeight */
                          tick={{ fill: '#64748B', fontSize: 10, fontWeight: 700 }} 
                       />
                       <Radar name="My Focus" dataKey="A" stroke="#4F46E5" strokeWidth={3} fill="#6366F1" fillOpacity={0.2} />
                       <Tooltip 
                          contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px', color: '#fff' }}
                          itemStyle={{ color: '#fff' }}
                       />
                    </RadarChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* --- PIE CHART (CLEAN - NO SIDE LIST) --- */}
           <div className="md:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <div>
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Volume</h3>
                 <h2 className="text-2xl font-black text-slate-900 mt-1">Goal Distribution</h2>
              </div>
              
              <div className="flex-1 flex items-center justify-center mt-2 relative">
                 <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                       <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={85}
                          paddingAngle={5}
                          cornerRadius={6}
                          dataKey="value"
                          stroke="none"
                       >
                          {pieChartData.map((entry, index) => (
                             <Cell 
                                key={`cell-${index}`} 
                                fill={PALETTE.accents[entry.paletteIndex].hex}
                                className="outline-none focus:outline-none hover:opacity-80 transition-opacity duration-300"
                             />
                          ))}
                       </Pie>
                       {/* HOVER TOOLTIP */}
                       <Tooltip 
                         cursor={false}
                         content={({ active, payload }) => {
                           if (active && payload && payload.length) {
                             const data = payload[0].payload;
                             const theme = PALETTE.accents[data.paletteIndex];
                             const percentage = totalGoalsCount > 0 ? Math.round((data.value / totalGoalsCount) * 100) : 0;
                             
                             return (
                               <div className="bg-slate-900/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl border border-white/10 text-center min-w-[120px]">
                                  <div className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: theme.hex }}>
                                     {data.name}
                                  </div>
                                  <div className="text-2xl font-black leading-none flex items-center justify-center gap-0.5">
                                    {percentage}<span className="text-sm font-bold text-slate-400">%</span>
                                  </div>
                                  <div className="text-[9px] font-bold text-slate-500 uppercase mt-1">
                                    {data.value} Goals
                                  </div>
                               </div>
                             );
                           }
                           return null;
                         }}
                       />
                    </PieChart>
                 </ResponsiveContainer>
                 
                 {/* Center Text (Always Visible) */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 leading-none">{totalGoalsCount}</span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 mt-1">Total Goals</span>
                 </div>
              </div>
           </div>

           {/* Quick Stats */}
           <div className="md:col-span-3 grid grid-rows-2 gap-6">
              <div className="bg-slate-900 rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                 <h3 className="text-white font-black text-3xl mb-1 relative z-10">{selectedMonthForWeekly}</h3>
                 <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest relative z-10">Current Sprint</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-3xl p-6 flex flex-col justify-center text-white relative overflow-hidden">
                 <span className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-2">Total Progress</span>
                 <div className="text-4xl font-black">{totalProgress}%</div>
                 <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${totalProgress}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* CATEGORIES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
           {categories.map((cat, i) => (
              <CategoryCard key={i} category={cat} index={i} />
           ))}
        </div>

        {/* SPRINT DASHBOARD */}
        <div className="rounded-[2.5rem] bg-[#0F172A] p-8 md:p-12 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
           
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-64 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

           <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 relative z-10 gap-8">
              <div>
                 <h2 className="text-4xl font-black mb-2">Sprint Board</h2>
                 <p className="text-slate-400 text-sm font-medium">Break annual goals into weekly execution.</p>
              </div>
              
              <div className="max-w-full overflow-hidden">
                  <div className="flex bg-slate-800/50 p-1 rounded-xl backdrop-blur-sm border border-slate-700/50 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                    {MONTHS_LIST.map(m => (
                        <button
                          key={m}
                          onClick={() => setSelectedMonthForWeekly(m)}
                          className={`px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap
                              ${selectedMonthForWeekly === m ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                          `}
                        >
                          {m}
                        </button>
                    ))}
                  </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
              
              {/* Consistency Graph */}
              <div className="lg:col-span-3 flex flex-col gap-6">
                 <div className="bg-slate-800/40 rounded-3xl p-6 border border-white/5 h-full">
                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6">Velocity Trend</h3>
                    <div className="h-40 w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={sprintTrendData}>
                             <defs>
                                <linearGradient id="colorSprint" x1="0" y1="0" x2="0" y2="1">
                                   <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3}/>
                                   <stop offset="95%" stopColor="#818CF8" stopOpacity={0}/>
                                </linearGradient>
                             </defs>
                             <Tooltip 
                                cursor={{ stroke: '#475569' }}
                                contentStyle={{ background: '#1E293B', border: 'none', borderRadius: '8px' }}
                             />
                             <Area type="monotone" dataKey="value" stroke="#818CF8" strokeWidth={3} fillOpacity={1} fill="url(#colorSprint)" />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </div>
              </div>

              {/* The Board */}
              <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                 {WEEK_LABELS.map((label, weekIdx) => {
                    const currentGoals = getWeekGoals(selectedMonthForWeekly, weekIdx);
                    const isExtra = label === 'EXTRA';
                    return (
                       <div key={weekIdx} className={`rounded-2xl p-4 flex flex-col h-full min-h-[300px] border border-white/5 bg-slate-800/20 hover:bg-slate-800/40 transition-colors`}>
                          <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
                             <span className={`text-[10px] font-black uppercase tracking-widest ${isExtra ? 'text-emerald-400' : 'text-slate-400'}`}>
                                {label}
                             </span>
                             <div 
                                className="w-1.5 h-1.5 rounded-full" 
                                style={{ backgroundColor: currentGoals.every(g => g.completed) && currentGoals.length > 0 ? '#10B981' : '#475569' }} 
                             />
                          </div>

                          <div className="space-y-3 flex-1">
                             {currentGoals.map((g, gIdx) => (
                                <div key={gIdx} className="group flex items-start gap-3 relative">
                                   <div 
                                      onClick={() => handleWeeklyGoalToggle(weekIdx, gIdx)}
                                      className={`mt-1 w-3.5 h-3.5 rounded border flex items-center justify-center cursor-pointer transition-colors flex-shrink-0
                                         ${g.completed ? 'bg-indigo-500 border-indigo-500' : 'border-slate-600 hover:border-slate-400'}
                                      `}
                                   >
                                      {g.completed && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                                   </div>
                                   <textarea 
                                      rows={2}
                                      value={g.text}
                                      onChange={(e) => handleWeeklyGoalChange(weekIdx, gIdx, e.target.value)}
                                      className={`flex-1 bg-transparent text-xs font-medium outline-none resize-none leading-tight
                                         ${g.completed ? 'text-slate-500 line-through' : 'text-slate-300'}
                                      `}
                                   />
                                   <button 
                                      onClick={() => deleteWeeklyGoal(weekIdx, gIdx)}
                                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-500 transition-opacity p-1"
                                   >
                                      <CrossIcon />
                                   </button>
                                </div>
                             ))}
                             <button 
                                onClick={() => addWeeklyGoal(weekIdx)}
                                className="w-full py-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider hover:text-white transition-colors border border-dashed border-slate-700/50 rounded-lg mt-2"
                             >
                                + Add
                             </button>
                          </div>
                       </div>
                    );
                 })}
              </div>

           </div>
        </div>

      </div>
    </div>
  );
};
