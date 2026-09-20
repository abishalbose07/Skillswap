import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Send, Inbox, Clock, CheckCircle2, XCircle, Trash2, RefreshCw,
  ArrowRight, Sparkles, MessageSquare, BookOpen, User
} from 'lucide-react';

const STATUS_STYLES = {
  PENDING:   { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/30',  label: 'Pending'   },
  ACCEPTED:  { bg: 'bg-emerald-500/10',text: 'text-emerald-400',border: 'border-emerald-500/30',label: 'Accepted'  },
  REJECTED:  { bg: 'bg-red-500/10',    text: 'text-red-400',    border: 'border-red-500/30',    label: 'Rejected'  },
  CANCELLED: { bg: 'bg-slate-500/10',  text: 'text-slate-400',  border: 'border-slate-500/30',  label: 'Cancelled' },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${s.bg} ${s.text} ${s.border}`}>
      {status === 'PENDING' && <Clock className="w-3 h-3" />}
      {status === 'ACCEPTED' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'REJECTED' && <XCircle className="w-3 h-3" />}
      {status === 'CANCELLED' && <Trash2 className="w-3 h-3" />}
      {s.label}
    </span>
  );
}

function RequestCard({ req, type, onAccept, onReject, onCancel, actionLoading }) {
  const isLoading = actionLoading === req.id;
  const other = type === 'received' ? req.sender : req.receiver;

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-base shrink-0">
            {(other?.fullName || other?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-100 text-sm">{other?.fullName || other?.name}</p>
            <p className="text-[11px] text-slate-400">{other?.email}</p>
          </div>
        </div>
        <StatusBadge status={req.status} />
      </div>

      {/* Skills Exchange */}
      <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Offered Skill</p>
          <p className="text-xs font-semibold text-slate-200">{req.offeredSkill?.name || '—'}</p>
          <p className="text-[10px] text-slate-500">{req.offeredSkill?.category}</p>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="flex-1 text-center space-y-0.5">
          <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Requested Skill</p>
          <p className="text-xs font-semibold text-slate-200">{req.requestedSkill?.name || '—'}</p>
          <p className="text-[10px] text-slate-500">{req.requestedSkill?.category}</p>
        </div>
      </div>

      {/* Message */}
      {req.message && (
        <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3 flex gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed italic">"{req.message}"</p>
        </div>
      )}

      {/* Timestamp */}
      <p className="text-[10px] text-slate-500">
        Sent: {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'Unknown'}
      </p>

      {/* Actions */}
      {req.status === 'PENDING' && (
        <div className="flex gap-2 pt-1">
          {type === 'received' && (
            <>
              <button
                onClick={() => onAccept(req.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Accept
              </button>
              <button
                onClick={() => onReject(req.id)}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                Reject
              </button>
            </>
          )}
          {type === 'sent' && (
            <button
              onClick={() => onCancel(req.id)}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
              Cancel Request
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function SwapRequestsPage({ onNavigateToSwaps }) {
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived]   = useState([]);
  const [sent, setSent]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/swap-requests/received'),
        api.get('/swap-requests/sent'),
      ]);
      setReceived(recRes.data);
      setSent(sentRes.data);
    } catch (err) {
      console.error('Failed to fetch swap requests:', err);
      setError('Failed to load swap requests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleAccept = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/swap-requests/${id}/accept`);
      showSuccess('Swap request accepted! An active swap has been created.');
      await fetchRequests();
      if (onNavigateToSwaps) onNavigateToSwaps();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to accept request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(id);
    try {
      await api.put(`/swap-requests/${id}/reject`);
      showSuccess('Swap request rejected.');
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject request.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id) => {
    setActionLoading(id);
    try {
      await api.delete(`/swap-requests/${id}`);
      showSuccess('Swap request cancelled.');
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel request.');
    } finally {
      setActionLoading(null);
    }
  };

  const displayList = activeTab === 'received' ? received : sent;
  const pendingReceived = received.filter(r => r.status === 'PENDING').length;

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Send className="w-3.5 h-3.5" /> Swap Requests
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Skill Swap Requests</h1>
          <p className="text-xs text-slate-400">Manage incoming and outgoing skill swap requests.</p>
        </div>
      </div>

      {/* Success / Error banners */}
      {successMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-medium animate-pulse">
          <CheckCircle2 className="w-4 h-4 shrink-0" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-medium">
          <XCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-300 cursor-pointer">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-2xl p-1.5">
        <button
          onClick={() => setActiveTab('received')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'received'
              ? 'bg-slate-800 text-cyan-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          Received
          {pendingReceived > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black">
              {pendingReceived}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'sent'
              ? 'bg-slate-800 text-indigo-400 border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-3.5 h-3.5" />
          Sent
        </button>
        <button
          onClick={fetchRequests}
          disabled={loading}
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">Loading swap requests...</div>
      ) : displayList.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          {activeTab === 'received' ? <Inbox className="w-10 h-10 text-slate-600 mx-auto" /> : <Send className="w-10 h-10 text-slate-600 mx-auto" />}
          <p className="text-sm font-semibold text-slate-300">
            No {activeTab === 'received' ? 'received' : 'sent'} requests yet
          </p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {activeTab === 'received'
              ? 'When someone sends you a swap request, it will appear here.'
              : 'Go to Discover Matches and send a swap request to a peer!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayList.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              type={activeTab}
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
