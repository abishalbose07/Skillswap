import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LogIn, UserPlus, Activity, Sparkles, Award, Compass, Send, Zap, Inbox } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingRequests }) {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('health')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-900 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-100 tracking-tight">Skill<span className="text-cyan-400">Swap</span></span>
              <span className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">MVP v1</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('health')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'health' 
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Health API
            </button>

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'matches' 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                      : 'text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Discover Matches
                </button>

                <button
                  onClick={() => setActiveTab('skills')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'skills' 
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                  My Skills
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'requests' 
                      ? 'bg-slate-800 text-indigo-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5 text-indigo-400" />
                  Requests
                  {pendingRequests > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 text-[9px] font-black flex items-center justify-center">
                      {pendingRequests}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('swaps')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'swaps' 
                      ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  My Swaps
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">
                    {(user?.fullName || user?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{user?.fullName || user?.name}</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setActiveTab('login');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'login' 
                      ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20' 
                      : 'text-slate-300 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>

                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === 'register' 
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-500/20' 
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
