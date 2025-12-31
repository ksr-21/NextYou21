
import React from 'react';
import { Habit, WeeklyGoal, AnnualCategory } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Cell
} from 'recharts';

interface DashboardViewProps {
  habits: Habit[];
  currentMonth: string;
  weeklyGoals: WeeklyGoal[];
  annualCategories: AnnualCategory[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({ habits, currentMonth, weeklyGoals, annualCategories }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  // Advanced Data Processing
  const dailyCompletions = days.map(d => {
    const completed = habits.filter(h => h.history[currentMonth]?.[d]).length;
    return { day: d, count: completed };
  });

  const categories = ['Mind', 'Body', 'Spirit', 'Work'];
  const categoryStats = categories.map(cat => {
    const catHabits = habits.filter(h => h.category === cat);
    const totalPossible = catHabits.length * 31;
    const completed = catHabits.reduce((acc, h) => acc + Object.values(h.history[currentMonth] || {}).filter(Boolean).length, 0);
    return {
      subject: cat,
      A: Math.round((completed / totalPossible) * 100) || 0,
      fullMark: 100
    };
  });

  const totalPossibleCompletions = habits.length * 31;
  const actualCompletions = habits.reduce((acc, h) => acc + Object.values(h.history[currentMonth] || {}).filter(Boolean).length, 0);
  const globalConsistency = Math.round((actualCompletions / totalPossibleCompletions) * 100) || 0;

  // Heatmap helper
  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'bg-gray-100';
    const ratio = count / habits.length;
    if (ratio > 0.8) return 'bg-[#1B5E20]';
    if (ratio > 0.5) return 'bg-[#43A047]';
    if (ratio > 0.2) return 'bg-[#81C784]';
    return 'bg-[#C8E6C9]';
  };

  // Filter weekly goals for current month
  const currentMonthWeeklyGoals = weeklyGoals.filter(w => w.month === currentMonth);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 md:space-y-8 pb-10">
      {/* Top Level Metric Header - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-sm shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Biological Sync</p>
           <div className="flex items-end gap-2">
             <span className="text-3xl md:text-4xl font-black text-gray-900">{globalConsistency}%</span>
             <span className="text-emerald-500 text-xs font-bold mb-1">↑ 4.2%</span>
           </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-sm shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Rituals</p>
           <div className="flex items-end gap-2">
             <span className="text-3xl md:text-4xl font-black text-gray-900">{habits.length}</span>
             <span className="text-gray-400 text-xs font-bold mb-1">v 1.2.0</span>
           </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 md:p-6 rounded-sm shadow-sm">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Peak Momentum</p>
           <div className="flex items-end gap-2">
             <span className="text-3xl md:text-4xl font-black text-gray-900">14d</span>
             <span className="text-orange-500 text-xs font-bold mb-1">STREAK</span>
           </div>
        </div>
        <div className="bg-gray-900 p-4 md:p-6 rounded-sm shadow-xl text-white">
           <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Current Ledger</p>
           <div className="flex items-end gap-2">
             <span className="text-3xl md:text-4xl font-black">{currentMonth}</span>
             <span className="text-gray-500 text-[10px] font-bold mb-1">ACTIVE</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Momentum & Heatmap */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
          <div className="bg-white border border-gray-200 p-4 md:p-8 rounded-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Neural Momentum Flow</h3>
               <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#76C7C0]" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Completions</span>
               </div>
            </div>
            <div className="h-[240px] md:h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyCompletions}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#76C7C0" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#76C7C0" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94A3B8' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '4px', border: '1px solid #E2E8F0', fontSize: '10px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#76C7C0" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4 md:p-8 rounded-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Neural Consistency Map</h3>
            <div className="grid grid-cols-7 gap-1.5 md:gap-4">
              {days.map(d => (
                <div key={d} className="group relative">
                  <div className={`aspect-square rounded-sm ${getHeatmapColor(dailyCompletions[d-1].count)} transition-all duration-300 md:hover:scale-110 cursor-help flex items-center justify-center`}>
                    <span className="text-[7px] md:text-[8px] font-black text-white opacity-0 group-hover:opacity-100">{d}</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="bg-gray-900 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-sm whitespace-nowrap shadow-xl">
                      Day {d}: {dailyCompletions[d-1].count} Rituals
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Balance & AI */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white border border-gray-200 p-4 md:p-8 rounded-sm">
             <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Ritual Equilibrium</h3>
             <div className="h-[240px] md:h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryStats}>
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 9, fontWeight: 800 }} />
                    <Radar
                      name="Balance"
                      dataKey="A"
                      stroke="#76C7C0"
                      fill="#76C7C0"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </div>

          <div className="bg-gray-900 p-6 md:p-8 rounded-sm text-white relative overflow-hidden group">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6">Strategic Optimization</h3>
              <div className="space-y-6 relative z-10">
                <p className="text-xs md:text-sm font-medium leading-relaxed italic opacity-80 border-l-2 border-emerald-500 pl-4 py-1">
                  "Your {currentMonth} patterns suggest a 48h reset period."
                </p>
                <button className="w-full bg-[#76C7C0] py-4 rounded-sm font-black uppercase tracking-widest text-[10px] text-gray-900 hover:bg-white transition-all shadow-xl">
                  Execute Protocol
                </button>
              </div>
          </div>
        </div>
      </div>

      {/* Strategic Alignment Footer */}
      <div className="bg-white border border-gray-200 p-4 md:p-8 rounded-sm shadow-sm mt-8 md:mt-12">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-50">
          <div className="w-8 md:w-12 h-1 bg-[#76C7C0]" />
          <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tighter uppercase">Strategic Alignment</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-[#76C7C0] uppercase tracking-widest mb-4">Active Sprints</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1, 2, 3, 4].map(idx => {
                const weekData = currentMonthWeeklyGoals.find(w => w.weekIndex === idx);
                const hasGoals = weekData && weekData.goals.length > 0;
                const completedCount = weekData?.goals.filter(g => g.completed).length || 0;
                const totalCount = weekData?.goals.length || 0;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <div key={idx} className={`p-4 rounded-sm border ${hasGoals ? 'bg-gray-50 border-gray-100' : 'bg-transparent border-dashed border-gray-200 opacity-50'}`}>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black uppercase text-gray-400">Week {idx + 1}</span>
                       <span className="text-[9px] font-black text-gray-900">{completedCount}/{totalCount}</span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                       <div className="h-full bg-[#76C7C0]" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-[#76C7C0] uppercase tracking-widest mb-4">Annual Milestones</h3>
            <div className="space-y-4">
              {annualCategories.map((cat, i) => {
                const progress = 20 + (i * 15) % 60;
                return (
                  <div key={cat.name} className="flex items-center gap-4">
                    <div className="flex-1 overflow-hidden">
                       <span className="text-[10px] font-black uppercase text-gray-400 block truncate">{cat.name}</span>
                       <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div className="h-full bg-gray-900" style={{ width: `${progress}%` }} />
                       </div>
                    </div>
                    <span className="text-[10px] font-black text-gray-900">{progress}%</span>
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
