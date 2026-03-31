import React from 'react';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';

const Leaderboard = ({ teams, hideInternalHeader }) => {
  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {!hideInternalHeader && (
        <div className="text-center mb-12">
          <h2 className="text-sm font-black tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-3">Live Rankings</h2>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Leaderboard</h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Tournament Progress Tracking</p>
        </div>
      )}

      <div className="glass-premium rounded-[2rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/10 bg-black/5 dark:bg-white/5 tracking-wide">
                <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 text-center w-24">Rank</th>
                <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300">Team Name</th>
                <th className="py-4 px-8 text-right font-semibold text-slate-700 dark:text-slate-300 w-48">Total Points</th>
              </tr>
            </thead>
            <motion.tbody
              layout
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {teams.map((team, index) => {
                const rank = index + 1;
                const isTop3 = rank <= 3;
                const isUser = team.isUser;

                return (
                  <motion.tr 
                    layout
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    key={team.id}
                    className={`border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.08] ${
                      isUser 
                        ? 'bg-primary/[0.03] dark:bg-primary/[0.05] ring-1 ring-primary/20 dark:ring-primary/20 relative z-10 shadow-[0_0_15px_rgba(0,0,0,0.03)] dark:shadow-[0_0_15px_rgba(255,255,255,0.02)]' 
                        : ''
                    }`}
                  >
                    <td className="py-4 px-6 text-center w-20">
                      {rank === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-black/10 dark:bg-white/20 text-slate-900 dark:text-white border border-black/20 dark:border-white/30 flex items-center justify-center mx-auto shadow-sm">
                          <Trophy size={16} />
                        </div>
                      ) : rank === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-black/10 dark:border-white/20 flex items-center justify-center mx-auto shadow-sm">
                          <Medal size={16} />
                        </div>
                      ) : rank === 3 ? (
                        <div className="w-8 h-8 rounded-full bg-black/[0.02] dark:bg-white/5 text-slate-600 dark:text-slate-500 border border-black/5 dark:border-white/10 flex items-center justify-center mx-auto shadow-sm">
                          <Medal size={16} />
                        </div>
                      ) : (
                        <span className="text-slate-600 dark:text-slate-400 font-medium">{rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className={`font-black text-lg ${isUser ? 'text-slate-900 dark:text-white filter drop-shadow-sm' : isTop3 ? 'text-slate-800 dark:text-slate-200' : 'text-slate-600 dark:text-slate-400'}`}>
                          {team.teamName}
                        </span>
                        {isUser && (
                          <span className="text-[10px] px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-black uppercase tracking-widest shadow-sm">
                            Your Team
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-8 text-right font-black text-[22px] tracking-tight">
                      {isTop3 ? (
                        <span className="text-slate-900 dark:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:drop-shadow-lg">{team.totalPoints.toLocaleString()}</span>
                      ) : (
                        <span className="text-slate-800 dark:text-slate-200">{team.totalPoints.toLocaleString()}</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </motion.tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
