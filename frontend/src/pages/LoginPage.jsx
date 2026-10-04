import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Users,
  Repeat,
  Zap,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

export default function LoginPage({ onSuccess, onSwitchToRegister }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero / Product Value Proposition */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Learn faster. Teach what you love.
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-['Plus_Jakarta_Sans']">
            Master skills through{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400">
              direct student exchange
            </span>
          </h1>

          <p className="text-slate-300 text-base leading-relaxed">
            Forget expensive tutors and generic video courses. SkillSwap pairs you with fellow campus students to swap knowledge 1-on-1: teach Python, learn UI design, level up together.
          </p>

          {/* Social Proof & Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <Repeat className="w-5 h-5 text-cyan-400 mb-1.5" />
              <p className="text-xs font-bold text-white">100% Reciprocal</p>
              <p className="text-[11px] text-slate-400">Pure knowledge trade, zero tuition</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <Users className="w-5 h-5 text-indigo-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Peer Network</p>
              <p className="text-[11px] text-slate-400">Verified students across colleges</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <Zap className="w-5 h-5 text-emerald-400 mb-1.5" />
              <p className="text-xs font-bold text-white">Smart Matching</p>
              <p className="text-[11px] text-slate-400">Instant reciprocal match scores</p>
            </div>
          </div>
        </div>

        {/* Right Authentication Form Card */}
        <div className="lg:col-span-6 max-w-md w-full mx-auto">
          <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-white/[0.1] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            {/* Subtle card glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[50px] pointer-events-none" />

            <div className="space-y-1 relative z-10">
              <h2 className="text-2xl font-bold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Welcome back
              </h2>
              <p className="text-xs text-slate-400">
                Sign in to your SkillSwap account to manage swaps and matches.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@university.edu"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-indigo-400" />
                    Password
                  </label>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In to SkillSwap
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-white/[0.08] pt-4 text-center">
              <p className="text-xs text-slate-400">
                New to SkillSwap?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
