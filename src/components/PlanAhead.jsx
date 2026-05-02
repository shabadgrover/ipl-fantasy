import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';

const PlanAhead = ({ matches }) => {
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="w-full max-w-6xl mx-auto px-4 mb-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Next Fixtures</h3>
            <p className="text-xs text-slate-500 font-medium tracking-tight">Don't miss the upcoming action</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((match, idx) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-[2rem] p-6 border border-black/5 dark:border-white/5 group hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Logo Watermark */}
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <img src={`/Logos/dark/${match.abbrs[1].toLowerCase()}.png`} alt="" className="w-24 h-24 object-contain" />
            </div>

            <div className="flex justify-between items-start mb-6">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-black/5 dark:bg-white/10 text-slate-500 dark:text-slate-400 rounded-lg border border-black/5 dark:border-white/5">
                Match {match.id}
              </span>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
                 LIVE {match.time}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm p-2 flex items-center justify-center transition-transform group-hover:scale-110">
                  <img src={`/Logos/dark/${match.abbrs[0].toLowerCase()}.png`} alt={match.abbrs[0]} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{match.abbrs[0]}</span>
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase italic">VS</span>
              </div>

              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="w-14 h-14 rounded-2xl bg-white/50 dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-sm p-2 flex items-center justify-center transition-transform group-hover:scale-110">
                  <img src={`/Logos/dark/${match.abbrs[1].toLowerCase()}.png`} alt={match.abbrs[1]} className="w-full h-full object-contain" />
                </div>
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{match.abbrs[1]}</span>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-black/5 dark:border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                <Calendar size={12} className="text-primary/60" />
                {match.date}
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-500 truncate">
                <MapPin size={12} className="text-slate-400" />
                {match.venue}
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all flex items-center justify-center gap-2 shadow-sm">
              View Squads <ChevronRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlanAhead;
