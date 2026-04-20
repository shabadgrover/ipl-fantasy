import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Shield, Lock, RefreshCcw, Clock, BookOpen, CircleDollarSign } from 'lucide-react';

const RuleSection = ({ icon: Icon, title, points, colorClass, iconColorClass }) => (
  <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2.5 rounded-xl bg-opacity-10 ${colorClass}`}>
        <Icon size={18} className={iconColorClass} />
      </div>
      <h3 className="font-bold text-white tracking-tight group-hover:text-shiny">{title}</h3>
    </div>
    <ul className="space-y-2.5">
      {points.map((point, idx) => (
        <li key={idx} className="text-xs md:text-sm text-slate-400 flex items-start gap-2 leading-relaxed">
          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-800 shrink-0 group-hover:bg-slate-600" />
          {point}
        </li>
      ))}
    </ul>
  </div>
);

const MSTRulesModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 md:p-10 border-b border-white/5">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                  <BookOpen size={22} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-white">MST – Mid Season Transfer Rules</h2>
                  <p className="text-sm text-slate-500 font-medium tracking-tight mt-1">Everything you need to know about squad re-shuffling.</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full hover:bg-white/5 text-slate-500 hover:text-white transition-all active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar flex-1 pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <RuleSection 
                  icon={CheckCircle2}
                  title="Free Transfer"
                  colorClass="bg-green-500"
                  iconColorClass="text-green-400"
                  points={[
                    "Player has 0 points (hasn’t played any match)",
                    "Player is ruled out of tournament",
                    "Replacement is permanent",
                    "No cost"
                  ]}
                />

                <RuleSection 
                  icon={Shield}
                  title="Temporary Substitute"
                  colorClass="bg-yellow-500/20"
                  iconColorClass="text-yellow-400"
                  points={[
                    "Allowed if player is injured",
                    "Substitute must be same role",
                    "Substitute plays until original player becomes available",
                    "Once available, original player points count"
                  ]}
                />

                <RuleSection 
                  icon={Lock}
                  title="Permanent Conversion"
                  colorClass="bg-blue-500/20"
                  iconColorClass="text-blue-400"
                  points={[
                    "Allowed if original player officially ruled out",
                    "Substitute becomes permanent automatically",
                    "No extra cost involved"
                  ]}
                />

                <RuleSection 
                  icon={CircleDollarSign}
                  title="Paid Transfer"
                  colorClass="bg-red-500/20"
                  iconColorClass="text-red-400"
                  points={[
                    "For benched / poor form players",
                    "Cost = 250 points deduction",
                    "Replacement is permanent"
                  ]}
                />

                <RuleSection 
                  icon={RefreshCcw}
                  title="Role Rule"
                  colorClass="bg-purple-500/20"
                  iconColorClass="text-purple-400"
                  points={[
                    "Replacements must be same role",
                    "Batter → Batter, Bowler → Bowler",
                    "All-rounder → All-rounder, WK → WK"
                  ]}
                />

                <RuleSection 
                  icon={Clock}
                  title="Deadline"
                  colorClass="bg-amber-500/20"
                  iconColorClass="text-amber-400"
                  points={[
                    "Transfers allowed till 25 April, 7:30 PM",
                    "No changes after deadline"
                  ]}
                />
              </div>

              {/* Notes Banner */}
              <div className="mt-8 p-6 md:p-8 rounded-[1.5rem] bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Official Notes</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Basis</span>
                    <span className="text-sm text-slate-400">Team selection status</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Policy</span>
                    <span className="text-sm text-slate-400">No reversing transfers</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-slate-600 font-bold underline decoration-blue-500/50 underline-offset-4">Advice</span>
                    <span className="text-sm text-white font-bold italic">Choose wisely</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MSTRulesModal;
