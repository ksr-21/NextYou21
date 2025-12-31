
import React from 'react';
import { HabitMode } from '../types';

interface ModeSelectorProps {
  currentMode: HabitMode;
  onModeChange: (mode: HabitMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
  const modes: { label: HabitMode; icon: string; desc: string }[] = [
    { label: 'All', icon: '🌈', desc: 'View everything' },
    { label: 'Focus', icon: '🎯', desc: 'Top 3 habits' },
    { label: 'Low Energy', icon: '⚡', desc: 'Easy wins only' },
    { label: 'Growth', icon: '🌱', desc: 'Challenge mode' },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {modes.map((mode) => (
        <button
          key={mode.label}
          onClick={() => onModeChange(mode.label)}
          className={`flex-1 min-w-[120px] p-3 rounded-2xl border transition-all duration-200 text-left group ${
            currentMode === mode.label
              ? 'bg-[#4CAF50] border-[#4CAF50] text-white shadow-lg shadow-green-100 translate-y-[-2px]'
              : 'bg-white border-transparent text-gray-600 hover:bg-gray-50'
          }`}
        >
          <div className="text-xl mb-1">{mode.icon}</div>
          <div className="font-semibold text-sm">{mode.label}</div>
          <div className={`text-[10px] ${currentMode === mode.label ? 'text-green-50' : 'text-gray-400'}`}>
            {mode.desc}
          </div>
        </button>
      ))}
    </div>
  );
};
