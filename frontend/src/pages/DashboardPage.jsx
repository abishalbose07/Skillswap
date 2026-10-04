import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  BookOpen,
  Award,
  Inbox,
  Zap,
  User,
  Compass,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Plus
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [userSkills, setUserSkills] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, skillsRes, receivedRes, swapsRes, matchesRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/me/skills').catch(() => ({ data: [] })),
        api.get('/swap-requests/received').catch(() => ({ data: [] })),
        api.get('/swaps').catch(() => ({ data: [] })),
        api.get('/matches').catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data);
      setUserSkills(skillsRes.data || []);
      const pending = (receivedRes.data || []).filter((r) => r.status === 'PENDING');
      setPendingRequests(pending);
      const active = (swapsRes.data || []).filter((s) => s.status === 'ACTIVE');
      setActiveSwaps(active);
      setMatches(matchesRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load your dashboard. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const teachSkills = userSkills.filter((s) => s.type === 'TEACH');
  const learnSkills = userSkills.filter((s) => s.type === 'LEARN');
  const topMatches = matches.slice(0, 3);

  const studentName = profile?.fullName || profile?.name || 'Student';
  const firstName = studentName.split(' ')[0];

  // Helper for greeting based on local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="h-48 rounded-3xl bg-white/[0.02] border border-white/[0.06] animate-pulse flex items-center justify-center">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <span className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            Loading your student hub...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-rose-500/10 border border-rose-500/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
            <span className="text-rose-200 text-sm">{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.15] text-white text-xs font-semibold transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Personalized Welcome Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-950/60 via-[#131b2e] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        {/* Glow acccents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center text-white text-2xl font-black font-['Plus_Jakarta_Sans']">
                {studentName.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                  {getGreeting()}, {firstName} 👋
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                Your Learning Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-400">
                {profile?.college ? `${profile.college} ` : 'Campus Member '}
                {profile?.course ? `• ${profile.course} ` : ''}
                {profile?.yearOfStudy ? `• Year ${profile.yearOfStudy}` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('matches')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Discover Matches
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold transition-all cursor-pointer"
            >
              My Profile
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div
          onClick={() => onNavigate('requests')}
          className="rounded-2xl bg-[#111827]/70 border border-white/[0.08] hover:border-amber-500/40 p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-amber-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Pending Requests
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
              {pendingRequests.length}
            </span>
            <span className="text-xs font-semibold text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Active Swaps */}
        <div
          onClick={() => onNavigate('swaps')}
          className="rounded-2xl bg-[#111827]/70 border border-white/[0.08] hover:border-emerald-500/40 p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Swaps
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
              {activeSwaps.length}
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              View <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Teaching Skills */}
        <div
          onClick={() => onNavigate('skills')}
          className="rounded-2xl bg-[#111827]/70 border border-white/[0.08] hover:border-cyan-500/40 p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Skills You Teach
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
              {teachSkills.length}
            </span>
            <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Learning Skills */}
        <div
          onClick={() => onNavigate('skills')}
          className="rounded-2xl bg-[#111827]/70 border border-white/[0.08] hover:border-indigo-500/40 p-4 sm:p-5 space-y-3 cursor-pointer transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Skills You Learn
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-white font-['Plus_Jakarta_Sans']">
              {learnSkills.length}
            </span>
            <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Manage <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Portfolio & Recommended Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Skills Overview */}
        <div className="lg:col-span-7 space-y-6">
          {/* Skills Being Taught */}
          <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  Skills You Offer (Teaching)
                </h2>
              </div>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>

            {teachSkills.length === 0 ? (
              <div className="rounded-2xl bg-[#0b0f19] border border-dashed border-white/[0.1] p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">No teaching skills added yet.</p>
                <button
                  onClick={() => onNavigate('skills')}
                  className="text-xs font-bold text-cyan-400 hover:underline cursor-pointer"
                >
                  Add skills you can share with campus peers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teachSkills.map((ts) => (
                  <div
                    key={ts.id}
                    className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] hover:border-cyan-500/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {ts.skill?.name || 'Skill'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {ts.skill?.category || 'General'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-wider">
                      {ts.proficiencyLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Being Learned */}
          <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                  Skills You Want (Learning)
                </h2>
              </div>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Skill
              </button>
            </div>

            {learnSkills.length === 0 ? (
              <div className="rounded-2xl bg-[#0b0f19] border border-dashed border-white/[0.1] p-6 text-center space-y-2">
                <p className="text-xs text-slate-400">No learning goals set yet.</p>
                <button
                  onClick={() => onNavigate('skills')}
                  className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                >
                  Add skills you want to learn this semester
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learnSkills.map((ls) => (
                  <div
                    key={ls.id}
                    className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] hover:border-indigo-500/30 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {ls.skill?.name || 'Skill'}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {ls.skill?.category || 'General'}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
                      {ls.proficiencyLevel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recommended Matches & Pending Previews */}
        <div className="lg:col-span-5 space-y-6">
          {/* Top Recommended Matches */}
          <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                  Top Matches For You
                </h3>
              </div>
              <button
                onClick={() => onNavigate('matches')}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-0.5 cursor-pointer"
              >
                See All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {topMatches.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                Add skills to your profile to discover reciprocal matches!
              </p>
            ) : (
              <div className="space-y-3">
                {topMatches.map((m) => (
                  <div
                    key={m.user.id}
                    onClick={() => onNavigate('matches')}
                    className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] hover:border-indigo-500/30 transition-all cursor-pointer group flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {(m.user.fullName || m.user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                          {m.user.fullName || m.user.name}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {m.user.college || 'Peer Student'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-xs font-extrabold text-emerald-400 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        {m.compatibilityScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Request Preview Box */}
          {pendingRequests.length > 0 && (
            <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Inbox className="w-4 h-4 text-amber-400" />
                  {pendingRequests.length} Pending Swap Request{pendingRequests.length > 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => onNavigate('requests')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-0.5 cursor-pointer"
                >
                  Review Now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-amber-200/80">
                Fellow students are requesting a skill swap. Check offered skills and accept or decline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
