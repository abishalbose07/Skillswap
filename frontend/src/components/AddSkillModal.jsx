import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { X, Plus, Sparkles, BookOpen, GraduationCap, AlertCircle, Check } from 'lucide-react';

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
        setCatalogSkills(response.data);
      } catch (err) {
        console.error('Failed to load skill catalog:', err);
      }
    };
    fetchCatalog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSkillId && !customSkillName.trim()) {
      setError('Please select a skill from the catalog or type a custom skill name.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${type === 'TEACH' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-indigo-500/10 text-indigo-400'}`}>
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              Add {type === 'TEACH' ? 'Teaching' : 'Learning'} Skill
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 flex items-center gap-2 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Skill Type Radio Toggle */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Skill Intention</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('TEACH')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  type === 'TEACH'
                    ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-4 h-4" /> Teach Others
              </button>
              <button
                type="button"
                onClick={() => setType('LEARN')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  type === 'LEARN'
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Want to Learn
              </button>
            </div>
          </div>

          {/* Catalog Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Select Skill from Catalog</label>
            <select
              value={selectedSkillId}
              onChange={(e) => {
                setSelectedSkillId(e.target.value);
                if (e.target.value) setCustomSkillName('');
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/80 transition-all"
            >
              <option value="">-- Choose from standard catalog --</option>
              {catalogSkills.map((sk) => (
                <option key={sk.id} value={sk.id}>
                  {sk.name} ({sk.category})
                </option>
              ))}
            </select>
          </div>

          {/* OR Custom Skill Name */}
          {!selectedSkillId && (
            <div className="space-y-3 pt-1 border-t border-slate-800/80">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Or Type Custom Skill Name</label>
                <input
                  type="text"
                  value={customSkillName}
                  onChange={(e) => setCustomSkillName(e.target.value)}
                  placeholder="e.g. Next.js, Kubernetes, Machine Learning..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Web Development, Languages, Music"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/80 transition-all"
                />
              </div>
            </div>
          )}

          {/* Proficiency Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Proficiency Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setProficiencyLevel(lvl)}
                  className={`py-2 px-2.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                    proficiencyLevel === lvl
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 pb-6 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
