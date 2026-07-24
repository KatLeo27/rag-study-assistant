import React, { useRef, useState } from 'react';
import { Upload, FileText, Loader2, AlertCircle, RefreshCw, Flame, Award, Zap, Compass, Trophy, CheckCircle2, ListTodo, Plus, Trash2, LogOut } from 'lucide-react';
import type { SubjectTheme } from '../App';
import { API_BASE } from '../App';

interface DocumentSidebarProps {
  documents: string[];
  isLoading: boolean;
  onUploadSuccess: () => void;
  onRefresh: () => void;
  onDeleteDocument: (docName: string) => void;
  xp: number;
  level: number;
  streak: number;
  questionsAsked: number;
  currentSubject: string;
  subjects: string[];
  onSelectSubject: (subject: string) => void;
  onCreateSubject: (subject: string) => void;
  theme: SubjectTheme;
  token: string | null;
  user: { username: string } | null;
  onLogout: () => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  documents,
  isLoading,
  onUploadSuccess,
  onRefresh,
  onDeleteDocument,
  xp,
  level,
  streak,
  questionsAsked,
  currentSubject,
  subjects,
  onSelectSubject,
  onCreateSubject,
  theme,
  token,
  user,
  onLogout,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState('');
  const [showAddSubject, setShowAddSubject] = useState(false);
  
