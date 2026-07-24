import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface Source {
  id: string;
  text: string;
  source: string;
  score: number;
}

interface SourceReferenceProps {
  sources: Source[];
}

export const SourceReference: React.FC<SourceReferenceProps> = ({ sources }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!sources || sources.length === 0) return null;

  // Group chunks by document name
  const groupedSources: { [key: string]: Source[] } = {};
  sources.forEach((src) => {
    if (!groupedSources[src.source]) {
      groupedSources[src.source] = [];
    }
    groupedSources[src.source].push(src);
  });

  return (
    <div className="mt-4 border border-slate-800 bg-slate-900/40 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/60"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
          <span>RELEVANT CONTEXT SOURCES ({sources.length})</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto divide-y divide-slate-800/60">
          {Object.entries(groupedSources).map(([docName, chunks], docIndex) => (
            <div key={docName} className={docIndex > 0 ? 'pt-4' : ''}>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2 truncate">
                <FileText className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                <span className="truncate" title={docName}>{docName}</span>
              </div>
              <div className="space-y-2.5">
                {chunks.map((chunk, chunkIndex) => (
                  <div
                    key={chunk.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/40 rounded-lg text-xs text-slate-400 leading-relaxed font-mono whitespace-pre-wrap"
                  >
                    <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 font-sans">
                      <span>Chunk {chunkIndex + 1}</span>
                      {chunk.score !== undefined && (
                        <span>Distance: {chunk.score.toFixed(4)}</span>
                      )}
                    </div>
                    {chunk.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
