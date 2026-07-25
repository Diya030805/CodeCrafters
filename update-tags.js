const fs = require('fs');
let code = fs.readFileSync('components/dashboard/notes-view.tsx', 'utf8');

// 1. Add state
code = code.replace(
  "const [searchQuery, setSearchQuery] = React.useState('');",
  "const [searchQuery, setSearchQuery] = React.useState('');\n  const [activeTags, setActiveTags] = React.useState<string[]>(['biology', 'metabolism', 'atp', 'mitochondria']);\n  const [newTag, setNewTag] = React.useState('');"
);

// 2. Replace static tags with dynamic ones
const oldTagsSection = `            <div className="flex flex-wrap gap-2">              {['biology', 'metabolism', 'atp', 'mitochondria'].map(tag => (                <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-md border border-black/5 dark:border-white/10">                  #{tag}                </span>              ))}              <button className="text-[10px] font-bold px-2 py-1 bg-transparent text-indigo-500 border border-dashed border-indigo-500/30 rounded-md hover:bg-indigo-500/5">                + Add              </button>            </div>`;

const newTagsSection = `            <div className="flex flex-wrap gap-2">
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
            </div>`;

code = code.replace(oldTagsSection, newTagsSection);

fs.writeFileSync('components/dashboard/notes-view.tsx', code);
