const fs = require('fs');
let code = fs.readFileSync('components/dashboard/notes-view.tsx', 'utf8');

const regex = /        <\/div>\n      <\/div>\n\n    <\/div>\n  \);\n}/g;

const replacement = `          </div>
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
}`;

if (code.match(regex)) {
  code = code.replace(regex, replacement);
  fs.writeFileSync('components/dashboard/notes-view.tsx', code);
  console.log("Success");
} else {
  console.log("Regex not found");
}
