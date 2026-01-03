import React, { useState } from 'react';
import { auth, db } from '../services/firebase.ts';

interface AuthViewProps {
  onSuccess: () => void;
  onBack: () => void;
}

const COUNTRY_CODES = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'United States' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+92', name: 'Pakistan' },
  { code: '+971', name: 'UAE' },
  { code: '+1', name: 'Canada' },
  { code: '+61', name: 'Australia' },
];

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onBack }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [contact, setContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isLogin) {
      if (!validatePassword(password)) {
        setError('Security Protocol: Password requires 8+ chars, Uppercase, Lowercase, Number, and Special Char.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Verification Error: Passwords do not match.');
        setLoading(false);
        return;
      }
      if (!firstName.trim() || !lastName.trim() || !contact.trim()) {
        setError('Identification Error: All fields required.');
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        await auth.signInWithEmailAndPassword(email, password);
      } else {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        if (user) {
          const fullName = `${firstName.trim()} ${lastName.trim()}`;
          await user.updateProfile({ displayName: fullName });
          const fullContact = `${countryCode} ${contact.trim()}`;
          
          await db.collection('users').doc(user.uid).set({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            fullName,
            contact: fullContact,
            email,
            isPaid: false,
            createdAt: new Date().toISOString(),
            habits: [],
            monthlyGoals: [],
            annualCategories: [],
            config: {
              year: '2026',
              showVisionBoard: true,
              activeMonths: ['January'],
            },
            weeklyGoals: []
          });
        }
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Access Denied: Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      {!isLogin && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
                placeholder="Ex: Marcus"
                required={!isLogin}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
                placeholder="Ex: Aurelius"
                required={!isLogin}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Contact</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-full sm:w-auto sm:max-w-[140px] bg-white/50 border-2 border-slate-100 rounded-2xl px-4 py-4 outline-none focus:border-indigo-500 focus:bg-white font-black text-slate-500 text-xs appearance-none cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={`${item.name}-${item.code}`} value={item.code}>
                    {item.code} ({item.name})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="flex-1 min-w-0 bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
                placeholder="Mobile Matrix"
                required={!isLogin}
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
          placeholder="architect@nexus.io"
          required
        />
      </div>

      <div className={`grid grid-cols-1 ${!isLogin ? 'md:grid-cols-2' : ''} gap-4`}>
        <div className="space-y-2 relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
            placeholder="••••••••"
            required
          />
        </div>
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verify Key</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200"
              placeholder="••••••••"
              required={!isLogin}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.3em] text-[11px] hover:bg-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-4 group mt-4"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{isLogin ? 'INITIATE SESSION' : 'DEPLOY PROTOCOL'}</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFB] flex flex-col lg:flex-row relative overflow-hidden">
      
      {/* 1. KINETIC BACKGROUND (AURORA) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-tr from-[#76C7C0]/15 via-indigo-500/10 to-rose-500/15 blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[80%] h-[80%] bg-[#76C7C0]/10 rounded-full blur-[120px]" />
      </div>

      {/* 2. LEFT BRANDING PANEL (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-transparent to-[#76C7C0]/20" />
        
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="w-full h-full text-indigo-500" fill="currentColor" viewBox="0 0 100 100">
            <pattern id="auth-grid-vibrant" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#auth-grid-vibrant)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center max-w-xl">
          <div className="w-32 h-32 bg-[#76C7C0] rounded-[3rem] flex items-center justify-center text-white font-black text-7xl mx-auto mb-16 shadow-[0_30px_60px_rgba(118,199,192,0.4)] animate-float">N</div>
          <h2 className="text-8xl font-black text-white italic tracking-tighter leading-none mb-10">NextYou21</h2>
          <div className="w-24 h-2 bg-gradient-to-r from-indigo-500 via-[#76C7C0] to-emerald-500 mx-auto mb-16 rounded-full shadow-[0_0_30px_rgba(118,199,192,0.6)]" />
          <p className="text-4xl text-slate-400 font-medium leading-relaxed italic tracking-tight">
            "Identity is the root of performance architecture."
          </p>
          
          <div className="mt-20 flex justify-center gap-12">
             <div className="text-center">
                <div className="text-4xl font-black text-white italic">2026</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Architecture v2</div>
             </div>
             <div className="w-px h-16 bg-white/10" />
             <div className="text-center">
                <div className="text-4xl font-black text-[#76C7C0] italic">Elite</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">System Tier</div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. FORM CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative">
        <button 
          onClick={onBack}
          className="absolute top-10 left-10 flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-slate-900 transition-all group z-20"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Exit Protocol
        </button>

        <div className="w-full max-w-xl bg-white/70 backdrop-blur-3xl border border-white p-10 md:p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-700 relative overflow-hidden">
          {/* Subtle Decorative Gradient Blobs in Form */}
          <div className="absolute top-[-5%] right-[-5%] w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-[-5%] left-[-5%] w-40 h-40 bg-[#76C7C0]/5 rounded-full blur-3xl -z-10" />
          
          <header className="mb-12 text-center lg:text-left">
            <div className="lg:hidden w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-3xl mx-auto mb-8 shadow-2xl shadow-slate-200">N</div>
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic mb-4 leading-none">
              {isLogin ? 'Initialize.' : 'Deploy Identity.'}
            </h1>
            <p className="text-xl text-slate-400 font-medium tracking-tight">
              {isLogin ? 'Resume your performance synchrony.' : 'Architect your private ritual ledger.'}
            </p>
          </header>

          {error && (
            <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-r-3xl mb-10 flex items-start gap-5 animate-shake shadow-lg shadow-rose-100">
              <span className="text-2xl">⚠️</span>
              <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-3xl mb-10 flex items-start gap-5 animate-in fade-in duration-300 shadow-lg shadow-emerald-100">
              <span className="text-2xl">✅</span>
              <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest leading-relaxed">{success}</p>
            </div>
          )}

          {renderAuthForm()}

          <footer className="mt-12 pt-10 border-t border-slate-100 flex flex-col items-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-indigo-600 transition-colors"
            >
              {isLogin ? "INITIALIZE NEW PROFILE?" : "ALREADY AUTHENTICATED?"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};