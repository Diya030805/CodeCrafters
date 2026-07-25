const fs = require('fs');
let code = fs.readFileSync('components/dashboard/notes-view.tsx', 'utf8');

if (!code.includes("History,")) {
  code = code.replace(
    "FolderOpen, Clock, FileSearch, Sparkles,",
    "FolderOpen, Clock, FileSearch, Sparkles, History,"
  );
  code = code.replace(
    "History, MoreVertical,",
    "MoreVertical,"
  );
}

// Add mock data
if (!code.includes("const VERSIONS =")) {
  const versionsData = `
const VERSIONS = [
  { id: 'v5', time: 'Just now', type: 'auto-save', title: 'Current Version' },
  { id: 'v4', time: '10 mins ago', type: 'manual', title: 'Added Krebs Cycle details' },
  { id: 'v3', time: '1 hour ago', type: 'auto-save', title: 'AI Summary generated' },
  { id: 'v2', time: 'Yesterday, 2:30 PM', type: 'auto-save', title: 'Initial draft' },
  { id: 'v1', time: 'Yesterday, 1:15 PM', type: 'manual', title: 'Empty note created' },
];`;
  code = code.replace("const EXPORT_OPTIONS = [", versionsData + "\n\nconst EXPORT_OPTIONS = [");
}

// Add state
if (!code.includes("const [rightTab,")) {
  code = code.replace(
    "const [activeTab, setActiveTab] = React.useState<'editor' | 'mindmap'>('editor');",
    "const [activeTab, setActiveTab] = React.useState<'editor' | 'mindmap'>('editor');\n  const [rightTab, setRightTab] = React.useState<'insights' | 'history'>('insights');"
  );
}

// Right sidebar header
const oldSidebarHeader = `<div className="p-4 border-b border-slate-100 dark:border-white/5 bg-indigo-500/5">
          <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <BrainCircuit className="w-5 h-5" /> AI Assistant
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            I&apos;ve analyzed this note. Here are some insights and actions you can take.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-6 custom-scrollbar">`;

const newSidebarHeader = `<div className="p-2 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-black/10">
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
            <div className="space-y-6">`;

if (code.includes(oldSidebarHeader)) {
  code = code.replace(oldSidebarHeader, newSidebarHeader);
} else {
  console.log("Could not find old sidebar header");
}

// Right sidebar footer
const oldSidebarFooter = `          </div>
        </div>
      </div>

    </div>`;

const newSidebarFooter = `            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Version History</h3>
              </div>
              <div className="relative border-l-2 border-slate-200 dark:border-white/10 ml-3 space-y-6 pb-4">
                {VERSIONS.map((version, i) => (
                  <div key={version.id} className="relative pl-6">
                    <div className={cn(
                      "absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900",
                      i === 0 ? "bg-indigo-500" : "bg-slate-300 dark:bg-slate-600"
                    )} />
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{version.time}</span>
                        {i === 0 && <span className="text-[9px] font-bold px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded">Current</span>}
                      </div>
                      <span className="text-[10px] text-slate-500">{version.title}</span>
                      {i !== 0 && (
                        <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-600 mt-1 self-start flex items-center gap-1">
                          Restore this version
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

    </div>`;

if (code.includes(oldSidebarFooter)) {
  code = code.replace(oldSidebarFooter, newSidebarFooter);
} else {
    // try a more loose replacement
    code = code.replace(
      `          </div>
        </div>
      </div>

    </div>
  );`,
      `          </div>
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
  );`
    );
}

fs.writeFileSync('components/dashboard/notes-view.tsx', code);
