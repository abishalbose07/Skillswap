import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import {
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  Send,
  UserCheck,
  CheckCircle2,
  X,
  ArrowRight,
  BookOpen,
  Award,
  MessageSquare,
  GraduationCap,
  ChevronDown,
  Repeat,
  Zap,
  Info
} from 'lucide-react';

// ─── Send Request Modal ──────────────────────────────────────────────────────
function SendRequestModal({ match, mySkills, onClose, onSuccess }) {
  const [offeredSkillId, setOfferedSkillId] = useState('');
  const [requestedSkillId, setRequestedSkillId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // My TEACH skills
  const teachSkills = mySkills.filter((s) => s.type === 'TEACH');
  // Their TEACH skills (which I can request)
  const theirTeachSkills = match.skillsYouWantToLearnFromThem || [];

  const partnerName = match.user.fullName || match.user.name || 'Peer';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b13]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-white/[0.1] rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-5 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {partnerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm font-['Plus_Jakarta_Sans']">
                Send Swap Request
              </h3>
              <p className="text-xs text-slate-400">Propose a 1-on-1 swap with {partnerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Offered Skill */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-cyan-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Skill You Can Teach Them
            </label>
            {teachSkills.length === 0 ? (
              <p className="text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                You have no teaching skills added. Add skills to your profile first!
              </p>
            ) : (
              <select
                value={offeredSkillId}
                onChange={(e) => setOfferedSkillId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
              >
                <option value="">— Select a skill to teach —</option>
                {teachSkills.map((s) => (
                  <option key={s.id} value={s.skill?.id || s.id}>
                    {s.skill?.name || s.name} ({s.proficiencyLevel})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Requested Skill */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Skill You Want To Learn
            </label>
            {theirTeachSkills.length === 0 ? (
              <p className="text-xs text-slate-400 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                No overlapping teaching skills detected.
              </p>
            ) : (
              <select
                value={requestedSkillId}
                onChange={(e) => setRequestedSkillId(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="">— Select a skill to learn —</option>
                {theirTeachSkills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.category ? `(${s.category})` : ''}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Custom Note */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
              Intro Note (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={400}
              placeholder={`Hi ${partnerName}! I saw you know ${theirTeachSkills[0]?.name || 'this topic'} and I'd love to swap knowledge...`}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl p-2.5">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || teachSkills.length === 0}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Request
                </>
              )}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b13]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-white/[0.1] rounded-3xl w-full max-w-md p-6 sm:p-7 space-y-6 shadow-2xl">
        <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center text-white text-xl font-bold font-['Plus_Jakarta_Sans']">
                {(user.fullName || user.name || 'U').charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                {user.fullName || user.name}
              </h3>
              <p className="text-xs text-indigo-400 font-medium">{user.college || 'Peer Student'}</p>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/[0.08] text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              About
            </span>
            <p className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] text-slate-300 leading-relaxed">
              {user.bio || 'No bio shared yet.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#0b0f19] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block">Major / Course</span>
              <span className="text-white font-semibold text-xs">{user.course || 'Not specified'}</span>
            </div>
            <div className="p-3 rounded-2xl bg-[#0b0f19] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block">Year of Study</span>
              <span className="text-white font-semibold text-xs">
                {user.yearOfStudy ? `Year ${user.yearOfStudy}` : 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          Close Profile
        </button>
      </div>
    </div>
  );
}

// ─── Main Matches Page ───────────────────────────────────────────────────────
export default function MatchesPage({ onNavigateToRequests }) {
  const [matches, setMatches] = useState([]);
  const [mySkills, setMySkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState(0);

  const [selectedProfileUser, setSelectedProfileUser] = useState(null);
  const [sendRequestModal, setSendRequestModal] = useState(null);
  const [requestedUsers, setRequestedUsers] = useState({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [matchRes, skillRes] = await Promise.all([
        api.get('/matches'),
        api.get('/users/me/skills'),
      ]);
      setMatches(matchRes.data || []);
      setMySkills(skillRes.data || []);
    } catch (err) {
      console.error('Failed to fetch matches:', err);
      setError('Unable to load matches. Make sure the backend service is reachable.');
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
    const nameMatch =
      m.user.fullName?.toLowerCase().includes(term) ||
      m.user.name?.toLowerCase().includes(term);
    const collegeMatch = m.user.college?.toLowerCase().includes(term);
    const teachMatch = m.skillsYouWantToLearnFromThem?.some((s) =>
      s.name.toLowerCase().includes(term)
    );
    const learnMatch = m.skillsYouCanTeachThem?.some((s) =>
      s.name.toLowerCase().includes(term)
    );
    return nameMatch || collegeMatch || teachMatch || learnMatch;
  });

  const handleRequestSuccess = (userId) => {
    setRequestedUsers((prev) => ({ ...prev, [userId]: true }));
    setSendRequestModal(null);
    if (onNavigateToRequests) onNavigateToRequests();
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#131b2e] via-[#111827] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Reciprocal Matching Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Discover Student Matches
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Connect with classmates who want to learn your skills and teach what you need. Higher match percentages mean seamless two-way skill exchange.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Matches
          </button>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="rounded-2xl bg-[#111827]/80 border border-white/[0.08] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student, college, or skill..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-2.5 text-xs text-slate-300 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>Match Filter:</span>
          <select
            value={minScore}
            onChange={(e) => setMinScore(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
          >
            <option value={0}>All matches (0%+)</option>
            <option value={40}>Good match (40%+)</option>
            <option value={60}>High match (60%+)</option>
            <option value={80}>Top reciprocal (80%+)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Matches Cards Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 text-xs animate-pulse">
          Analyzing skill intersections across campus...
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="rounded-3xl bg-[#111827]/50 border border-white/[0.08] p-12 text-center space-y-3">
          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
            No matches found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search or add more skills to your profile to expand your reciprocal network.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMatches.map((match) => {
            const isRequested = requestedUsers[match.user.id];
            const isReciprocal =
              match.skillsYouWantToLearnFromThem?.length > 0 &&
              match.skillsYouCanTeachThem?.length > 0;
            const score = match.compatibilityScore || 0;

            return (
              <div
                key={match.user.id}
                className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] hover:border-indigo-500/30 p-6 shadow-xl flex flex-col justify-between transition-all duration-200 group hover:-translate-y-1 relative"
              >
                <div className="space-y-4">
                  {/* Card Header: Student identity & Match Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-md shadow-indigo-500/20 shrink-0">
                        <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center text-white text-base font-black font-['Plus_Jakarta_Sans']">
                          {(match.user.fullName || match.user.name || 'U').charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors font-['Plus_Jakarta_Sans']">
                          {match.user.fullName || match.user.name}
                        </h3>
                        <p className="text-xs text-slate-400">
                          {match.user.college || 'Campus Student'}
                          {match.user.course ? ` • ${match.user.course}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Match percentage */}
                    <div
                      className={`px-3 py-1.5 rounded-2xl text-xs font-black tracking-tight shrink-0 flex items-center gap-1 ${
                        score >= 70
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10'
                          : score >= 40
                          ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30'
                          : 'bg-white/[0.05] text-slate-400 border border-white/[0.08]'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{score}% MATCH</span>
                    </div>
                  </div>

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* They Teach (You Learn) */}
                    <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] space-y-1.5">
                      <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        They Teach
                      </span>
                      {match.skillsYouWantToLearnFromThem?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.skillsYouWantToLearnFromThem.map((s) => (
                            <span
                              key={s.id}
                              className="px-2.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-medium"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No direct overlap</span>
                      )}
                    </div>

                    {/* You Teach (They Learn) */}
                    <div className="p-3.5 rounded-2xl bg-[#0b0f19] border border-white/[0.06] space-y-1.5">
                      <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider block flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        They Want
                      </span>
                      {match.skillsYouCanTeachThem?.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {match.skillsYouCanTeachThem.map((s) => (
                            <span
                              key={s.id}
                              className="px-2.5 py-1 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">No direct overlap</span>
                      )}
                    </div>
                  </div>

                  {/* Why this match works */}
                  <div className="p-3.5 rounded-2xl bg-[#0b0f19]/70 border border-white/[0.04] flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Why this match works
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {match.explanation || 'Complementary skill interests detected for direct collaboration.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-3 pt-5">
                  <button
                    onClick={() => setSelectedProfileUser(match.user)}
                    className="flex-1 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer text-center"
                  >
                    View Profile
                  </button>

                  <button
                    onClick={() => !isRequested && setSendRequestModal(match)}
                    disabled={isRequested}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
                      isRequested
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : isReciprocal
                        ? 'bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 shadow-indigo-500/20'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {isRequested ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Request Sent
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Send Swap Request
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {selectedProfileUser && (
        <ProfileModal
          user={selectedProfileUser}
          onClose={() => setSelectedProfileUser(null)}
        />
      )}

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
