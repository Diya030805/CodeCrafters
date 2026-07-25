'use client';

import * as React from 'react';
import { 
  FileText, Network, Search, Plus, Star, Share2, Archive, 
  FolderOpen, Clock, FileSearch, Sparkles, History,
  Download, Printer, Copy, Check, ChevronDown, AlignLeft,
  List, ListOrdered, CheckSquare, Code, Quote, Highlighter,
  Save, AlertCircle, BrainCircuit, Lightbulb, TrendingUp,
  Tag, Activity, Zap, FileDown, Layers, MousePointer2, ZoomIn, ZoomOut, Maximize, Target, Loader2,
  File, BookOpen, Clock3, MoreVertical, LayoutDashboard
} from 'lucide-react';
import { FOLDERS, RECENT_NOTES, AI_QUICK_ACTIONS, VERSIONS, EXPORT_OPTIONS } from './notes-data';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { Tooltip } from '@/components/ui/tooltip';

export function NotesView() {
  const { meta } = useAccent();
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'editor' | 'mindmap'>('editor');
  const [rightTab, setRightTab] = React.useState<'insights' | 'history'>('insights');
  const [isSaving, setIsSaving] = React.useState(false);
  const [showExport, setShowExport] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeTags, setActiveTags] = React.useState<string[]>(['biology', 'metabolism', 'atp', 'mitochondria']);
  const [newTag, setNewTag] = React.useState('');

  React.useEffect(() => {
    // Simulate auto-save
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1000);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center p-8">
        <div className="w-32 h-32 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6 border-4 border-indigo-500/20">
          <FileText className="w-12 h-12 text-indigo-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Your AI Notes Library is Empty
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-8">
          Start capturing your thoughts, or let the AI generate comprehensive study notes, summaries, and mind maps for any topic.
        </p>
        <button 
          onClick={() => setIsEmpty(false)}
          className={cn("px-6 py-3 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2 transition-all hover:scale-105", meta.dark.button)}
        >
          <Sparkles className="w-4 h-4" />
          Generate First Note
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)] min-h-[700px]">
      
      {/* LEFT SIDEBAR: Library */}
      <div className={cn("lg:col-span-3 flex flex-col h-full overflow-hidden", glassStyles.container)}>
        <div className="p-4 border-b border-slate-100 dark:border-white/5">
          <button className={cn("w-full py-2.5 rounded-xl text-sm font-bold text-white shadow-md flex items-center justify-center gap-2 mb-4 transition-all hover:opacity-90", meta.dark.button)}>
            <Plus className="w-4 h-4" />
            New Note
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search notes..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-black/20 text-sm border-none rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-indigo-500/50 outline-none text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* Categories */}
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors">
              <Clock className="w-4 h-4" /> Recent Notes
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Star className="w-4 h-4" /> Favorites
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Share2 className="w-4 h-4" /> Shared Notes
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
              <Archive className="w-4 h-4" /> Archived
            </button>
          </div>

          {/* Folders */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Folders</h3>
            <div className="space-y-1">
              {FOLDERS.map(folder => (
                <button key={folder} className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                    {folder}
                  </div>
                  <span className="text-[10px] bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-500">
                    12
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Notes List */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">Recent</h3>
            <div className="space-y-2">
              {RECENT_NOTES.map(note => (
                <div key={note.id} className={cn(
                  "p-3 rounded-xl border transition-all cursor-pointer group",
                  note.id === '1' 
                    ? "bg-white dark:bg-slate-800 border-indigo-500/30 shadow-sm" 
                    : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-white/5"
                )}>
                  <div className="flex items-start justify-between mb-1">
                    <h4 className={cn("text-sm font-bold line-clamp-1", note.id === '1' ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300")}>
                      {note.title}
                    </h4>
                    {note.isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="bg-slate-200 dark:bg-white/10 px-1.5 py-0.5 rounded">{note.folder}</span>
                    <span>• {note.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* CENTER WORKSPACE: Editor & Mind Map */}
      <div className={cn("lg:col-span-6 flex flex-col h-full overflow-hidden relative", glassStyles.container)}>
        
        {/* Workspace Header */}
        <div className="p-4 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-black/20 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('editor')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2", activeTab === 'editor' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <FileText className="w-3.5 h-3.5" /> Notes
            </button>
            <button 
              onClick={() => setActiveTab('mindmap')}
              className={cn("px-4 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-2", activeTab === 'mindmap' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <Network className="w-3.5 h-3.5" /> Mind Map
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 mr-2">
              {isSaving ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</>
              ) : (
                <><Check className="w-3.5 h-3.5 text-emerald-500" /> Saved</>
              )}
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowExport(!showExport)}
                className="p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 hover:text-indigo-500 transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
              
              {showExport && (
                  <div 
                    className="absolute right-0 top-10 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-black/5 dark:border-white/10 z-50 overflow-hidden"
                  >
                    {EXPORT_OPTIONS.map((opt, i) => (
                      <button key={i} className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left">
                        <opt.icon className="w-4 h-4 text-slate-400" /> {opt.label}
                      </button>
                    ))}
                  </div>
                )}
            </div>
            
            <button className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-grow overflow-hidden relative">
          
          {/* EDITOR TAB */}
          {activeTab === 'editor' && (
            <div className="absolute inset-0 flex flex-col">
              {/* Rich Text Toolbar */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5 flex flex-wrap items-center gap-1">
                <select className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 border-none outline-none mr-2 cursor-pointer">
                  <option>Normal Text</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                  <option>Heading 3</option>
                </select>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-serif font-bold">B</button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-serif italic">I</button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 font-serif underline">U</button>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><Highlighter className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><List className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><ListOrdered className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><CheckSquare className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><Quote className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400"><Code className="w-4 h-4" /></button>
              </div>
              
              {/* Editor Content Area */}
              <div className="flex-grow p-6 lg:p-10 overflow-y-auto custom-scrollbar bg-white dark:bg-transparent">
                <input 
                  type="text" 
                  defaultValue="Cellular Respiration"
                  className="w-full text-4xl font-black text-slate-900 dark:text-white bg-transparent border-none outline-none mb-6 placeholder-slate-300"
                  placeholder="Note Title"
                />
                
                {/* Simulated Rich Text Content */}
                <div className="space-y-5 text-slate-700 dark:text-slate-300 leading-relaxed">
                  <p>
                    Cellular respiration is the process by which biological fuels are oxidized in the presence of an inorganic electron acceptor, such as oxygen, to produce large amounts of energy, to drive the bulk production of ATP.
                  </p>
                  
                  <div className="bg-indigo-50 dark:bg-indigo-500/10 border-l-4 border-indigo-500 p-4 rounded-r-xl">
                    <div className="flex items-center gap-2 font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                      <Sparkles className="w-4 h-4" /> AI Generated Summary
                    </div>
                    <p className="text-sm text-indigo-900 dark:text-indigo-200">
                      In simple terms, cellular respiration is how cells turn food into usable energy (ATP). It mainly occurs in the mitochondria and requires oxygen to be highly efficient.
                    </p>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white pt-4">The 4 Main Stages:</h3>
                  
                  <ol className="list-decimal pl-6 space-y-2">
                    <li><strong className="text-slate-900 dark:text-white">Glycolysis:</strong> Occurs in the cytoplasm. Breaks down glucose into 2 molecules of pyruvate. Yields 2 ATP and 2 NADH.</li>
                    <li><strong className="text-slate-900 dark:text-white">Pyruvate Oxidation:</strong> Moves into mitochondria. Pyruvate is converted to Acetyl-CoA.</li>
                    <li><strong className="text-slate-900 dark:text-white">Krebs Cycle (Citric Acid Cycle):</strong> Occurs in the mitochondrial matrix. Produces NADH, FADH2, and ATP.</li>
                    <li><strong className="text-slate-900 dark:text-white">Electron Transport Chain:</strong> Inner mitochondrial membrane. Uses electrons from NADH and FADH2 to create a proton gradient, producing ~34 ATP.</li>
                  </ol>

                  <div className="p-4 bg-slate-100 dark:bg-white/5 rounded-xl font-mono text-sm text-slate-600 dark:text-slate-400">
                    Formula:<br/>
                    C6H12O6 + 6O2 → 6CO2 + 6H2O + ATP
                  </div>

                  <ul className="list-disc pl-6 space-y-1">
                    <li><span className="bg-yellow-200/50 dark:bg-yellow-500/20 text-yellow-900 dark:text-yellow-100 px-1 rounded">Requires Oxygen (Aerobic)</span> for maximum efficiency.</li>
                    <li>Anaerobic respiration (fermentation) occurs when oxygen is absent.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* MIND MAP TAB */}
          {activeTab === 'mindmap' && (
            <div className="absolute inset-0 bg-[#f8fafc] dark:bg-[#08090a] overflow-hidden flex flex-col">
              {/* Map Tools */}
              <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-black/5 dark:border-white/10 p-2 rounded-xl shadow-lg z-20">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300"><ZoomOut className="w-4 h-4" /></button>
                <span className="text-xs font-bold w-12 text-center text-slate-500">100%</span>
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300"><ZoomIn className="w-4 h-4" /></button>
                <div className="w-px h-4 bg-slate-200 dark:bg-white/10 mx-1" />
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg text-slate-600 dark:text-slate-300"><Maximize className="w-4 h-4" /></button>
              </div>

              {/* Interactive Canvas Area */}
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                {/* SVG Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-300 dark:stroke-slate-700" strokeWidth="2" fill="none">
                  {/* Central to Main Nodes */}
                  <path d="M 50% 50% L 25% 25%" />
                  <path d="M 50% 50% L 75% 25%" />
                  <path d="M 50% 50% L 25% 75%" />
                  <path d="M 50% 50% L 75% 75%" />
                </svg>

                {/* Central Node */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-6 py-4 rounded-2xl shadow-xl shadow-indigo-500/20 font-black text-lg border-4 border-indigo-400/30 z-10 cursor-pointer"
                >
                  Cellular Respiration
                </div>

                {/* Main Node 1 */}
                <div 
                  className="absolute top-[25%] left-[25%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-lg border-2 border-emerald-500/50 font-bold z-10 cursor-pointer hover:scale-105 transition-transform"
                >
                  Glycolysis
                </div>

                {/* Main Node 2 */}
                <div 
                  className="absolute top-[25%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-lg border-2 border-amber-500/50 font-bold z-10 cursor-pointer hover:scale-105 transition-transform"
                >
                  Krebs Cycle
                </div>

                {/* Main Node 3 */}
                <div 
                  className="absolute top-[75%] left-[25%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-lg border-2 border-rose-500/50 font-bold z-10 cursor-pointer hover:scale-105 transition-transform"
                >
                  Pyruvate Oxidation
                </div>

                {/* Main Node 4 */}
                <div 
                  className="absolute top-[75%] left-[75%] -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-5 py-3 rounded-xl shadow-lg border-2 border-purple-500/50 font-bold z-10 cursor-pointer hover:scale-105 transition-transform"
                >
                  Electron Transport
                </div>
                
                {/* Floating AI Generate Button */}
                <div className="absolute top-6 left-6 z-20">
                  <button className={cn("px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg flex items-center gap-2", meta.dark.button)}>
                    <Sparkles className="w-3.5 h-3.5" /> Expand Map
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: AI Insights & Quick Actions */}
      <div className={cn("lg:col-span-3 flex flex-col h-full overflow-hidden", glassStyles.container)}>
        
        <div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10">
          <div className="flex bg-slate-200/50 dark:bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setRightTab('insights')}
              className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2", rightTab === 'insights' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <BrainCircuit className="w-3.5 h-3.5" /> AI Assistant
            </button>
            <button
              onClick={() => setRightTab('history')}
              className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all flex items-center justify-center gap-2", rightTab === 'history' ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <History className="w-3.5 h-3.5" /> History
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
          {rightTab === 'insights' ? (
            <div className="space-y-6">
          
          {/* Note Metadata */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Word Count</div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">428</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Read Time</div>
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">3 mins</div>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Key Takeaways
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 leading-relaxed">
                Respiration converts glucose to ATP in 4 stages.
              </li>
              <li className="text-xs text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 leading-relaxed">
                Oxygen is required for maximum ATP yield.
              </li>
              <li className="text-xs text-slate-600 dark:text-slate-400 bg-emerald-50 dark:bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 leading-relaxed">
                The Electron Transport Chain produces the most energy.
              </li>
            </ul>
          </div>

          {/* AI Insights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-rose-500" /> Study Insights
            </h3>
            <div className="space-y-3">
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Study Difficulty</div>
                  <div className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Intermediate
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 80% Complete
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold mb-1">
                  <span className="text-slate-500">Knowledge Coverage</span>
                  <span className="text-emerald-500">High (85%)</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              
              <div className="p-3 rounded-xl border border-rose-100 dark:border-rose-500/20 bg-rose-50 dark:bg-rose-500/5">
                <div className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Missing Concept
                </div>
                <p className="text-xs text-rose-700 dark:text-rose-300">
                  You haven&apos;t detailed the exact amount of ATP produced in Glycolysis vs Krebs Cycle.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5">
                <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mb-1 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" /> Suggested Revision
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  Review the role of NADH and FADH2 in the electron transport chain to solidify understanding.
                </p>
              </div>
            </div>
          </div>

          {/* Quick AI Actions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> AI Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {AI_QUICK_ACTIONS.map((action, i) => (
                <button 
                  key={i}
                  className="flex flex-col items-center justify-center p-3 gap-2 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all group text-center"
                >
                  <action.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="text-[9px] font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeTags.map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 rounded-md border border-indigo-200 dark:border-indigo-500/20 flex items-center gap-1">
                  #{tag}
                  <button onClick={() => setActiveTags(activeTags.filter(t => t !== tag))} className="hover:text-indigo-900 dark:hover:text-indigo-100">×</button>
                </span>
              ))}
              <input
                type="text"
                placeholder="+ Add"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    setActiveTags([...activeTags, newTag.trim()]);
                    setNewTag('');
                  }
                }}
                className="text-[10px] font-bold px-2 py-1 bg-transparent text-indigo-500 border border-dashed border-indigo-500/30 rounded-md focus:outline-none focus:border-indigo-500 w-16"
              />
            </div>
          </div>

          {/* Related Topics */}
          <div className="space-y-2 pt-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Network className="w-3 h-3" /> Related Topics
            </h3>
            <div className="space-y-1.5">
              {['Photosynthesis', 'Enzyme Kinetics', 'Fermentation'].map(topic => (
                <button key={topic} className="w-full text-left text-xs text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-white/5 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                  {topic}
                </button>
              ))}
            </div>
          </div>

          </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Version History</h3>
              </div>
              <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-3 space-y-6 pb-4">
                {VERSIONS.map((version, i) => (
                  <div key={version.id} className="relative pl-6 group">
                    <div className={cn(
                      "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                      i === 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className={cn("text-xs font-bold", i === 0 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300")}>{version.time}</span>
                        {i === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded">Current</span>}
                      </div>
                      <span className="text-[10px] text-slate-500">{version.title}</span>
                      {i !== 0 && (
                        <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 mt-1 self-start flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Restore version
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

// Missing Icon Component
function CheckCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}
