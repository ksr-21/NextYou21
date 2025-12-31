
import React from 'react';
import { 
  AreaChart, Area, XAxis, ResponsiveContainer, Tooltip, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, Cell, PieChart, Pie
} from 'recharts';
import { MOCK_CHART_DATA } from '../constants';
import { Habit } from '../types';

export const WeeklyActivity: React.FC = () => {
  return (
    <div className="glass p-10 rounded-[4rem] h-full transition-all hover:scale-[1.02] premium-shadow group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500 mb-1">Momentum</h3>
          <p className="text-2xl font-black text-gray-900 tracking-tight">Ritual Flow</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center text-xl group-hover:rotate-12 transition-transform">📈</div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={MOCK_CHART_DATA}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Tooltip 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', padding: '16px 24px' }}
              itemStyle={{ fontWeight: '900', color: '#111' }}
            />
            <Area 
              type="monotone" 
              dataKey="count" 
              stroke="#6366F1" 
              strokeWidth={5} 
              fillOpacity={1} 
              fill="url(#colorCount)" 
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
    A: habits.filter(h => h.category === cat).length * 20 + habits.filter(h => h.category === cat && h.completed).length * 30,
    fullMark: 150,
  }));

  return (
    <div className="glass p-10 rounded-[4rem] h-full transition-all hover:scale-[1.02] premium-shadow group">
       <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-500 mb-1">Biological</h3>
          <p className="text-2xl font-black text-gray-900 tracking-tight">Equilibrium</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center text-xl group-hover:-rotate-12 transition-transform">🧿</div>
      </div>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 800 }} />
            <Radar
              name="Balance"
              dataKey="A"
              stroke="#A855F7"
              fill="#A855F7"
              fillOpacity={0.4}
              animationDuration={2500}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ConsistencyRing: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="glass p-10 rounded-[4rem] flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] premium-shadow">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-10">Neural Fidelity</h3>
      <div className="relative w-44 h-44 mb-10">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88" cy="88" r="78"
            stroke="#F1F5F9" strokeWidth="16" fill="transparent"
          />
          <circle
            cx="88" cy="88" r="78"
            stroke="url(#performanceGrad)" strokeWidth="16" fill="transparent"
            strokeDasharray={490}
            strokeDashoffset={490 * (1 - percentage / 100)}
            strokeLinecap="round"
            className="transition-all duration-[2000ms] ease-out"
          />
          <defs>
            <linearGradient id="performanceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black text-gray-900 tracking-tighter">{percentage}%</span>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Global Score</span>
        </div>
      </div>
      <div className="inline-flex items-center gap-2 bg-emerald-50 px-5 py-2.5 rounded-full">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-sm" />
        <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">Optimized State</span>
      </div>
    </div>
  );
};
