'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Star,
  Award,
  Flame,
  Zap,
  Target,
  Crown,
  Medal,
  CalendarDays,
  Gem,
  Gift,
  Coins,
  Shield,
  TrendingUp,
  LayoutDashboard,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Users,
  Building,
  Globe,
  Clock,
  BookOpen,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAccent } from '@/components/accent-provider';
import { cn } from '@/lib/utils';
import { glassStyles } from '@/lib/glass';
import { Tooltip } from '@/components/ui/tooltip';

// MOCK DATA

const USER_STATS = {
  level: 42,
  currentXP: 14500,
  nextLevelXP: 15000,
  totalCoins: 2450,
  currentStreak: 12,
  longestStreak: 28,
  rank: 145,
  completionPercentage: 82,
  totalAchievements: 34
};

const DAILY_CHALLENGES = [
  { id: 1, title: 'Complete one quiz', type: 'Quiz', target: 1, current: 1, reward: 50, isCompleted: true },
  { id: 2, title: 'Study for 30 minutes', type: 'Time', target: 30, current: 20, reward: 100, isCompleted: false },
  { id: 3, title: 'Review 20 flashcards', type: 'Flashcard', target: 20, current: 0, reward: 75, isCompleted: false },
  { id: 4, title: 'Chat with AI Tutor', type: 'Tutor', target: 1, current: 1, reward: 50, isCompleted: true },
];

const WEEKLY_MISSIONS = [
  { id: 1, title: 'Finish 5 quizzes with >80%', current: 3, target: 5, reward: 500, icon: Target },
  { id: 2, title: 'Maintain a 5-day streak', current: 3, target: 5, reward: 1000, icon: Flame },
  { id: 3, title: 'Earn 1000 XP', current: 450, target: 1000, reward: 300, icon: Star },
];

const ACHIEVEMENTS = [
  { id: 1, title: 'Knowledge Seeker', desc: 'Ask 100 questions to AI Tutor.', category: 'AI Tutor', icon: Sparkles, progress: 100, target: 100, unlocked: true },
  { id: 2, title: 'Quiz Master', desc: 'Score 100% on 10 different quizzes.', category: 'Quiz Master', icon: Award, progress: 8, target: 10, unlocked: false },
  { id: 3, title: 'Memory Champion', desc: 'Review 1,000 flashcards.', category: 'Flashcard Expert', icon: Layers, progress: 450, target: 1000, unlocked: false },
  { id: 4, title: 'Deep Diver', desc: 'Analyze 50 PDF documents.', category: 'PDF Scholar', icon: BookOpen,
  Layers, progress: 50, target: 50, unlocked: true },
  { id: 5, title: 'Unbreakable', desc: 'Achieve a 30-day streak.', category: 'Consistency', icon: Flame, progress: 12, target: 30, unlocked: false },
  { id: 6, title: 'Master Planner', desc: 'Complete 5 full study plans.', category: 'Study Planner', icon: CalendarDays, progress: 5, target: 5, unlocked: true },
];

