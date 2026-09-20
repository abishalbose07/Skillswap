import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import MySkillsPage from './pages/MySkillsPage';
import MatchesPage from './pages/MatchesPage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import ActiveSwapsPage from './pages/ActiveSwapsPage';
import api from './api/axios';
import { Activity, CheckCircle2, XCircle, RefreshCw, Server, Database, Code2 } from 'lucide-react';

function HealthDashboard() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();
    try {
      const response = await api.get('/health');
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setHealthData(response.data);
    } catch (err) {
      console.error('Failed to fetch backend health:', err);
      setError(err.message || 'Cannot reach Spring Boot backend on http://localhost:8080');
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-cyan-400 font-medium">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          SkillSwap Phase 5 – Swap Request & Active Swap System
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
          SkillSwap Backend
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto">
          Spring Boot 3 + Reciprocal Matching + Swap Requests + Active Swaps + React + Vite + Tailwind CSS.
        </p>
      </div>

      {/* Health Card */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${error ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-200">Backend Communication</h2>
              <p className="text-xs text-slate-400">GET /api/health via Axios</p>
            </div>
          </div>

          <button
            onClick={fetchHealth}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all border border-slate-700 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Test Connection
          </button>
        </div>

        {loading ? (
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
            <span className="text-sm text-slate-300">Connecting to Spring Boot backend...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-red-300">Connection Failed</p>
              <p className="text-xs text-red-400/80">{error}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-emerald-300">
                  {healthData?.message || 'Backend Operational!'}
                </p>
                <p className="text-xs text-emerald-400/70">
                  Service: {healthData?.service || 'SkillSwap Backend'} • {healthData?.timestamp}
                </p>
              </div>
            </div>
            {latency && (
              <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                {latency} ms
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Code2 className="w-4 h-4 text-cyan-400" /> Frontend</span>
              <span className="text-emerald-400 font-medium">Ready</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">React 19 + Vite</p>
            <p className="text-xs text-slate-500">Port 5173 • Tailwind CSS</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Server className="w-4 h-4 text-indigo-400" /> Backend</span>
              <span className={healthData ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                {healthData ? 'Online' : 'Checking'}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-200">Spring Boot 3</p>
            <p className="text-xs text-slate-500">Port 8080 • Phase 5</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><Database className="w-4 h-4 text-emerald-400" /> Database</span>
              <span className="text-cyan-400 font-medium">Configured</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">MySQL / JPA</p>
            <p className="text-xs text-slate-500">Swap Requests + Swaps</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MainContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(isAuthenticated ? 'matches' : 'login');
  const [pendingRequests, setPendingRequests] = useState(0);

  // Poll for pending received requests to show badge
  const fetchPendingCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await api.get('/swap-requests/received');
      const pending = res.data.filter(r => r.status === 'PENDING').length;
      setPendingRequests(pending);
    } catch {
      // silently ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && activeTab !== 'health' && activeTab !== 'skills' && activeTab !== 'profile') {
      setActiveTab('matches');
    }
  }, [isAuthenticated]);

  // Poll every 30 seconds for new pending requests
  useEffect(() => {
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [fetchPendingCount]);

  // Refresh count whenever we navigate to requests tab
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchPendingCount();
    }
  }, [activeTab, fetchPendingCount]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingRequests={pendingRequests}
      />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative">
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full relative z-10">
          {activeTab === 'health' && <HealthDashboard />}
          {activeTab === 'login' && (
            <LoginPage
              onSuccess={() => setActiveTab('matches')}
              onSwitchToRegister={() => setActiveTab('register')}
            />
          )}
          {activeTab === 'register' && (
            <RegisterPage
              onSuccess={() => setActiveTab('matches')}
              onSwitchToLogin={() => setActiveTab('login')}
            />
          )}
          {activeTab === 'profile' && (
            <ProfilePage onNavigateToSkills={() => setActiveTab('skills')} />
          )}
          {activeTab === 'skills' && <MySkillsPage />}
          {activeTab === 'matches' && (
            <MatchesPage
              onNavigateToRequests={() => {
                fetchPendingCount();
                setActiveTab('requests');
              }}
            />
          )}
          {activeTab === 'requests' && (
            <SwapRequestsPage
              onNavigateToSwaps={() => setActiveTab('swaps')}
            />
          )}
          {activeTab === 'swaps' && <ActiveSwapsPage />}
        </div>
      </main>

      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-900">
        SkillSwap Phase 5 – Swap Request & Active Swap System
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
