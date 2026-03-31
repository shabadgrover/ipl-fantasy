import React, { useState } from 'react';
import { Users, Award, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TeamCard = ({ team }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort players by finalPoints descending
  const sortedPlayers = [...team.players].sort((a, b) => b.finalPoints - a.finalPoints);
  const topThree = sortedPlayers.slice(0, 3);
  const remaining = sortedPlayers.slice(3);

  return (
    <div className={`glass-card rounded-3xl p-6 h-fit self-start group transition-all duration-300 ${
      team.isUser ? 'ring-2 ring-primary/30 dark:ring-primary/40 bg-primary/[0.02] dark:bg-primary/[0.03] shadow-[0_8px_40px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_40px_rgba(255,255,255,0.06)] scale-[1.02] -translate-y-1' : 'hover:-translate-y-1 hover:shadow-xl'
    }`}>
      <div className="flex justify-between items-start mb-4">
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
        </div>
        
        <div className="space-y-2.5">
          {topThree.map((player, idx) => (
            <div key={idx} className="flex flex-col group/player">
              <div className="flex justify-between items-center text-[13px]">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  {idx === 0 && <span className="text-sm">🔥</span>}
                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{player.name}</span>
                  {player.isCaptain && (
                    <span className="text-[9px] px-1 rounded bg-amber-500/10 dark:bg-gold/20 text-amber-600 dark:text-gold border border-amber-500/20 dark:border-gold/30 font-black flex-shrink-0">C</span>
                  )}
                  {player.isVC && (
                    <span className="text-[9px] px-1 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 font-black flex-shrink-0">VC</span>
                  )}
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{player.finalPoints}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-0.5 opacity-0 group-hover/player:opacity-100 transition-opacity">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 italic uppercase tracking-tighter">
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
                        <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{player.name}</span>
                        {player.isCaptain && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/10 dark:bg-gold/20 text-amber-600 dark:text-gold border border-amber-500/20 dark:border-gold/30 font-black flex-shrink-0">C</span>
                        )}
                        {player.isVC && (
                          <span className="text-[9px] px-1 rounded bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 dark:border-blue-500/30 font-black flex-shrink-0">VC</span>
                        )}
                      </div>
                      <div className="text-right ml-2 flex-shrink-0">
                        <span className="text-slate-800 dark:text-slate-100 font-bold">{player.finalPoints}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/5 flex justify-center">
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
