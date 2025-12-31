
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Habit } from '../types';

interface MatrixAnalyticsProps {
  habits: Habit[];
}

export const MatrixAnalytics: React.FC<MatrixAnalyticsProps> = ({ habits }) => {
  const categories = ['Mind', 'Body', 'Spirit', 'Work'] as const;
  const categoryColors: Record<string, string> = {
    Mind: '#01579B',
    Body: '#1B5E20',
    Spirit: '#4A148C',
    Work: '#E65100'
  };

  const catStats = categories.map(cat => {
    const catHabits = habits.filter(h => h.category === cat);
    if (catHabits.length === 0) return { name: cat, value: 0 };
    const totalPossible = catHabits.length * 31;
    const totalDone = catHabits.reduce((acc, h) => acc + Object.values(h.history).filter(Boolean).length, 0);
    return { name: cat, value: Math.round((totalDone / totalPossible) * 100) };
  });

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Category Performance Bar Chart */}
      <div className="planner-card p-8 lg:col-span-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Performance Summary</h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={catStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 800 }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#F8F9F3' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                {catStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Meta Insights Widget */}
      <div className="planner-card p-8 flex flex-col justify-between">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6">Daily Insight</h3>
          <div className="p-6 rounded-3xl bg-[#E8F5E9] border border-emerald-100">
            <p className="text-sm font-black text-[#1B5E20] leading-relaxed italic">
              "You are maintaining a 92% completion rate on high-difficulty tasks during early hours. Focus on maintaining Body rituals this week."
            </p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consistency</p>
              <p className="text-2xl font-black text-gray-900 mono">Peak</p>
           </div>
           <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-black">
              ⭐
           </div>
        </div>
      </div>
    </div>
  );
};
