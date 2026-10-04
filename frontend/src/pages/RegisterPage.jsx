import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  BookOpen,
  Code2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  GraduationCap
} from 'lucide-react';

export default function RegisterPage({ onSuccess, onSwitchToLogin }) {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skillsOffered: '',
    skillsNeeded: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in your name, email, and password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await register(formData);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Join the campus peer exchange
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
          Build your SkillSwap profile
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Share what you know, discover what others are teaching, and connect directly with student peers.
        </p>
      </div>

      <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-xl border border-white/[0.1] p-6 sm:p-8 shadow-2xl space-y-6 relative">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section: Basic Identity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Maya Lin"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="maya@college.edu"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a secure password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
              Bio & Focus Area
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              placeholder="Computer Science sophomore passionate about web development, UI design, and algorithms."
              className="w-full px-4 py-3 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            />
          </div>

          {/* Initial Skills Setup */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Skill Starter (Comma separated)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-cyan-400 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" />
                  Skills You Teach
                </label>
                <input
                  type="text"
                  name="skillsOffered"
                  value={formData.skillsOffered}
                  onChange={handleChange}
                  placeholder="Python, React, Data Structures"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-indigo-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Skills You Want to Learn
                </label>
                <input
                  type="text"
                  name="skillsNeeded"
                  value={formData.skillsNeeded}
                  onChange={handleChange}
                  placeholder="Figma, Machine Learning, Public Speaking"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
                Setting up your account...
              </span>
            ) : (
              <>
                Create SkillSwap Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-white/[0.08] pt-4 text-center">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors cursor-pointer"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
