
import React, { useState, useEffect, useMemo } from 'react';
import { Habit } from '../types';
import { 
  AreaChart, Area, ResponsiveContainer, XAxis, YAxis, 
  Radar, RadarChart, PolarGrid, PolarAngleAxis 
} from 'recharts';
import { MONTHS_LIST } from '../constants';
import { getHabitInsights } from '../services/geminiService';

interface WallpaperViewProps {
  habits: Habit[];
  month: string;
}

export const WallpaperView: React.FC<WallpaperViewProps> = ({ habits, month }) => {
  const [time, setTime] = useState(new Date());
  const [insight, setInsight] = useState("Initializing strategic analysis...");
  const [isMinimal, setIsMinimal] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadInsight = async () => {
      const text = await getHabitInsights(habits);
      setInsight(text);
    };
    loadInsight();
  }, [habits]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const stats = useMemo(() => {
    const today = time.getDate();
    const todayActive = habits.filter(h => h.activeMonths.includes(month));
    const todayDone = todayActive.filter(h => h.history[month]?.[today]).length;
    const efficiency = todayActive.length > 0 ? Math.round((todayDone / todayActive.length) * 100) : 0;

    const categories = ['Mind', 'Body', 'Spirit', 'Work'];
    const balanceData = categories.map(cat => {
      const catHabits = habits.filter(h => h.category === cat);
      const done = catHabits.reduce((acc, h) => acc + Object.values(h.history[month] || {}).filter(Boolean).length, 0);
      const possible = Math.max(1, catHabits.length * 31);
      return { subject: cat, A: Math.round((done / possible) * 100), fullMark: 100 };
    });

    const weeklyTrend = [0, 1, 2, 3, 4, 5, 6].map(offset => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - offset));
      const dateNum = d.getDate();
      const mName = MONTHS_LIST[d.getMonth()];
      const done = habits.filter(h => h.history[mName]?.[dateNum]).length;
      return { name: d.toLocaleDateString('en-US', { weekday: 'narrow' }), count: done };
    });

    return { efficiency, balanceData, weeklyTrend, activeCount: todayActive.length, doneCount: todayDone };
  }, [habits, month, time]);

  return (
    <div className="fixed inset-0 bg-[#020617] text-white z-[40] flex flex-col p-8 md:p-12 overflow-hidden transition-all duration-1000">
      {/* Animated Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#76C7C0]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

      {/* FLOATING SETTINGS TRIGGER */}
      <div className="absolute top-8 right-8 z-[60] flex gap-3">
        <button 
          onClick={() => setShowGuide(true)}
          className="w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all shadow-2xl group"
          title="Wallpaper Setup Guide"
        >
          <svg className="w-5 h-5 text-[#76C7C0] group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
        </button>
        <button 
          onClick={() => setIsMinimal(!isMinimal)}
          className={`w-12 h-12 backdrop-blur-xl border rounded-2xl flex items-center justify-center transition-all shadow-2xl ${isMinimal ? 'bg-[#76C7C0] border-[#76C7C0] text-gray-900' : 'bg-white/5 border-white/10 text-[#76C7C0] hover:bg-white/20'}`}
          title="Minimal Mode"
        >
          {isMinimal ? '🎯' : '📺'}
        </button>
      </div>

      {/* TACTICAL CLOCK */}
      <header className={`relative z-10 flex flex-col items-center justify-center transition-all duration-1000 ${isMinimal ? 'mt-20 scale-110' : 'mb-12'}`}>
        <h1 className="text-8xl md:text-[12rem] font-black tracking-tighter italic leading-none text-white/90 drop-shadow-2xl">
          {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <div className="h-px w-12 bg-indigo-500/50" />
          <p className="text-[12px] md:text-[14px] font-black uppercase tracking-[0.8em] text-indigo-400 italic">
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className="h-px w-12 bg-indigo-500/50" />
        </div>
      </header>

      {/* MAIN DATA GRID */}
      <div className={`flex-1 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center transition-all duration-1000 ${isMinimal ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
        
        {/* LEFT: Balance Radar */}
        <div className="lg:col-span-3 h-[400px] flex flex-col justify-center bg-white/5 backdrop-blur-3xl rounded-[4rem] p-10 border border-white/5 shadow-2xl">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic text-center">Biometric Equilibrium</h3>
           <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.balanceData}>
                  <PolarGrid stroke="#ffffff10" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
                  <Radar name="Balance" dataKey="A" stroke="#76C7C0" fill="#76C7C0" fillOpacity={0.2} animationDuration={2500} />
                </RadarChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* CENTER: Efficiency Pulse */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center py-10">
           <div className={`relative w-full aspect-square max-w-[450px] transition-transform duration-1000 ${isMinimal ? 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-100 scale-125' : ''}`}>
              {/* Progress Ring */}
              <svg className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_30px_rgba(118,199,192,0.2)]" viewBox="0 0 240 240">
                <circle cx="120" cy="120" r="100" stroke="#ffffff05" strokeWidth="4" fill="transparent" />
                <circle 
                  cx="120" cy="120" r="100" 
                  stroke="url(#wallpaperGradLarge)" strokeWidth="10" fill="transparent"
                  strokeDasharray="628" 
                  strokeDashoffset={628 - (628 * stats.efficiency / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-[3000ms] ease-out"
                />
                <defs>
                  <linearGradient id="wallpaperGradLarge" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#76C7C0" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] mb-4 italic">Daily Velocity</p>
                <div className="flex items-baseline">
                  <span className="text-[10rem] font-black italic tracking-tighter text-white drop-shadow-2xl">{stats.efficiency}</span>
                  <span className="text-4xl font-black text-[#76C7C0] mb-6 ml-2">%</span>
                </div>
                <div className="mt-4 px-6 py-2 bg-white/10 rounded-full border border-white/10 text-[11px] font-black uppercase tracking-[0.3em] text-[#76C7C0]">
                  {stats.doneCount} / {stats.activeCount} Rituals
                </div>
              </div>
           </div>
        </div>

        {/* RIGHT: Weekly Trend */}
        <div className="lg:col-span-3 h-[400px] flex flex-col justify-center bg-white/5 backdrop-blur-3xl rounded-[4rem] p-10 border border-white/5 shadow-2xl">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 italic text-center">Tactical Flow</h3>
           <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyTrend}>
                  <defs>
                    <linearGradient id="wallTrendWall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Area type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={5} fill="url(#wallTrendWall)" animationDuration={3000} />
                </AreaChart>
              </ResponsiveContainer>
           </div>
           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center mt-6">7-Day Deployment History</p>
        </div>
      </div>

      {/* STRATEGIC INSIGHT FOOTER */}
      <footer className={`relative z-10 bg-white/5 border border-white/5 p-10 rounded-[4rem] backdrop-blur-2xl transition-all duration-1000 ${isMinimal ? 'translate-y-40 opacity-0' : 'mt-12 opacity-100'}`}>
         <div className="flex items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-[#76C7C0] text-gray-900 flex items-center justify-center text-3xl font-black shadow-xl shadow-[#76C7C0]/20 animate-bounce">
               ⚡
            </div>
            <div className="flex-1">
               <p className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-2 italic">Architect Briefing</p>
               <p className="text-3xl font-black italic tracking-tight text-white/95 leading-snug">
                 "{insight}"
               </p>
            </div>
         </div>
      </footer>

      {/* SETUP GUIDE MODAL */}
      {showGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in zoom-in-95 duration-500">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" onClick={() => setShowGuide(false)} />
           <div className="relative w-full max-w-4xl bg-white/5 border border-white/10 rounded-[4rem] p-12 md:p-20 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px]" />
              
              <div className="flex justify-between items-start mb-16">
                <div>
                   <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-4">Permanent Wallpaper Protocol</h2>
                   <div className="h-2 w-24 bg-[#76C7C0] rounded-full" />
                </div>
                <button onClick={() => setShowGuide(false)} className="text-4xl text-white/20 hover:text-white transition-colors">×</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-10">
                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
                       <h3 className="text-[12px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">STEP 1: Windows (Best Method)</h3>
                       <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                         Install <span className="text-white font-black">Lively Wallpaper</span> (Free/Open Source). Select "Add Wallpaper" -> "URL" and paste this app's URL. It will render natively behind your icons.
                       </p>
                       <button onClick={toggleFullscreen} className="w-full bg-[#76C7C0] text-gray-900 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all">
                          Enter Fullscreen Mode (F11)
                       </button>
                    </div>

                    <div className="bg-white/5 p-8 rounded-[3rem] border border-white/5">
                       <h3 className="text-[12px] font-black text-indigo-400 uppercase tracking-widest mb-4 italic">STEP 2: Mac / Universal</h3>
                       <p className="text-slate-400 text-sm leading-relaxed font-medium">
                         Use a dedicated space for this tab. Enable <span className="text-white font-black">Minimal Mode</span> using the 🎯 button. Switch between work and wallpaper using three-finger trackpad swipes.
                       </p>
                    </div>
                 </div>

                 <div className="flex flex-col justify-center items-center text-center bg-[#76C7C0]/5 rounded-[4rem] p-10 border border-[#76C7C0]/10">
                    <div className="w-24 h-24 bg-[#76C7C0] rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 shadow-2xl shadow-[#76C7C0]/20">📺</div>
                    <p className="text-2xl font-black italic text-white tracking-tight mb-4">Live Performance Monitor</p>
                    <p className="text-slate-400 text-[11px] uppercase font-black tracking-[0.3em]">Operational Fidelity: 99.9%</p>
                    <p className="mt-10 text-slate-500 text-[10px] leading-loose max-w-xs">
                      Note: Browsers do not allow webpages to be set as backgrounds natively for security. You must use the "Lively" or "Dashboard" method to bypass this restriction.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
