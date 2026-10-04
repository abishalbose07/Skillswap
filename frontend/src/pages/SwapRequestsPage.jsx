import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  RefreshCw,
  ArrowRight,
  Sparkles,
  MessageSquare,
  Award,
  BookOpen,
  User,
  Zap
} from 'lucide-react';

const STATUS_CONFIG = {
  PENDING: {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: Clock,
    label: 'Pending Response',
  },
  ACCEPTED: {
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: CheckCircle2,
    label: 'Accepted',
  },
  REJECTED: {
    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    icon: XCircle,
    label: 'Declined',
  },
  CANCELLED: {
    badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
    icon: Trash2,
    label: 'Cancelled',
  },
};

function StatusPill({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
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

function RequestCard({ req, type, onAccept, onReject, onCancel, actionLoading }) {
  const isLoading = actionLoading === req.id;
  const other = type === 'received' ? req.sender : req.receiver;
  const otherName = other?.fullName || other?.name || 'Student';

  return (
    <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] hover:border-indigo-500/30 p-6 space-y-5 transition-all duration-200 shadow-xl relative overflow-hidden group">
      {/* Header: User & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
            <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center text-white text-base font-bold font-['Plus_Jakarta_Sans']">
              {otherName.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white text-base font-['Plus_Jakarta_Sans']">
              {otherName}
            </h4>
            <p className="text-xs text-slate-400">
              {type === 'received' ? 'Sent you a proposal' : 'You proposed a swap'}
              {other?.college ? ` • ${other.college}` : ''}
            </p>
          </div>
        </div>

        <StatusPill status={req.status} />
      </div>

      {/* Exchange Skill Visualiser */}
      <div className="rounded-2xl bg-[#0b0f19] border border-white/[0.06] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex-1 text-center sm:text-left">
          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
            Offered Skill
          </span>
          <p className="text-sm font-bold text-white">{req.offeredSkill?.name || '—'}</p>
          <p className="text-xs text-slate-400">{req.offeredSkill?.category || 'General'}</p>
        </div>

        <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-slate-400 shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>

        <div className="flex-1 text-center sm:text-right">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
            Requested Skill
          </span>
          <p className="text-sm font-bold text-white">{req.requestedSkill?.name || '—'}</p>
          <p className="text-xs text-slate-400">{req.requestedSkill?.category || 'General'}</p>
        </div>
      </div>

      {/* Message Note */}
      {req.message && (
        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-start gap-2.5 text-xs text-slate-300 italic">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
          <span>"{req.message}"</span>
        </div>
      )}

      {/* Footer Details & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-white/[0.04]">
        <p className="text-[11px] text-slate-400">
          {req.createdAt ? new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Recently'}
        </p>

        {req.status === 'PENDING' && (
          <div className="flex items-center gap-2.5">
            {type === 'received' && (
              <>
                <button
                  onClick={() => onAccept(req.id)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Accept Swap
                </button>
                <button
                  onClick={() => onReject(req.id)}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  Decline
                </button>
              </>
            )}

            {type === 'sent' && (
              <button
                onClick={() => onCancel(req.id)}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                Cancel Proposal
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SwapRequestsPage({ onNavigateToSwaps }) {
  const [activeSubTab, setActiveSubTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/swap-requests/received'),
        api.get('/swap-requests/sent'),
      ]);
      setReceived(recRes.data || []);
      setSent(sentRes.data || []);
    } catch (err) {
      console.error('Failed to load swap requests:', err);
      setError('Failed to load swap proposals. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    setFeedbackMsg(null);
    try {
      await api.put(`/swap-requests/${requestId}/accept`);
      setFeedbackMsg({ type: 'success', text: 'Proposal accepted! A new active swap has been launched.' });
      await fetchRequests();
      if (onNavigateToSwaps) {
        setTimeout(() => onNavigateToSwaps(), 1200);
      }
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.error || 'Failed to accept proposal.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (requestId) => {
    setActionLoading(requestId);
    setFeedbackMsg(null);
    try {
      await api.put(`/swap-requests/${requestId}/reject`);
      setFeedbackMsg({ type: 'info', text: 'Proposal declined.' });
      await fetchRequests();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.error || 'Failed to decline proposal.' });
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (requestId) => {
    setActionLoading(requestId);
    setFeedbackMsg(null);
    try {
      await api.put(`/swap-requests/${requestId}/cancel`);
      setFeedbackMsg({ type: 'info', text: 'Proposal withdrawn.' });
      await fetchRequests();
    } catch (err) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.error || 'Failed to cancel proposal.' });
    } finally {
      setActionLoading(null);
    }
  };

  const currentList = activeSubTab === 'received' ? received : sent;
  const pendingReceivedCount = received.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#131b2e] via-[#111827] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Inbox className="w-3.5 h-3.5" />
              Collaboration Requests
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Swap Proposals
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg">
              Manage incoming requests from students who want to trade knowledge with you, and track requests you've sent.
            </p>
          </div>

          <button
            onClick={fetchRequests}
            disabled={loading}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Sub tabs switcher */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveSubTab('received')}
          className={`relative px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'received'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <Inbox className="w-4 h-4" />
          Received Proposals
          {pendingReceivedCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black">
              {pendingReceivedCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('sent')}
          className={`relative px-5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'sent'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.08]'
          }`}
        >
          <Send className="w-4 h-4" />
          Sent Proposals ({sent.length})
        </button>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium border animate-in fade-in duration-150 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : feedbackMsg.type === 'error'
              ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
              : 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* Requests Feed */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
          Loading swap proposals...
        </div>
      ) : currentList.length === 0 ? (
        <div className="rounded-3xl bg-[#111827]/50 border border-white/[0.08] p-12 text-center space-y-3">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            {activeSubTab === 'received' ? 'No incoming proposals' : 'No sent proposals'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeSubTab === 'received'
              ? 'When classmates request a skill exchange, their proposals will show up here.'
              : 'Explore the Discover page and reach out to students to trade knowledge!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {currentList.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              type={activeSubTab}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
