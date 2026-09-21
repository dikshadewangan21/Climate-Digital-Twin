import React, { useState } from 'react';
import { 
  LogIn, 
  UserPlus, 
  LogOut,
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  AlertCircle,
  User,
  Key
} from 'lucide-react';

export const AuthPage = ({ setActiveTab, user, setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    const authPayload = {
      email,
      name: email.split('@')[0],
      role: 'Registered Member',
      token: `ct_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      loginTime: new Date().toISOString(),
    };

    try {
      localStorage.setItem('climatetwin_auth', JSON.stringify(authPayload));
      if (setUser) setUser(authPayload);
      setSuccessMsg(isLogin ? 'Successfully signed in.' : 'Account created successfully.');
    } catch (err) {
      console.warn('LocalStorage unavailable:', err);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('climatetwin_auth');
      if (setUser) setUser(null);
      setEmail('');
      setPassword('');
      setSuccessMsg('');
    } catch (err) {
      console.warn('LocalStorage cleanup error:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6 animate-in fade-in duration-300">
      
      {/* Notice regarding open public access */}
      <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-2">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Open Public Climate Service</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          ClimateTwin AI is an open weather and climate service. All 33 Chhattisgarh districts, current weather observations, and daily forecasts are freely accessible without requiring an account.
        </p>
      </div>

      {/* Auth Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              {user ? <ShieldCheck className="w-5 h-5" /> : (isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />)}
            </div>
            <h1 className="text-xl font-black text-white font-heading">
              {user ? 'Signed In' : (isLogin ? 'Sign In to ClimateTwin AI' : 'Create Free Account')}
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            {user 
              ? 'Your active member session and preferences.'
              : (isLogin 
                ? 'Sign in to save your favorite districts and personalized views.' 
                : 'Create an account to save favorite districts and preferences.')}
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {user ? (
          <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-white font-heading truncate">{user.name || 'Member'}</div>
                <div className="text-xs text-slate-400 truncate">{user.email}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Account Type:</span>
                <span className="text-cyan-400 font-semibold">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coverage:</span>
                <span className="text-emerald-400">All 33 Districts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Status:</span>
                <span className="text-emerald-400 font-semibold">Active</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Go to Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@climatetwin.ai"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider uppercase rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}

        {!user && (
          <div className="pt-4 border-t border-slate-800 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
            >
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Sign In"}
            </button>
          </div>
        )}
      </div>

    </div>
  );
};

export default AuthPage;
