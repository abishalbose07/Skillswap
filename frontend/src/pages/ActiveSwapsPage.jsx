import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Zap, CheckCircle2, XCircle, RefreshCw, ArrowRight,
  Trophy, Clock, BookOpen, User
} from 'lucide-react';

const STATUS_STYLES = {
  ACTIVE:    { bg: 'bg-cyan-500/10',    text: 'text-cyan-400',    border: 'border-cyan-500/30',    label: 'Active'    },
  COMPLETED: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: 'Completed' },
  CANCELLED: { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/30',   label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.ACTIVE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${s.bg} ${s.text} ${s.border}`}>
      {status === 'ACTIVE' && <Zap className="w-3 h-3" />}
      {status === 'COMPLETED' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'CANCELLED' && <XCircle className="w-3 h-3" />}
      {s.label}
    </span>
  );
}

function SwapCard({ swap, currentUserEmail, onComplete, onCancel, actionLoading }) {
  const isLoading = actionLoading === swap.id;
  // Determine which user is "the other" for display
  const partner = swap.userOne?.email === currentUserEmail ? swap.userTwo : swap.userOne;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-600 flex items-center justify-center text-white font-black text-base shrink-0">
            {(partner?.fullName || partner?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-100 text-sm">{partner?.fullName || partner?.name}</p>
            <p className="text-[11px] text-slate-400">{partner?.college || partner?.email}</p>
          </div>
        </div>
        <StatusBadge status={swap.status} />
      </div>

      {/* Skills Exchange Arrow */}
      <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Skill One</p>
          <p className="text-xs font-semibold text-slate-200">{swap.skillOne?.name || '—'}</p>
          <p className="text-[10px] text-slate-500">{swap.skillOne?.category}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Skill Two</p>
          <p className="text-xs font-semibold text-slate-200">{swap.skillTwo?.name || '—'}</p>
          <p className="text-[10px] text-slate-500">{swap.skillTwo?.category}</p>
        </div>
      </div>

      {/* Timestamps */}
      <div className="flex items-center justify-between text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Started: {swap.createdAt ? new Date(swap.createdAt).toLocaleDateString() : 'Unknown'}
        </span>
        {swap.completedAt && (
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" />
            Completed: {new Date(swap.completedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Actions – only for ACTIVE swaps */}
      {swap.status === 'ACTIVE' && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onComplete(swap.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trophy className="w-3.5 h-3.5" />}
            Mark Complete
          </button>
          <button
            onClick={() => onCancel(swap.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
            Cancel Swap
          </button>
        </div>
      )}
    </div>
  );
}

export default function ActiveSwapsPage() {
  const [swaps, setSwaps]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [filter, setFilter]       = useState('ACTIVE');

  const fetchSwaps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [swapRes, meRes] = await Promise.all([
        api.get('/swaps'),
        api.get('/users/me'),
      ]);
      setSwaps(swapRes.data);
      setCurrentUserEmail(meRes.data.email);
    } catch (err) {
      console.error('Failed to load swaps:', err);
      setError('Failed to load active swaps. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSwaps();
  }, [fetchSwaps]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleComplete = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/swaps/${id}/complete`);
      showSuccess('🎉 Swap marked as completed! Great work!');
      await fetchSwaps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to complete swap.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/swaps/${id}/cancel`);
      showSuccess('Swap cancelled.');
      await fetchSwaps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel swap.');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = swaps.filter(s => filter === 'ALL' || s.status === filter);

  const activeCount    = swaps.filter(s => s.status === 'ACTIVE').length;
  const completedCount = swaps.filter(s => s.status === 'COMPLETED').length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-emerald-500/10 blur-[70px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <Zap className="w-3.5 h-3.5" /> Active Skill Swaps
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">My Skill Swaps</h1>
          <p className="text-xs text-slate-400">
            Track ongoing and past skill exchange sessions.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              {activeCount} Active
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <Trophy className="w-3.5 h-3.5" />
              {completedCount} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Success / Error */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-medium">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto cursor-pointer">✕</button>
        </div>
      )}

      {/* Filter Controls */}
      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5">
        {['ACTIVE', 'COMPLETED', 'CANCELLED', 'ALL'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === f
                ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.charAt(0) + f.slice(1).toLowerCase()}
          </button>
        ))}
        <button
          onClick={fetchSwaps}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">Loading swaps...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Zap className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No {filter.toLowerCase()} swaps yet</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {filter === 'ACTIVE'
              ? 'Accept a swap request to start an active skill exchange!'
              : `No ${filter.toLowerCase()} swaps to show.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(swap => (
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
