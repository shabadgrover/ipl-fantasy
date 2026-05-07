import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, TrendingDown, Minus, Users } from 'lucide-react';

const ImpactAnalysis = ({ teams, matchInfo, hideInternalHeader }) => {
  const isDark = document.documentElement.classList.contains('dark');
  if (!matchInfo) return null;

  // Calculate Impact Data
  const impactData = (teams || []).map(fTeam => {
    const matchPlayers = (fTeam.players || []).filter(p => matchInfo.abbrs.includes(p.iplAbbr) && !p.isOut);
    return {
      name: fTeam.teamName,
      count: matchPlayers.length,
      rank: fTeam.rank,
      trend: fTeam.trend,
      rankDiff: fTeam.rankDiff,
      players: matchPlayers.map(p => ({
        name: p.name,
        isCaptain: p.isCaptain,
        isVC: p.isVC,
        isNew: p.isNew,
        iplAbbr: p.iplAbbr
      }))
    };
  }).sort((a, b) => b.count - a.count);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {!hideInternalHeader && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-black/5 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white border border-black/10 dark:border-white/20 shadow-sm">
              <Target size={28} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Best Opportunity For</h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium tracking-wide">Fantasy Impact Analysis for {matchInfo.name}</p>
            </div>
          </div>
        </div>
      )}

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {impactData.map((team, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className={`glass-card rounded-[2rem] p-6 border transition-all duration-300 group hover:scale-[1.02] ${
              team.count >= 4 
                ? 'border-primary/30 bg-primary/[0.04] shadow-[0_0_40px_-15px_rgba(14,165,233,0.15)] dark:bg-primary/[0.02] dark:shadow-[0_0_40px_-15px_rgba(14,165,233,0.3)]' 
                : 'border-black/5 bg-black/[0.01] dark:border-white/5 dark:bg-white/[0.01]'
            } ${team.count === 0 ? 'opacity-50 grayscale-[0.5]' : ''}`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{team.name}</h3>
                  {team.trend === 'up' ? (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                      <TrendingUp size={10} className="text-emerald-500" strokeWidth={3} />
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400">{Math.abs(team.rankDiff || 0)}</span>
                    </div>
                  ) : team.trend === 'down' ? (
                    <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                      <TrendingDown size={10} className="text-rose-500" strokeWidth={3} />
                      <span className="text-[9px] font-black text-rose-600 dark:text-rose-400">{Math.abs(team.rankDiff || 0)}</span>
                    </div>
                  ) : (
                    <div className="px-1 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/5 opacity-40">
                      <Minus size={10} className="text-slate-400 dark:text-slate-600" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Rank {team.rank}</span>
                  {team.count >= 4 && (
                    <span className="text-[10px] w-fit px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 dark:bg-white/10 dark:text-white dark:border-white/20 shadow-sm rounded-md font-black uppercase tracking-wider animate-pulse">
                      High Impact 🔥
                    </span>
                  )}
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-sm border ${
                team.count >= 4 
                  ? 'bg-black/10 text-slate-900 border-black/20 dark:bg-white/10 dark:text-white dark:border-white/20' 
                  : 'bg-black/5 text-slate-500 border-black/5 dark:bg-white/5 dark:text-slate-300 dark:border-white/5'
              }`}>
                {team.count}
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-2">
                <Users size={12} />
                Match Players
              </p>
              {team.count > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {team.players.map((p, pIdx) => (
                    <div 
                      key={pIdx}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/[0.03] border border-black/5 hover:bg-black/[0.06] dark:bg-white/5 dark:border-white/5 dark:hover:bg-white/10 transition-colors"
                    >
                      <img src={`/Logos/dark/${p.iplAbbr.toLowerCase()}.png`} alt={p.iplAbbr} className="w-3.5 h-3.5 object-contain opacity-80 dark:hidden" />
                      <img src={`/Logos/dark/${p.iplAbbr.toLowerCase()}.png`} alt={p.iplAbbr} className="w-3.5 h-3.5 object-contain opacity-80 hidden dark:block" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.name}</span>
                      {p.isNew && <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 font-black tracking-widest">NEW</span>}
                      {p.isCaptain && <span className="text-[8px] px-1 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-gold/20 dark:text-gold dark:border-gold/30 font-black">C</span>}
                      {p.isVC && <span className="text-[8px] px-1 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 font-black">VC</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-2 px-4 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-600 block">No players in this match</span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-12 p-8 glass-premium rounded-[2.5rem] border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 transition-colors duration-300">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <TrendingUp size={24} />
          </div>
          <div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white">Strategy Insights</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Teams with 4+ players have the highest point variance this match-day.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-center">
            <span className="block text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest mb-1">Max Players</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{Math.max(0, ...impactData.map(d => d.count))}</span>
          </div>
          <div className="px-5 py-3 rounded-2xl bg-black/10 border border-black/10 dark:bg-white/10 dark:border-white/20 shadow-sm text-center">
            <span className="block text-[10px] font-black text-slate-700 dark:text-white/80 uppercase tracking-widest mb-1">Impact Avg</span>
            <span className="text-xl font-black text-slate-900 dark:text-white">{(impactData.reduce((acc, curr) => acc + curr.count, 0) / (impactData.length || 1)).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactAnalysis;
