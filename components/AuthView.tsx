
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
    return pass.length >= 8;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!isLogin) {
      if (!validatePassword(password)) {
        setError('Password must be at least 8 characters long.');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (!firstName.trim() || !lastName.trim() || !contact.trim()) {
        setError('Please fill in all the details.');
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
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const renderAuthForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-500 pb-2">
      {!isLogin && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                placeholder="John"
                required={!isLogin}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                placeholder="Doe"
                required={!isLogin}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="w-auto bg-white/50 border-2 border-slate-100 rounded-xl px-2 py-3 outline-none focus:border-[#76C7C0] focus:bg-white font-black text-slate-500 text-[10px] appearance-none cursor-pointer"
              >
                {COUNTRY_CODES.map((item) => (
                  <option key={`${item.name}-${item.code}`} value={item.code}>
                    {item.code}
                  </option>
                ))}
              </select>
              <input
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="flex-1 min-w-0 bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
                placeholder="Phone"
                required={!isLogin}
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
          placeholder="name@email.com"
          required
        />
      </div>

      <div className={`grid grid-cols-1 ${!isLogin ? 'md:grid-cols-2' : ''} gap-3`}>
        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        {!isLogin && (
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Repeat</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-white/50 border-2 border-slate-100 rounded-xl px-4 py-3 outline-none focus:border-[#76C7C0] focus:bg-white transition-all font-bold text-slate-900 placeholder:text-slate-200 text-sm"
              placeholder="••••••••"
              required={!isLogin}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#76C7C0] hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-slate-100 disabled:opacity-50 flex items-center justify-center gap-3 group mt-2"
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{isLogin ? 'Log In' : 'Join Now'}</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-[#FDFDFB] flex flex-col lg:flex-row overflow-hidden h-screen w-screen">
      
      {/* 1. BACKGROUND DECOR */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[60%] bg-[#76C7C0]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[100px]" />
      </div>

      {/* 2. LEFT PANEL (DESKTOP ONLY) */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0F172A] relative items-center justify-center p-12 overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-transparent to-[#76C7C0]/10" />
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg className="w-full h-full text-[#76C7C0]" fill="currentColor">
            <pattern id="auth-grid-static" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#auth-grid-static)" />
          </svg>
        </div>
        
        <div className="relative z-10 text-center max-w-md">
          <div className="w-24 h-24 bg-[#76C7C0] rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl mx-auto mb-10 shadow-[0_20px_40px_rgba(118,199,192,0.3)] animate-float">N</div>
          <h2 className="text-6xl font-black text-white italic tracking-tighter leading-none mb-6">NextYou21</h2>
          <div className="w-16 h-1.5 bg-gradient-to-r from-[#76C7C0] to-emerald-500 mx-auto mb-10 rounded-full" />
          <p className="text-2xl text-slate-400 font-medium leading-tight italic tracking-tight">
            Consistency is the foundation of growth.
          </p>
          
          <div className="mt-16 flex justify-center gap-10">
             <div className="text-center">
                <div className="text-3xl font-black text-white italic">2026</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Standard</div>
             </div>
             <div className="w-px h-10 bg-white/10" />
             <div className="text-center">
                <div className="text-3xl font-black text-[#76C7C0] italic">Safe</div>
                <div className="text-[8px] font-black uppercase tracking-widest text-slate-500 mt-1">Private</div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. FORM AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative h-full overflow-hidden">
        
        {/* Back Button */}
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 md:top-10 md:left-10 flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-all group z-20"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
          </svg>
          Exit
        </button>

        {/* Content Card - Scrollable internally if screen is tiny */}
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-2xl border border-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] animate-in fade-in zoom-in-95 duration-500 flex flex-col max-h-[90vh]">
          
          <header className="mb-8 text-center lg:text-left shrink-0">
            <div className="lg:hidden w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-6 shadow-xl">N</div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic mb-2 leading-none">
              {isLogin ? 'Log In.' : 'Join Now.'}
            </h1>
            <p className="text-lg text-slate-400 font-medium tracking-tight">
              {isLogin ? 'Welcome back.' : 'Start your plan today.'}
            </p>
          </header>

          {/* Form container with hidden scrollbar for internal overflow */}
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
            {error && (
              <div className="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-r-2xl mb-6 flex items-start gap-4 shadow-sm">
                <span className="text-lg">⚠️</span>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-tight">{error}</p>
              </div>
            )}

            {renderAuthForm()}
          </div>

          <footer className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center shrink-0">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess('');
              }}
              className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-[#76C7C0] transition-colors"
            >
              {isLogin ? "NEED AN ACCOUNT? JOIN" : "HAVE AN ACCOUNT? LOG IN"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};
