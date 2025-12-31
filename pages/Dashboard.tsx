
import React, { useState, useEffect } from 'react';
import { Habit, HabitMode, HabitTemplate } from '../types';
import { HabitCard } from '../components/HabitCard';
import { ModeSelector } from '../components/ModeSelector';
import { WeeklyActivity, ConsistencyRing, RitualBalance } from '../components/ProgressCharts';
import { TemplateHub } from '../components/TemplateHub';
import { getHabitInsights } from '../services/geminiService';

interface DashboardProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  onAddClick: () => void;
  onDelete: (id: string) => void;
  onApplyTemplate: (template: HabitTemplate) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ habits, setHabits, onAddClick, onDelete, onApplyTemplate }) => {
  const [mode, setMode] = useState<HabitMode>('All');
  const [insight, setInsight] = useState<string>("Initializing neural analysis...");
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      const text = await getHabitInsights(habits);
      setInsight(text);
      setLoadingInsight(false);
    };
    fetchInsight();
  }, [habits.length]);

  const toggleHabit = (id: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const today = new Date().getDate();
        const newState = !h.completed;
        return { 
          ...h, 
          completed: newState, 
          streak: newState ? h.streak + 1 : Math.max(0, h.streak - 1),
          history: { ...h.history, [today]: newState }
        };
      }
      return h;
    }));
  };

  const filteredHabits = habits.filter(h => {
    if (mode === 'All') return true;
    if (mode === 'Focus') return h.difficulty === 'Hard' || h.streak > 10;
    if (mode === 'Low Energy') return h.difficulty === 'Easy';
    if (mode === 'Growth') return h.difficulty !== 'Easy';
    return true;
  });

  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completed).length / habits.length) * 100)
    : 0;

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-12 pb-40">
      {/* Structural Header */}
      <header className="mb-16 pb-12 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-1 bg-[#1B5E20] rounded-full" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Biological Planner v1.2</span>
          </div>
          <h1 className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">Daily Briefing</h1>
          <p className="text-lg text-gray-400 font-medium">Calibrated for <span className="text-gray-900 font-black">High performance</span> rituals in March.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           <div className="planner-card px-8 py-5 flex items-center gap-4 border-l-4 border-l-emerald-500">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Streak</p>
                <p className="text-2xl font-black text-gray-900 mono">14 Days</p>
              </div>
           </div>
           <div className="planner-card px-8 py-5 flex items-center gap-4 border-l-4 border-l-sky-500">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Rank</p>
                <p className="text-2xl font-black text-gray-900 mono">Elite</p>
              </div>
           </div>
        </div>
      </header>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-20">
        <ConsistencyRing percentage={completionRate} />
        <WeeklyActivity />
        <RitualBalance habits={habits} />
        <div className="bg-[#111] p-10 rounded-[3rem] text-white flex flex-col justify-between group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-20 transform group-hover:scale-125 transition-transform">💎</div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-8">AI Synchronization</h3>
          <p className={`text-xl font-bold leading-relaxed ${loadingInsight ? 'opacity-30 animate-pulse' : ''}`}>
            "{insight}"
          </p>
          <div className="mt-12 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Neural Engine Online</span>
          </div>
        </div>
      </section>

      {/* Interactive Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <div className="mb-12">
            <ModeSelector currentMode={mode} onModeChange={setMode} />
          </div>
          
          <div className="space-y-10">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Current Buffer</h2>
              <button onClick={onAddClick} className="bg-gray-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all">
                Add Ritual
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {filteredHabits.map(habit => (
                <div key={habit.id} className="relative group">
                  <HabitCard habit={habit} onToggle={toggleHabit} />
                  <button onClick={() => onDelete(habit.id)} className="absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-4 text-gray-300 hover:text-red-500 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <TemplateHub onApply={onApplyTemplate} />
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="planner-card p-10 bg-[#FDFDFB]">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-10">Level Evolution</h3>
              <div className="flex items-end gap-4 mb-3">
                <span className="text-6xl font-black text-gray-900 tracking-tighter leading-none mono">42</span>
                <span className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-widest">Architect</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div className="h-full bg-emerald-600 w-[74%]" />
              </div>
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Next Tier: Grand Architect (820 XP to go)</p>
           </div>

           <div className="planner-card p-10 bg-white border-2 border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.05]"><span className="text-8xl">🌱</span></div>
              <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-2">Growth Protocol</h3>
              <p className="text-sm text-gray-400 font-medium mb-8">Maintain your spirit rituals for 5 more days to unlock the "Master Calm" achievement.</p>
              <button className="w-full bg-[#1B5E20] text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-black transition-all">
                View Progression
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