  // Tab State: 'materials' | 'gamify'
  const [activeTab, setActiveTab] = useState<'materials' | 'gamify'>('materials');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Only PDF files are supported.');
      return;
    }

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', currentSubject);

    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to upload PDF.');
      }

      onUploadSuccess();
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    onCreateSubject(newSubject.trim());
    setNewSubject('');
    setShowAddSubject(false);
  };

  const targetXp = level * 150;
  const xpPercentage = Math.min(100, Math.round((xp / targetXp) * 100));
  
  const dailyGoalTarget = 3;
  const dailyGoalPercentage = Math.min(100, Math.round((questionsAsked / dailyGoalTarget) * 100));

  // Calculated total XP across all levels
  const totalXp = xp + (level - 1) * 200;

  // Helper to retrieve emojis for other subjects dynamically
  const getEmoji = (name: string): string => {
    const n = name.toLowerCase().trim();
    if (n.includes('computer') || n.includes('cs') || n.includes('coding') || n.includes('programming')) return '💻';
    if (n.includes('physic') || n.includes('math') || n.includes('calc') || n.includes('alge')) return '⚛️';
    if (n.includes('chemistry') || n.includes('chem') || n.includes('bio') || n.includes('science')) return '🧪';
    if (n.includes('history') || n.includes('lit') || n.includes('art') || n.includes('social')) return '📜';
    return '📚';
  };

  const mockLeaderboard = [
    { name: 'Albert Einstein', level: 5, xp: 980, avatar: '👑' },
    { name: 'Ada Lovelace', level: 4, xp: 820, avatar: '🥈' },
    { name: 'You (Scholar)', level: level, xp: totalXp, avatar: '🥉', isUser: true },
    { name: 'Isaac Newton', level: 1, xp: 95, avatar: '4️⃣' }
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className={`w-80 ${theme.sidebarBg} backdrop-blur-xl border-r ${theme.border} flex flex-col h-full text-slate-800 dark:text-slate-100 z-10 relative transition-colors duration-300`}>
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 18,25 C 23,18 39,18 47,30 L 38,54 L 47,54 L 43,85 C 39,73 23,73 18,80 Z" fill="#1e88e5" />
                <path d="M 53,30 C 61,18 77,18 82,25 L 82,80 C 77,73 61,73 49,85 L 53,54 L 44,54 Z" fill="#1e88e5" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-600 dark:from-white dark:via-slate-200 dark:to-indigo-300 bg-clip-text text-transparent">
              ExamPrep AI
            </span>
          </h1>
          <p className="text-[10px] text-indigo-600 dark:text-slate-400 font-bold tracking-wider mt-1.5 uppercase flex items-center gap-1">
            <Compass className={`w-3.5 h-3.5 ${theme.accent} animate-spin-slow`} />
            Cosmic Study Hub
          </p>
        </div>
      </div>

      {/* Subject Selector Section */}
      <div className="px-4 pt-4 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-wider pl-1">
            Active Course
          </label>
          <button
            onClick={() => setShowAddSubject(!showAddSubject)}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:scale-105 transition-all cursor-pointer flex items-center gap-0.5 text-[10px] font-bold border-none bg-transparent"
            title="Create new subject"
          >
            <Plus className="w-3 h-3" /> Add Subject
          </button>
        </div>

        {showAddSubject ? (
          <form onSubmit={handleAddSubjectSubmit} className="flex gap-1.5 animate-pulse-subtle">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="e.g. Physics 101"
              maxLength={20}
              className={`flex-1 ${theme.inputBg} rounded-xl px-2.5 py-1.5 text-xs text-slate-800 dark:text-white outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/85`}
              autoFocus
            />
            <button
              type="submit"
              className={`p-1.5 rounded-xl bg-gradient-to-tr ${theme.gradient} text-white font-bold text-xs hover:scale-105 transition-all cursor-pointer border-none`}
            >
              Add
            </button>
          </form>
        ) : (
          <select
            value={currentSubject}
            onChange={(e) => onSelectSubject(e.target.value)}
            className={`w-full ${theme.inputBg} rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer shadow-sm`}
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {getEmoji(sub)} {sub}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Gamification Stats Section */}
      <div className={`p-4 mx-4 mt-3 rounded-2xl ${theme.cardBg} space-y-3 shadow-sm transition-colors duration-300`}>
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
            <Award className={`w-4 h-4 ${theme.accent}`} /> Scholar Rank
          </span>
          <span className={`text-[10px] bg-indigo-500/10 dark:bg-indigo-400/10 ${theme.accent} px-2.5 py-0.5 rounded-full border ${theme.border} font-bold`}>
            Level {level}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
            <span>XP milestone</span>
            <span>{xp} / {targetXp} XP</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r ${theme.gradient} rounded-full transition-all duration-500`} style={{ width: `${xpPercentage}%` }}></div>
          </div>
        </div>

        {/* Streak & Goal Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className={`p-2 rounded-xl ${theme.inputBg} flex items-center gap-2 shadow-sm`}>
            <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
            <div className="leading-tight">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Streak</p>
              <p className="text-xs text-slate-800 dark:text-white font-extrabold">{streak} Days</p>
            </div>
          </div>
          <div className={`p-2 rounded-xl ${theme.inputBg} flex items-center gap-2 shadow-sm`}>
            <Zap className={`w-5 h-5 ${theme.accent} animate-pulse`} />
            <div className="leading-tight">
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase">Daily Goal</p>
              <p className="text-xs text-slate-800 dark:text-white font-extrabold">{dailyGoalPercentage}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex p-1 mx-4 mt-3.5 bg-slate-200/50 dark:bg-slate-950/60 border border-slate-250 dark:border-slate-800/45 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none bg-transparent ${
            activeTab === 'materials'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold border border-slate-200/40 dark:border-slate-800/40'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Library</span>
        </button>
        <button
          onClick={() => setActiveTab('gamify')}
          className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border-none bg-transparent ${
            activeTab === 'gamify'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold border border-slate-200/40 dark:border-slate-800/40'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Quests</span>
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'materials' ? (
        <>
          {/* Upload Button */}
          <div className="p-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf"
              className="hidden"
            />
            <button
              onClick={triggerFileInput}
              disabled={uploading}
              className={`w-full py-3.5 px-4 rounded-2xl text-sm font-semibold flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer shiny-button border-none ${
                uploading
                  ? `${theme.border} bg-indigo-50/10 dark:bg-violet-600/5 ${theme.accent} cursor-not-allowed`
                  : `${theme.cardBg} hover:opacity-90 text-slate-700 dark:text-slate-300 hover:text-slate-900 hover:dark:text-white shadow-sm`
              }`}
            >
              {uploading ? (
                <>
                  <Loader2 className={`w-5 h-5 animate-spin ${theme.accent}`} />
                  <span className="font-bold">Extracting knowledge...</span>
                </>
              ) : (
                <>
                  <Upload className={`w-5 h-5 ${theme.accent}`} />
                  <span>Upload PDF study guide</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold">Stored under '{currentSubject}'</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Document list header */}
          <div className="px-6 py-1.5 flex items-center justify-between text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            <span>Subject Material ({documents.length})</span>
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-400 dark:text-slate-550 hover:text-slate-800 dark:hover:text-white transition-colors border-none bg-transparent"
              title="Refresh subject guide"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* List of Documents */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2 no-scrollbar">
            {isLoading && documents.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-slate-400 dark:text-slate-500 text-sm gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Summoning materials...</span>
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-10 px-4 text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/20">
                <FileText className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-800 mb-2.5" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">Subject is empty</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-1 max-w-[180px] mx-auto">Upload a textbook PDF to load study nodes.</p>
              </div>
            ) : (
              documents.map((doc, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl ${theme.cardBg} hover:opacity-95 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:dark:text-white transition-all text-xs group cursor-pointer hover-scale relative shadow-sm`}
                  title={doc}
                >
                  <div className="flex items-center gap-3 truncate flex-1">
                    <div className={`w-7 h-7 rounded-lg ${theme.inputBg} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-colors`}>
                      <FileText className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <span className="truncate font-semibold tracking-wide text-slate-600 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{doc}</span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDocument(doc);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/15 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 border-none bg-transparent"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Gamification Tab */
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 pt-4 no-scrollbar">
          
          {/* Daily Quests */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 pl-1">
              <ListTodo className="w-3.5 h-3.5 text-indigo-500 dark:text-violet-400" /> Daily Quests
            </h3>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${documents.length > 0 ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  <span className={`${documents.length > 0 ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'} font-semibold`}>
                    Transcribe study file
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-500">+50 XP</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/60 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 ${questionsAsked >= dailyGoalTarget ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                  <span className={`${questionsAsked >= dailyGoalTarget ? 'line-through text-slate-400 dark:text-slate-600' : 'text-slate-600 dark:text-slate-300'} font-semibold`}>
                    Ask {dailyGoalTarget} questions ({questionsAsked}/{dailyGoalTarget})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-amber-500">+45 XP</span>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="space-y-2.5">
            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 pl-1">
              <Trophy className="w-3.5 h-3.5 text-indigo-500 dark:text-violet-400 animate-pulse" /> Leaderboard
            </h3>
            
            <div className="space-y-1.5">
              {mockLeaderboard.map((rival, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    rival.isUser
                      ? 'bg-indigo-500/10 dark:bg-violet-500/10 border-indigo-500/35 dark:border-violet-500/35 font-bold scale-[1.01]'
                      : 'bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/40 text-xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="text-sm flex-shrink-0">{rival.avatar}</span>
                    <div className="truncate leading-tight">
                      <p className={`text-xs truncate ${rival.isUser ? 'text-indigo-600 dark:text-white font-extrabold' : 'text-slate-600 dark:text-slate-300 font-semibold'}`}>
                        {rival.name}
                      </p>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500">Level {rival.level} Scholar</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-500 dark:text-cyan-400 flex-shrink-0">{rival.xp} XP</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* User profile panel at the bottom of sidebar */}
      <div className={`p-4 border-t ${theme.border} flex items-center justify-between bg-white/40 dark:bg-black/10 transition-colors mt-auto`}>
        <div className="flex items-center gap-2.5 truncate">
          <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${theme.gradient} flex items-center justify-center text-white font-bold text-xs`}>
            {user?.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <div className="truncate leading-tight">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user?.username || 'Scholar'}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase">Scholar Lv. {level}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/15 hover:scale-105 transition-all cursor-pointer border-none bg-transparent"
          title="Sign Out"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
};
