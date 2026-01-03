import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

type InfoTab = 'Privacy' | 'Security' | 'Infrastructure' | null;

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>(null);

  const handleUPIPayment = (amount: string, planName: string) => {
    const upiId = "kunalsinghrajput2125@okicici";
    const name = "NextYou21";
    const note = encodeURIComponent(`NextYou21 ${planName} Plan`);
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${note}`;
    window.location.href = upiLink;
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getInfoContent = () => {
    switch (activeInfoTab) {
      case 'Privacy':
        return {
          title: 'Data Privacy Protocol',
          desc: 'NextYou21 operates on a Zero-Knowledge Architecture. Your rituals, financial ledgers, and personal benchmarks are securely managed within your private session.',
          stats: ['Zero Knowledge', 'Zero Data Resale', 'GDPR Compliant']
        };
      case 'Security':
        return {
          title: 'System Security Standards',
          desc: 'Our infrastructure is hardened against external friction. Multi-factor authentication is standard for all architects.',
          stats: ['MFA Ready', 'Automated Audits', 'Isolated Storage']
        };
      case 'Infrastructure':
        return {
          title: 'Strategic Infrastructure',
          desc: 'Built on a high-velocity cloud matrix, NextYou21 ensures 99.9% uptime for your performance tracking.',
          stats: ['99.9% Uptime', 'Cloud Sync', 'Low-Latency']
        };
      default:
        return null;
    }
  };

  const info = getInfoContent();
  const commonFeatures = [
    'Daily Ritual Matrix',
    'Performance Telemetry',
    'Cloud Sync Protocol',
    'Priority Support'
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFB] selection:bg-[#76C7C0] selection:text-white overflow-x-hidden scroll-smooth text-gray-900">
      
      {/* 1. KINETIC BACKGROUND (AURORA) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-tr from-[#76C7C0]/10 via-indigo-500/5 to-rose-500/10 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[80%] h-[80%] bg-[#76C7C0]/5 rounded-full blur-[120px]" />
      </div>

      {/* 2. PREMIUM NAVIGATION */}
      <nav className="fixed top-4 md:top-6 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-6xl px-4 md:px-8 py-2 md:py-4 flex justify-between items-center backdrop-blur-2xl border border-white/50 bg-white/60 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-900 rounded-xl md:rounded-2xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-xl shadow-gray-200 animate-float">N</div>
          <span className="font-black text-xl md:text-2xl tracking-tighter text-slate-900">NextYou21</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10">
          <button onClick={() => scrollToSection('methodology')} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-indigo-600 transition-colors">Methodology</button>
          <button onClick={() => scrollToSection('architecture')} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-indigo-600 transition-colors">Architecture</button>
          <button onClick={() => scrollToSection('pricing')} className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-indigo-600 transition-colors">Pricing</button>
        </div>

        <button 
          onClick={onStart}
          className="bg-indigo-600 text-white px-4 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:scale-105 transition-all shadow-xl shadow-indigo-100 whitespace-nowrap"
        >
          Access Console
        </button>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative pt-40 md:pt-48 pb-20 md:pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Strategic Planner 2026</span>
            </div>
            
            <h1 className="text-[4rem] sm:text-[5.5rem] lg:text-[8rem] font-black tracking-tighter leading-[0.85] text-slate-900 mb-10 italic">
              Build Your <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-[#76C7C0] to-emerald-500 not-italic">
                Legacy.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-lg leading-relaxed font-medium">
              The high-fidelity command center for architects of life. Track rituals, calibrate financial performance, and manifest your elite strategic vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onStart}
                className="bg-slate-900 text-white px-10 py-6 rounded-3xl text-xl font-black shadow-2xl shadow-slate-300 hover:bg-indigo-600 hover:scale-[1.05] active:scale-95 transition-all group flex items-center justify-center gap-4"
              >
                Initialize Console
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right-12 duration-1000 delay-300 hidden md:block">
            <div className="relative p-6 rounded-[5rem] bg-gradient-to-br from-white to-slate-100 border-4 border-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop" 
                alt="Workspace" 
                className="w-full aspect-[4/5] object-cover rounded-[4rem] group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 via-transparent to-transparent" />
              
              <div className="absolute bottom-12 left-12 right-12">
                 <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl flex items-center justify-between border border-white/50 animate-float">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-[#76C7C0] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-emerald-100">⚡</div>
                      <div>
                        <div className="text-sm font-black text-slate-900 uppercase">System Sync</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Efficiency: 99.4%</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-black text-indigo-600">ACTIVE SESSION</div>
                       <div className="w-20 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                         <div className="w-5/6 h-full bg-indigo-500 animate-pulse" />
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY BENTO GRID */}
      <section id="methodology" className="py-20 md:py-40 px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-[3rem] md:text-[3.5rem] lg:text-[5rem] font-black tracking-tighter text-slate-900 mb-6 italic">
              Strategic <span className="text-indigo-600 not-italic">Methodology</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium mb-16 md:mb-24">A multi-layered execution framework for high-performance architects.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {[
              { 
                step: "01", title: "Ritual Design", color: "text-indigo-600", bg: "bg-indigo-50", 
                desc: "Identify the critical daily actions that yield the highest strategic ROI for your legacy.",
                icon: "💎"
              },
              { 
                step: "02", title: "Grid Alignment", color: "text-[#76C7C0]", bg: "bg-emerald-50", 
                desc: "Map your daily ritual ticks against weekly sprints to ensure zero tactical drift.",
                icon: "📊"
              },
              { 
                step: "03", title: "Annual Sync", color: "text-rose-500", bg: "bg-rose-50", 
                desc: "Calibrate your performance ledger against long-term vision milestones in real-time.",
                icon: "🎯"
              }
            ].map((m, i) => (
              <div key={i} className={`p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 group`}>
                <div className={`w-16 h-16 ${m.bg} ${m.color} rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:rotate-12 transition-transform`}>
                  {m.icon}
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-sm font-black ${m.color}`}>{m.step}</span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">{m.title}</h3>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. ELITE ARCHITECTURE */}
      <section id="architecture" className="py-20 md:py-40 px-8 scroll-mt-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
           <div>
              <h2 className="text-[3rem] md:text-[3.5rem] lg:text-[5rem] font-black tracking-tighter text-slate-900 mb-6 italic leading-none">
                System <span className="text-[#76C7C0] not-italic">Architecture.</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-12">
                Engineered for those who demand absolute precision. Our zero-knowledge infrastructure ensures your strategic plans remain yours alone.
              </p>
              
              <div className="space-y-8">
                {[
                  { label: "High-Fidelity Telemetry", desc: "Real-time performance tracking with sub-millisecond sync across all zones." },
                  { label: "Adaptive Neural Logic", desc: "System scales with your performance, providing deeper insights as your ledger grows." },
                  { label: "Strategic Synchrony", desc: "Coherent data alignment across annual, monthly, and daily execution grids." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-[10px] font-black shrink-0">{i+1}</div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight mb-1 uppercase">{item.label}</h4>
                      <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 blur-[100px] rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-[#111827] rounded-[4rem] p-12 border border-white/10 shadow-2xl">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { val: "99.9%", label: "Uptime Fidelity", color: "text-[#76C7C0]" },
                    { val: "256", label: "Bit Precision", color: "text-indigo-400" },
                    { val: "0", label: "Data Friction", color: "text-rose-400" },
                    { val: "Alpha", label: "Tier Protocol", color: "text-amber-400" }
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl text-center">
                       <div className={`text-3xl font-black italic mb-2 ${stat.color}`}>{stat.val}</div>
                       <div className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                   <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Validated Operational Standard 2026</p>
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. PRICING TIERS */}
      <section id="pricing" className="py-20 md:py-40 px-8 bg-slate-50/50 scroll-mt-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-24">
            <h2 className="text-[3.5rem] md:text-[4rem] lg:text-[6rem] font-black tracking-tighter text-slate-900 mb-6 italic">
              Investment in <span className="text-[#76C7C0] not-italic">Results.</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-medium">Select your synchronization tier. Performance architecture for every level of commitment.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Monthly */}
            <div className="bg-white border-2 border-slate-100 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.02)] relative group hover:border-indigo-600/30 transition-all duration-700">
              <h3 className="text-2xl font-black text-slate-900 uppercase italic mb-2">Tactical Cycle</h3>
              <p className="text-sm font-bold text-slate-400 mb-10">Monthly Sync</p>
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-6xl font-black text-slate-900 italic tracking-tighter">₹49</span>
                <span className="text-2xl font-black text-slate-200 line-through decoration-rose-400 decoration-4">₹199</span>
              </div>
              <ul className="space-y-6 mb-12">
                {commonFeatures.map((feat, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-[12px] font-black text-slate-600 uppercase tracking-widest">{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleUPIPayment("49", "Tactical Cycle")}
                className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black text-lg hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
              >
                Deploy Strategy
              </button>
            </div>

            {/* Yearly */}
            <div className="bg-[#0F172A] p-8 md:p-12 rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] relative group border border-white/5 overflow-hidden">
              <div className="absolute top-0 right-0 px-6 md:px-10 py-3 md:py-4 bg-[#76C7C0] text-slate-900 font-black text-[9px] md:text-[10px] uppercase tracking-[0.4em] rounded-bl-[1.5rem] md:rounded-bl-[2.5rem]">Strategic Alpha</div>
              <h3 className="text-2xl font-black text-white uppercase italic mb-2">Strategic Vision</h3>
              <p className="text-sm font-bold text-slate-500 mb-10">Annual Architecture Bundle</p>
              <div className="flex items-baseline gap-4 mb-10">
                <span className="text-6xl md:text-7xl font-black text-[#76C7C0] italic tracking-tighter">₹299</span>
                <span className="text-2xl font-black text-white/10 line-through decoration-[#76C7C0]/50 decoration-4">₹1999</span>
              </div>
              <ul className="space-y-6 mb-12">
                {commonFeatures.map((feat, i) => (
                  <li key={i} className="flex items-center gap-4">
                    <div className="w-5 h-5 bg-[#76C7C0]/10 rounded-full flex items-center justify-center text-[#76C7C0]">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="text-[12px] font-black text-white/80 uppercase tracking-widest">{feat}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => handleUPIPayment("299", "Strategic Vision")}
                className="w-full py-6 bg-[#76C7C0] text-slate-900 rounded-[2rem] font-black text-lg hover:scale-[1.05] transition-all shadow-2xl shadow-[#76C7C0]/20 active:scale-95"
              >
                Access Full Stack
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. MODAL SYSTEM */}
      {activeInfoTab && info && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setActiveInfoTab(null)} />
          <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 shadow-2xl animate-in zoom-in slide-in-from-bottom-8 duration-500 border border-slate-100">
             <button onClick={() => setActiveInfoTab(null)} className="absolute top-6 right-8 text-slate-400 hover:text-slate-900 text-2xl md:text-3xl font-light transition-colors">✕</button>
             <div className="mb-8 md:mb-10">
                <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] mb-2 block">System Protocol</span>
                <h3 className="text-3xl md:text-4xl font-black italic tracking-tighter text-slate-900">{info.title}</h3>
             </div>
             <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-8 md:mb-12 italic">"{info.desc}"</p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
               {info.stats.map((stat, i) => (
                 <div key={i} className="bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-2xl md:rounded-3xl flex items-center justify-center text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{stat}</span>
                 </div>
               ))}
             </div>
             <div className="mt-8 md:mt-12 pt-8 md:pt-10 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Secured</span>
                </div>
                <button onClick={() => setActiveInfoTab(null)} className="bg-slate-900 text-white px-6 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Dismiss</button>
             </div>
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="py-20 md:py-32 px-8 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center text-white text-3xl md:text-4xl font-black mb-10 animate-float">N</div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 italic tracking-tighter">Ready for Calibration?</h2>
          <p className="text-slate-400 mb-12 max-w-md font-medium text-lg">Your rituals define your legacy. Deploy your first performance protocol today.</p>
          <button 
            onClick={onStart}
            className="bg-indigo-600 text-white px-12 md:px-16 py-4 md:py-6 rounded-2xl md:rounded-3xl text-lg md:text-xl font-black hover:bg-slate-900 hover:scale-110 transition-all mb-20 shadow-2xl shadow-indigo-100"
          >
            Start Your Ledger
          </button>
          
          <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 pt-10 border-t border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 NextYou21 Protocol</p>
             <div className="flex flex-wrap justify-center gap-6 md:gap-10">
               {['Privacy', 'Security', 'Infrastructure'].map(item => (
                 <button key={item} onClick={() => setActiveInfoTab(item as InfoTab)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">{item}</button>
               ))}
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};