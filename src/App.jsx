import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import UpcomingMatch from './components/UpcomingMatch';
import Home from './components/Home';
import Schedule from './components/Schedule';
import { Home as HomeIcon, LayoutDashboard, Users, Zap, Calendar, Target, Sun, Moon, Share2, CheckCircle2, LogOut } from 'lucide-react';
import { parseExcelData } from './utils/excelParser';
import ImpactAnalysis from './components/ImpactAnalysis';
import { matches } from './data/matches';
import ProgressionGraph from './components/ProgressionGraph';
import MobileNav from './components/MobileNav';

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('userSession')) || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.xlsx?t=' + Date.now());
        if (!response.ok) throw new Error('Failed to load excel data from /data.xlsx');
        
        const arrayBuffer = await response.arrayBuffer();
        const parsedTeams = parseExcelData(arrayBuffer);
        
        const now = new Date();
        setLastUpdated(now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        
        // --- BASELINE DATA (Match 24 Standings) ---
        const BASELINE_MATCH24 = {
          "shabad's Team": 3232,
          "Sumit's Team": 3296.5,
          "Deepanshuu's Team": 3122.5,
          "Piyush dhiman's Team": 2646.5,
          "Ankit's Team": 2606.5,
          "Maat maro shota bacha hu": 2713.5,
          "Jenna Morrh Warriors": 2306.5,
          "GURI XI": 2244.5,
          "Aizen": 1656.5
        };

        const INITIAL_RANKS = Object.keys(BASELINE_MATCH24)
          .sort((a, b) => BASELINE_MATCH24[b] - BASELINE_MATCH24[a])
          .map((id, index) => ({ id, rank: index + 1 }));

        // Current totals come directly from the public/data.xlsx (cumulative Match 25)
        const finalStandings = parsedTeams.map(team => {
          const totalPoints = team.totalPoints;
          const previousPoints = BASELINE_MATCH24[team.id] || 0;
          return {
            ...team,
            matchPoints: totalPoints - previousPoints,
            totalPoints: totalPoints
          };
        });

        const sortedTeams = [...finalStandings].sort((a, b) => b.totalPoints - a.totalPoints);

        // Use INITIAL_RANKS (Match 23) as the fixed baseline for latest match movement
        const teamsWithTrend = sortedTeams.map((team, index) => {
          const currentRank = index + 1;
          const prevEntry = INITIAL_RANKS.find(p => p.id === team.id);
          let trend = 'same';
          let rankDiff = 0;
          
          if (prevEntry) {
            rankDiff = prevEntry.rank - currentRank;
            if (currentRank < prevEntry.rank) trend = 'up';
            else if (currentRank > prevEntry.rank) trend = 'down';
          }
          return { ...team, trend, rankDiff, rank: currentRank };
        });
        
        setTeams(teamsWithTrend);

        // Store current rankings for next comparison
        const rankingsToStore = teamsWithTrend.map((t, idx) => ({ id: t.id, rank: idx + 1 }));
        localStorage.setItem('previousLeaderboard', JSON.stringify(rankingsToStore));
        // ----------------------------

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const tabs = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'leaderboard', name: 'Leaderboard', icon: LayoutDashboard },
    { id: 'all-teams', name: 'All Teams', icon: Users },
    { id: 'upcoming', name: 'Upcoming Match', icon: Zap },
    { id: 'impact', name: 'Opportunity', icon: Target },
    { id: 'schedule', name: 'Schedule', icon: Calendar },
  ];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black transition-colors duration-500">
        <div className="text-center flex flex-col items-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20"
          >
            <Zap className="w-8 h-8 text-white" fill="currentColor" />
          </motion.div>
          <motion.h2 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-2xl md:text-3xl font-black text-white tracking-tighter"
          >
            Loading Fantasy League...
          </motion.h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
        <div className="text-center p-8 bg-white dark:bg-[#111] rounded-3xl border border-red-500/20 shadow-sm dark:shadow-none">
          <h2 className="text-xl font-black text-red-500 dark:text-red-400">Error Loading Data</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{error}</p>
        </div>
      </div>
    );
  }
  
  const handleLogin = (userData) => {
    localStorage.setItem('userSession', JSON.stringify(userData));
    setSession(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userSession');
    setSession(null);
  };

  if (!session) {
    return <Login onLogin={handleLogin} />;
  }

  const teamsWithUser = teams.map(team => ({
    ...team,
    isUser: session?.role === 'player' && team.teamName === session.team
  }));

  const upcomingMatch = matches.find(m => !m.isCompleted) || matches[matches.length - 1];

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Zap size={18} className="text-black dark:text-white" fill="currentColor" />
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">IPL Fantasy</span>
          </div>
          
          <div className="flex items-center gap-1 md:gap-4">
            <nav className="hidden md:flex gap-1 md:gap-4 overflow-x-auto items-center">
              {tabs.slice(1).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollTo(tab.id)}
                  className="text-[10px] font-black tracking-[0.2em] text-slate-500 hover:text-[#00d4ff] hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all duration-300 px-3 py-2 whitespace-nowrap uppercase"
                >
                  {tab.name}
                </button>
              ))}
              
              <button
                onClick={handleShare}
                className="ml-2 flex items-center gap-1.5 px-3 py-2 text-[10px] font-black tracking-[0.2em] uppercase text-slate-500 hover:text-[#00d4ff] hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)] transition-all duration-300"
                aria-label="Share League"
              >
                <Share2 size={14} />
                <span className="hidden sm:inline">Share</span>
              </button>
            </nav>

            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={toggleTheme}
                className="px-3 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:scale-105 transition-all duration-300"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {session && (
                <button 
                  onClick={handleLogout} 
                  className="ml-1 md:ml-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                >
                  <LogOut size={16} />
                  <span className="hidden md:inline">{session.role === 'observer' ? 'Exit' : 'Logout'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.8 }} 
        className="flex flex-col"
      >
        <section id="home">
          <Home onNavigate={scrollTo} />
        </section>

        <section id="leaderboard" className="pt-20 md:pt-32 pb-10 md:pb-20 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white text-shiny">Track Every Point.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">The live leaderboard updated in real-time. Last Refreshed: {lastUpdated}</p>
          </motion.div>
          <Leaderboard teams={teamsWithUser} hideInternalHeader={true} />
          <ProgressionGraph />
        </section>
        
        <section id="all-teams" className="pt-20 md:pt-32 pb-10 md:pb-20 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white text-shiny">Know Your Team.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Every squad, every player, every stat beautifully organized.</p>
          </motion.div>
          <Teams teams={teamsWithUser} hideInternalHeader={true} />
        </section>

        <section id="upcoming" className="pt-20 md:pt-32 pb-6 md:pb-10 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white text-shiny">Plan Ahead.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Deep impact analysis for the next upcoming fixture.</p>
          </motion.div>
          <UpcomingMatch teams={teamsWithUser} matchInfo={upcomingMatch} hideInternalHeader={true} />
        </section>

        <section id="impact" className="pb-20 pt-10">
          <ImpactAnalysis teams={teamsWithUser} matchInfo={upcomingMatch} hideInternalHeader={true} />
        </section>

        <section id="schedule" className="pt-20 md:pt-32 pb-20 md:pb-32 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white text-shiny">The Long Game.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Full tournament schedule and fixture tracking.</p>
          </motion.div>
          <Schedule teams={teamsWithUser} hideInternalHeader={true} />
        </section>
      </motion.main>

      <footer className="border-t border-black/5 dark:border-white/5 bg-[#f5f5f7] dark:bg-black py-16 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">© 2026 IPL Fantasy League. All rights reserved.</p>
          <p className="text-xs text-slate-600 dark:text-slate-700 mt-2">Designed for the purists.</p>
        </div>
      </footer>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 px-5 py-3 bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-black rounded-full shadow-2xl border border-white/10 dark:border-black/10"
          >
            <CheckCircle2 size={18} className="text-green-400 dark:text-green-600" />
            <span className="text-sm font-semibold tracking-wide">Link copied to clipboard</span>
          </motion.div>
        )}
      </AnimatePresence>
      <MobileNav onNavigate={scrollTo} />
    </div>
  );
}

export default App;
