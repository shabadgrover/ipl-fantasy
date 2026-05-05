import React, { useState, useMemo } from 'react';
import { Calendar, ChevronRight, Info, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { matches } from '../data/matches';

const Schedule = ({ teams, hideInternalHeader }) => {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [showOnlyActive, setShowOnlyActive] = useState(true);

  const isDark = document.documentElement.classList.contains('dark');
  
  const matchDetails = useMemo(() => {
    if (!selectedMatch) return null;
    
    const isPhase1 = selectedMatch.id <= 35;
    
    const playersByTeam = {};
    selectedMatch.abbrs.forEach(abbr => {
      playersByTeam[abbr] = [];
    });

    (teams || []).forEach(fTeam => {
      (fTeam.players || []).forEach(player => {
        if (selectedMatch.abbrs.includes(player.iplAbbr)) {
          // If Phase 1: Hide new players
          if (isPhase1 && player.isNew) return;
          
          // In Phase 1: Old players were active, so they shouldn't be marked as "Out" visually
          const effectiveIsOut = isPhase1 ? false : player.isOut;
          
          // Determine dynamic captaincy based on match timeline
          const matchPhase = selectedMatch.id <= 36 ? 'phase1' : 'phase2';
          const isMatchCaptain = matchPhase === 'phase1' ? player.phase1Captain : player.phase2Captain;
          const isMatchVC = matchPhase === 'phase1' ? player.phase1ViceCaptain : player.phase2ViceCaptain;

          playersByTeam[player.iplAbbr].push({
            ...player,
            effectiveIsOut,
            isMatchCaptain,
            isMatchVC,
            ownedBy: fTeam.teamName,
            ownerTrend: fTeam.trend,
            ownerRank: fTeam.rank,
            ownerRankDiff: fTeam.rankDiff
          });
        }
      });
    });

    return playersByTeam;
  }, [selectedMatch, teams]);

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {!hideInternalHeader && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight text-shiny">AuctionRoom Schedule</h2>
            <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">Full season fixtures and fantasy player tracking</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/5 text-xs font-bold text-slate-600 dark:text-slate-500 uppercase tracking-widest transition-colors">
            <Calendar size={14} />
            Season 2026
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {matches.map((match) => (
            <motion.button
              key={match.id}
              whileHover={{ x: 8 }}
              onClick={() => setSelectedMatch(match)}
              className={`w-full text-left p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden group ${
                selectedMatch?.id === match.id
                ? 'bg-primary/5 dark:bg-white/10 border-primary/30 dark:border-white/20 shadow-xl shadow-[#0ea5e9]/10 dark:shadow-[#0ea5e9]/20'
                : 'bg-white dark:bg-white/5 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 shadow-sm dark:shadow-none'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg ${
                      selectedMatch?.id === match.id 
                      ? 'bg-black/10 text-slate-900 dark:bg-white/20 dark:text-white' 
                      : match.isCompleted 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-primary/10 text-primary border border-primary/20'
                    }`}>
                      {match.isCompleted ? 'Completed' : `Match ${match.id}`}
                    </span>
                    {match.isCompleted && <Zap size={10} className="text-emerald-500 dark:text-emerald-400" fill="currentColor" />}
                  </div>
                  <div>
                    <h3 className={`text-xl font-black leading-tight flex items-center gap-3 ${
                      selectedMatch?.id === match.id ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      <img src={`/Logos/${match.abbrs[0].toUpperCase()}.png`} alt={match.abbrs[0]} className="w-6 h-6 object-contain dark:hidden" />
                      <img src={`/Logos/dark/${match.abbrs[0].toLowerCase()}.png`} alt={match.abbrs[0]} className="w-6 h-6 object-contain hidden dark:block" />
                      {match.abbrs[0]} <span className="opacity-40 mx-1 text-sm text-slate-500">VS</span> {match.abbrs[1]}
                      <img src={`/Logos/${match.abbrs[1].toUpperCase()}.png`} alt={match.abbrs[1]} className="w-6 h-6 object-contain dark:hidden" />
                      <img src={`/Logos/dark/${match.abbrs[1].toLowerCase()}.png`} alt={match.abbrs[1]} className="w-6 h-6 object-contain hidden dark:block" />
                    </h3>
                    <p className={`text-xs mt-1 font-medium ${
                      selectedMatch?.id === match.id ? 'text-slate-600 dark:text-white/60' : 'text-slate-500'
                    }`}>
                      {match.date} • {match.venue}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`transition-transform duration-300 ${
                  selectedMatch?.id === match.id ? 'text-slate-900 dark:text-white translate-x-1' : 'text-slate-400 dark:text-slate-600 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                }`} />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedMatch ? (
              <motion.div
                key={selectedMatch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-premium rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 transition-colors duration-300 h-full"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-black/5 border-black/10 dark:bg-white/10 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white border dark:border-white/20 shadow-sm">
                    <Zap size={28} fill="currentColor" />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedMatch.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-500 font-medium flex items-center gap-2">
                        <span>{selectedMatch.time} • Local Time Delivery</span>
                        <span className="opacity-50">•</span>
                        <span className="text-[10px] uppercase font-black tracking-widest text-primary px-2 py-0.5 rounded bg-primary/10 border border-primary/20">
                          {selectedMatch.id <= 35 ? "Phase 1 Squad" : "Phase 2 Squad"}
                        </span>
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowOnlyActive(!showOnlyActive)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${
                        showOnlyActive 
                          ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary dark:border-primary/30' 
                          : 'bg-black/5 text-slate-500 border-black/10 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
                      }`}
                    >
                      {showOnlyActive ? 'Active Only: ON' : 'Active Only: OFF'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {selectedMatch.abbrs.map(abbr => (
                    <div key={abbr} className="space-y-6">
                      <div className="flex items-center gap-3 pb-3 border-b border-black/5 dark:border-white/5">
                        <div className="w-10 h-10 rounded-lg bg-white/5 dark:bg-white/10 flex items-center justify-center border border-black/5 dark:border-white/5 shadow-sm overflow-hidden p-1.5">
                          <img src={`/Logos/${abbr.toUpperCase()}.png`} alt={abbr} className="w-full h-full object-contain dark:hidden" />
                          <img src={`/Logos/dark/${abbr.toLowerCase()}.png`} alt={abbr} className="w-full h-full object-contain hidden dark:block" />
                        </div>
                        <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">{abbr} Squad</h4>
                      </div>
                      
                      <div className="space-y-3">
                        {matchDetails[abbr].filter(p => !showOnlyActive || !p.effectiveIsOut).length > 0 ? (
                          matchDetails[abbr].filter(p => !showOnlyActive || !p.effectiveIsOut).map((player, idx) => (
                            <motion.div 
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className={`p-4 rounded-2xl flex flex-col gap-1 transition-all ${
                                player.effectiveIsOut 
                                  ? 'bg-black/[0.01] border-black/5 dark:bg-white/[0.01] dark:border-white/5 opacity-50 grayscale'
                                  : 'bg-black/[0.02] border-black/5 dark:bg-white/[0.03] dark:border-white/5 group hover:bg-black/[0.04] hover:border-black/10 dark:hover:bg-white/[0.06] dark:hover:border-white/10'
                              } border`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`font-bold ${player.effectiveIsOut ? 'text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                                    {player.name} {player.effectiveIsOut ? '(Out)' : ''}
                                  </span>
                                  {player.isNew && !player.effectiveIsOut && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30 font-black tracking-widest">NEW</span>}
                                  {player.isMatchCaptain && !player.effectiveIsOut && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-gold/20 dark:text-gold dark:border-gold/30 font-black">C</span>}
                                  {player.isMatchVC && !player.effectiveIsOut && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 font-black">VC</span>}
                                </div>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-[10px] uppercase font-bold text-slate-500">
                                  {player.effectiveIsOut ? "Previously" : "Owned By"}
                                </span>
                                <div className="flex items-center gap-1.5 transition-colors">
                                  {!player.effectiveIsOut && (
                                    player.ownerTrend === 'up' ? (
                                      <TrendingUp size={10} className="text-emerald-500" strokeWidth={3} />
                                    ) : player.ownerTrend === 'down' ? (
                                      <TrendingDown size={10} className="text-rose-500" strokeWidth={3} />
                                    ) : (
                                      <Minus size={10} className="text-slate-400" strokeWidth={3} />
                                    )
                                  )}
                                  <span className={`text-[10px] font-black transition-colors ${
                                    player.effectiveIsOut ? 'text-slate-500' : 'text-primary hover:text-indigo-500 dark:group-hover:text-blue-400'
                                  }`}>
                                    {player.ownedBy}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ))
                        ) : (
                          <div className="p-10 rounded-[2rem] border border-dashed border-black/10 dark:border-white/5 text-center bg-white/50 dark:bg-transparent">
                            <Info className="mx-auto text-slate-400 dark:text-slate-700 mb-3" size={24} />
                            <p className="text-xs text-slate-600 dark:text-slate-500 font-medium italic">No {abbr} players found in anyone's squad.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-10 glass-premium rounded-[2.5rem] border border-dashed border-black/10 dark:border-white/10 text-center space-y-4 transition-colors duration-300">
                <div className="w-20 h-20 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-700">
                  <Calendar size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Select a Match</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-600 max-w-xs mx-auto font-medium">Click on any fixture to see detailed player ownership and fantasy impact.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
