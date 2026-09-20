import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import EditProfileModal from '../components/EditProfileModal';
import { User, Mail, ShieldCheck, Calendar, BookOpen, GraduationCap, Code2, RefreshCw, KeyRound, Sparkles, Edit3, Award, CheckCircle2 } from 'lucide-react';

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

  // Calculate profile completion percentage dynamically
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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 blur-[60px] rounded-full pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            {userProfile?.profileImage ? (
              <img
                src={userProfile.profileImage}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
                {(userProfile?.fullName || userProfile?.name || 'U').charAt(0).toUpperCase()}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100">
                  {userProfile?.fullName || userProfile?.name || 'SkillSwap Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" /> {userProfile?.email}
              </p>
              {userProfile?.college && (
                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {userProfile.college}
                  {userProfile.course && ` • ${userProfile.course}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button
              onClick={fetchProfileData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all cursor-pointer"
              title="Refresh profile"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Completion Bar */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-200 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-cyan-400" /> Profile Completion
          </span>
          <span className="text-cyan-400 font-mono">{completionPct}%</span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stats */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
              Skill Overview
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={onNavigateToSkills}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 space-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Teaching
                </div>
                <p className="text-2xl font-extrabold text-slate-100">{teachingSkills.length}</p>
                <p className="text-[10px] text-cyan-400">Skills Offered</p>
              </div>

              <div 
                onClick={onNavigateToSkills}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/40 space-y-1 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Learning
                </div>
                <p className="text-2xl font-extrabold text-slate-100">{learningSkills.length}</p>
                <p className="text-[10px] text-indigo-400">Skills Needed</p>
              </div>
            </div>

            <button
              onClick={onNavigateToSkills}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-all text-center cursor-pointer"
            >
              Manage Skills Portfolio →
            </button>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
            <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-2">Academic Profile</h3>
            <div className="space-y-2">
              <div>
                <span className="text-slate-400 block">College</span>
                <span className="text-slate-200 font-medium">{userProfile?.college || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Course / Major</span>
                <span className="text-slate-200 font-medium">{userProfile?.course || 'Not specified'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Year of Study</span>
                <span className="text-slate-200 font-medium">{userProfile?.yearOfStudy || 'Not specified'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Bio */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
            {/* Bio */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-400" /> About & Bio
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                {userProfile?.bio || 'No bio provided yet. Click "Edit Profile" above to tell peers about yourself!'}
              </p>
            </div>

            {/* Teaching Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" /> Teaching Skills
                </h3>
                <button
                  onClick={onNavigateToSkills}
                  className="text-xs text-cyan-400 hover:underline font-semibold cursor-pointer"
                >
                  Manage
                </button>
              </div>
              {teachingSkills.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                  No teaching skills added. Go to "My Skills" to add what you can teach!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {teachingSkills.map((sk) => (
                    <div key={sk.id} className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium flex items-center gap-2">
                      <span>{sk.skill.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 font-mono text-cyan-400">
                        {sk.proficiencyLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Learning Skills List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" /> Learning Skills
                </h3>
                <button
                  onClick={onNavigateToSkills}
                  className="text-xs text-indigo-400 hover:underline font-semibold cursor-pointer"
                >
                  Manage
                </button>
              </div>
              {learningSkills.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-950 p-3 rounded-xl border border-slate-800">
                  No learning skills added. Go to "My Skills" to add what you want to learn!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {learningSkills.map((sk) => (
                    <div key={sk.id} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium flex items-center gap-2">
                      <span>{sk.skill.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-950 font-mono text-indigo-400">
                        {sk.proficiencyLevel}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProfileModal
          user={userProfile}
          onClose={() => setShowEditModal(false)}
          onUpdated={(updated) => setUserProfile(updated)}
        />
      )}
    </div>
  );
}
