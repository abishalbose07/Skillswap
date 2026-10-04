import React, { useState } from 'react';
import api from '../api/axios';
import { X, User, GraduationCap, BookOpen, Calendar, Image as ImageIcon, Save, AlertCircle } from 'lucide-react';

export default function EditProfileModal({ user, onClose, onUpdated }) {
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    college: user?.college || '',
    course: user?.course || '',
    yearOfStudy: user?.yearOfStudy || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/users/me', formData);
      onUpdated(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
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
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                Edit Profile
              </h3>
              <p className="text-xs text-slate-400">Keep your student profile up-to-date</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-indigo-400" /> Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Alex Rivers"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> College / University
              </label>
              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Stanford University"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Course / Major
              </label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleChange}
                placeholder="Computer Science"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Year of Study
              </label>
              <input
                type="text"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                placeholder="Sophomore / Year 2"
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" /> Avatar Image URL
              </label>
              <input
                type="url"
                name="profileImage"
                value={formData.profileImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">About / Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell other students about yourself, your learning goals, and how you like to collaborate..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#0b0f19] border border-white/[0.1] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition-all resize-none"
            />
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
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
