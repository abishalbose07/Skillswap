import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import EditProfileModal from '../components/EditProfileModal';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  BookOpen,
  GraduationCap,
  Code2,
  RefreshCw,
  Sparkles,
  Edit3,
  Award,
  CheckCircle2,
  Zap,
  ArrowRight,
  Plus
} from 'lucide-react';

export default function ProfilePage({ onNavigateToSkills }) {
  const { user: authUser } = useAuth();
  const [userProfile, setUserProfile] = useState(authUser || null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, skillsRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/users/me/skills').catch(() => ({ data: [] })),
      ]);
      setUserProfile(profileRes.data);
      setUserSkills(skillsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch profile data:', err);
      setError(err.response?.data?.error || 'Failed to retrieve profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const teachingSkills = userSkills.filter((sk) => sk.type === 'TEACH');
  const learningSkills = userSkills.filter((sk) => sk.type === 'LEARN');

  const calculateCompletion = () => {
    if (!userProfile) return 0;
    let score = 0;
    let total = 6;
    if (userProfile.name || userProfile.fullName) score += 1;
    if (userProfile.bio && userProfile.bio.trim().length > 10) score += 1;
    if (userProfile.college) score += 1;
    if (userProfile.course) score += 1;
    if (teachingSkills.length > 0) score += 1;
    if (learningSkills.length > 0) score += 1;
    return Math.round((score / total) * 100);
  };

  const completionPct = calculateCompletion();
  const studentName = userProfile?.fullName || userProfile?.name || 'Student';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 space-y-8">
      {/* Header Profile Identity Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#131b2e] via-[#111827] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt="Avatar"
                className="w-20 h-20 rounded-3xl object-cover border-2 border-indigo-500/40 shadow-xl shadow-indigo-500/20 shrink-0"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-0.5 shadow-xl shadow-indigo-500/20 shrink-0">
                <div className="w-full h-full bg-[#0d1322] rounded-[22px] flex items-center justify-center text-white text-3xl font-black font-['Plus_Jakarta_Sans']">
                  {studentName.charAt(0).toUpperCase()}
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
                  {studentName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> {userProfile?.email}
              </p>
              {userProfile?.college && (
                <p className="text-xs text-slate-300 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  {userProfile.college}
                  {userProfile.course ? ` • ${userProfile.course}` : ''}
                  {userProfile.yearOfStudy ? ` (Year ${userProfile.yearOfStudy})` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button
              onClick={fetchProfileData}
              disabled={loading}
              className="p-2.5 rounded-2xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] transition-all cursor-pointer"
              title="Refresh profile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Meter */}
      <div className="rounded-2xl bg-[#111827]/80 border border-white/[0.08] p-5 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Profile Strength
          </span>
          <span className="text-cyan-400 font-extrabold">{completionPct}% Complete</span>
        </div>
        <div className="w-full bg-[#0b0f19] rounded-full h-2.5 overflow-hidden border border-white/[0.06]">
          <div
            className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          A complete profile improves your compatibility match rankings with campus peers.
        </p>
      </div>

      {/* Bio / About */}
      <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider text-slate-300">
          About & Academic Focus
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-[#0b0f19] p-4 rounded-2xl border border-white/[0.04]">
          {userProfile?.bio || 'No bio written yet. Click "Edit Profile" above to share a little about your studies and interests.'}
        </p>
      </div>

      {/* Skills Showcase: Teaching & Learning */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Teaching Skills */}
        <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Skills I Can Teach ({teachingSkills.length})
              </h3>
            </div>
            {onNavigateToSkills && (
              <button
                onClick={onNavigateToSkills}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Manage
              </button>
            )}
          </div>

          {teachingSkills.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No teaching skills configured yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {teachingSkills.map((ts) => (
                <div
                  key={ts.id}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-300 flex items-center gap-2"
                >
                  <span>{ts.skill?.name || 'Skill'}</span>
                  <span className="text-[10px] font-black uppercase text-cyan-400/70">
                    {ts.proficiencyLevel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Skills */}
        <div className="rounded-3xl bg-[#111827]/80 border border-white/[0.08] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                Skills I Want to Learn ({learningSkills.length})
              </h3>
            </div>
            {onNavigateToSkills && (
              <button
                onClick={onNavigateToSkills}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Manage
              </button>
            )}
          </div>

          {learningSkills.length === 0 ? (
            <p className="text-xs text-slate-400 py-3">No learning goals configured yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {learningSkills.map((ls) => (
                <div
                  key={ls.id}
                  className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300 flex items-center gap-2"
                >
                  <span>{ls.skill?.name || 'Skill'}</span>
                  <span className="text-[10px] font-black uppercase text-indigo-400/70">
                    {ls.proficiencyLevel}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          user={userProfile}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => {
            setUserProfile(updated);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
