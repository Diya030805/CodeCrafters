const fs = require('fs');
let code = fs.readFileSync('components/dashboard/notes-view.tsx', 'utf8');

const target1 = `          {/* AI Insights */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-rose-500" /> Study Insights
            </h3>
            <div className="space-y-3">
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
            </div>
          </div>`;

const replacement1 = `          {/* AI Insights */}
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
          </div>`;

const target2 = `          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['biology', 'metabolism', 'atp', 'mitochondria'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-md border border-black/5 dark:border-white/10">
                  #{tag}
                </span>
              ))}
              <button className="text-[10px] font-bold px-2 py-1 bg-transparent text-indigo-500 border border-dashed border-indigo-500/30 rounded-md hover:bg-indigo-500/5">
                + Add
              </button>
            </div>
          </div>`;

const replacement2 = `          {/* Tags */}
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {['biology', 'metabolism', 'atp', 'mitochondria'].map(tag => (
                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-md border border-black/5 dark:border-white/10">
                  #{tag}
                </span>
              ))}
              <button className="text-[10px] font-bold px-2 py-1 bg-transparent text-indigo-500 border border-dashed border-indigo-500/30 rounded-md hover:bg-indigo-500/5">
                + Add
              </button>
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
          </div>`;

code = code.replace(target1, replacement1);
code = code.replace(target2, replacement2);

fs.writeFileSync('components/dashboard/notes-view.tsx', code);
