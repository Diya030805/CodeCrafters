const fs = require('fs');
let code = fs.readFileSync('components/dashboard/gamification-view.tsx', 'utf8');

const rewardsBlock = `
          {/* Rewards Center */}
          <div className={cn("p-6 space-y-4", glassStyles.container)}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
              <Gift className="w-4 h-4 text-emerald-500" />
              Rewards Center
            </div>
            
            <div className="space-y-3">
              {[
                { title: 'Daily Login Reward', desc: 'Available in 2h', icon: CalendarDays, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', ready: false },
                { title: 'Weekly Milestone', desc: 'Claim your 500 XP', icon: Star, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', ready: true },
                { title: 'Achievement Unlocked', desc: 'Deep Diver Badge', icon: Medal, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', ready: true },
              ].map((reward, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg border", reward.color)}>
                      <reward.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{reward.title}</div>
                      <div className="text-[10px] text-slate-500">{reward.desc}</div>
                    </div>
                  </div>
                  {reward.ready ? (
                    <button onClick={handleClaimReward} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition-colors">
                      Claim
                    </button>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Locked</span>
                  )}
                </div>
              ))}
            </div>
          </div>
`;

code = code.replace(
  '        {/* Right Column (Leaderboard, Streaks, Badges) */}\n        <div className="space-y-8">',
  '        {/* Right Column (Leaderboard, Streaks, Badges) */}\n        <div className="space-y-8">\n' + rewardsBlock
);

fs.writeFileSync('components/dashboard/gamification-view.tsx', code);
