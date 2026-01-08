
import React, { useState } from 'react';

interface LandingPageProps {
  onStart: () => void;
}

type InfoTab = 'Privacy' | 'Security' | 'How it works' | null;

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTab>(null);

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
          title: 'Privacy First',
          desc: 'Your data is yours. We use a private architecture where your routines and financial details stay within your secure account. We never sell your information.',
          stats: ['Private Data', 'Secure Cloud', 'No Ads']
        };
      case 'Security':
        return {
          title: 'Safe & Secure',
          desc: 'We use bank-level encryption to keep your account safe. Your passwords and data are protected by modern security standards.',
          stats: ['Encrypted', 'Secure Login', 'Safe Sync']
        };
      case 'How it works':
        return {
          title: 'Easy to Use',
          desc: 'Built for speed and clarity. Track your daily habits and manage your money in a simple, beautiful interface designed for 2026.',
          stats: ['Fast Load', 'Simple UI', 'Always Ready']
        };
      default:
        return null;
    }
  };

  const info = getInfoContent();

  return (
    <div className="min-h-screen bg-[#FDFDFB] selection:bg-[#76C7C0] selection:text-white overflow-x-hidden scroll-smooth font-['Plus_Jakarta_Sans']">
      
      {/* 1. NAVIGATION */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] w-[94%] max-w-6xl px-6 md:px-10 py-4 flex justify-between items-center backdrop-blur-2xl border border-white/40 bg-white/70 rounded-full shadow-[0_15px_50px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-[#111] rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl">N</div>
          <span className="font-black text-2xl tracking-tighter text-[#111] italic">NextYou21</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-10">
          <button onClick={() => scrollToSection('routine')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#76C7C0] transition-colors italic">Daily Routine</button>
          <button onClick={() => scrollToSection('finance')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#76C7C0] transition-colors italic">Finance Tracking</button>
          <button onClick={() => scrollToSection('pricing')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-[#76C7C0] transition-colors italic">Pricing</button>
        </div>

        <button 
          onClick={onStart}
          className="bg-[#111827] text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#76C7C0] transition-all shadow-xl shadow-slate-200"
        >
          Get Started
        </button>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative pt-40 md:pt-60 pb-20 md:pb-40 px-6 md:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-left-12 duration-1000">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-[#F0F9FF] border border-blue-100 rounded-full mb-10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#76C7C0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#76C7C0]"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">Built for 2026</span>
            </div>
            
            <h1 className="text-[4rem] sm:text-[6rem] md:text-[8.5rem] font-black tracking-tighter leading-[0.85] text-[#111] mb-12 italic">
              Life <br/> 
              <span className="text-[#76C7C0] not-italic underline decoration-[10px] md:decoration-[20px] decoration-slate-100 underline-offset-[10px]">Architecture.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-14 max-w-xl leading-relaxed font-medium italic tracking-tight">
              A simple, powerful command center for your life goals. Master your <span className="text-slate-900 font-black not-italic">daily routine</span> and take command of your <span className="text-slate-900 font-black not-italic">finance tracking</span> with ease.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onStart}
                className="bg-[#111827] text-white px-12 py-6 rounded-3xl text-xl font-black shadow-2xl hover:bg-[#76C7C0] transition-all group flex items-center justify-center gap-4 active:scale-95"
              >
                Create Account
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
             <div className="relative rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-[0_50px_120px_-20px_rgba(0,0,0,0.15)] border-8 border-white bg-white">
                <img src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072" className="w-full aspect-[4/5] object-cover grayscale opacity-90" alt="Routine Tracking" />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                
                <div className="absolute bottom-10 left-8 right-8 bg-[#111827]/90 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 shadow-2xl flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#76C7C0] rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14H11V21L20 10H13Z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em] italic">System Status</h4>
                      <p className="text-[12px] font-black text-[#76C7C0] uppercase tracking-widest mt-1">Live & Active</p>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 3. DAILY ROUTINE SECTION */}
      <section id="routine" className="py-24 md:py-48 px-6 md:px-8 bg-white text-slate-900 border-t border-slate-50">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <StatLabel>Master Your Day</StatLabel>
          <h2 className="text-[3.5rem] md:text-[7.5rem] font-black tracking-tighter text-[#111] italic leading-none">
            Routine <span className="text-[#76C7C0] not-italic">Tracking.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { id: 'STEP 1', title: 'Daily Habits', icon: '💎', desc: 'Identify the simple daily habits that make the biggest difference in your life.' },
            { id: 'STEP 2', title: 'Stay Focused', icon: '📊', desc: 'Monitor your progress daily and weekly to stay on track with your goals.' },
            { id: 'STEP 3', title: 'See Progress', icon: '🎯', desc: 'Watch your streaks grow as you build a life of consistency and results.' }
          ].map((item) => (
            <div key={item.id} className="bg-slate-50/50 p-12 rounded-[3.5rem] border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-700">
              <div className={`w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-3xl mb-12 transform group-hover:rotate-12 transition-transform`}>
                {item.icon}
              </div>
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-[#76C7C0] font-black text-[11px] tracking-[0.4em] uppercase">{item.id}</span>
                <h3 className="text-2xl font-black text-[#111] tracking-tight uppercase italic">{item.title}</h3>
              </div>
              <p className="text-base text-slate-400 font-medium leading-relaxed italic">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FINANCE SECTION */}
      <section id="finance" className="py-24 md:py-48 px-6 md:px-8 bg-[#111827] text-white overflow-hidden relative border-y border-white/5">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#76C7C0]/10 rounded-full blur-[150px] pointer-events-none" />
         
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            {/* Mockup */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-[#1F2937] rounded-[4rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#76C7C0]/20 rounded-bl-full blur-2xl" />
                  
                  <div className="bg-[#111827] p-8 rounded-[2.5rem] mb-6 border border-white/5 shadow-inner">
                      <div className="flex justify-between items-center mb-6">
                         <div className="text-[10px] font-black uppercase text-[#76C7C0] tracking-[0.4em] italic">Net Balance</div>
                         <div className="w-2 h-2 rounded-full bg-[#76C7C0] animate-pulse"></div>
                      </div>
                      <div className="text-5xl md:text-7xl font-black italic tracking-tighter text-white mb-2">₹12.4L</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">+18% This Month</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                      <div className="bg-[#111827] p-6 rounded-[2rem] border border-white/5">
                          <div className="text-[9px] font-black uppercase text-rose-400 tracking-[0.3em] mb-4 italic">Expenses</div>
                          <div className="w-full h-1.5 bg-white/5 rounded-full mb-4 overflow-hidden">
                              <div className="h-full bg-rose-500 w-[65%]" />
                          </div>
                          <div className="text-xl font-black text-white italic tracking-tighter">₹45k<span className="text-[10px] text-slate-500 not-italic ml-1">/mo</span></div>
                      </div>
                      <div className="bg-[#111827] p-6 rounded-[2rem] border border-white/5 flex flex-col justify-between">
                          <div className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.3em] mb-2 italic">Invested</div>
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full border-2 border-[#76C7C0] flex items-center justify-center text-[10px] font-black text-[#76C7C0]">80%</div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-tight">Savings<br/>Goal</div>
                          </div>
                      </div>
                  </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <StatLabel>Your Money</StatLabel>
              <h2 className="text-[3.5rem] md:text-[6.5rem] font-black tracking-tighter text-white leading-[0.85] mb-12 italic">
                Finance <br/>
                <span className="text-[#76C7C0] not-italic underline decoration-[10px] md:decoration-[20px] decoration-white/5 underline-offset-[10px]">Tracking.</span>
              </h2>
              
              <p className="text-xl text-slate-400 mb-12 leading-relaxed font-medium max-w-xl mx-auto lg:mx-0 italic tracking-tight">
                 Simple tracking for your money. Manage debt, monitor investments, and track monthly spending in one beautiful place.
              </p>

              <div className="space-y-6 mb-14 text-left max-w-md mx-auto lg:mx-0">
                 {[
                   { label: 'Money Matrix', desc: 'Track what you owe and what you are owed.' },
                   { label: 'Investment Hub', desc: 'Watch your savings and investments grow.' },
                   { label: 'Loan Tracker', desc: 'Simple progress bars for your loan repayments.' }
                 ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                        <div className="w-8 h-8 rounded-xl bg-[#76C7C0]/10 text-[#76C7C0] flex items-center justify-center text-xs font-black shrink-0">✓</div>
                        <div>
                            <div className="text-[12px] font-black text-white uppercase tracking-widest italic">{item.label}</div>
                            <div className="text-xs text-slate-500 font-medium mt-1">{item.desc}</div>
                        </div>
                    </div>
                 ))}
              </div>

              <button 
                onClick={onStart}
                className="bg-white text-[#111] px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-[0.4em] hover:bg-[#76C7C0] hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.05)] active:scale-95"
              >
                Start Tracking
              </button>
            </div>
         </div>
      </section>

      {/* 5. PRICING */}
      <section id="pricing" className="py-24 md:py-48 px-6 md:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <StatLabel>Pricing Plans</StatLabel>
          <h2 className="text-[3.5rem] md:text-[8rem] font-black tracking-tighter text-[#111] italic leading-none">
            Choose <span className="text-slate-200">Your</span> <span className="text-[#76C7C0] not-italic">Plan.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Monthly */}
          <div className="bg-[#F8FAFC] p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group">
            <div>
              <h3 className="text-3xl font-black italic text-[#111] mb-2 uppercase tracking-tighter">Monthly</h3>
              <p className="text-[#76C7C0] text-[11px] font-black uppercase tracking-[0.4em] mb-12 italic">30 Days Access</p>
              
              <div className="flex items-baseline gap-3 mb-12">
                <span className="text-7xl font-black text-[#111] tracking-tighter italic">₹49</span>
                <span className="text-xl text-slate-300 font-black uppercase tracking-widest italic">/mo</span>
              </div>
              
              <ul className="space-y-6 mb-16">
                {['Daily Routine Tracking', 'Finance Tracking', 'Cloud Sync', 'Simple UI'].map((f) => (
                  <li key={f} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-500 italic">
                    <span className="text-[#76C7C0]">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={onStart} className="w-full py-6 bg-[#111] text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-[#76C7C0] transition-all shadow-xl active:scale-95">Get Started</button>
          </div>

          {/* Yearly */}
          <div className="bg-[#111827] p-12 md:p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden transform lg:-translate-y-12">
            <div className="absolute top-0 right-0 px-8 py-3 bg-[#76C7C0] text-[#111] font-black text-[10px] uppercase tracking-[0.4em] rounded-bl-3xl italic">Best Value</div>
            
            <div className="flex flex-col h-full justify-between">
              <div>
                <h3 className="text-3xl font-black italic mb-2 uppercase tracking-tighter">Yearly</h3>
                <p className="text-slate-500 text-[11px] font-black uppercase tracking-[0.4em] mb-12 italic">Full Year Access</p>
                
                <div className="flex items-baseline gap-3 mb-12">
                  <span className="text-7xl font-black text-[#76C7C0] tracking-tighter italic">₹299</span>
                  <span className="text-xl text-slate-600 font-black uppercase tracking-widest italic">/yr</span>
                </div>
                
                <ul className="space-y-6 mb-16">
                  {['Unlimited Habits', 'Full Finance Master', 'Annual Goals', 'Priority Sync'].map((f) => (
                    <li key={f} className="flex items-center gap-4 text-[11px] font-black uppercase tracking-widest text-slate-400 italic">
                      <span className="text-[#76C7C0]">✓</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={onStart} className="w-full py-6 bg-[#76C7C0] text-black rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all shadow-2xl active:scale-95">Buy Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION */}
      <section className="py-32 md:py-60 px-6 md:px-8 text-center max-w-5xl mx-auto">
        <div className="w-16 h-16 bg-[#111] rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-16 shadow-2xl animate-float">N</div>
        <h2 className="text-[4rem] md:text-[8.5rem] font-black tracking-tighter text-[#111] italic leading-[0.85] mb-12">
          Start Your <br/> <span className="text-[#76C7C0] not-italic">Journey.</span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-400 font-medium mb-16 max-w-2xl mx-auto italic tracking-tight">
          How you spend your days is how you spend your life. Start tracking your routine and finances today.
        </p>
        <button 
          onClick={onStart}
          className="w-full sm:w-auto bg-[#111827] text-white px-16 py-7 rounded-3xl text-2xl font-black shadow-[0_30px_70px_-10px_rgba(0,0,0,0.3)] hover:bg-[#76C7C0] transition-all hover:scale-105 active:scale-95"
        >
          Get Started Now
        </button>
      </section>

      {/* 7. MODALS */}
      {activeInfoTab && info && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#FDFDFB]/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={() => setActiveInfoTab(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-[4rem] p-12 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-slate-100 animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
            
            <div className="flex flex-wrap justify-center gap-4 mb-14">
              {['Privacy', 'Security', 'How it works'].map((tab) => (
                <button
                  key={tab}
                  onClick={(e) => { e.stopPropagation(); setActiveInfoTab(tab as InfoTab); }}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all
                    ${activeInfoTab === tab ? 'bg-[#111] text-white shadow-2xl scale-105' : 'bg-slate-50 border border-slate-100 text-slate-300 hover:text-[#76C7C0]'}
                  `}
                >
                  {tab}
                </button>
              ))}
            </div>

            <h3 className="text-4xl md:text-6xl font-black italic text-slate-900 tracking-tighter mb-10 leading-none uppercase">
              {info.title}
            </h3>
            
            <p className="text-lg md:text-xl text-slate-400 font-medium leading-relaxed mb-14 italic tracking-tight">
              {info.desc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
              {info.stats.map(s => (
                <div key={s} className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-400 italic">
                  {s}
                </div>
              ))}
            </div>

            <button onClick={() => setActiveInfoTab(null)} className="mt-16 text-[11px] font-black text-slate-300 uppercase tracking-[0.4em] hover:text-[#111] transition-colors italic">Close</button>
          </div>
        </div>
      )}

      {/* 8. FOOTER */}
      <footer className="py-20 px-10 bg-white border-t border-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-2">
            <p className="text-[11px] font-black uppercase tracking-[0.6em] text-slate-900 italic">NextYou21</p>
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Built for a better life in 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-10">
            {['Privacy', 'Security', 'How it works'].map(t => (
              <button key={t} onClick={() => setActiveInfoTab(t as InfoTab)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#76C7C0] transition-colors italic">{t}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

const StatLabel = ({ children }: { children?: React.ReactNode }) => (
  <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[#76C7C0] mb-4 block italic">{children}</span>
);
