import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import AddSkillModal from '../components/AddSkillModal';
import { Sparkles, BookOpen, Plus, Trash2, Edit3, ShieldAlert, Award, RefreshCw, Check } from 'lucide-react';

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
      setUserSkills(response.data);
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
    if (!window.confirm('Are you sure you want to remove this skill from your profile?')) return;
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

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case 'EXPERT':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
      case 'ADVANCED':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
      case 'INTERMEDIATE':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <Award className="w-3.5 h-3.5" /> Skill Portfolio
          </div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">My Skills Portfolio</h1>
          <p className="text-xs text-slate-400">
            Manage skills you can teach to others and skills you want to learn.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setModalType('TEACH');
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Teaching Skill
          </button>
          <button
            onClick={() => {
              setModalType('LEARN');
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Learning Skill
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teaching Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> Teaching Skills ({teachingSkills.length})
            </h2>
            <span className="text-xs text-cyan-400 font-mono">TEACH</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading skills...</div>
          ) : teachingSkills.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-400/40 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No Teaching Skills Added Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Share what you are great at! Add skills you can mentor or exchange with peers.
              </p>
              <button
                onClick={() => {
                  setModalType('TEACH');
                  setShowAddModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
              >
                + Add First Teaching Skill
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {teachingSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm">{userSkill.skill.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                        {userSkill.skill.category}
                      </span>
                    </div>

                    {editingSkillId === userSkill.id ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleUpdateProficiency(userSkill.id, lvl)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                              userSkill.proficiencyLevel === lvl
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(userSkill.proficiencyLevel)}`}>
                          {userSkill.proficiencyLevel}
                        </span>
                        <button
                          onClick={() => setEditingSkillId(userSkill.id)}
                          className="text-slate-500 hover:text-cyan-400 p-0.5 transition-all cursor-pointer"
                          title="Change proficiency level"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(userSkill.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" /> Learning Skills ({learningSkills.length})
            </h2>
            <span className="text-xs text-indigo-400 font-mono">LEARN</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs animate-pulse">Loading skills...</div>
          ) : learningSkills.length === 0 ? (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-8 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-indigo-400/40 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No Learning Skills Added Yet</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                What do you want to learn next? Add skills to find mentors and swap knowledge.
              </p>
              <button
                onClick={() => {
                  setModalType('LEARN');
                  setShowAddModal(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-bold border border-indigo-500/30 transition-all cursor-pointer"
              >
                + Add First Learning Skill
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {learningSkills.map((userSkill) => (
                <div
                  key={userSkill.id}
                  className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-lg hover:border-slate-700 transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-sm">{userSkill.skill.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                        {userSkill.skill.category}
                      </span>
                    </div>

                    {editingSkillId === userSkill.id ? (
                      <div className="flex items-center gap-1.5 pt-1">
                        {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => handleUpdateProficiency(userSkill.id, lvl)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer ${
                              userSkill.proficiencyLevel === lvl
                                ? 'bg-indigo-500 text-white border-indigo-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getLevelBadgeClass(userSkill.proficiencyLevel)}`}>
                          {userSkill.proficiencyLevel}
                        </span>
                        <button
                          onClick={() => setEditingSkillId(userSkill.id)}
                          className="text-slate-500 hover:text-indigo-400 p-0.5 transition-all cursor-pointer"
                          title="Change proficiency level"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDeleteSkill(userSkill.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                    title="Remove skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSkillModal
          initialType={modalType}
          onClose={() => setShowAddModal(false)}
          onAdded={(newSkill) => {
            setUserSkills([...userSkills, newSkill]);
          }}
        />
      )}
    </div>
  );
}
