import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Compass,
  Award,
  Inbox,
  Zap,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
  User,
  ShieldCheck,
  Activity,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingRequests }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Hub', icon: LayoutDashboard },
    { id: 'matches', label: 'Discover', icon: Compass, highlight: true },
    { id: 'skills', label: 'My Skills', icon: Award },
    { id: 'requests', label: 'Requests', icon: Inbox, badge: pendingRequests },
    { id: 'swaps', label: 'Active Swaps', icon: Zap },
  ];

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const userName = user?.fullName || user?.name || 'Student';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-50 bg-[#0d1322]/85 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Identity */}
          <div
            onClick={() => handleNavClick(isAuthenticated ? 'dashboard' : 'login')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d1322] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Swap</span>
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Campus
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
                      isActive
                        ? 'text-white bg-white/[0.08] shadow-sm border border-white/[0.08]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    } ${item.highlight && !isActive ? 'text-indigo-300 hover:text-indigo-200' : ''}`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? item.highlight
                            ? 'text-cyan-400'
                            : 'text-indigo-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>

                    {/* Notification Badge */}
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-black shadow-md shadow-rose-500/30 animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {/* Active Tab Underline Indicator */}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => handleNavClick('health')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'health'
                    ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                System Health
              </button>
            </div>
          )}

          {/* User Profile / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer select-none group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-500/20">
                    {userInitial}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-200 leading-tight max-w-[110px] truncate">
                      {userName}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight">
                      {user?.college || 'Student'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#0f172a] border border-white/[0.1] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                      <p className="text-xs font-bold text-white truncate">{userName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all text-left cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-indigo-400" />
                      View Profile
                    </button>

                    <button
                      onClick={() => handleNavClick('health')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all text-left cursor-pointer"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      System Health
                    </button>

                    <div className="border-t border-white/[0.06] mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          handleNavClick('login');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => handleNavClick('login')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white/[0.1] text-white border border-white/[0.1]'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleNavClick('register')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  Get Started
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            {Boolean(pendingRequests > 0) && (
              <button
                onClick={() => handleNavClick('requests')}
                className="relative p-2 rounded-xl bg-rose-500/10 text-rose-400"
              >
                <Inbox className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {pendingRequests}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/[0.05] text-slate-300 hover:text-white hover:bg-white/[0.1] transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d1322] border-b border-white/[0.08] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          {isAuthenticated ? (
            <>
              {/* User overview in mobile menu */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{userName}</p>
                  <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                </div>
              </div>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                        : 'text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {Boolean(item.badge && item.badge > 0) && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-xs font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <button
                onClick={() => handleNavClick('profile')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/[0.04]"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile & Settings
              </button>

              <button
                onClick={() => handleNavClick('health')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04]"
              >
                <Activity className="w-4 h-4 text-cyan-400" />
                Backend Health Status
              </button>

              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    logout();
                    handleNavClick('login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full py-3 rounded-xl text-center text-sm font-semibold text-white bg-white/[0.05] border border-white/[0.08]"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('register')}
                className="w-full py-3 rounded-xl text-center text-sm font-bold text-slate-950 bg-gradient-to-r from-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20"
              >
                Create Free Account
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
