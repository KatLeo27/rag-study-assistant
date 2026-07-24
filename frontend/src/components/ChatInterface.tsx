import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles, AlertCircle, Quote, GraduationCap, Lightbulb, Sun, Moon } from 'lucide-react';
import { SourceReference } from './SourceReference';
import type { SubjectTheme } from '../App';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  hasDocuments: boolean;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentSubject: string;
  theme: SubjectTheme;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  hasDocuments,
  darkMode,
  onToggleDarkMode,
  currentSubject,
  theme,
}) => {
  const [input, setInput] = useState('');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !hasDocuments) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const studyQuotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
    { text: "Procrastination is the thief of time. Collar him!", author: "Charles Dickens" },
    { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" }
  ];

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * studyQuotes.length);
    setQuoteIndex(randomIdx);
  }, [messages.length === 0]);

  const suggestions = [
    `Explain the core topics of the current subject.`,
    "Formulate 3 practice exam questions from this file.",
    "Summarize the formulas or key terms defined here.",
    "Draft a quick cheat-sheet covering this material."
  ];

  const formatMessageContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, lineIdx) => {
      const bulletMatch = line.match(/^(\s*)([*-]|\d+\.)\s+(.*)$/);

      if (bulletMatch) {
        const indent = bulletMatch[1].length * 8;
        const marker = bulletMatch[2];
        const textOnly = bulletMatch[3];

        const textParts = textOnly.split(/(\*\*.*?\*\*)/g);
        const parsedText = textParts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <strong key={partIdx} className="font-extrabold text-indigo-900 dark:text-violet-200">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return part;
        });

        return (
          <div
            key={lineIdx}
            style={{ paddingLeft: `${indent + 12}px` }}
            className="flex items-start gap-2 my-1.5 leading-relaxed"
          >
            <span className={`font-extrabold flex-shrink-0 select-none ${theme.accent}`}>
              {marker === '*' || marker === '-' ? '•' : marker}
            </span>
            <span className="flex-1 text-slate-755 dark:text-slate-200">{parsedText}</span>
          </div>
        );
      }

      const boldParts = line.split(/(\*\*.*?\*\*)/g);
      if (boldParts.length > 1) {
        return (
          <div key={lineIdx} className="min-h-[1.25rem] leading-relaxed my-1">
            {boldParts.map((part, partIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={partIdx} className="font-extrabold text-indigo-900 dark:text-violet-200">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            })}
          </div>
        );
      }

      return (
        <div key={lineIdx} className="min-h-[1.25rem] leading-relaxed my-1 text-slate-700 dark:text-slate-200">
          {line}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-transparent text-slate-800 dark:text-slate-100 relative overflow-hidden transition-colors duration-300">
      {/* Background blobs for visual style */}
      <div className="bg-blob blob-purple top-10 left-10 opacity-10 dark:opacity-20"></div>
      <div className="bg-blob blob-cyan bottom-10 right-10 opacity-10 dark:opacity-20"></div>

      {/* Top Header */}
      <div className={`h-16 border-b ${theme.border} px-6 flex items-center justify-between bg-white/75 dark:bg-[#070b18]/60 backdrop-blur-md sticky top-0 z-10 transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <Sparkles className={`w-5 h-5 ${theme.accent} animate-pulse`} />
          <span className="font-extrabold tracking-wider text-xs bg-gradient-to-r from-indigo-700 to-violet-500 dark:from-slate-100 dark:to-indigo-300 bg-clip-text text-transparent uppercase flex items-center gap-1.5">
            <span>AI STUDY SESSION</span>
            <span className="text-[10px] text-slate-350 dark:text-slate-600 select-none">|</span>
            <span className={`${theme.accent} font-black text-[11px]`}>
              {theme.emoji} {currentSubject}
            </span>
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          {!hasDocuments && (
            <span className="text-[9px] font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              UPLOAD STUDY MATERIAL
            </span>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border ${theme.border} ${theme.cardBg} text-slate-655 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-105 transition-all cursor-pointer shadow-sm`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 relative no-scrollbar">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6 mt-4">
            
            {/* Logo Sphere */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600 to-cyan-400 rounded-3xl blur-xl opacity-20 dark:opacity-50 group-hover:opacity-75 transition-all duration-500"></div>
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-tr ${theme.gradient} flex items-center justify-center shadow-xl`}>
                <Bot className="w-8 h-8 text-white animate-bounce" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Your Study Sanctuary</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                Load your learning assets, ask questions, generate mock tests, and let AI build personalized explanations directly from your syllabus files.
              </p>
            </div>

            {/* Motivational Quote Card */}
            <div className={`w-full p-5 rounded-2xl ${theme.cardBg} border ${theme.border} max-w-md mx-auto text-left relative overflow-hidden shadow-md`}>
              <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${theme.gradient}`}></div>
              <Quote className="absolute right-3 top-3 w-12 h-12 text-slate-100 dark:text-slate-850 opacity-20 pointer-events-none" />
              <p className="text-xs italic text-slate-655 dark:text-slate-305 leading-relaxed font-medium">
                "{studyQuotes[quoteIndex].text}"
              </p>
              <p className={`text-[10px] ${theme.accent} font-black mt-2 uppercase tracking-wide`}>
                — {studyQuotes[quoteIndex].author}
              </p>
            </div>

            {/* Suggestions list */}
            {hasDocuments ? (
              <div className="w-full space-y-2 pt-2">
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left pl-1">Suggested Study Prompts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(s)}
                      className={`p-3.5 text-left rounded-xl ${theme.cardBg} hover:bg-indigo-50/50 hover:dark:bg-slate-800/60 hover:border-indigo-500/30 text-xs text-slate-650 dark:text-slate-300 transition-all duration-200 flex items-center gap-3 group cursor-pointer shadow-sm hover:shadow-md`}
                    >
                      <Lightbulb className={`w-4 h-4 ${theme.accent} group-hover:scale-110 transition-transform flex-shrink-0`} />
                      <span className="truncate font-semibold text-slate-700 dark:text-slate-300">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center gap-2 p-6 border border-dashed ${theme.border} rounded-2xl ${theme.cardBg}`}>
                <GraduationCap className={`w-8 h-8 ${theme.accent} animate-pulse`} />
                <p className="text-xs text-slate-455 dark:text-slate-500 max-w-xs font-bold">
                  Awaiting study logs for '{currentSubject}'. Upload a PDF to activate the AI.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-4 p-5 rounded-2xl transition-all duration-200 ${
                  msg.role === 'user'
                    ? `bg-gradient-to-tr ${theme.gradient} border-indigo-500/10 text-white ml-12 shadow-md ${theme.shadow}`
                    : `${theme.cardBg} mr-12 shadow-sm`
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-white text-slate-800 text-sm font-black'
                      : `bg-gradient-to-tr ${theme.gradient} text-white`
                  }`}
                >
                  {msg.role === 'user' ? <User className="w-4.5 h-4.5 text-slate-800" /> : <Bot className="w-4.5 h-4.5" />}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2 overflow-hidden">
                  <div className={`text-[10px] font-black uppercase tracking-wider ${
                    msg.role === 'user' ? 'text-indigo-100' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    <span>{msg.role === 'user' ? 'Scholar' : 'ExamPrep Coach'}</span>
                  </div>
                  
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap select-text selection:bg-indigo-550/30 font-medium ${
                    msg.role === 'user' ? 'text-white font-semibold' : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {msg.role === 'user' ? msg.content : formatMessageContent(msg.content)}
                  </div>
                  
                  {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                    <SourceReference sources={msg.sources} />
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className={`flex gap-4 p-5 rounded-2xl ${theme.cardBg} mr-12 pulse-animation shadow-sm`}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600/80 to-indigo-600/80 flex items-center justify-center flex-shrink-0 text-white shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-2.5 pt-1">
                  <div className="text-[10px] font-bold text-indigo-555 dark:text-slate-500 uppercase tracking-wider">Synthesizing textbook answers...</div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-xs font-bold">
                    <Loader2 className={`w-4 h-4 animate-spin ${theme.accent}`} />
                    <span>Searching vectors and compiling response...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className={`p-4 border-t ${theme.border} bg-white/95 dark:bg-[#05070f]/80 backdrop-blur-md z-10 relative transition-colors duration-300`}>
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading || !hasDocuments}
            placeholder={
              !hasDocuments
                ? `First upload study material PDF files under '${currentSubject}'...`
                : `Ask anything about your '${currentSubject}' files...`
            }
            className={`w-full ${theme.inputBg} focus:bg-white focus:dark:bg-slate-950 focus:border-indigo-550/85 focus:ring-1 focus:ring-indigo-550/85 rounded-2xl py-3.5 pl-4 pr-12 text-sm text-slate-855 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-inner`}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || !hasDocuments}
            className={`absolute right-2.5 p-2 rounded-xl bg-gradient-to-tr ${theme.gradient} text-white disabled:bg-slate-200 dark:disabled:bg-slate-850/60 disabled:from-transparent disabled:to-transparent disabled:text-slate-400 dark:disabled:text-slate-650 transition-all cursor-pointer shadow-md`}
            title="Submit question"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[9px] font-bold text-center text-indigo-500/80 dark:text-slate-500 mt-2 uppercase tracking-wide">
          Grounded generation. Answers are derived strictly from your course material.
        </p>
      </div>
    </div>
  );
};
