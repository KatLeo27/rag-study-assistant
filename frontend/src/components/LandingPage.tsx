import { Sun, Moon, Trophy, Lightbulb, TrendingUp, ArrowRight, Lock, Shield, Sparkles, BookOpen } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function LandingPage({
  onEnterApp,
  darkMode,
  onToggleDarkMode
}: LandingPageProps) {
  return (
    <div className="h-screen w-screen bg-[#e8edff] dark:bg-[#070913] text-slate-800 dark:text-slate-100 transition-colors duration-300 relative overflow-y-auto overflow-x-hidden font-sans flex flex-col scroll-smooth">
      {/* Background grid for the entire landing page */}
      <div className="absolute inset-0 opacity-[0.07] dark:opacity-[0.05] pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="global-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-700 dark:text-indigo-400" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#global-grid)" />
        </svg>
      </div>

      {/* Top Header bar */}
      <header className="h-16 flex items-center justify-between px-6 md:px-12 border-b border-slate-200/50 dark:border-slate-800/40 bg-white/70 dark:bg-[#070913]/70 backdrop-blur-md sticky top-0 z-40">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <svg className="w-7 h-7 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="#1e88e5" />
            <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="#1e88e5" />
          </svg>
          <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
            ExamPrep AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-655 dark:text-slate-300">
          <a href="#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</a>
          <a href="#ranks" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Scholar Ranks</a>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onToggleDarkMode}
            className="p-2.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-850 transition-all cursor-pointer flex items-center justify-center shadow-sm"
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <button
            onClick={onEnterApp}
            className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white font-black text-sm shadow-md transition-all cursor-pointer border-none"
          >
            Enter App <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 md:px-12 pt-16 pb-20 md:pt-24 md:pb-28 flex flex-col items-center text-center overflow-hidden border-b border-slate-200/40 dark:border-slate-800/30">
        {/* Blueprint faded shapes */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50%" cy="45%" r="320" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6,6" className="text-indigo-600/15 dark:text-indigo-400/10" />
            <circle cx="50%" cy="45%" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-600/10 dark:text-indigo-400/5" />
          </svg>
        </div>

        <div className="relative z-10 max-w-4xl flex flex-col items-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/35 border border-indigo-200/50 dark:border-indigo-850/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold mb-6 select-none animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
            Intelligent RAG Document Learning
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-display max-w-3xl leading-[1.08] mb-6">
            Study Smarter, Not Harder with{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-indigo-400 bg-clip-text text-transparent">
              ExamPrep AI
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-600 dark:text-slate-350 max-w-2xl font-medium leading-relaxed mb-8">
            Upload notes, lecture slides, and textbooks. Converse with a secure, isolated RAG system that extracts concepts instantly, rewards your active recall, and tracks your scholar rank.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 relative z-10">
            <button
              onClick={onEnterApp}
              className="px-8 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-black text-base shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/10 transition-all hover:-translate-y-0.5 cursor-pointer border-none flex items-center gap-2"
            >
              Get Started for Free <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-base shadow-sm transition-all hover:-translate-y-0.5"
            >
              Explore Features
            </a>
          </div>

          {/* Glassmorphic Study Hub Mockup Dashboard */}
          <div className="w-full max-w-3xl rounded-2xl bg-white/45 dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-800/40 shadow-2xl p-3 md:p-5 backdrop-blur-md relative group select-none">
            {/* Background glowing ring */}
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-30 transition duration-1000 -z-10"></div>
            
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-800/30 pb-3 mb-3 px-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400/80"></span>
                <span className="w-3 h-3 rounded-full bg-green-400/80"></span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono ml-2">student_study_workspace.exe</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <Lock className="w-3 h-3 text-indigo-500 mr-1" /> Isolated & Secure
              </div>
            </div>

            {/* Mock Body */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* Left sidebar Mock */}
              <div className="md:col-span-4 rounded-xl bg-white/80 dark:bg-slate-950/45 p-3 border border-slate-200/40 dark:border-slate-850/40 flex flex-col gap-2.5">
                <span className="text-[9px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">Document Library</span>
                
                <div className="flex items-center justify-between p-2 rounded bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 text-xs font-bold text-indigo-600 dark:text-indigo-455">
                  <span className="truncate flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0" /> Physics_Unit_3.pdf
                  </span>
                  <span className="text-[8px] bg-indigo-100 dark:bg-indigo-900 px-1 rounded text-indigo-700 dark:text-indigo-300">Active</span>
                </div>
                
                <div className="flex items-center p-2 rounded border border-slate-200/20 dark:border-slate-800/20 text-xs text-slate-500 dark:text-slate-400 gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" /> Chemistry_Organic.pdf
                </div>
                
                <div className="flex items-center p-2 rounded border border-slate-200/20 dark:border-slate-800/20 text-xs text-slate-500 dark:text-slate-400 gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" /> Biology_Genetics_Ch4.pdf
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-800/30">
                  <div className="bg-indigo-50 dark:bg-indigo-950/25 p-2 rounded border border-indigo-100/30 dark:border-indigo-900/20">
                    <div className="flex items-center justify-between text-[9px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                      <span>SCHOLAR LEVEL 5</span>
                      <span>980 / 1000 XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-indigo-205 dark:bg-indigo-900/40 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Interface Mock */}
              <div className="md:col-span-8 rounded-xl bg-white/80 dark:bg-slate-950/45 p-3 border border-slate-200/40 dark:border-slate-850/40 flex flex-col justify-between min-h-[200px]">
                <div className="space-y-3">
                  {/* User Bubble */}
                  <div className="flex justify-end">
                    <div className="bg-indigo-600 text-white rounded-2xl rounded-tr-none px-3.5 py-1.5 text-xs max-w-[85%] shadow-sm">
                      Explain quantum tunneling in simple terms?
                    </div>
                  </div>
                  {/* AI Bubble */}
                  <div className="flex justify-start">
                    <div className="bg-slate-50 dark:bg-slate-850/50 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs max-w-[90%] shadow-sm border border-slate-200/30 dark:border-slate-800/30">
                      <div className="flex items-center gap-1.5 mb-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="currentColor" />
                          <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="currentColor" />
                        </svg>
                        <span>ExamPrep AI</span>
                      </div>
                      Quantum tunneling occurs when a subatomic particle passes through a energy barrier that it classically shouldn't be able to cross. Think of a ball rolling up a hill—if it doesn't have enough speed, it rolls back. But in quantum physics, the wave-like particle has a non-zero probability of appearing on the other side!
                    </div>
                  </div>
                </div>
                {/* Mock Input */}
                <div className="mt-4 flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-full px-4 py-1.5 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-medium">Ask a follow-up about quantum nodes...</span>
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-bold">→</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-6 md:px-12 py-20 bg-white/40 dark:bg-slate-900/10 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/30 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Engineered for Academic Excellence
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm md:text-base max-w-xl mx-auto">
              Unlock a private academic core designed to boost memory retention, streamline study workflows, and track achievements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-305 hover:-translate-y-1 group">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Lightbulb className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Semantic Context Engine</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Interact with textbooks, papers, and lecture slides. The RAG semantic retriever targets specific paragraphs to give you instant, cited answers.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-305 hover:-translate-y-1 group">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Shield className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Isolated Account Security</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Your study materials and vector embeddings are physically and logically segregated. No leakages, no public access, complete account isolation.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 shadow-sm hover:shadow-md transition-all duration-305 hover:-translate-y-1 group">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Trophy className="w-5.5 h-5.5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Scholar XP & Achievements</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Watch your study statistics grow. Earn Scholar XP as you ask questions and review documents, leveling up your custom avatar and title rank.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="px-6 md:px-12 py-20 border-b border-slate-200/40 dark:border-slate-800/30 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Three Steps to Academic Mastery
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-3 font-medium text-sm md:text-base">
              A frictionless learning pipeline from upload to exam-ready competence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 text-xl font-extrabold text-indigo-600 dark:text-indigo-400 relative z-10">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upload Material</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                Drag-and-drop lecture slides, study syllabus PDFs, or books into the secured workspace library.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 text-xl font-extrabold text-indigo-600 dark:text-indigo-400 relative z-10">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Pick Course Subject</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                Organize your dashboard into subject categories (Math, Physics, Biology) with custom pastel theme schemes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center mb-4 text-xl font-extrabold text-indigo-600 dark:text-indigo-400 relative z-10">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Interrogate & Absorb</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs leading-relaxed">
                Ask specific questions, extract bullet summaries, test your recall, and level up your scholar score.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Scholar Ranks gamification spotlight */}
      <section id="ranks" className="px-6 md:px-12 py-20 bg-slate-50 dark:bg-slate-900/10 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/30 scroll-mt-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/45 border border-indigo-200/20 dark:border-indigo-805/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-black tracking-wider uppercase mb-4">
                Gamified Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white font-display leading-[1.15] mb-4">
                Level Up From Neophyte to Sage
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-6">
                Active recall is the key to memory consolidation. ExamPrep AI integrates gamified reward feedback. Study continuously to unlock ranks, badges, and avatars.
              </p>
              
              <ul className="space-y-3 font-semibold text-slate-600 dark:text-slate-300 text-sm">
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">✓</span>
                  Earn XP for reading document chunks
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">✓</span>
                  Earn bonuses for comprehensive Q&A
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-400 text-xs font-bold">✓</span>
                  Ascend local leaderboards as you study
                </li>
              </ul>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Level 1 Card */}
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-4 shadow-sm hover:scale-[1.02] transition-transform text-left">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Rank 1</span>
                  <span className="text-lg">🌱</span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white">Neophyte Scholar</h4>
                <p className="text-slate-405 text-xs mt-1">Starting level. Open your first textbook PDF and index your initial study course.</p>
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              {/* Level 5 Card */}
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-md hover:scale-[1.02] transition-transform text-left border-l-indigo-600 dark:border-l-indigo-500 border-l-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Rank 5</span>
                  <span className="text-lg">👑</span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white">Master Scholar</h4>
                <p className="text-slate-450 dark:text-slate-400 text-xs mt-1">Proven study habits. Generate 20+ chat responses and study 5 parallel subjects.</p>
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 dark:bg-indigo-400 rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>

              {/* Level 10 Card */}
              <div className="bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 rounded-xl p-4 shadow-sm hover:scale-[1.02] transition-transform text-left">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">Rank 10</span>
                  <span className="text-lg">🧙‍♂️</span>
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white">Grand Chancellor</h4>
                <p className="text-slate-400 text-xs mt-1">Omniscient command. Read 1,000+ chunks, answer comprehensive quizzes with 95% accuracy.</p>
                <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>

              {/* Stat Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl p-4 shadow-md flex flex-col justify-between text-left">
                <div>
                  <h4 className="font-bold text-sm text-indigo-100 uppercase tracking-wider">Active Community</h4>
                  <p className="text-3xl font-black mt-2">5,280+</p>
                  <p className="text-xs text-indigo-200 mt-1">Students studying actively right now</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-100 font-bold mt-4">
                  <TrendingUp className="w-4 h-4 text-emerald-300" /> +14% growth this week
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 md:px-12 border-t border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="#1e88e5" />
              <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="#1e88e5" />
            </svg>
            <span className="font-extrabold text-lg tracking-tight text-white font-display">
              ExamPrep AI
            </span>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#ranks" className="hover:text-white transition-colors">Scholar Ranks</a>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} ExamPrep AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
