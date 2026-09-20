import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Sparkles, Search, Filter, RefreshCw, Send, UserCheck,
  CheckCircle2, X, ArrowRight, BookOpen, Award, MessageSquare
} from 'lucide-react';

// ─── Send Request Modal ──────────────────────────────────────────────────────
function SendRequestModal({ match, mySkills, onClose, onSuccess }) {
  const [offeredSkillId, setOfferedSkillId]     = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [message, setMessage]                   = useState('');
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState(null);

  // My TEACH skills
  const teachSkills = mySkills.filter(s => s.type === 'TEACH');
  // Their TEACH skills (which I can request)
  const theirTeachSkills = match.skillsYouWantToLearnFromThem || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offeredSkillId || !requestedSkillId) {
      setError('Please select both an offered and a requested skill.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/swap-requests', {
        receiverId: match.user.id,
        offeredSkillId: Number(offeredSkillId),
        requestedSkillId: Number(requestedSkillId),
        message: message.trim() || null,
      });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send swap request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-base">
              {(match.user.fullName || match.user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Send Swap Request</h3>
              <p className="text-[11px] text-slate-400">to {match.user.fullName || match.user.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-all cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Offered Skill */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              Skill You Offer (TEACH)
            </label>
            {teachSkills.length === 0 ? (
              <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5">
                You have no TEACH skills. Add skills to your profile first!
              </p>
            ) : (
              <select
                value={offeredSkillId}
                onChange={e => setOfferedSkillId(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/80 transition-all"
              >
                <option value="">— Select a skill you can teach —</option>
                {teachSkills.map(s => (
                  <option key={s.id} value={s.skill?.id || s.id}>
                    {s.skill?.name || s.name} ({s.proficiencyLevel})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Requested Skill */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
              Skill You Want to Learn
            </label>
            {theirTeachSkills.length === 0 ? (
              <p className="text-xs text-slate-400 bg-slate-800 border border-slate-700 rounded-xl p-2.5">
                No overlapping teach skills found. You can still request any of their skills.
              </p>
            ) : (
              <select
                value={requestedSkillId}
                onChange={e => setRequestedSkillId(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-indigo-500/80 transition-all"
              >
                <option value="">— Select a skill you want to learn —</option>
                {theirTeachSkills.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.category ? `(${s.category})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Introduce yourself and explain why you'd be a great swap partner..."
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-500/20 rounded-xl p-2.5">{error}</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || teachSkills.length === 0}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-md shadow-cyan-500/20"
            >
              {loading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── View Profile Modal ──────────────────────────────────────────────────────
function ProfileModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 font-bold text-xl flex items-center justify-center">
            {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{user.fullName || user.name}</h3>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-xs text-indigo-400 font-medium">{user.college || 'Peer Student'}</p>
          </div>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-slate-400 block font-semibold mb-1">Bio</span>
            <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 leading-relaxed">
              {user.bio || 'No bio provided.'}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Course</span>
            <span className="text-slate-200 font-medium">{user.course || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Year of Study</span>
            <span className="text-slate-200 font-medium">{user.yearOfStudy || 'N/A'}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 transition-all cursor-pointer"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}

// ─── Main Matches Page ───────────────────────────────────────────────────────
export default function MatchesPage({ onNavigateToRequests }) {
  const [matches, setMatches]   = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore]   = useState(0);

  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [sendRequestModal, setSendRequestModal]         = useState(null); // match object
  const [requestedUsers, setRequestedUsers]             = useState({});   // userId → true

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [matchRes, skillRes] = await Promise.all([
        api.get('/matches'),
        api.get('/users/me/skills'),
      ]);
      setMatches(matchRes.data);
      setMySkills(skillRes.data);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setError('Failed to calculate skill matches. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredMatches = matches.filter((m) => {
    if (m.compatibilityScore < minScore) return false;
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    const nameMatch   = m.user.fullName?.toLowerCase().includes(term) || m.user.name?.toLowerCase().includes(term);
    const collegeMatch = m.user.college?.toLowerCase().includes(term);
    const teachMatch  = m.skillsYouWantToLearnFromThem?.some(s => s.name.toLowerCase().includes(term));
    const learnMatch  = m.skillsYouCanTeachThem?.some(s => s.name.toLowerCase().includes(term));
    return nameMatch || collegeMatch || teachMatch || learnMatch;
  });

  const handleRequestSuccess = (userId) => {
    setRequestedUsers(prev => ({ ...prev, [userId]: true }));
    setSendRequestModal(null);
    if (onNavigateToRequests) onNavigateToRequests();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-cyan-500/10 blur-[70px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Reciprocal Skill Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
              Skill Matches & Peer Discovery
            </h1>
            <p className="text-xs text-slate-400 max-w-lg">
              Find peers who teach what you want to learn, and want what you can teach. Click "Send Swap Request" to start a skill exchange!
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Recalculate Matches
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, college, or skill..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-300 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>Min Match:</span>
          <select
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/80 transition-all"
          >
            <option value={0}>All Matches (0%+)</option>
            <option value={40}>Reciprocal / Good (40%+)</option>
            <option value={60}>High Compatibility (60%+)</option>
            <option value={80}>Top Reciprocal Matches (80%+)</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      {/* Matches Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs animate-pulse">Calculating skill compatibility scores...</div>
      ) : filteredMatches.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">No Matches Found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try lowering the minimum score filter or adding more teaching & learning skills to your profile!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => {
            const isRequested = requestedUsers[match.user.id];
            const isReciprocal = match.skillsYouWantToLearnFromThem?.length > 0 && match.skillsYouCanTeachThem?.length > 0;

            return (
              <div
                key={match.user.id}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between hover:border-slate-700 transition-all relative overflow-hidden group"
              >
                {/* Header User Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {match.user.profileImage ? (
                      <img src={match.user.profileImage} alt="Avatar" className="w-12 h-12 rounded-2xl object-cover border border-slate-700" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-lg flex items-center justify-center">
                        {(match.user.fullName || match.user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-extrabold text-slate-100 text-base">{match.user.fullName || match.user.name}</h3>
                      <p className="text-xs text-slate-400">
                        {match.user.college || 'University Peer'} {match.user.course ? `• ${match.user.course}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Compatibility Score Badge */}
                  <div className={`px-3 py-1.5 rounded-xl border text-xs font-black tracking-tight flex items-center gap-1 shrink-0 ${
                    match.compatibilityScore >= 70
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : match.compatibilityScore >= 40
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    <span>{match.compatibilityScore}% MATCH</span>
                  </div>
                </div>

                {/* Skills Intersections Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* They Can Teach You */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">They can teach you:</span>
                    {match.skillsYouWantToLearnFromThem?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {match.skillsYouWantToLearnFromThem.map(s => (
                          <span key={s.id} className="px-2 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[11px] font-medium">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">None overlapping</span>
                    )}
                  </div>

                  {/* You Can Teach Them */}
                  <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block">You can teach them:</span>
                    {match.skillsYouCanTeachThem?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {match.skillsYouCanTeachThem.map(s => (
                          <span key={s.id} className="px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-medium">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">None overlapping</span>
                    )}
                  </div>
                </div>

                {/* Why You Match Explanation */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Why you match:</span>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{match.explanation}</p>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setSelectedProfileUser(match.user)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all text-center cursor-pointer"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => !isRequested && setSendRequestModal(match)}
                    disabled={isRequested}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isRequested
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : isReciprocal
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isRequested ? (
                      <><CheckCircle2 className="w-3.5 h-3.5" /> Request Sent</>
                    ) : (
                      <><Send className="w-3.5 h-3.5" /> Send Swap Request</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Profile Modal */}
      {selectedProfileUser && (
        <ProfileModal user={selectedProfileUser} onClose={() => setSelectedProfileUser(null)} />
      )}

      {/* Send Request Modal */}
      {sendRequestModal && (
        <SendRequestModal
          match={sendRequestModal}
          mySkills={mySkills}
          onClose={() => setSendRequestModal(null)}
          onSuccess={() => handleRequestSuccess(sendRequestModal.user.id)}
        />
      )}
    </div>
  );
}
