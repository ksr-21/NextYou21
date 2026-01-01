
import React, { useState, useMemo, useEffect } from 'react';
import { Habit, PlannerConfig } from '../types';
import { WeeklyActivity, ConsistencyRing, RitualBalance } from '../components/ProgressCharts';
import { MONTHS_LIST } from '../constants';

interface DashboardProps {
  habits: Habit[];
  config: PlannerConfig;
  onUpdateConfig: (config: PlannerConfig) => void;
  onAddClick: () => void;
}

const YEARS = ['2024', '2025', '2026', '2027'];

export const Dashboard: React.FC<DashboardProps> = ({ habits, config, onUpdateConfig }) => {
  const [viewYear, setViewYear] = useState('2026');
  const [viewMonth, setViewMonth] = useState<'Year' | string>('Year');
  const [localManifestation, setLocalManifestation] = useState(config.manifestationText || '');

  // Debounced sync for manifestation board
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localManifestation !== config.manifestationText) {
        onUpdateConfig({ ...config, manifestationText: localManifestation });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [localManifestation]);

  useEffect(() => {
    setLocalManifestation(config.manifestationText || '');
  }, [config.manifestationText]);

  const performanceMetrics = useMemo(() => {
    if (habits.length === 0) return { rate: 0, count: 0 };
    let totalPossible = 0;
    let totalCompleted = 0;
    const monthsToProcess = viewMonth === 'Year' ? MONTHS_LIST : [viewMonth];
    habits.forEach(habit => {
      monthsToProcess.forEach(month => {
        const history = habit.history[month] || {};
        totalPossible += 31;
        totalCompleted += Object.values(history).filter(Boolean).length;
      });
    });
    const rate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    return { rate, count: totalCompleted };
  }, [habits, viewMonth]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8 md:py-16 pb-32 space-y-16 md:space-y-24 overflow-x-hidden">
      {/* Header Strategy Control */}
      <section className="flex flex-col xl:flex-row items-start xl:items-end justify-between gap-12">
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-4 mb-10">
            <div className="px-4 py-2 bg-[#F1F5F9] rounded-full flex items-center gap-3 border border-gray-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#76C7C0] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Console: Active</span>
            </div>
          </div>

          <h1 className="text-[4rem] sm:text-[6rem] lg:text-[7.5rem] font-black text-gray-900 tracking-tighter leading-[0.8] mb-12 italic">
            Fidelity <br/><span className="text-[#76C7C0] not-italic underline decoration-[12px] md:decoration-[20px] decoration-gray-100 underline-offset-[10px]">Matrix.</span>
          </h1>

          <div className="flex flex-wrap gap-6 mt-12">
            <div className="flex flex-col gap-2 min-w-[140px] flex-1 md:flex-initial">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Period</label>
              <select 
                value={viewYear}
                onChange={(e) => setViewYear(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:border-gray-900 outline-none transition-all shadow-sm"
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 min-w-[200px] flex-1 md:flex-initial">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Window</label>
              <select 
                value={viewMonth}
                onChange={(e) => setViewMonth(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 px-6 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest focus:border-[#76C7C0] outline-none transition-all shadow-sm"
              >
                <option value="Year">Full Annual View</option>
                {MONTHS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
          <div className="flex-1 bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-between gap-8 shadow-sm">
            <div className="text-right">
              <p className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Completions</p>
              <p className="text-5xl font-black text-gray-900 tracking-tighter italic">{performanceMetrics.count}</p>
            </div>
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-3xl">✓</div>
          </div>
          <div className="flex-1 bg-[#F8FAFC] border-2 border-emerald-100 p-8 rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-between gap-8 shadow-xl">
            <div className="w-16 h-16 bg-white text-teal-400 rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-emerald-50">🎯</div>
            <div className="text-right">
              <p className="text-[11px] font-black text-teal-600/50 uppercase tracking-widest mb-2">Status</p>
              <p className="text-5xl font-black text-gray-900 tracking-tighter italic">Peak</p>
            </div>
          </div>
        </div>
      </section>

      {/* Manifestation Board Section */}
      <section className="bg-white border-2 border-gray-100 p-8 md:p-14 rounded-[3rem] md:rounded-[5rem] shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#76C7C0]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#76C7C0] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">✍️</div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Manifestation Board</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Intent Architecture Protocol</p>
          </div>
        </div>
        <div className="relative">
          <textarea
            value={localManifestation}
            onChange={(e) => setLocalManifestation(e.target.value)}
            className="w-full h-48 md:h-64 bg-gray-50/50 border-2 border-gray-50 rounded-[2rem] p-8 md:p-10 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-mono text-sm md:text-base leading-relaxed text-gray-700 resize-none shadow-inner"
            placeholder="Document your vision for 2026. What does elite performance look like for you?"
          />
          <div className="absolute bottom-6 right-8 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Autosync Enabled</span>
          </div>
        </div>
      </section>

      {/* Main Analytics Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        <div className="lg:col-span-5 h-full min-h-[500px]">
          <ConsistencyRing percentage={performanceMetrics.rate} />
        </div>
        <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
          <div className="h-full"><WeeklyActivity month={viewMonth} habits={habits} /></div>
          <div className="h-full"><RitualBalance habits={habits} /></div>
        </div>
      </section>

      {/* Evolution Dashboard */}
      <section className="bg-white border-2 border-gray-100 p-6 sm:p-10 md:p-20 rounded-[3rem] sm:rounded-[4rem] md:rounded-[6rem] shadow-[0_40px_100px_rgba(0,0,0,0.03)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-teal-50 rounded-full blur-[100px] md:blur-[140px] -z-10 opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 sm:gap-16 md:gap-24 items-center relative z-10">
          <div>
            <div className="flex items-center gap-6 mb-10 md:mb-16">
              <h3 className="text-[10px] md:text-[12px] font-black text-[#76C7C0] uppercase tracking-[0.6em] md:tracking-[0.8em] border-b-2 border-gray-100 pb-2">Evolution Sync</h3>
              <div className="h-[1px] flex-1 bg-gray-100" />
            </div>

            <div className="flex flex-row items-end gap-6 sm:gap-10 mb-10 md:mb-16">
              <span className="text-[6rem] sm:text-[10rem] md:text-[14rem] font-black text-gray-900 tracking-tighter leading-[0.7] group-hover:text-teal-500 transition-colors duration-700 italic">42</span>
              <div className="mb-2 md:mb-6">
                <p className="text-[10px] md:text-sm font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-3">Ranking Tier</p>
                <p className="text-xl sm:text-2xl md:text-4xl font-black text-gray-900 tracking-tight italic uppercase">Elite Architect A1</p>
              </div>
            </div>

            <div className="w-full h-8 md:h-10 bg-gray-100 rounded-full overflow-hidden p-1.5 md:p-2 border border-gray-200 mb-10 md:mb-12">
              <div className="h-full bg-gray-900 rounded-full transition-all duration-[2500ms] ease-out group-hover:bg-teal-500" style={{ width: '74%' }} />
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-gray-100 group-hover:bg-white transition-all group-hover:shadow-lg gap-6 md:gap-8">
              <div className="text-center sm:text-left">
                <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 italic">Current Delta</p>
                <p className="text-lg md:text-2xl font-black text-gray-900 italic tracking-tight uppercase">High Precision Sync</p>
              </div>
              <div className="bg-gray-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-widest group-hover:bg-teal-500 transition-colors">
                Level 43 Critical
              </div>
            </div>
          </div>

          <div className="space-y-8 md:space-y-10">
            <div className="bg-[#111827] p-8 md:p-12 rounded-[2.5rem] md:rounded-[5rem] text-white relative overflow-hidden group-hover:border-teal-500/30 border border-transparent transition-colors shadow-2xl">
               <div className="absolute top-0 right-0 p-8 md:p-16 opacity-5 pointer-events-none transform group-hover:rotate-12 transition-transform duration-1000">
                  <svg className="w-32 h-32 md:w-64 md:h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
               </div>
               <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-teal-400 mb-6 md:mb-10 pb-4 border-b border-white/5 italic">Operational Briefing</h4>
               <p className="text-xl sm:text-3xl md:text-5xl font-black italic leading-[1.1] md:leading-[1] tracking-tighter mb-8 md:mb-10">
                 "Architecture fidelity outperforming global median by <span className="text-teal-400">24.8%</span>."
               </p>
               <div className="flex items-center gap-4 md:gap-5 p-4 md:p-5 bg-white/5 rounded-2xl border border-white/5">
                 <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                   <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
                 <p className="text-[10px] md:text-xs font-bold text-gray-400 tracking-tight italic leading-snug">Global Node Synchronization at 99.9% fidelity.</p>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:gap-8">
              <div className="p-6 md:p-10 bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:border-teal-500 transition-colors text-center">
                <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-3 italic">Integrity</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl md:text-5xl font-black text-gray-900 italic tracking-tighter">99</span>
                  <span className="text-xl md:text-3xl font-black text-teal-500">.9</span>
                </div>
              </div>
              <div className="p-6 md:p-10 bg-white border border-gray-100 rounded-[2rem] md:rounded-[3rem] shadow-sm hover:border-indigo-500 transition-colors text-center">
                <p className="text-[8px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 md:mb-3 italic">Load</p>
                <p className="text-2xl md:text-5xl font-black text-gray-900 italic tracking-tighter uppercase">Elite</p>
              </div>
            </div>
          </div> 
        </div>
      </section>
    </div>
  );
};
