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
  Clock,
  CheckCircle2,
  RefreshCw,
  PlusCircle,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage({ onNavigate }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user || null);
  const [userSkills, setUserSkills] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeSwaps, setActiveSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, skillsRes, receivedRes, swapsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/me/skills').catch(() => ({ data: [] })),
        api.get('/swap-requests/received').catch(() => ({ data: [] })),
        api.get('/swaps').catch(() => ({ data: [] })),
      ]);

      setProfile(profileRes.data);
      setUserSkills(skillsRes.data || []);
      const pending = (receivedRes.data || []).filter((r) => r.status === 'PENDING');
      setPendingRequests(pending);
      const active = (swapsRes.data || []).filter((s) => s.status === 'ACTIVE');
      setActiveSwaps(active);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load dashboard details. Please refresh or verify backend status.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const teachSkills = userSkills.filter((s) => s.type === 'TEACH');
  const learnSkills = userSkills.filter((s) => s.type === 'LEARN');

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex items-center justify-center gap-3 text-slate-400">
          <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
          <span>Loading your SkillSwap dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-red-950/30 border border-red-500/30 rounded-3xl p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <span className="text-red-300 font-medium">{error}</span>
          </div>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 blur-[70px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 blur-[70px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-500/20">
              {(profile?.fullName || profile?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-bold uppercase tracking-wider mb-1">
                Student Dashboard
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                Welcome back, {profile?.fullName || profile?.name}!
              </h1>
              <p className="text-xs md:text-sm text-slate-400">
                {profile?.college ? `${profile.college} • ` : ''}
                {profile?.course ? `${profile.course} • ` : ''}
                {profile?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('matches')}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              Discover Matches
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <User className="w-4 h-4 text-cyan-400" />
              View Profile
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Requests */}
        <div
          onClick={() => onNavigate('requests')}
          className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-3 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-all">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{pendingRequests.length}</span>
            <span className="text-[11px] text-amber-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              Review <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Active Swaps */}
        <div
          onClick={() => onNavigate('swaps')}
          className="bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 space-y-3 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Swaps</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-all">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{activeSwaps.length}</span>
            <span className="text-[11px] text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Teaching Skills Count */}
        <div
          onClick={() => onNavigate('skills')}
          className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 space-y-3 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills You Teach</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-all">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{teachSkills.length}</span>
            <span className="text-[11px] text-cyan-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Learning Skills Count */}
        <div
          onClick={() => onNavigate('skills')}
          className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-5 space-y-3 transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Skills You Learn</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-all">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-100">{learnSkills.length}</span>
            <span className="text-[11px] text-indigo-400 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
              Manage <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Skills Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Teaching */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-cyan-400" />
                <h2 className="font-bold text-slate-200 text-base">Skills Offered (Teaching)</h2>
              </div>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                + Add Skill
              </button>
            </div>

            {teachSkills.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">No teaching skills added yet.</p>
                <button
                  onClick={() => onNavigate('skills')}
                  className="mt-2 text-xs text-cyan-400 font-medium hover:underline"
                >
                  Add skills you can share with peers
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {teachSkills.map((ts) => (
                  <div
                    key={ts.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-sm">
                        {ts.skill?.name || 'Skill'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {ts.proficiencyLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {ts.skill?.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Learning */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-slate-200 text-base">Skills Wanted (Learning)</h2>
              </div>
              <button
                onClick={() => onNavigate('skills')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                + Add Skill
              </button>
            </div>

            {learnSkills.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl">
                <p className="text-xs text-slate-400">No learning skills added yet.</p>
                <button
                  onClick={() => onNavigate('skills')}
                  className="mt-2 text-xs text-indigo-400 font-medium hover:underline"
                >
                  Add skills you want to learn
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {learnSkills.map((ls) => (
                  <div
                    key={ls.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 text-sm">
                        {ls.skill?.name || 'Skill'}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {ls.proficiencyLevel}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      {ls.skill?.category}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h2 className="font-bold text-slate-200 text-sm uppercase tracking-wider text-slate-400">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => onNavigate('matches')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  Find Reciprocal Matches
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
              </button>

              <button
                onClick={() => onNavigate('requests')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-amber-400" />
                  Check Swap Requests
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {pendingRequests.length}
                </span>
              </button>

              <button
                onClick={() => onNavigate('swaps')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  View Active Swaps
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {activeSwaps.length}
                </span>
              </button>

              <button
                onClick={() => onNavigate('skills')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all group cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  Add New Skill
                </span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300 transition-all" />
              </button>
            </div>
          </div>

          {/* Pending Requests Preview */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="font-bold text-slate-200 text-sm">Action Needed</h2>
              <span className="text-[11px] text-slate-400">
                {pendingRequests.length} pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-3">
                No pending requests right now.
              </p>
            ) : (
              <div className="space-y-2.5">
                {pendingRequests.slice(0, 3).map((pr) => (
                  <div
                    key={pr.id}
                    onClick={() => onNavigate('requests')}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl hover:border-amber-500/40 transition-all cursor-pointer space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">
                        {pr.sender?.fullName || pr.sender?.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Wants to swap
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">
                      Offers {pr.offeredSkill?.name} for {pr.requestedSkill?.name}
                    </p>
                  </div>
                ))}
                {pendingRequests.length > 3 && (
                  <button
                    onClick={() => onNavigate('requests')}
                    className="w-full text-center text-xs text-cyan-400 font-semibold hover:underline pt-1"
                  >
                    +{pendingRequests.length - 3} more requests
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
