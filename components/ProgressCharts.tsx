
import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { MONTHS_LIST } from '../constants';
import { Habit } from '../types';

export const WeeklyActivity: React.FC<{ month?: string; habits: Habit[] }> = ({ month = 'Year', habits }) => {
  const chartData = useMemo(() => {
    if (month === 'Year') {
      return MONTHS_LIST.map(m => {
        let completions = 0;
        habits.forEach(h => {
          completions += Object.values(h.history[m] || {}).filter(Boolean).length;
        });
        return { name: m.slice(0, 3).toUpperCase(), count: completions };
      });
    } else {
      return [
        { name: 'W1', count: 0 },
        { name: 'W2', count: 0 },
        { name: 'W3', count: 0 },
        { name: 'W4', count: 0 },
      ].map((week, idx) => {
        let weekCompletions = 0;
        const startDay = idx * 7 + 1;
        const endDay = (idx + 1) * 7;
        habits.forEach(h => {
          const history = h.history[month] || {};
          for (let d = startDay; d <= endDay; d++) {
            if (history[d]) weekCompletions++;
          }
        });
        return { ...week, count: weekCompletions };
      });
    }
  }, [month, habits]);

  return (
    <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] h-full transition-all hover:shadow-xl duration-500 group flex flex-col overflow-hidden">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Ritual Flow</h3>
          <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic leading-none">{month === 'Year' ? 'Annual Velocity' : `${month} Telemetry`}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl">📈</div>
      </div>
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="flowGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              // Corrected fontBold to fontWeight to satisfy SVG property requirements
              tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} 
              dy={10} 
            />
            <Tooltip 
              cursor={{ stroke: '#6366F1', strokeWidth: 1, strokeDasharray: '3 3' }}
              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '16px', background: '#fff' }}
              itemStyle={{ fontWeight: '900', color: '#1e293b', fontSize: '12px' }}
              labelStyle={{ display: 'none' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#6366F1" 
              strokeWidth={3} 
              fillOpacity={1} 
              fill="url(#flowGrad)" 
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const RitualBalance: React.FC<{ habits: Habit[] }> = ({ habits }) => {
  const categories = ['Mind', 'Body', 'Spirit', 'Work'];
  const data = categories.map(cat => ({
    subject: cat,
    A: habits.filter(h => h.category === cat).length * 20 + habits.filter(h => h.category === cat && h.completed).length * 20 + 20,
    fullMark: 150,
  }));

  return (
    <div className="bg-white border border-gray-100 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] h-full transition-all hover:shadow-xl duration-500 group flex flex-col overflow-hidden">
       <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-500 mb-2">Equilibrium</h3>
          <p className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter italic leading-none">Bio Balance</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">🧿</div>
      </div>
      <div className="flex-1 min-h-[200px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#F1F5F9" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }} />
            <Radar
              name="Balance"
              dataKey="A"
              stroke="#14B8A6"
              strokeWidth={3}
              fill="#14B8A6"
              fillOpacity={0.2}
              animationDuration={2000}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ConsistencyRing: React.FC<{ percentage: number }> = ({ percentage }) => {
  const radius = 90;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const percentile = useMemo(() => {
    if (percentage === 0) return 0.2;
    if (percentage === 100) return 99.9;
    return Math.min(99.8, (percentage * 0.95) + 5.2);
  }, [percentage]);

  return (
    <div className="bg-[#111827] p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] flex flex-col items-center justify-between transition-all hover:shadow-[0_40px_120px_-20px_rgba(0,0,0,0.6)] shadow-2xl border border-gray-800/40 relative overflow-hidden group h-full">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#76C7C0]/5 to-transparent pointer-events-none" />
      <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />

      <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.8em] mb-8 relative z-10">Performance Fidelity</h3>
      
      <div className="relative w-full aspect-square max-w-[280px] md:max-w-[320px] flex items-center justify-center">
        {/* Progress Ring */}
        <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_15px_rgba(118,199,192,0.15)]" viewBox="0 0 240 240">
          <circle
            cx="120" cy="120" r={radius}
            stroke="#1f2937" strokeWidth={strokeWidth} fill="transparent"
          />
          <circle
            cx="120" cy="120" r={radius}
            stroke="url(#architectGradMain)" strokeWidth={strokeWidth} fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-[2500ms] ease-out"
          />
          <defs>
            <linearGradient id="architectGradMain" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#76C7C0" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Hero Typography - Contained inside the circle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-20">
           <div className="flex items-end justify-center group-hover:scale-105 transition-transform duration-700">
             <span className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none italic drop-shadow-2xl">
               {percentage}
             </span>
             <span className="text-2xl md:text-3xl font-black text-[#76C7C0] mb-2 md:mb-4 ml-0.5 drop-shadow-md">%</span>
           </div>
           
           {/* Floating status badge moved down and cleaned up */}
           <div className="mt-4 px-3 py-1 bg-teal-500 text-gray-900 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-[0_4px_12px_rgba(20,184,166,0.3)]">
              {percentage > 90 ? 'Elite' : 'Active'}
           </div>
        </div>
      </div>

      <div className="w-full space-y-6 relative z-10 mt-10">
        {/* Unified Standing Module */}
        <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 md:p-8 backdrop-blur-md group-hover:bg-white/10 transition-all">
          <div className="flex justify-between items-center mb-4">
            <p className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em] italic">Ranking</p>
            <span className="w-1.5 h-1.5 rounded-full bg-[#76C7C0] animate-pulse" />
          </div>
          
          <div className="space-y-1">
            <p className="text-2xl font-black text-white italic leading-tight">
              Above <span className="text-[#76C7C0]">{percentile.toFixed(1)}%</span>
            </p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">
              of Performance Nodes
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between px-2">
           <div className="flex items-center gap-2">
              <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.5em]">Protocol Sync</span>
           </div>
           <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">V2.5.1</span>
        </div>
      </div>
    </div>
  );
};
