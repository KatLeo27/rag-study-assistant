import { useState, useEffect } from 'react';
import { DocumentSidebar } from './components/DocumentSidebar';
import { ChatInterface } from './components/ChatInterface';
import type { Message } from './components/ChatInterface';
import { Trophy, Sun, Moon, GraduationCap, Lightbulb, TrendingUp, ArrowRight, Lock, User } from 'lucide-react';
import { LandingPage } from './components/LandingPage';

// Dynamically determine the correct API base URL
export const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://rag-study-assistant-1mm0.onrender.com');

export interface SubjectTheme {
  accent: string;
  bg: string;
  bgHover: string;
  border: string;
  gradient: string;
  shadow: string;
  emoji: string;
  appBg: string;
  sidebarBg: string;
  cardBg: string;
  inputBg: string;
}

// Pastel-themed Login Screen component with custom blueprint and theme toggling
function LoginScreen({ 
  onLogin, 
  darkMode, 
  onToggleDarkMode,
  onBackToHome
}: { 
  onLogin: (token: string, username: string) => void; 
  darkMode: boolean; 
  onToggleDarkMode: () => void; 
  onBackToHome: () => void;
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const name = username.trim();
    if (!name || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const endpoint = isRegister ? 'register' : 'login';
    try {
      const response = await fetch(`${API_BASE}/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: name, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || `Failed to ${endpoint}.`);
      }

      const data = await response.json();
      onLogin(data.token, data.username);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      // Auto-authenticate with a mock Google session for student
      onLogin('google_mock_token_123', 'Google Scholar');
      setLoading(false);
    }, 850);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#e8edff] dark:bg-[#070913] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-y-auto overflow-x-hidden font-sans">
      
      {/* Technical coordinate grids & geometric draft shapes behind left form */}
      <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-20 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="left-blueprint-grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-600/10 dark:text-indigo-400/8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#left-blueprint-grid)" />
        {/* Concentric circles and crosshairs in top-left */}
        <circle cx="10%" cy="20%" r="80" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3,3" className="text-indigo-600/15 dark:text-indigo-400/10" />
        <circle cx="10%" cy="20%" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-600/15 dark:text-indigo-400/10" />
        <line x1="10%" y1="5%" x2="10%" y2="35%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-indigo-600/15 dark:text-indigo-400/10" />
        <line x1="0" y1="20%" x2="25%" y2="20%" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5,5" className="text-indigo-600/15 dark:text-indigo-400/10" />
        {/* Angled lines representing vectors */}
        <line x1="8%" y1="18%" x2="15%" y2="8%" stroke="currentColor" strokeWidth="1" className="text-indigo-600/20 dark:text-indigo-400/15" />
        <text x="16%" y="8%" className="text-[9px] fill-indigo-600/30 dark:fill-indigo-400/25 font-mono font-bold">v = [dx, dy]</text>
        {/* Math formulas or academic drafts in bottom-right */}
        <text x="80%" y="85%" className="text-[10px] fill-indigo-600/30 dark:fill-indigo-400/20 font-mono font-bold">f(x) = σ(Wᵀx + b)</text>
        <text x="75%" y="90%" className="text-[10px] fill-indigo-600/25 dark:fill-indigo-400/15 font-mono font-bold">L_rag = -Σ y log(p)</text>
      </svg>
      
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 md:px-12 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-[#070913]/70 backdrop-blur-md z-30">
        {/* Logo block */}
        <div 
          onClick={onBackToHome}
          className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
          title="Back to Landing Page"
        >
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="#1e88e5" />
            <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="#1e88e5" />
          </svg>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
            ExamPrep AI
          </span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer border-none"
          >
            {isRegister ? 'Login' : 'Sign Up'} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main split content */}
      <div className="flex-1 w-full flex flex-col lg:flex-row pt-16">
        
        {/* Left Side: Auth Card Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 relative z-10">
          <div className="w-full max-w-md flex flex-col items-center card-flair">
            
            {/* Center book-lightning icon */}
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4">
              <svg className="w-9 h-9" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="#1e88e5" />
                <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="#1e88e5" />
              </svg>
            </div>

            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display text-center">
              Welcome
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium mb-4 text-center">
              {isRegister ? 'Sign up for an account to continue' : 'Sign in to your account to continue'}
            </p>

            {error && (
              <div className="w-full mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs font-semibold text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Google OAuth Login Button with hover shine */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full relative overflow-hidden group flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-sm transition-all shadow-sm cursor-pointer mb-4"
            >
              <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-500/10 dark:via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:animate-[shine_1s_ease-in-out_infinite] pointer-events-none"></div>
              
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            {/* Divider */}
            <div className="w-full flex items-center justify-center gap-4 mb-4">
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                Or continue with credentials
              </span>
              <div className="flex-1 h-[1px] bg-slate-200 dark:bg-slate-800"></div>
            </div>

            {/* Credential login form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 pl-0.5">
                  Username
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. scholar123"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:dark:border-indigo-400 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm border-solid"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 pl-0.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:dark:border-indigo-400 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm border-solid"
                    required
                  />
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 pl-0.5">
                    Confirm Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 text-slate-400 dark:text-slate-500 w-4 h-4 pointer-events-none" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:dark:border-indigo-400 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all shadow-sm border-solid"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-extrabold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer border-none"
              >
                {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Sign Up / Sign In link */}
            <div className="mt-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isRegister ? 'Already registered?' : 'New to the sanctuary?'}{' '}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError(null);
                }}
                className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer border-none bg-transparent"
              >
                {isRegister ? 'Sign In' : 'Sign Up'}
              </button>
            </div>

            {/* Terms Footer */}
            <p className="mt-5 text-[11px] text-slate-400 dark:text-slate-500 text-center leading-normal max-w-[320px]">
              By continuing, you agree to our{' '}
              <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="underline hover:text-slate-600 dark:hover:text-slate-300">Privacy Policy</a>.
            </p>
          </div>
        </div>

        {/* Right Side: Marketing Value Props Panel with active animated node graph */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f0f4ff] dark:bg-[#090b16] p-6 md:p-10 relative overflow-hidden transition-colors duration-300">
          
          {/* Subtle math blueprint grid overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20 pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="marketing-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-600/10 dark:text-indigo-400/8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#marketing-grid)" />
          </svg>

          <div className="w-full max-w-lg flex flex-col justify-center relative z-10 card-flair" style={{ animationDelay: '0.1s' }}>
            
            {/* Animated SVG RAG Knowledge Graph */}
            <div className="relative w-full aspect-video md:aspect-square max-w-[220px] mx-auto mb-4 flex items-center justify-center">
              {/* Pulsing glow halos */}
              <div className="absolute w-32 h-32 rounded-full bg-indigo-500/10 dark:bg-indigo-400/5 blur-xl animate-pulse"></div>
              <div className="absolute w-48 h-48 rounded-full bg-cyan-500/5 dark:bg-cyan-400/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>

              <svg className="w-full h-full z-10" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="line-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Connection Lines */}
                <line x1="100" y1="100" x2="40" y2="60" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="100" y1="100" x2="160" y2="60" stroke="url(#line-grad-1)" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="160" y2="140" stroke="url(#line-grad-1)" strokeWidth="1.5" strokeDasharray="3,3" />
                <line x1="100" y1="100" x2="40" y2="140" stroke="url(#line-grad-1)" strokeWidth="1.5" />

                {/* Pulsing signal dots traveling along paths */}
                <circle r="2" fill="#0ea5e9">
                  <animateMotion dur="3s" repeatCount="indefinite" path="M 100 100 L 40 60" />
                </circle>
                <circle r="2" fill="#8b5cf6">
                  <animateMotion dur="2.5s" repeatCount="indefinite" path="M 160 60 L 100 100" />
                </circle>
                <circle r="2" fill="#ec4899">
                  <animateMotion dur="4s" repeatCount="indefinite" path="M 100 100 L 160 140" />
                </circle>
                <circle r="2" fill="#10b981">
                  <animateMotion dur="3.5s" repeatCount="indefinite" path="M 40 140 L 100 100" />
                </circle>

                {/* Center Node: AI Brain */}
                <g>
                  <circle cx="100" cy="100" r="18" fill="#6366f1" />
                  <circle cx="100" cy="100" r="14" fill="white" className="dark:fill-slate-900" />
                  <text x="100" y="104" textAnchor="middle" fontSize="10" className="select-none pointer-events-none">🧠</text>
                </g>

                {/* Surrounding Nodes */}
                {/* Node 1: PDFs */}
                <g>
                  <circle cx="40" cy="60" r="11" fill="#a78bfa" />
                  <circle cx="40" cy="60" r="8.5" fill="white" className="dark:fill-slate-900" />
                  <text x="40" y="63" textAnchor="middle" fontSize="8" className="select-none pointer-events-none">📂</text>
                </g>
                {/* Node 2: Vector DB */}
                <g>
                  <circle cx="160" cy="60" r="11" fill="#22d3ee" />
                  <circle cx="160" cy="60" r="8.5" fill="white" className="dark:fill-slate-900" />
                  <text x="160" y="63" textAnchor="middle" fontSize="8" className="select-none pointer-events-none">💾</text>
                </g>
                {/* Node 3: AI Chunks */}
                <g>
                  <circle cx="160" cy="140" r="11" fill="#f472b6" />
                  <circle cx="160" cy="140" r="8.5" fill="white" className="dark:fill-slate-900" />
                  <text x="160" y="143" textAnchor="middle" fontSize="8" className="select-none pointer-events-none">✨</text>
                </g>
                {/* Node 4: User Progress */}
                <g>
                  <circle cx="40" cy="140" r="11" fill="#34d399" />
                  <circle cx="40" cy="140" r="8.5" fill="white" className="dark:fill-slate-900" />
                  <text x="40" y="143" textAnchor="middle" fontSize="8" className="select-none pointer-events-none">🎓</text>
                </g>
              </svg>

              {/* Labels */}
              <span className="absolute top-[22%] left-[4%] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm z-20 select-none pointer-events-none">PDFs</span>
              <span className="absolute top-[22%] right-[4%] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm z-20 select-none pointer-events-none">SQLite Vector</span>
              <span className="absolute bottom-[24%] right-[4%] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm z-20 select-none pointer-events-none">Gemini API</span>
              <span className="absolute bottom-[24%] left-[4%] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded text-[8px] font-bold shadow-sm z-20 select-none pointer-events-none">Scholar XP</span>
            </div>

            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight font-display mb-4 text-center lg:text-left">
              Transform Your Learning Journey with AI
            </h3>

            {/* Features lists structured as floating glass cards */}
            <div className="space-y-3 mb-5">
              {/* Card 1 */}
              <div className="glass-panel border border-slate-200/60 dark:border-slate-800/40 p-3 rounded-xl flex gap-3 items-start shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 relative z-10 w-full cursor-default group/card">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm group-hover/card:scale-105 transition-transform">
                  <GraduationCap className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Personalized Learning
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">
                    AI-powered study plans tailored to your learning style and goals
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="glass-panel border border-slate-200/60 dark:border-slate-800/40 p-3 rounded-xl flex gap-3 items-start shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 relative z-10 w-full cursor-default group/card">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm group-hover/card:scale-105 transition-transform">
                  <Lightbulb className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Smart Study Assistant
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Get instant help with questions and explanations
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="glass-panel border border-slate-200/60 dark:border-slate-800/40 p-3 rounded-xl flex gap-3 items-start shadow-sm hover:translate-y-[-2px] hover:shadow-md transition-all duration-300 relative z-10 w-full cursor-default group/card">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm group-hover/card:scale-105 transition-transform">
                  <TrendingUp className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    Progress Tracking
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Monitor your improvement with detailed analytics
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-800/80 mb-5"></div>

            {/* Stat row */}
            <div className="flex items-center gap-3.5">
              <span className="flex-shrink-0 px-3 py-1.5 rounded-full bg-indigo-600 text-white font-black text-xs shadow-sm">
                5K+
              </span>
              <span className="text-xs font-semibold text-slate-550 dark:text-slate-400 leading-normal">
                Students already improving their study habits with AI
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function App() {
  const [documents, setDocuments] = useState<string[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Auth States
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [user, setUser] = useState<{ username: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);

  // Subject Specific States
  const [currentSubject, setCurrentSubject] = useState<string>(() => {
    return localStorage.getItem('currentSubject') || 'General';
  });
  const [subjects, setSubjects] = useState<string[]>(['General']);
  
  // Chat Histories mapped by subject name: { [subjectName]: Message[] }
  const [chatHistories, setChatHistories] = useState<{ [subject: string]: Message[] }>({});

  // Gamification States
  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('xp');
    return saved ? parseInt(saved, 10) : 120;
  });
  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem('level');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [streak] = useState<number>(3);
  const [questionsAsked, setQuestionsAsked] = useState<number>(0);
  const [floatingXPs, setFloatingXPs] = useState<any[]>([]);
  const [confetti, setConfetti] = useState<any[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // Read saved dark mode setting or default to true
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  // Apply dark class to root document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync XP, Level, and currentSubject
  useEffect(() => {
    localStorage.setItem('xp', xp.toString());
    localStorage.setItem('level', level.toString());
    localStorage.setItem('currentSubject', currentSubject);
  }, [xp, level, currentSubject]);

  // Handle load/save of user-isolated chat history
  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`chatHistories_${user.username}`);
      setChatHistories(saved ? JSON.parse(saved) : {});
    } else {
      setChatHistories({});
    }
  }, [user]);

  useEffect(() => {
    if (user && Object.keys(chatHistories).length > 0) {
      localStorage.setItem(`chatHistories_${user.username}`, JSON.stringify(chatHistories));
    }
  }, [chatHistories, user]);

  // Fetch subjects on startup / login
  const fetchSubjects = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/api/subjects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const list = data.subjects || ['General'];
        if (!list.includes('General')) {
          list.unshift('General');
        }
        setSubjects(list);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  // Fetch documents for the active subject
  const fetchDocuments = async (subjectName: string) => {
    if (!token) return;
    setIsDocsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/documents?subject=${encodeURIComponent(subjectName)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch documents.');
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsDocsLoading(false);
    }
  };

  const handleSelectSubject = (subjectName: string) => {
    setCurrentSubject(subjectName);
    fetchDocuments(subjectName);
  };

  const handleCreateSubject = async (newSubjectName: string) => {
    if (!token) return;
    const cleaned = newSubjectName.trim();
    if (!cleaned) return;

    try {
      const response = await fetch(`${API_BASE}/api/subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: cleaned }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register subject on backend.');
      }
      
      await fetchSubjects();
      handleSelectSubject(cleaned);
    } catch (error) {
      console.error('Error creating subject:', error);
      if (!subjects.includes(cleaned)) {
        setSubjects(prev => sortedSubjects([...prev, cleaned]));
      }
      handleSelectSubject(cleaned);
    }
  };

  const sortedSubjects = (list: string[]) => {
    const sorted = [...list].filter(s => s !== 'General');
    sorted.sort();
    return ['General', ...sorted];
  };

  // Trigger loading documents and subjects on auth state change
  useEffect(() => {
    if (token) {
      fetchSubjects();
      fetchDocuments(currentSubject);
    }
  }, [token]);

  // Auth Action Handlers
  const handleLogin = (newToken: string, username: string) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify({ username }));
    setToken(newToken);
    setUser({ username });
    setCurrentSubject('General');
    localStorage.setItem('currentSubject', 'General');
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.warn('Logout notification to backend failed:', err);
      }
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setShowLogin(false);
  };

  // Web Audio Synth Sound generator
  const playSynthSound = (type: 'success' | 'send' | 'receive') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc2.start(ctx.currentTime + 0.1);
        osc2.stop(ctx.currentTime + 0.5);
      } else if (type === 'send') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      } else if (type === 'receive') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.07);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (err) {
      console.warn('Audio blocked:', err);
    }
  };

  const addFloatingXP = (amount: number) => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 50 + 25;
    const y = Math.random() * 10 + 75;
    setFloatingXPs(prev => [...prev, { id, text: amount > 0 ? `+${amount} XP` : `${amount} XP`, x, y }]);
    setTimeout(() => {
      setFloatingXPs(prev => prev.filter(f => f.id !== id));
    }, 1800);
  };

  const gainXP = (amount: number) => {
    const targetXp = level * 150;
    addFloatingXP(amount);
    
    setXp(prev => {
      const nextXp = prev + amount;
      if (nextXp >= targetXp) {
        setLevel(prevLv => prevLv + 1);
        setShowLevelUp(true);
        triggerConfetti();
        setTimeout(() => playSynthSound('success'), 200);
        return nextXp - targetXp;
      }
      return nextXp;
    });
  };

  const triggerConfetti = () => {
    const colors = ['#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];
    const particles = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 1.5}s`,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: `${Math.random() * 8 + 5}px`
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 4000);
  };

  const handleUploadSuccess = () => {
    fetchDocuments(currentSubject);
    fetchSubjects();
    triggerConfetti();
    playSynthSound('success');
    gainXP(50);
  };

  const handleDeleteDocument = async (docName: string) => {
    if (!token) return;
    if (!window.confirm(`Are you sure you want to remove "${docName}" from this subject library?`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_BASE}/api/documents?filename=${encodeURIComponent(docName)}&subject=${encodeURIComponent(currentSubject)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete document from backend.');
      }
      
      playSynthSound('send');
      fetchDocuments(currentSubject);
      addFloatingXP(-10);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!token) return;
    const userMessage: Message = { role: 'user', content };
    
    setChatHistories(prev => ({
      ...prev,
      [currentSubject]: [...(prev[currentSubject] || []), userMessage]
    }));

    setIsChatLoading(true);
    playSynthSound('send');
    gainXP(15);
    setQuestionsAsked(prev => prev + 1);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: content, subject: currentSubject }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || 'Failed to get answer.');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
      };

      setChatHistories(prev => ({
        ...prev,
        [currentSubject]: [...(prev[currentSubject] || []), assistantMessage]
      }));

      playSynthSound('receive');
    } catch (error: any) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message || 'Unknown backend error'}. Please verify the backend is running and Gemini API is key-configured correctly.`,
      };
      setChatHistories(prev => ({
        ...prev,
        [currentSubject]: [...(prev[currentSubject] || []), errorMessage]
      }));
      playSynthSound('receive');
    } finally {
      setIsChatLoading(false);
    }
  };

  const getSubjectColor = (subjectName: string): SubjectTheme => {
    const name = subjectName.toLowerCase().trim();
    if (name.includes('computer') || name.includes('cs') || name.includes('coding') || name.includes('programming')) {
      return {
        accent: 'text-sky-500 dark:text-sky-300',
        bg: 'bg-sky-400 dark:bg-sky-500',
        bgHover: 'hover:bg-sky-300 hover:dark:bg-sky-400',
        border: 'border-sky-200/50 dark:border-sky-900/30',
        gradient: 'from-sky-300 to-cyan-300 dark:from-sky-500 dark:to-cyan-500',
        shadow: 'shadow-sky-300/10 dark:shadow-sky-500/10',
        emoji: '💻',
        appBg: 'bg-[#f0f9ff] dark:bg-[#040d16]',
        sidebarBg: 'bg-[#e0f2fe]/95 dark:bg-[#071524]/90',
        cardBg: 'bg-[#f8fafc] dark:bg-[#0b2138]/60 border border-sky-100 dark:border-sky-900/30',
        inputBg: 'bg-[#ffffff] dark:bg-[#05111c] border border-sky-150 dark:border-sky-900/40'
      };
    }
    if (name.includes('physic') || name.includes('math') || name.includes('calc') || name.includes('alge')) {
      return {
        accent: 'text-purple-400 dark:text-purple-300',
        bg: 'bg-purple-300 dark:bg-purple-500',
        bgHover: 'hover:bg-purple-200 hover:dark:bg-purple-400',
        border: 'border-purple-200/50 dark:border-purple-900/30',
        gradient: 'from-purple-300 to-pink-300 dark:from-purple-500 dark:to-pink-500',
        shadow: 'shadow-purple-300/10 dark:shadow-purple-500/10',
        emoji: '⚛️',
        appBg: 'bg-[#faf5ff] dark:bg-[#0b0714]',
        sidebarBg: 'bg-[#f3e8ff]/95 dark:bg-[#120d20]/90',
        cardBg: 'bg-[#f8fafc] dark:bg-[#1d1433]/60 border border-purple-100 dark:border-purple-900/30',
        inputBg: 'bg-[#ffffff] dark:bg-[#0d0718] border border-purple-150 dark:border-purple-900/40'
      };
    }
    if (name.includes('chemistry') || name.includes('chem') || name.includes('bio') || name.includes('science')) {
      return {
        accent: 'text-emerald-500 dark:text-emerald-300',
        bg: 'bg-emerald-300 dark:bg-emerald-500',
        bgHover: 'hover:bg-emerald-200 hover:dark:bg-emerald-400',
        border: 'border-emerald-200/50 dark:border-emerald-900/30',
        gradient: 'from-emerald-300 to-teal-300 dark:from-emerald-500 dark:to-teal-555',
        shadow: 'shadow-emerald-300/10 dark:shadow-emerald-500/10',
        emoji: '🧪',
        appBg: 'bg-[#f0fdf4] dark:bg-[#030e09]',
        sidebarBg: 'bg-[#dcfce7]/95 dark:bg-[#071910]/90',
        cardBg: 'bg-[#f8fafc] dark:bg-[#0d271a]/60 border border-emerald-100 dark:border-emerald-900/30',
        inputBg: 'bg-[#ffffff] dark:bg-[#04120a] border border-emerald-150 dark:border-emerald-900/40'
      };
    }
    if (name.includes('history') || name.includes('lit') || name.includes('art') || name.includes('social')) {
      return {
        accent: 'text-orange-400 dark:text-orange-300',
        bg: 'bg-orange-300 dark:bg-orange-500',
        bgHover: 'hover:bg-orange-200 hover:dark:bg-orange-400',
        border: 'border-orange-200/50 dark:border-orange-900/30',
        gradient: 'from-orange-300 to-rose-300 dark:from-orange-500 dark:to-rose-500',
        shadow: 'shadow-orange-300/10 dark:shadow-orange-500/10',
        emoji: '📜',
        appBg: 'bg-[#fff7ed] dark:bg-[#0e0a05]',
        sidebarBg: 'bg-[#ffedd5]/95 dark:bg-[#1c120a]/90',
        cardBg: 'bg-[#f8fafc] dark:bg-[#2b1b0f]/60 border border-orange-100 dark:border-orange-900/30',
        inputBg: 'bg-[#ffffff] dark:bg-[#130b05] border border-orange-150 dark:border-orange-900/40'
      };
    }
    return {
      accent: 'text-indigo-400 dark:text-indigo-300',
      bg: 'bg-indigo-300 dark:bg-indigo-500',
      bgHover: 'hover:bg-indigo-200 hover:dark:bg-indigo-400',
      border: 'border-indigo-200/50 dark:border-indigo-900/30',
      gradient: 'from-indigo-300 to-purple-350 dark:from-indigo-500 dark:to-purple-500',
      shadow: 'shadow-indigo-300/10 dark:shadow-indigo-500/10',
      emoji: '📚',
      appBg: 'bg-[#f5f7ff] dark:bg-[#05060f]',
      sidebarBg: 'bg-[#e0e7ff]/95 dark:bg-[#0c0d20]/90',
      cardBg: 'bg-[#f8fafc] dark:bg-[#141630]/60 border border-indigo-100 dark:border-indigo-900/30',
      inputBg: 'bg-[#ffffff] dark:bg-[#070817] border border-indigo-150 dark:border-indigo-900/40'
    };
  };

  const theme = getSubjectColor(currentSubject);

  if (!token || !user) {
    if (showLogin) {
      return (
        <LoginScreen 
          onLogin={handleLogin} 
          darkMode={darkMode} 
          onToggleDarkMode={() => setDarkMode(!darkMode)} 
          onBackToHome={() => setShowLogin(false)}
        />
      );
    }
    return (
      <LandingPage 
        onEnterApp={() => setShowLogin(true)} 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />
    );
  }

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${theme.appBg} text-slate-800 dark:text-slate-100 transition-colors duration-300 relative`}>
      
      {/* Confetti particles */}
      {confetti.map(p => (
        <div
          key={p.id}
          className="confetti-particle z-50 pointer-events-none"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay
          }}
        />
      ))}

      {/* Floating XP tracker */}
      {floatingXPs.map(f => (
        <div
          key={f.id}
          className="float-xp absolute z-50 pointer-events-none text-sm font-extrabold text-amber-500 dark:text-amber-450 bg-amber-500/10 dark:bg-amber-450/10 border border-amber-500/25 px-2.5 py-1 rounded-full shadow-lg"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
        >
          {f.text}
        </div>
      ))}

      {/* Level Up modal pop */}
      {showLevelUp && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="level-up-modal bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 max-w-sm w-full p-8 rounded-3xl text-center shadow-2xl relative overflow-hidden glow-interactive">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.gradient}`}></div>
            <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-bounce" />
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 font-display">LEVEL UP! 🎓</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              You've completed study nodes and unlocked **Level {level} Scholar** status!
            </p>
            <button
              onClick={() => setShowLevelUp(false)}
              className={`py-3 px-6 w-full rounded-xl bg-gradient-to-tr ${theme.gradient} text-white font-bold transition-all shadow-lg ${theme.shadow} cursor-pointer border-none`}
            >
              Continue Studying
            </button>
          </div>
        </div>
      )}

      <DocumentSidebar
        documents={documents}
        isLoading={isDocsLoading}
        onUploadSuccess={handleUploadSuccess}
        onRefresh={() => fetchDocuments(currentSubject)}
        onDeleteDocument={handleDeleteDocument}
        xp={xp}
        level={level}
        streak={streak}
        questionsAsked={questionsAsked}
        // Subject RAG parameters
        currentSubject={currentSubject}
        subjects={subjects}
        onSelectSubject={handleSelectSubject}
        onCreateSubject={handleCreateSubject}
        theme={theme}
        token={token}
        user={user}
        onLogout={handleLogout}
      />
      
      <ChatInterface
        messages={chatHistories[currentSubject] || []}
        isLoading={isChatLoading}
        onSendMessage={handleSendMessage}
        hasDocuments={documents.length > 0}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        currentSubject={currentSubject}
        theme={theme}
      />
    </div>
  );
}

export default App;
