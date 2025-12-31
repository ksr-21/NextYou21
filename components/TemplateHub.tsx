
import React from 'react';
import { HABIT_TEMPLATES } from '../constants';
import { HabitTemplate } from '../types';

interface TemplateHubProps {
  onApply: (template: HabitTemplate) => void;
}

export const TemplateHub: React.FC<TemplateHubProps> = ({ onApply }) => {
  return (
    <div className="mt-20">
      <div className="flex items-center gap-4 mb-10">
        <span className="w-12 h-1 bg-indigo-500 rounded-full" />
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Protocol Blueprints</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {HABIT_TEMPLATES.map((tpl) => (
          <div 
            key={tpl.id} 
            className="group glass relative p-10 rounded-[4rem] border-2 border-white premium-shadow hover:scale-[1.02] transition-all duration-700 overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${tpl.color} opacity-[0.03] rounded-full blur-3xl transform group-hover:scale-150 transition-transform duration-1000`} />
            
            <div className="flex items-start justify-between mb-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${tpl.color} rounded-[2rem] flex items-center justify-center text-4xl text-white shadow-xl shadow-indigo-100 transform group-hover:rotate-12 transition-transform duration-700`}>
                  {tpl.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{tpl.title}</h3>
                  <p className="text-sm font-medium text-gray-400 max-w-[200px] leading-snug">{tpl.description}</p>
                </div>
              </div>
              <button 
                onClick={() => onApply(tpl)}
                className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all transform active:scale-95 shadow-xl"
              >
                Install Protocol
              </button>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10">
              {tpl.rituals.map((r, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl flex items-center gap-2 group-hover:bg-white transition-colors">
                  <span className="text-lg">{r.emoji}</span>
                  <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{r.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
