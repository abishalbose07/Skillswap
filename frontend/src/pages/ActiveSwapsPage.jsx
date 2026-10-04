import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Zap,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Trophy,
  Clock,
  BookOpen,
  User,
  Users,
  Calendar,
  Sparkles
} from 'lucide-react';

const SWAP_STATUS_CONFIG = {
  ACTIVE: {
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: Zap,
    label: 'Ongoing Collaboration',
  },
  COMPLETED: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    label: 'Completed Exchange',
  },
  CANCELLED: {
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    icon: XCircle,
    label: 'Terminated',
  },
};

function SwapStatusPill({ status }) {
  const config = SWAP_STATUS_CONFIG[status] || SWAP_STATUS_CONFIG.ACTIVE;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badge}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

function SwapCard({ swap, currentUserEmail, onComplete, onCancel, actionLoading }) {
  const isLoading = actionLoading === swap.id;
  const partner = swap.userOne?.email === currentUserEmail ? swap.userTwo : swap.userOne;
  const partnerName = partner?.fullName || partner?.name || 'Peer';

  return (
    <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] hover:border-cyan-500/30 p-6 space-y-5 transition-all duration-200 shadow-xl group">
      {/* Header: Partner & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 shrink-0">
            <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center text-white text-base font-bold font-['Plus_Jakarta_Sans']">
              {partnerName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-base font-['Plus_Jakarta_Sans']">
              {partnerName}
            </h4>
            <p className="text-xs text-slate-400">
              {partner?.college || 'Fellow Student'}
              {partner?.email ? ` • ${partner.email}` : ''}
            </p>
          </div>
        </div>

        <SwapStatusPill status={swap.status} />
      </div>

      {/* Exchanged Skills Box */}
      <div className="rounded-2xl bg-[#0b0f19] border border-white/[0.06] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Skill 1
          </span>
          <p className="text-sm font-bold text-white">{swap.skillOne?.name || '—'}</p>
          <p className="text-xs text-slate-400">{swap.skillOne?.category || 'General'}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4" />
        </div>

        <div className="flex-1 text-center sm:text-right">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Skill 2
          </span>
          <p className="text-sm font-bold text-white">{swap.skillTwo?.name || '—'}</p>
          <p className="text-xs text-slate-400">{swap.skillTwo?.category || 'General'}</p>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          Started: {swap.createdAt ? new Date(swap.createdAt).toLocaleDateString() : 'Active'}
        </span>
        {swap.completedAt && (
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Finished: {new Date(swap.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Actions */}
      {swap.status === 'ACTIVE' && (
        <div className="flex items-center gap-3 pt-3 border-t border-white/[0.04]">
          <button
            onClick={() => onComplete(swap.id)}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trophy className="w-3.5 h-3.5" />
            )}
            Mark Completed
          </button>

          <button
            onClick={() => onCancel(swap.id)}
            disabled={isLoading}
            className="py-2.5 px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.08] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <XCircle className="w-3.5 h-3.5" />
            )}
            End Swap
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActiveSwapsPage() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [filter, setFilter] = useState('ALL');

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [swapRes, meRes] = await Promise.all([
        api.get('/swaps'),
        api.get('/users/me'),
      ]);
      setSwaps(swapRes.data || []);
      setCurrentUserEmail(meRes.data.email);
    } catch (err) {
      console.error('Failed to load swaps:', err);
      setError('Unable to load active exchanges.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  const handleComplete = async (swapId) => {
    setActionLoading(swapId);
    setSuccessMsg(null);
    try {
      await api.put(`/swaps/${swapId}/complete`);
      setSuccessMsg('🎉 Awesome! Swap marked as completed. Kudos on expanding your skillset!');
      await fetchSwaps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete swap.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (swapId) => {
    if (!window.confirm('Are you sure you want to end this skill swap collaboration?')) return;
    setActionLoading(swapId);
    setSuccessMsg(null);
    try {
      await api.put(`/swaps/${swapId}/cancel`);
      setSuccessMsg('Swap collaboration has been ended.');
      await fetchSwaps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel swap.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSwaps = swaps.filter((s) => {
    if (filter === 'ALL') return true;
    return s.status === filter;
  });

  const activeCount = swaps.filter((s) => s.status === 'ACTIVE').length;
  const completedCount = swaps.filter((s) => s.status === 'COMPLETED').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#131b2e] via-[#111827] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5" />
              Active Skill Exchanges
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Ongoing Collaborations
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Track mutual learning sessions with your study partners. Mark swaps completed once both sides have learned their desired skills.
            </p>
          </div>

          <button
            onClick={fetchSwaps}
            disabled={loading}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Swaps
          </button>
        </div>
      </div>

      {/* Filter Switcher */}
      <div className="flex items-center gap-2.5 flex-wrap">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ALL'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-white/[0.05] text-slate-400 hover:text-white'
          }`}
        >
          All Exchanges ({swaps.length})
        </button>

        <button
          onClick={() => setFilter('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'ACTIVE'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-white/[0.05] text-slate-400 hover:text-white'
          }`}
        >
          Active Now ({activeCount})
        </button>

        <button
          onClick={() => setFilter('COMPLETED')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            filter === 'COMPLETED'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-white/[0.05] text-slate-400 hover:text-white'
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-in fade-in duration-150">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Swaps Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
          Loading learning collaborations...
        </div>
      ) : filteredSwaps.length === 0 ? (
        <div className="rounded-3xl bg-[#111827]/50 border border-white/[0.08] p-12 text-center space-y-3">
          <Users className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            No collaborations in this view
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When a swap request is accepted, it turns into an active collaboration right here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSwaps.map((swap) => (
            <SwapCard
              key={swap.id}
              swap={swap}
              currentUserEmail={currentUserEmail}
              onComplete={handleComplete}
              onCancel={handleCancel}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
