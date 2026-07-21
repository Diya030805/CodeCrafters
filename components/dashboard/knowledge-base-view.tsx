'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Download, 
  Eye, 
  Filter,
  FileCode,
  FileJson,
  UploadCloud,
  X,
  Clock,
  HardDrive
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { useAccent } from '@/components/accent-provider';
import { useTheme } from '@/components/theme-provider';
import { FlashcardStudy } from './flashcard-study';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'code' | 'json';
  size: string;
  uploadedAt: string;
  category: string;
}

const INITIAL_DOCS: Document[] = [
  { id: '1', name: 'Quantum_Mechanics_Lecture_Notes.pdf', type: 'pdf', size: '4.2 MB', uploadedAt: '2h ago', category: 'Physics' },
  { id: '2', name: 'Algorithm_Complexity_Final.pdf', type: 'pdf', size: '1.8 MB', uploadedAt: '1d ago', category: 'CS' },
  { id: '3', name: 'Data_Structures_Reference.doc', type: 'doc', size: '850 KB', uploadedAt: '3d ago', category: 'CS' },
  { id: '4', name: 'React_Hooks_Deep_Dive.pdf', type: 'pdf', size: '2.1 MB', uploadedAt: '5d ago', category: 'Frontend' },
  { id: '5', name: 'Database_Schema_v2.json', type: 'json', size: '12 KB', uploadedAt: '1w ago', category: 'Database' },
];

export function KnowledgeBaseView() {
  const { meta } = useAccent();
  const { darkMode } = useTheme();
  const [docs, setDocs] = React.useState<Document[]>(INITIAL_DOCS);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'sources' | 'flashcards'>('sources');

  const filteredDocs = docs.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteDoc = (id: string) => {
    setDocs(prev => prev.filter(d => d.id !== id));
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-rose-500" />;
      case 'code': return <FileCode className="w-5 h-5 text-blue-500" />;
      case 'json': return <FileJson className="w-5 h-5 text-amber-500" />;
      default: return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Knowledge Base</h1>
          <p className="text-slate-400 text-sm font-medium">Manage and index your source material for AI synthesis.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <HardDrive className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Storage: 42% Used</span>
          </div>
          <button 
            onClick={() => setIsUploading(true)}
            className={cn(
              "px-4 py-2 rounded-xl text-white text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 shadow-lg",
              darkMode ? meta.dark : meta.light
            )}
            style={{ backgroundColor: meta.hex }}
          >
            <Plus className="w-4 h-4" />
            Upload Source
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] pb-px">
        <button
          onClick={() => setActiveTab('sources')}
          className={cn(
            "pb-3 text-xs font-black uppercase tracking-widest border-b-2 px-6 transition-all duration-300 relative cursor-pointer",
            activeTab === 'sources'
              ? "text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          )}
          style={activeTab === 'sources' ? { borderColor: meta.hex } : {}}
        >
          Sources Library
        </button>
        <button
          onClick={() => setActiveTab('flashcards')}
          className={cn(
            "pb-3 text-xs font-black uppercase tracking-widest border-b-2 px-6 transition-all duration-300 relative cursor-pointer",
            activeTab === 'flashcards'
              ? "text-white"
              : "border-transparent text-slate-500 hover:text-slate-300"
          )}
          style={activeTab === 'flashcards' ? { borderColor: meta.hex } : {}}
        >
          Flashcards Study
        </button>
      </div>

      {activeTab === 'sources' ? (
        <>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="Search documents, categories, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 text-sm outline-none transition-all duration-300",
                  glassStyles.input
                )}
              />
            </div>
            <button className={cn("px-4 py-3 rounded-xl flex items-center gap-2 text-slate-400 font-bold text-sm", glassStyles.card)}>
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredDocs.map((doc) => (
                <motion.div
                  key={doc.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn("group relative p-5 flex flex-col gap-4 overflow-hidden", glassStyles.card)}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.05] flex items-center justify-center">
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteDoc(doc.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white truncate pr-6">{doc.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{doc.size}</span>
                      <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 px-1.5 rounded uppercase">{doc.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.05] mt-auto">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                      <Clock className="w-3 h-3" />
                      {doc.uploadedAt}
                    </div>
                    <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors">
                      Sync to AI
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Upload Dropzone Card */}
            <button 
              onClick={() => setIsUploading(true)}
              className={cn(
                "p-8 rounded-[24px] border-2 border-dashed border-white/[0.08] hover:border-amber-500/30 hover:bg-amber-500/[0.02] transition-all flex flex-col items-center justify-center gap-4 text-slate-500 hover:text-amber-500 group",
                glassStyles.container
              )}
            >
              <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Add more sources</p>
                <p className="text-[10px] font-medium opacity-60 mt-1">Drop PDFs or click to browse</p>
              </div>
            </button>
          </div>
        </>
      ) : (
        <FlashcardStudy />
      )}

      {/* Upload Modal (Simulation) */}
      <AnimatePresence>
        {isUploading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={cn("w-full max-w-lg p-8 relative", glassStyles.container)}
            >
              <button 
                onClick={() => setIsUploading(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/[0.05] text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-8 h-8 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white tracking-tight">Upload Knowledge Source</h2>
                  <p className="text-sm text-slate-400 font-medium mt-2">The AI will process and index your documents for real-time tutoring context.</p>
                </div>

                <div className="border-2 border-dashed border-white/[0.08] rounded-2xl p-12 hover:border-amber-500/30 transition-colors cursor-pointer group">
                  <FileText className="w-10 h-10 text-slate-700 group-hover:text-amber-500/50 transition-colors mx-auto mb-4" />
                  <p className="text-xs font-bold text-slate-500">Drag & Drop files here or click to browse</p>
                  <p className="text-[10px] text-slate-600 mt-2">Supports PDF, DOC, JSON (Max 50MB)</p>
                </div>

                <button 
                  onClick={() => setIsUploading(false)}
                  className={cn(
                    "w-full py-4 rounded-xl text-white font-black uppercase tracking-widest text-xs",
                    darkMode ? meta.dark : meta.light
                  )}
                  style={{ backgroundColor: meta.hex }}
                >
                  Confirm Upload
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
