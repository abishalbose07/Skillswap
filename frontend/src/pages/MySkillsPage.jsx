import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddSkillModal from '../components/AddSkillModal';
import {
  Sparkles,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Award,
  RefreshCw,
  Check,
  Zap,
  Code2
} from 'lucide-react';

export default function MySkillsPage() {
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('TEACH');
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [updatingLevel, setUpdatingLevel] = useState(false);

  const fetchMySkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/me/skills');
      setUserSkills(response.data || []);
    } catch (err) {
      console.error('Failed to fetch user skills:', err);
      setError('Failed to load your skills. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMySkills();
  }, []);

  const handleUpdateProficiency = async (skillId, newLevel) => {
    setUpdatingLevel(true);
    try {
      const response = await api.put(`/users/me/skills/${skillId}`, {
        proficiencyLevel: newLevel,
      });
      setUserSkills(userSkills.map((sk) => (sk.id === skillId ? response.data : sk)));
      setEditingSkillId(null);
    } catch (err) {
      console.error('Failed to update proficiency level:', err);
      alert(err.response?.data?.error || 'Failed to update proficiency level');
    } finally {
      setUpdatingLevel(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm('Remove this skill from your profile?')) return;
    try {
      await api.delete(`/users/me/skills/${skillId}`);
      setUserSkills(userSkills.filter((sk) => sk.id !== skillId));
    } catch (err) {
      console.error('Failed to delete skill:', err);
      alert(err.response?.data?.error || 'Failed to remove skill');
    }
  };

  const teachingSkills = userSkills.filter((sk) => sk.type === 'TEACH');
  const learningSkills = userSkills.filter((sk) => sk.type === 'LEARN');

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Top Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#131b2e] via-[#111827] to-[#0f172a] border border-white/[0.1] p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              Skill Portfolio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-['Plus_Jakarta_Sans']">
              Skills Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Add skills you have mastered to teach fellow students, and register topics you are excited to learn this term.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalType('TEACH');
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Teach Skill
            </button>
            <button
              onClick={() => {
                setModalType('LEARN');
                setShowAddModal(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Learn Skill
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
          {error}
        </div>
      )}

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teaching Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <h2 className="font-bold text-white text-base font-['Plus_Jakarta_Sans']">
                Skills I Can Teach ({teachingSkills.length})
              </h2>
            </div>
            <button
              onClick={() => {
                setModalType('TEACH');
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-cyan-400 hover:underline cursor-pointer"
            >
              + Add
            </button>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 animate-pulse">Loading skills...</p>
          ) : teachingSkills.length === 0 ? (
            <div className="rounded-3xl bg-[#111827]/50 border border-dashed border-white/[0.1] p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-300">No teaching skills listed</p>
              <p className="text-xs text-slate-400">
                Share what you know to unlock matching recommendations!
              </p>
              <button
                onClick={() => {
                  setModalType('TEACH');
                  setShowAddModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-bold hover:bg-cyan-500/25 transition-all cursor-pointer"
              >
                + Add Teaching Skill
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {teachingSkills.map((sk) => {
                const isEditing = editingSkillId === sk.id;
                return (
                  <div
                    key={sk.id}
                    className="rounded-2xl bg-[#111827]/80 border border-white/[0.08] hover:border-cyan-500/30 p-4 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {sk.skill?.name || 'Skill'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {sk.skill?.category || 'General'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingSkillId(isEditing ? null : sk.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          title="Change Level"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(sk.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Remove Skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="pt-2 flex items-center gap-2">
                        <select
                          defaultValue={sk.proficiencyLevel}
                          onChange={(e) => handleUpdateProficiency(sk.id, e.target.value)}
                          disabled={updatingLevel}
                          className="px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
                        >
                          <option value="BEGINNER">BEGINNER</option>
                          <option value="INTERMEDIATE">INTERMEDIATE</option>
                          <option value="ADVANCED">ADVANCED</option>
                          <option value="EXPERT">EXPERT</option>
                        </select>
                        <span className="text-[11px] text-slate-400">Select new level</span>
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-[10px] font-bold tracking-wider uppercase">
                        {sk.proficiencyLevel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Learning Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <h2 className="font-bold text-white text-base font-['Plus_Jakarta_Sans']">
                Skills I Want to Learn ({learningSkills.length})
              </h2>
            </div>
            <button
              onClick={() => {
                setModalType('LEARN');
                setShowAddModal(true);
              }}
              className="text-xs font-semibold text-indigo-400 hover:underline cursor-pointer"
            >
              + Add
            </button>
          </div>

          {loading ? (
            <p className="text-xs text-slate-400 animate-pulse">Loading skills...</p>
          ) : learningSkills.length === 0 ? (
            <div className="rounded-3xl bg-[#111827]/50 border border-dashed border-white/[0.1] p-8 text-center space-y-3">
              <p className="text-sm font-semibold text-slate-300">No learning goals registered</p>
              <p className="text-xs text-slate-400">
                Register skills you want to learn to get reciprocal swap matches!
              </p>
              <button
                onClick={() => {
                  setModalType('LEARN');
                  setShowAddModal(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold hover:bg-indigo-600/30 transition-all cursor-pointer"
              >
                + Add Learning Goal
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {learningSkills.map((sk) => {
                const isEditing = editingSkillId === sk.id;
                return (
                  <div
                    key={sk.id}
                    className="rounded-2xl bg-[#111827]/80 border border-white/[0.08] hover:border-indigo-500/30 p-4 transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {sk.skill?.name || 'Skill'}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {sk.skill?.category || 'General'}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingSkillId(isEditing ? null : sk.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
                          title="Change Target"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSkill(sk.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Remove Goal"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {isEditing ? (
                      <div className="pt-2 flex items-center gap-2">
                        <select
                          defaultValue={sk.proficiencyLevel}
                          onChange={(e) => handleUpdateProficiency(sk.id, e.target.value)}
                          disabled={updatingLevel}
                          className="px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        >
                          <option value="BEGINNER">BEGINNER</option>
                          <option value="INTERMEDIATE">INTERMEDIATE</option>
                          <option value="ADVANCED">ADVANCED</option>
                          <option value="EXPERT">EXPERT</option>
                        </select>
                        <span className="text-[11px] text-slate-400">Target level</span>
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold tracking-wider uppercase">
                        {sk.proficiencyLevel}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSkillModal
          initialType={modalType}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            fetchMySkills();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}
