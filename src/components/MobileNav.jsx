import React from 'react';
import { Home, LayoutDashboard, Users, Calendar, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const MobileNav = ({ activeTab, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'leaderboard', icon: LayoutDashboard, label: 'Board' },
    { id: 'all-teams', icon: Users, label: 'Teams' },
    { id: 'schedule', icon: Calendar, label: 'Dates' },
  ];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 inset-x-0 z-[60] md:hidden px-4 pb-6 pt-2"
    >
      <div className="bg-white/80 dark:bg-black/60 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl h-16 flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="flex flex-col items-center gap-1 px-3"
          >
            <item.icon 
              size={20} 
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" 
              strokeWidth={activeTab === item.id ? 3 : 2}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNav;
