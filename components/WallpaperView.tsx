import React, { useState, useEffect, useMemo } from 'react';
import { Habit } from '../types';
import { MONTHS_LIST } from '../constants';

interface WallpaperViewProps {
  habits: Habit[];
}

export const WallpaperView: React.FC<WallpaperViewProps> = ({ habits }) => {
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);

  // 1. Handle Screen Resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 2. Real-time Clock
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 3. Data Processing
  const { points, stats } = useMemo(() => {
    const year = new Date().getFullYear();
    const today = new Date();
    const startOfYear = new Date(year, 0, 1);
    const dayOffset = startOfYear.getDay(); 
    
    let totalScore = 0;
    let daysCounted = 0;
    const dataPoints = [];

    const d = new Date(year, 0, 1);
    
    while (d.getFullYear() === year) {
        const diff = d.getTime() - startOfYear.getTime();
        const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
        
        const colIndex = Math.floor((dayOfYear + dayOffset - 1) / 7);
        const rowIndex = d.getDay();

        const monthName = MONTHS_LIST[d.getMonth()];
        const dayNum = d.getDate();
        const activeHabits = habits.filter(h => h.activeMonths.includes(monthName));
        const completedCount = activeHabits.filter(h => h.history[monthName]?.[dayNum]).length;
        const activeCount = activeHabits.length;
        const ratio = activeCount > 0 ? completedCount / activeCount : 0;
        
        const isToday = d.getDate() === today.getDate() && d.getMonth() === today.getMonth();
        const isFuture = d > today;

        if (d <= today && activeCount > 0) {
            totalScore += ratio;
            daysCounted++;
        }

        dataPoints.push({
            dayOfYear,
            dayNum,
            monthName,
            ratio,
            isToday,
            isFuture,
            colIndex,
            rowIndex
        });

        d.setDate(d.getDate() + 1);
    }

    const efficiency = daysCounted > 0 ? Math.round((totalScore / daysCounted) * 100) : 0;
    const endOfYear = new Date(year, 11, 31);
    const timeDiff = endOfYear.getTime() - today.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return { points: dataPoints, stats: { efficiency, daysRemaining } };
  }, [habits, time]);

  // 4. SVG Config
  const CELL_SIZE = 12;
  const GAP = 2;
  const RADIUS = 6;
  
  const width = isMobile ? 27 * (CELL_SIZE + GAP) : 53 * (CELL_SIZE + GAP);
  const height = isMobile ? 16 * (CELL_SIZE + GAP) : 7 * (CELL_SIZE + GAP);

  const getPosition = (col: number, row: number) => {
    if (!isMobile) {
        return { x: col * (CELL_SIZE + GAP), y: row * (CELL_SIZE + GAP) };
    } else {
        const isSecondHalf = col >= 27;
        const mobileCol = isSecondHalf ? col - 27 : col;
        const yOffset = isSecondHalf ? (8 * (CELL_SIZE + GAP)) : 0; 
        return { x: mobileCol * (CELL_SIZE + GAP), y: row * (CELL_SIZE + GAP) + yOffset };
    }
  };

  const getColors = (p: any) => {
    if (p.isFuture) return { fill: '#0f0f10', text: '#333', stroke: '#1a1a1a' };
    if (p.isToday) return { fill: '#ffffff', text: '#000000', stroke: '#ffffff' };
    
    if (p.ratio === 0) return { fill: '#1a1a1a', text: '#444', stroke: 'none' };
    if (p.ratio < 0.5) return { fill: '#1e3a8a', text: '#93c5fd', stroke: 'none' };
    if (p.ratio < 0.8) return { fill: '#2563eb', text: '#ffffff', stroke: 'none' };
    return { fill: '#06b6d4', text: '#000000', stroke: 'none' };
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-[#000000] text-white font-sans flex flex-col p-6 overflow-hidden select-none cursor-default">
      
      {/* --- TOP DASHBOARD --- */}
      <header className="flex-none grid grid-cols-3 items-end pb-4 border-b border-[#222] mb-4">
         
         {/* LEFT: Date */}
         <div className="flex flex-col justify-end">
            <h1 className="text-[5vw] xl:text-7xl font-black tracking-tighter leading-none text-white">
                {time.getFullYear()}
            </h1>
            <div className="text-sm font-bold text-neutral-500 uppercase tracking-widest mt-1">
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
         </div>

         {/* CENTER: Time */}
         <div className="flex flex-col items-center justify-end">
            <div className="text-[4vw] xl:text-6xl font-mono font-medium text-white tabular-nums tracking-tight leading-none">
                {time.toLocaleTimeString('en-US', { hour12: false })}
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">
                    Live System
                </span>
            </div>
         </div>

         {/* RIGHT: Stats */}
         <div className="flex flex-col items-end justify-end">
            <div className="flex items-baseline gap-1">
                <span className="text-[3vw] xl:text-5xl font-bold text-white tabular-nums leading-none">
                    {stats.daysRemaining}
                </span>
                <span className="text-xs font-bold text-neutral-500 uppercase">Days Left</span>
            </div>
            
            <div className="flex items-center gap-2 mt-2">
                <div className="h-1.5 w-16 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 transition-all duration-1000" style={{ width: `${stats.efficiency}%` }}></div>
                </div>
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                    {stats.efficiency}% Efficiency
                </div>
            </div>
         </div>
      </header>

      {/* --- LIVE GRID --- */}
      <main className="flex-1 w-full h-full flex items-center justify-center min-h-0 relative">
        <svg 
            viewBox={`0 0 ${width} ${height}`} 
            preserveAspectRatio="xMidYMid meet" 
            className="w-full h-full max-h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
            {points.map((p, i) => {
                const pos = getPosition(p.colIndex, p.rowIndex);
                const colors = getColors(p);
                
                return (
                    <g key={i}>
                        <circle 
                            cx={pos.x + RADIUS} 
                            cy={pos.y + RADIUS} 
                            r={RADIUS} 
                            fill={colors.fill}
                            stroke={colors.stroke}
                            strokeWidth={0.5}
                            className={`transition-all duration-500 ${p.isToday ? 'animate-pulse' : ''}`}
                        />
                        <text 
                            x={pos.x + RADIUS} 
                            y={pos.y + RADIUS} 
                            dy="0.35em" 
                            textAnchor="middle" 
                            fontSize={p.dayOfYear > 99 ? "4.5" : "5.5"}
                            fill={colors.text}
                            fontWeight="800"
                        >
                            {p.dayOfYear}
                        </text>
                    </g>
                );
            })}
        </svg>
      </main>

      {/* --- FOOTER --- */}
      <footer className="flex-none pt-2 flex justify-center items-center opacity-50">
         <div className="flex items-center gap-3">
            <span className="text-[9px] font-bold uppercase text-neutral-600">Off</span>
            <div className="flex gap-1">
               <div className="w-1.5 h-1.5 rounded-full bg-[#1a1a1a]" />
               <div className="w-1.5 h-1.5 rounded-full bg-[#1e3a8a]" />
               <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
               <div className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
            </div>
            <span className="text-[9px] font-bold uppercase text-neutral-600">On</span>
         </div>
      </footer>
    </div>
  );
};