const BADGES = [
  { id: 'bronze', name: 'Bronze', color: 'text-amber-700 bg-amber-700/10 border-amber-700/20', icon: Shield, unlocked: true },
  { id: 'silver', name: 'Silver', color: 'text-slate-400 bg-slate-400/10 border-slate-400/20', icon: Shield, unlocked: true },
  { id: 'gold', name: 'Gold', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', icon: Crown, unlocked: true },
  { id: 'platinum', name: 'Platinum', color: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20', icon: Gem, unlocked: false },
  { id: 'diamond', name: 'Diamond', color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: Diamond, unlocked: false },
];

// Helper icon
function Diamond(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6 3h12l4 6-10 12L2 9l4-6z" />
      <path d="M12 21l4-12" />
      <path d="M12 21L8 9" />
      <path d="M2 9h20" />
      <path d="M12 3v6" />
    </svg>
  );
}

const LEADERBOARD = [
  { rank: 1, name: 'Alex Johnson', level: 54, xp: 28400, streak: 45, isCurrentUser: false },
  { rank: 2, name: 'Sarah Wu', level: 51, xp: 26100, streak: 30, isCurrentUser: false },
  { rank: 3, name: 'Michael Chang', level: 48, xp: 23500, streak: 21, isCurrentUser: false },
  { rank: 145, name: 'You', level: 42, xp: 14500, streak: 12, isCurrentUser: true },
];

export function GamificationView() {
  const { meta } = useAccent();
  const [activeLeaderboard, setActiveLeaderboard] = React.useState<'Global' | 'Friends' | 'University'>('Global');
  const [isEmpty, setIsEmpty] = React.useState(false);

  const handleClaimReward = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: [meta.color, '#F59E0B', '#3B82F6']
    });
  };

  const xpPercentage = (USER_STATS.currentXP / USER_STATS.nextLevelXP) * 100;

  if (isEmpty) {
    return (
      <div className={cn("p-12 text-center flex flex-col items-center justify-center min-h-[600px]", glassStyles.container)}>
        <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Your Gamification Journey Awaits
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
          Start studying to earn XP, level up, unlock achievements, and compete on the leaderboards. 
          Your progress will appear here.
        </p>
        <button 
          onClick={() => setIsEmpty(false)}
          className={cn("px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2", meta.dark.button)}
        >
          <Sparkles className="w-4 h-4" />
          Load Mock Data
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner (Level & XP) */}
      <div className={cn("p-6 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6", glassStyles.container)}>
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
          <div className="relative">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-200 dark:text-white/10" />
              <circle 
                cx="48" cy="48" r="44" stroke="currentColor" strokeWidth="6" fill="transparent" 
                strokeDasharray="276" strokeDashoffset={276 - (276 * xpPercentage) / 100}
                className="text-amber-500 transition-all duration-1000 ease-out" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Level</span>
              <span className="text-3xl font-black text-slate-900 dark:text-white">{USER_STATS.level}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              XP Progress
            </h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              <strong className="text-slate-900 dark:text-white">{USER_STATS.currentXP.toLocaleString()}</strong> / {USER_STATS.nextLevelXP.toLocaleString()} XP to Level {USER_STATS.level + 1}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 relative z-10 w-full md:w-auto md:justify-end">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Total Coins</div>
              <div className="text-lg font-bold text-slate-900 dark:text-white">{USER_STATS.totalCoins.toLocaleString()}</div>
            </div>
          </div>
          <button onClick={() => setIsEmpty(true)} className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 absolute top-0 right-0 m-4">
            Empty State
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Challenges & Streaks) */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Daily Challenges */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                Daily Challenges
              </h2>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-full border border-black/5 dark:border-white/10">
                Resets in 14h 22m
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DAILY_CHALLENGES.map((challenge, i) => (
                <motion.div 
                  key={challenge.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className={cn("p-5 relative overflow-hidden transition-all duration-300 group frosted-card", challenge.isCompleted ? "border-emerald-500/30 bg-emerald-500/5" : "")}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white pr-8">
                      {challenge.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      <Coins className="w-3.5 h-3.5" />
                      +{challenge.reward}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-500">Progress</span>
                      <span className={challenge.isCompleted ? "text-emerald-500" : "text-slate-900 dark:text-white"}>
                        {challenge.current} / {challenge.target}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", challenge.isCompleted ? "bg-emerald-500" : "bg-indigo-500")}
                        style={{ width: `${(challenge.current / challenge.target) * 100}%` }}
                      />
                    </div>
                  </div>

                  {challenge.isCompleted && (
                    <div className="absolute top-0 right-0 p-3 opacity-20 transform rotate-12 pointer-events-none">
                      <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </div>
                  )}
                  {challenge.isCompleted && challenge.current === challenge.target && (
                    <button 
                      onClick={handleClaimReward}
                      className={cn("mt-4 w-full py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95", meta.dark.button)}
                    >
                      <Gift className="w-4 h-4" />
                      Claim Reward
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Weekly Missions */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-purple-500" />
              Weekly Missions
            </h2>
            
            <div className="space-y-3">
              {WEEKLY_MISSIONS.map((mission, i) => (
                <div key={mission.id} className={cn("p-4 flex items-center gap-5 transition-all hover:-translate-y-0.5 frosted-card")}>
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300">
                    <mission.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-grow h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full transition-all duration-1000"
                          style={{ width: `${(mission.current / mission.target) * 100}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
                        {mission.current} / {mission.target}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Reward</div>
                    <div className="text-sm font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {mission.reward} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Medal className="w-4 h-4 text-blue-500" />
                Achievements
              </h2>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1">
                View All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ACHIEVEMENTS.map((achievement, i) => (
                <div 
                  key={achievement.id}
                  className={cn(
                    "p-4 relative overflow-hidden transition-all duration-300 frosted-card", 
                    !achievement.unlocked && "opacity-70 grayscale-[50%]"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn(
                      "p-2 rounded-xl",
                      achievement.unlocked ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" : "bg-slate-100 dark:bg-white/5 text-slate-400 border border-black/5 dark:border-white/10"
                    )}>
                      <achievement.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md">
                      {achievement.category}
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                    {achievement.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4 h-8">
                    {achievement.desc}
                  </p>

                  <div className="space-y-1.5 mt-auto">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="text-slate-500">Progress</span>
                      <span className={achievement.unlocked ? "text-emerald-500" : "text-slate-900 dark:text-white"}>
                        {achievement.progress} / {achievement.target}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1000", achievement.unlocked ? "bg-emerald-500" : "bg-blue-500")}
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (Leaderboard, Streaks, Badges) */}
        <div className="space-y-8">

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

          
          {/* Learning Streak */}
          <div className={cn("p-6 space-y-6", glassStyles.container)}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
              <Flame className="w-4 h-4 text-orange-500" />
              Learning Streak
            </div>

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 border-4 border-orange-500/20 mb-2 relative">
                  <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">{USER_STATS.currentStreak}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Days</div>
              </div>
              <div className="w-px h-16 bg-slate-200 dark:bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-white/5 border-2 border-black/5 dark:border-white/10 mb-2 mx-auto">
                  <Crown className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{USER_STATS.longestStreak}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Best Streak</div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">This Week</span>
                <span className="text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">Active</span>
              </div>
              <div className="flex justify-between gap-1">
                {['M','T','W','T','F','S','S'].map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      i < 4 ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : 
                      i === 4 ? "bg-slate-200 dark:bg-white/10 text-slate-400 border-2 border-dashed border-slate-300 dark:border-slate-600" :
                      "bg-slate-100 dark:bg-white/5 text-slate-400"
                    )}>
                      {i < 4 ? <CheckCircle2 className="w-4 h-4" /> : null}
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className={cn("p-6 space-y-6", glassStyles.container)}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <Trophy className="w-4 h-4 text-yellow-500" />
                Leaderboard
              </div>
              <button className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                View All
              </button>
            </div>

            <div className="flex bg-slate-100 dark:bg-black/20 p-1 rounded-xl">
              {['Global', 'Friends', 'University'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveLeaderboard(tab as any)}
                  className={cn(
                    "flex-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                    activeLeaderboard === tab 
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm" 
                      : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {LEADERBOARD.map((user, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-50 dark:hover:bg-white/[0.02]",
                    user.isCurrentUser ? "bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/20" : "bg-transparent border border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-6 text-center text-sm font-bold",
                    user.rank === 1 ? "text-yellow-500" :
                    user.rank === 2 ? "text-slate-400" :
                    user.rank === 3 ? "text-amber-700" : "text-slate-500"
                  )}>
                    #{user.rank}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-grow">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {user.name} {user.isCurrentUser && "(You)"}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Lvl {user.level} • <Flame className="w-3 h-3 inline text-orange-500" /> {user.streak}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-black text-slate-700 dark:text-slate-300">{user.xp.toLocaleString()}</div>
                    <div className="text-[9px] font-bold text-slate-400 uppercase">XP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge Collection */}
          <div className={cn("p-6 space-y-4", glassStyles.container)}>
            <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-white/5">
              <Award className="w-4 h-4 text-rose-500" />
              Badge Collection
            </div>
            
            <div className="grid grid-cols-5 gap-2">
              {BADGES.map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300",
                    badge.unlocked ? badge.color : "bg-slate-100 dark:bg-white/5 border-black/5 dark:border-white/10 grayscale opacity-40"
                  )}>
                    <badge.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{badge.name}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
