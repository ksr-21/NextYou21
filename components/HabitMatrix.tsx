import React, { useMemo } from 'react';
import { Habit, WeeklyGoal } from '../types.ts';
import { MONTHS_LIST } from '../constants.tsx';
import { 
  BarChart, Bar, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface HabitMatrixProps {
  month: string;
  year: string;
  habits: Habit[];
  weeklyGoals: WeeklyGoal[];
  onUpdateWeeklyGoalStatus: (weekIdx: number, goalIdx: number, completed: boolean) => void;
  onToggleCell: (habitId: string, day: number) => void;
}

export const HabitMatrix: React.FC<HabitMatrixProps> = ({ 
  month, 
  year,
  habits, 
  onToggleCell 
}) => {
  const monthIndex = MONTHS_LIST.indexOf(month);
  const daysInMonth = new Date(parseInt(year), monthIndex + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const activeHabits = habits.filter(h => (h.activeMonths || []).includes(month));
  const today = new Date().getDate();

  // Define Week Colors
  const WEEK_COLORS = {
    w1: '#007ACC', // Blue
    w2: '#5C5C99', // Purple
    w3: '#D4A017', // Gold
    w4: '#C94C4C', // Red
    ex: '#2E8B57'  // Green
  };
  
  const stats = useMemo(() => {
    const totalHabits = activeHabits.length;
    const todayCompleted = activeHabits.filter(h => h.history[month]?.[today]).length;
    
    // Performance data for Bar Chart & Area Chart
    const chartData = days.map(d => {
      const completions = activeHabits.filter(h => h.history[month]?.[d]).length;
      const percentage = totalHabits > 0 ? Math.round((completions / totalHabits) * 100) : 0;
      return { day: d, count: completions, total: totalHabits, percentage };
    });

    const getWeekStats = (start: number, end: number) => {
      const actualEnd = Math.min(end, daysInMonth);
      const daysCount = (actualEnd - start + 1);
      const totalPossible = activeHabits.length * daysCount;
      if (totalPossible === 0) return { avg: 0, completed: 0, possible: 0 };
      let completed = 0;
      activeHabits.forEach(h => {
        for (let i = start; i <= actualEnd; i++) {
          if (h.history[month]?.[i]) completed++;
        }
      });
      return { 
        avg: Math.round((completed / totalPossible) * 100),
        completed,
        possible: totalPossible
      };
    };

    const consistencyList = activeHabits.map(h => {
      const completions = Object.values(h.history[month] || {}).filter(Boolean).length;
      const rate = Math.round((completions / daysInMonth) * 100);
      return { name: h.name, rate };
    }).sort((a, b) => b.rate - a.rate);

    const w1 = getWeekStats(1, 7);
    const w2 = getWeekStats(8, 14);
    const w3 = getWeekStats(15, 21);
    const w4 = getWeekStats(22, 28);
    const wExtra = getWeekStats(29, 31);

    return { 
      todayCompleted, 
      totalHabits, 
      chartData, 
      consistencyList,
      w1, w2, w3, w4, wExtra
    };
  }, [activeHabits, month, daysInMonth, today]);

  const weeks = [
    { label: 'Week 1', days: days.filter(d => d >= 1 && d <= 7),   bg: 'bg-[#D1E8FF]', header: 'bg-[#B0D4F7]', color: WEEK_COLORS.w1 },
    { label: 'Week 2', days: days.filter(d => d >= 8 && d <= 14),  bg: 'bg-[#E4Dbf5]', header: 'bg-[#D0BFE8]', color: WEEK_COLORS.w2 },
    { label: 'Week 3', days: days.filter(d => d >= 15 && d <= 21), bg: 'bg-[#FFF3CD]', header: 'bg-[#FFE69C]', color: WEEK_COLORS.w3 },
    { label: 'Week 4', days: days.filter(d => d >= 22 && d <= 28), bg: 'bg-[#FADBD8]', header: 'bg-[#F5B7B1]', color: WEEK_COLORS.w4 },
    { label: 'Extra',  days: days.filter(d => d >= 29),            bg: 'bg-[#D4EDDA]', header: 'bg-[#C3E6CB]', color: WEEK_COLORS.ex },
  ];

  const getGradientIdForDay = (day: number) => {
    if (day <= 7) return 'url(#gradW1)';
    if (day <= 14) return 'url(#gradW2)';
    if (day <= 21) return 'url(#gradW3)';
    if (day <= 28) return 'url(#gradW4)';
    return 'url(#gradEx)';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 min-h-screen bg-[#FDFDFB] text-slate-700 font-sans pb-24">
      
      <style>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        /* Smooth scrolling container */
        .smooth-scroll {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* --- LEFT SIDEBAR (Desktop) / TOP STATS (Mobile) --- */}
      <div className="w-full lg:w-[280px] flex-shrink-0 space-y-5">
        <div className="bg-[#FFD8A8] rounded-xl p-6 text-center shadow-[4px_4px_0px_rgba(0,0,0,0.05)] border border-[#FFC078]">
          <h1 className="text-2xl font-black text-[#8C4B15] tracking-tight">{month}'s Matrix</h1>
          <div className="mt-2 text-[10px] font-bold text-[#A65D1B] bg-white/40 inline-block px-3 py-1 rounded-full uppercase tracking-wider">Ritual Architecture</div>
        </div>

        {/* Today's Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 flex flex-col items-center shadow-sm">
          <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 w-full text-center border-b border-slate-100 pb-2">Today's Pulse</h3>
          <div className="relative w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="mergedPieGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={WEEK_COLORS.w1} />
                    <stop offset="25%" stopColor={WEEK_COLORS.w2} />
                    <stop offset="50%" stopColor={WEEK_COLORS.w3} />
                    <stop offset="75%" stopColor={WEEK_COLORS.w4} />
                    <stop offset="100%" stopColor={WEEK_COLORS.ex} />
                  </linearGradient>
                </defs>
                <Pie
                  data={[{ value: stats.todayCompleted }, { value: Math.max(0, stats.totalHabits - stats.todayCompleted) }]}
                  innerRadius={40} outerRadius={55} dataKey="value" startAngle={90} endAngle={-270}
                  stroke="none"
                >
                  <Cell fill="url(#mergedPieGradient)" />
                  <Cell fill="#F1F5F9" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-800">{stats.todayCompleted}/{stats.totalHabits}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ticks</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 min-w-0 max-w-full">
        <div className="flex flex-col gap-5">

             {/* Header Bar */}
             <div className="flex items-center justify-between mb-2 bg-white/60 p-3 rounded-xl border border-slate-100 shadow-sm">
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Focus: <span className="text-slate-900">{activeHabits.length} Rituals</span></div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest italic">{month} Ledger v2.0</div>
             </div>

             {/* Daily Volume Bar Chart */}
             <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 h-[160px] w-full shadow-[2px_2px_0px_rgba(0,0,0,0.02)]">
               <h3 className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest opacity-60">Daily Volume Analysis</h3>
                <ResponsiveContainer width="100%" height="85%">
                 <BarChart data={stats.chartData}>
                   <defs>
                     <linearGradient id="gradW1" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={WEEK_COLORS.w1} stopOpacity={1}/><stop offset="100%" stopColor={WEEK_COLORS.w1} stopOpacity={0.4}/>
                     </linearGradient>
                     <linearGradient id="gradW2" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={WEEK_COLORS.w2} stopOpacity={1}/><stop offset="100%" stopColor={WEEK_COLORS.w2} stopOpacity={0.4}/>
                     </linearGradient>
                     <linearGradient id="gradW3" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={WEEK_COLORS.w3} stopOpacity={1}/><stop offset="100%" stopColor={WEEK_COLORS.w3} stopOpacity={0.4}/>
                     </linearGradient>
                     <linearGradient id="gradW4" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={WEEK_COLORS.w4} stopOpacity={1}/><stop offset="100%" stopColor={WEEK_COLORS.w4} stopOpacity={0.4}/>
                     </linearGradient>
                     <linearGradient id="gradEx" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor={WEEK_COLORS.ex} stopOpacity={1}/><stop offset="100%" stopColor={WEEK_COLORS.ex} stopOpacity={0.4}/>
                     </linearGradient>
                   </defs>
                   <Bar dataKey="count" radius={[3, 3, 0, 0]}>
                     {stats.chartData.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={getGradientIdForDay(entry.day)} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>

             {/* 
                 4. Main Matrix Table 
                 Fixed: Sticky positioning logic, container overflow, and z-indexes for perfect mobile scrolling 
             */}
             <div className="bg-white rounded-xl shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col w-full relative z-0">
               <div className="overflow-x-auto no-scrollbar smooth-scroll rounded-xl">
                 <div className="inline-block min-w-full align-middle">
                   <table className="min-w-max w-full border-collapse border-spacing-0">
                     <thead>
                       <tr>
                         {/* STICKY HEADER CELL - High Z-Index, Box Shadow to separate from scrolling content */}
                         <th className="sticky left-0 top-0 z-30 bg-[#E0F2FE] p-4 text-left text-[11px] font-black text-[#0369A1] uppercase tracking-[0.2em] border-r border-b border-white min-w-[200px] w-[200px] max-w-[200px] shadow-[4px_0_12px_-4px_rgba(0,0,0,0.15)]">
                           Ritual Architecture
                         </th>
                         <th className="bg-[#E0F2FE] p-2 text-center text-[10px] font-black text-[#0369A1] uppercase border-r border-b border-white w-14">Goal</th>
                         <th className="bg-[#E0F2FE] p-2 text-center text-[10px] font-black text-[#0369A1] uppercase border-r border-b border-white w-14">Freq</th>
                         {weeks.map(week => (
                           <th key={week.label} colSpan={week.days.length} className={`${week.header} border-r border-b border-white py-2 text-center`}>
                             <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest whitespace-nowrap px-2">{week.label}</span>
                           </th>
                         ))}
                         <th className="bg-[#FFEDD5] p-2 text-center text-[10px] font-black text-[#9A3412] uppercase border-r border-b border-white w-14">Left</th>
                         <th className="bg-[#FFEDD5] p-2 text-center text-[10px] font-black text-[#9A3412] uppercase border-r border-b border-white w-20">Rate</th>
                         <th className="bg-[#FFEDD5] p-2 text-center text-[10px] font-black text-[#9A3412] uppercase border-b border-white w-14">Streak</th>
                       </tr>
                     </thead>
                     <tbody>
                       {/* Day/Status Rows */}
                       <tr className="bg-[#F0F9FF]">
                         {/* STICKY SUB-HEADER CELL */}
                         <td className="sticky left-0 z-20 bg-[#F0F9FF] px-4 py-3 text-[9px] font-bold text-slate-500 border-r border-b border-white shadow-[4px_0_12px_-4px_rgba(0,0,0,0.15)]">
                           Temporal Vector
                         </td>
                         <td colSpan={2} className="border-r border-b border-white"></td>
                         {weeks.map(week => week.days.map(d => {
                           const date = new Date(parseInt(year), monthIndex, d);
                           const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
                           return (
                             <td key={d} className={`${week.bg} border-r border-b border-white text-center py-1.5 w-9 min-w-[36px]`}>
                               <div className="flex flex-col items-center">
                                 <span className="text-[7px] font-black opacity-40 uppercase">{dayName}</span>
                                 <span className="text-[9px] font-black text-gray-700">{d}</span>
                               </div>
                             </td>
                           );
                         }))}
                         <td colSpan={3} className="bg-[#FFEDD5] border-b border-white"></td>
                       </tr>

                       {/* HABIT ROWS */}
                       {activeHabits.map((habit) => {
                         const habitCompletions = Object.values(habit.history[month] || {}).filter(Boolean).length;
                         const habitPercentage = Math.round((habitCompletions / daysInMonth) * 100);
                         const left = daysInMonth - habitCompletions;
                         let currentStreak = 0;
                         for(let i = today; i > 0; i--) {
                           if(habit.history[month]?.[i]) currentStreak++;
                           else if (i < today) break; 
                         }

                         return (
                           <tr key={habit.id} className="group hover:bg-slate-50 transition-colors">
                             {/* STICKY FIRST COL - HABIT NAME */}
                             <td className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 border-r border-b border-slate-100 p-2.5 shadow-[4px_0_12px_-4px_rgba(0,0,0,0.1)] transition-colors">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-slate-50 flex items-center justify-center text-lg">{habit.emoji}</div>
                                  <div className="bg-[#FFF7ED] px-3 py-1.5 rounded-xl border border-orange-100/50 flex-1 min-w-0 w-full">
                                    {/* Used w-full and truncate to handle mobile width properly */}
                                    <span className="text-[10px] font-black text-slate-700 block uppercase tracking-tight leading-tight whitespace-normal md:whitespace-nowrap md:truncate">
                                      {habit.name}
                                    </span>
                                  </div>
                               </div>
                             </td>

                             <td className="text-center text-[10px] font-black text-slate-400 border-r border-b border-slate-100 bg-slate-50/50">{habit.goal}</td>
                             <td className="text-center text-[10px] font-black text-slate-400 border-r border-b border-slate-100 bg-slate-50/50 uppercase">{habit.frequency}</td>

                             {weeks.map(week => week.days.map(d => {
                               const isActive = habit.history[month]?.[d];
                               return (
                                 <td 
                                   key={`${habit.id}-${d}`} 
                                   className={`${week.bg} bg-opacity-30 border-r border-b border-white p-0 cursor-pointer text-center align-middle hover:bg-opacity-60 transition-all`}
                                   onClick={() => onToggleCell(habit.id, d)}
                                 >
                                   <div className="flex items-center justify-center h-full w-full py-2">
                                     <div className={`
                                       w-5 h-5 rounded-md border transition-all duration-300
                                       flex items-center justify-center
                                       ${isActive 
                                         ? 'bg-[#007ACC] border-[#007ACC] shadow-sm transform scale-105' 
                                         : 'bg-white border-slate-200 hover:border-indigo-400'}
                                     `}>
                                       {isActive && (
                                         <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                                         </svg>
                                       )}
                                     </div>
                                   </div>
                                 </td>
                               );
                             }))}

                             <td className="text-center text-[10px] font-black text-slate-400 bg-slate-50/50 border-r border-b border-slate-100">{left}</td>
                             <td className="text-center border-r border-b border-slate-100 px-2 bg-emerald-50/30">
                               <div className="text-[10px] font-black text-emerald-700 tracking-tighter">{habitPercentage}%</div>
                             </td>
                             <td className="text-center text-[10px] font-black text-orange-600 bg-orange-50/20 border-b border-slate-100">{currentStreak}</td>
                           </tr>
                         );
                       })}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
          
          {/* Trend Graph (Desktop and Mobile) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm w-full">
            <h3 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-[0.3em] opacity-60 italic">Daily Performance Trend</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.chartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mergedGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor={WEEK_COLORS.w1} /><stop offset="25%" stopColor={WEEK_COLORS.w2} />
                      <stop offset="50%" stopColor={WEEK_COLORS.w3} /><stop offset="75%" stopColor={WEEK_COLORS.w4} />
                      <stop offset="100%" stopColor={WEEK_COLORS.ex} />
                    </linearGradient>
                    <linearGradient id="mergedFill" x1="0" y1="0" x2="1" y2="0">
                       <stop offset="0%" stopColor={WEEK_COLORS.w1} stopOpacity={0.2} />
                       <stop offset="100%" stopColor={WEEK_COLORS.ex} stopOpacity={0.2} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" strokeDasharray="3 3" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 700 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ fontSize: '11px', borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: '900' }}
                    formatter={(value: number) => [`${value}%`, 'Integrity']}
                  />
                  <Area type="monotone" dataKey="percentage" stroke="url(#mergedGradient)" strokeWidth={4} fillOpacity={1} fill="url(#mergedFill)" animationDuration={1500} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};