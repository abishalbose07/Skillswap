import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Plus, Sparkles, BookOpen, GraduationCap, AlertCircle, Check, Award } from 'lucide-react';

export default function AddSkillModal({ initialType = 'TEACH', onClose, onAdded }) {
  const [catalogSkills, setCatalogSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [category, setCategory] = useState('General');
  const [type, setType] = useState(initialType);
  const [proficiencyLevel, setProficiencyLevel] = useState('INTERMEDIATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await api.get('/skills');
        setCatalogSkills(response.data || []);
      } catch (err) {
        console.error('Failed to load skill catalog:', err);
      }
    };
    fetchCatalog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkillId && !customSkillName.trim()) {
      setError('Please select a skill from the list or enter a custom skill name.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const payload = {
        type,
        proficiencyLevel,
      };

      if (selectedSkillId) {
        payload.skillId = parseInt(selectedSkillId, 10);
      } else {
        payload.skillName = customSkillName.trim();
        payload.category = category;
      }

      const response = await api.post('/users/me/skills', payload);
      onAdded(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to add skill:', err);
      setError(err.response?.data?.error || 'Failed to add skill to your profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070b13]/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#111827] border border-white/[0.1] rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-xl ${
                type === 'TEACH'
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'bg-indigo-500/10 text-indigo-400'
              }`}
            >
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Add {type === 'TEACH' ? 'Teaching Skill' : 'Learning Goal'}
              </h3>
              <p className="text-xs text-slate-400">
                {type === 'TEACH'
                  ? 'Share knowledge you can mentor others in'
                  : 'Specify what you want to master this term'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-300 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Skill Type Radio Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Skill Intention</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('TEACH')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  type === 'TEACH'
                    ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-[#0b0f19] border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-4 h-4" />
                I Want To Teach
              </button>

              <button
                type="button"
                onClick={() => setType('LEARN')}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                  type === 'LEARN'
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 shadow-md shadow-indigo-600/10'
                    : 'bg-[#0b0f19] border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                I Want To Learn
              </button>
            </div>
          </div>

          {/* Catalog Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Select From Campus Catalog
            </label>
            <select
              value={selectedSkillId}
              onChange={(e) => {
                setSelectedSkillId(e.target.value);
                if (e.target.value) setCustomSkillName('');
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="">— Or type a custom skill below —</option>
              {catalogSkills.map((sk) => (
                <option key={sk.id} value={sk.id}>
                  {sk.name} ({sk.category})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Skill Input */}
          {!selectedSkillId && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Custom Skill Name</label>
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Blender 3D"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Languages">Languages</option>
                  <option value="Music & Arts">Music & Arts</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          )}

          {/* Proficiency Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              {type === 'TEACH' ? 'Your Proficiency Level' : 'Target Goal Level'}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setProficiencyLevel(lvl)}
                  className={`py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    proficiencyLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
                      : 'bg-[#0b0f19] text-slate-400 border-white/[0.08] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pb-6 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-slate-300 text-xs font-semibold border border-white/[0.08] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                'Add to Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
