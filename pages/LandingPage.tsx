
import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-[100px] -z-10" />

      {/* Hero Section */}
      <section className="max-w-[1400px] mx-auto px-8 pt-32 lg:pt-52 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div className="relative z-10 animate-in fade-in slide-in-from-left-12 duration-1000">
          <div className="inline-flex items-center gap-3 bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.4em] mb-12 border border-indigo-100 shadow-xl shadow-indigo-100/20">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
            </span>
            Neural Protocol Active
          </div>
          
          <h1 className="text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-12">
            Design <br/> Your <span className="text-gradient">Self.</span>
          </h1>
          
          <p className="text-2xl text-gray-500 mb-14 max-w-xl leading-relaxed font-medium">
            Habitos is the premium command center for creators who build with discipline. Calibrate your biological clock with smart data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-8">
            <button 
              onClick={onStart}
              className="bg-gray-900 text-white px-12 py-6 rounded-[2.5rem] text-2xl font-black shadow-3xl shadow-indigo-200 hover:scale-[1.05] hover:bg-black transition-all active:scale-95 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center gap-3">
                Command Center
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </span>
            </button>
            <button className="bg-white border-4 border-gray-100 px-12 py-6 rounded-[2.5rem] text-2xl font-black hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95">
              Protocol ⭐
            </button>
          </div>
          
          <div className="mt-20 flex items-center gap-6">
             <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg">
                    <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="user" />
                  </div>
                ))}
             </div>
             <div>
               <p className="text-lg font-black text-gray-900 tracking-tight">25k+ Visionaries</p>
               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Optimizing Daily</p>
             </div>
          </div>
        </div>

        <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300">
           <div className="relative glass p-6 rounded-[5rem] shadow-4xl transform rotate-3 hover:rotate-0 transition-all duration-1000 border-4 border-white animate-float">
             <img 
               src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2120&auto=format&fit=crop" 
               alt="Focus" 
               className="w-full aspect-[4/5] object-cover rounded-[4rem] shadow-2xl brightness-90 contrast-125"
             />
             
             {/* Abstract UI Mockups Floating Over Image */}
             <div className="absolute -bottom-12 -left-12 glass p-10 rounded-[3.5rem] shadow-3xl border-2 border-emerald-100 hidden xl:block animate-bounce-slow">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-emerald-500 text-white rounded-[1.8rem] flex items-center justify-center text-4xl shadow-xl shadow-emerald-200">✨</div>
                  <div>
                    <div className="text-2xl font-black text-gray-900 tracking-tight">Aligned</div>
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Ritual Sync: 100%</div>
                  </div>
                </div>
             </div>

             <div className="absolute top-12 -right-16 glass p-8 rounded-[3rem] shadow-3xl border-2 border-indigo-100 hidden xl:block animate-float delay-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl">🔥</div>
                  <div>
                    <div className="text-xl font-black">14d</div>
                    <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Active Streak</div>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="bg-white/50 backdrop-blur-3xl py-40 border-y border-white/40">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {[
              { title: "Neuro-Patterns", icon: "🧠", desc: "Our system identifies your peak cognitive windows and surfaces the right habits at the right time.", color: "bg-sky-50 text-sky-600" },
              { title: "Visual Velocity", icon: "🚀", desc: "Ditch boring lists. See your life through high-fidelity mosaics and performance heatmaps.", color: "bg-orange-50 text-orange-600" },
              { title: "Gemini Engine", icon: "💎", desc: "Integrated intelligence that studies your friction points and suggests biological nudges.", color: "bg-purple-50 text-purple-600" }
            ].map((f, i) => (
              <div key={i} className="group p-12 rounded-[4rem] hover:bg-white hover:shadow-2xl transition-all duration-700 cursor-default">
                <div className={`w-24 h-24 ${f.color} rounded-[2.5rem] flex items-center justify-center text-5xl mb-10 group-hover:rotate-12 transition-transform shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tighter">{f.title}</h3>
                <p className="text-xl text-gray-400 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
