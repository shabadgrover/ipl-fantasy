import React, { useState } from 'react';
import { Users, Award, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamCard = ({ team, snapshotData }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isDark = document.documentElement.classList.contains('dark');

  // MST Logic: Separate active players from transferred out
  const activePlayers = team.players.filter(p => !p.isOut);
  const transferredOutPlayers = team.players.filter(p => p.isOut);

  // Sort active players by finalPoints descending
  const sortedPlayers = [...activePlayers].sort((a, b) => b.finalPoints - a.finalPoints);
  const topThree = sortedPlayers.slice(0, 3);
  const remaining = sortedPlayers.slice(3);

  return (
    <div className={`glass-card rounded-3xl p-6 h-fit self-start group transition-all duration-300 ${
      team.isUser ? 'ring-2 ring-primary/30 dark:ring-primary/40 bg-primary/[0.02] dark:bg-primary/[0.03] shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(255,255,255,0.06)] scale-[1.02] -translate-y-1' : 'hover:-translate-y-1 hover:shadow-xl'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="min-w-0 flex-1 flex items-start gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border shadow-sm ${
              team.rank === 1 ? 'bg-black/10 text-slate-900 border-black/20 dark:bg-white/10 dark:text-white dark:border-white/20' :
              team.rank <= 3 ? 'bg-black/5 text-slate-700 border-black/10 dark:bg-white/5 dark:text-slate-300 dark:border-white/10' :
              'bg-black/5 text-slate-500 border-black/5 dark:bg-white/5 dark:text-slate-400 dark:border-white/5'
            }`}>
              {team.rank}
            </div>
            {/* Trend Indicator */}
            <div className="flex items-center justify-center">
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
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`text-xl font-black truncate transition-all ${team.isUser ? 'text-primary dark:text-primary drop-shadow-[0_2px_10px_rgba(0,0,0,0.05)]' : 'text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-indigo-500 dark:group-hover:to-[#6366f1]'}`}>
                {team.teamName}
              </h3>
              {team.isUser && (
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest shadow-sm flex-shrink-0">
                  Your Team
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[10px]">
              <Users size={12} />
              <span>11 Players</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end ml-2">
          <div className="flex items-center gap-1 text-primary">
            <Award size={18} />
            <span className="text-lg font-black">{team.totalPoints}</span>
          </div>
          <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Points</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Top Contributors</h4>
          {team.roles?.captainChangeMatch && (
            <span className="text-[8px] font-black text-amber-600 dark:text-amber-400 tracking-tighter px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 shadow-sm" title={`Captain/VC updated from Match ${team.roles.captainChangeMatch}`}>
              Role Update M{team.roles.captainChangeMatch}
            </span>
          )}
        </div>
        
        <div className="space-y-2.5">
          {topThree.map((player, idx) => (
            <div key={idx} className="flex flex-col group/player">
              <div className="flex justify-between items-center text-[13px]">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {idx === 0 && <span className="text-sm">🔥</span>}
                  <span className={`font-medium truncate transition-all ${
                    player.isNew 
                      ? 'text-green-500 font-black drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                      : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {player.name}
                    {player.isNew && <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase font-black tracking-widest shadow-[0_0_8px_rgba(34,197,94,0.2)]">New</span>}
                  </span>
                  {player.isCaptain && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/10 dark:bg-gold/20 text-amber-600 dark:text-gold border border-amber-500/20 dark:border-gold/30 font-black flex-shrink-0">C</span>
                  )}
                  {player.isVC && (
                    <span className="text-[9px] px-1 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 font-black flex-shrink-0">VC</span>
                  )}
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <span className={`font-bold ${player.isNew ? 'text-green-500 drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]' : 'text-slate-900 dark:text-slate-100'}`}>
                    {player.finalPoints}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-0.5 opacity-0 group-hover/player:opacity-100 transition-opacity">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 italic uppercase tracking-tighter flex items-center gap-1">
                  <img src={`/Logos/${player.iplAbbr.toUpperCase()}.png`} alt={player.iplAbbr} className="w-3 h-3 object-contain opacity-60 group-hover/player:opacity-100 transition-opacity dark:hidden" />
                  <img src={`/Logos/dark/${player.iplAbbr.toLowerCase()}.png`} alt={player.iplAbbr} className="w-3 h-3 object-contain opacity-60 group-hover/player:opacity-100 transition-opacity hidden dark:block" />
                  {player.iplAbbr} 
                </span>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">
                  {player.basePoints}×{player.multiplier}
                </span>
              </div>
            </div>
          ))}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden space-y-2.5 pt-2.5 border-t border-black/5 dark:border-white/5"
              >
                {remaining.map((player, idx) => (
                  <div key={idx} className="flex flex-col group/player">
                    <div className="flex justify-between items-center text-[13px]">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className={`font-medium truncate transition-all ${
                          player.isNew 
                            ? 'text-green-500 font-black drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]' 
                            : 'text-slate-600 dark:text-slate-400'
                        }`}>
                          {player.name}
                          {player.isNew && <span className="ml-1.5 text-[8px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 uppercase font-black tracking-widest shadow-[0_0_8px_rgba(34,197,94,0.2)]">New</span>}
                        </span>
                        {player.isCaptain && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/10 dark:bg-gold/20 text-amber-600 dark:text-gold border border-amber-500/20 dark:border-gold/30 font-black flex-shrink-0">C</span>
                        )}
                        {player.isVC && (
                          <span className="text-[9px] px-1 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 font-black flex-shrink-0">VC</span>
                        )}
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <span className={`font-bold ${player.isNew ? 'text-green-500 drop-shadow-[0_0_4px_rgba(34,197,94,0.4)]' : 'text-slate-800 dark:text-slate-100'}`}>
                          {player.finalPoints}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Replaced Players (Red Strike-through) */}
                {transferredOutPlayers.length > 0 && (
                  <div className="pt-3 mt-3 space-y-2 border-t border-red-500/10">
                    <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/60 mb-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                      Transferred Out
                    </h5>
                    {transferredOutPlayers.map((player, idx) => (
                      <div key={`replaced-${idx}`} className="flex justify-between items-center text-[12px] opacity-70 group/out hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-red-500 font-semibold line-through decoration-red-500/50 truncate group-hover/out:decoration-red-500">{player.name}</span>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 uppercase font-black tracking-widest shadow-[0_0_8px_rgba(239,68,68,0.15)]">Out</span>
                        </div>
                        <span className="text-slate-500 dark:text-slate-400 font-bold">{player.finalPoints} <span className="text-[9px] uppercase font-medium">pts</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-yellow-600 dark:text-yellow-200/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-200/80 animate-pulse shadow-[0_0_8px_rgba(254,240,138,0.5)]"></span>
            MST Cost:
          </span>
          <span className="text-[11px] font-bold text-yellow-500 dark:text-yellow-200 drop-shadow-[0_0_4px_rgba(254,240,138,0.3)]">
            {team.mstCost || 0}
          </span>
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[10px] font-bold text-primary hover:text-indigo-600 dark:text-primary/80 dark:hover:text-primary transition-all flex items-center gap-1.5 uppercase tracking-widest group/btn"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp size={14} className="group-hover/btn:-translate-y-0.5 transition-transform" /></>
          ) : (
            <>View Full Team <ChevronDown size={14} className="group-hover/btn:translate-y-0.5 transition-transform" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default TeamCard;
