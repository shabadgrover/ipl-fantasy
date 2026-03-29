import React from 'react';
import { Calendar, MapPin, Zap, Users } from 'lucide-react';

const UpcomingMatch = ({ teams, hideInternalHeader }) => {
  const matchInfo = {
    matchName: "Match 3: RR vs CSK",
    date: "Monday, 30 March 2026 • 7:30 PM",
    venue: "Sawai Mansingh Stadium",
    teams: ["Rajasthan Royals", "Chennai Super Kings"],
    abbrs: ["RR", "CSK"]
  };

  const getMatchPlayers = (iplTeamName) => {
    const players = [];
    teams.forEach(fTeam => {
      fTeam.players.forEach(p => {
        if (p.iplTeam === iplTeamName) {
          players.push({
            ...p,
            ownedBy: fTeam.teamName
          });
        }
      });
    });
    return players.sort((a, b) => b.finalPoints - a.finalPoints);
  };

  const rrPlayers = getMatchPlayers("Rajasthan Royals");
  const cskPlayers = getMatchPlayers("Chennai Super Kings");

  return (
    <div className="max-w-6xl mx-auto px-4 pb-20">
      {/* Match Header */}
      <div className="glass-premium rounded-[3rem] p-10 border border-black/5 dark:border-white/5 mb-10 overflow-hidden relative transition-colors duration-300">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Zap size={120} className="text-slate-900 dark:text-white/20" fill="currentColor" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-black/5 text-slate-800 dark:bg-white/10 dark:text-white text-[10px] font-black uppercase tracking-widest shadow-sm border border-black/10 dark:border-white/20">Featured Match</span>
              <span className="text-slate-600 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                <Calendar size={12} />
                {matchInfo.date}
              </span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic">
              {matchInfo.abbrs[0]} <span className="text-slate-500 dark:text-slate-400 not-italic">VS</span> {matchInfo.abbrs[1]}
            </h2>
            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-primary" /> {matchInfo.venue}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Match Index</p>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{matchInfo.matchName.split(':')[0]}</p>
            </div>
            <div className="w-px h-12 bg-black/10 dark:bg-white/10 mx-2" />
            <div className="w-16 h-16 rounded-2xl bg-black/5 border border-black/5 dark:bg-white/5 dark:border-white/5 flex items-center justify-center text-2xl font-black text-slate-900 dark:text-white italic shadow-sm">
              VS
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Rajasthan Royals Squad */}
        <div className="glass-card rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-black/5 border border-black/10 dark:bg-white/10 dark:border-white/20 shadow-sm flex items-center justify-center text-slate-900 dark:text-white font-black text-sm">RR</div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Rajasthan Royals Squad</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Match Day Tracking</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {rrPlayers.map((player, pIdx) => (
              <div key={pIdx} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/5 dark:bg-white/[0.03] dark:border-white/5 group hover:bg-black/[0.04] hover:border-black/10 dark:hover:bg-white/[0.06] dark:hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{player.name}</span>
                    {player.isCaptain && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-gold/20 dark:text-gold dark:border-gold/30 font-black">C</span>}
                    {player.isVC && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 font-black">VC</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Owned By</span>
                  <span className="text-xs font-black text-primary/80 group-hover:text-primary transition-colors">{player.ownedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chennai Super Kings Squad */}
        <div className="glass-card rounded-[2.5rem] p-8 border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-black/5 border border-black/10 dark:bg-white/10 dark:border-white/20 shadow-sm flex items-center justify-center text-slate-900 dark:text-white font-black text-sm">CSK</div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Chennai Super Kings Squad</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em]">Match Day Tracking</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {cskPlayers.map((player, pIdx) => (
              <div key={pIdx} className="flex items-center justify-between p-4 rounded-2xl bg-black/[0.02] border border-black/5 dark:bg-white/[0.03] dark:border-white/5 group hover:bg-black/[0.04] hover:border-black/10 dark:hover:bg-white/[0.06] dark:hover:border-white/10 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40 group-hover:bg-emerald-500" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-200">{player.name}</span>
                    {player.isCaptain && <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:bg-gold/20 dark:text-gold dark:border-gold/30 font-black">C</span>}
                    {player.isVC && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 border border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30 font-black">VC</span>}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block">Owned By</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">{player.ownedBy}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMatch;
