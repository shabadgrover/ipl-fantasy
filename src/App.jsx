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
import PlanAhead from './components/PlanAhead';
import ImpactAnalysis from './components/ImpactAnalysis';
import { matches } from './data/matches';
import ProgressionGraph from './components/ProgressionGraph';
import MobileNav from './components/MobileNav';
import { saveCurrentStateSnapshot, getSavedSnapshots } from './utils/snapshot';



function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('userSession')) || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [showToast, setShowToast] = useState(false);
  const [showSnapshot, setShowSnapshot] = useState(false);
  const [snapshotData, setSnapshotData] = useState(null);


  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
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
        
        // --- BASELINE DATA (Match 46 Standings) ---
        const BASELINE_PREVIOUS_MATCH = {
          "Sumit's Team": 6740,
          "Deepanshuu's Team": 6289,
          "shabad's Team": 5753,
          "Piyush dhiman's Team": 5644.5,
          "Ankit's Team": 4829.5,
          "Jenna Morrh Warriors": 5028,
          "Maat maro shota bacha hu": 4828,
          "Aizen": 4407,
          "GURI XI": 3825.5
        };

        const INITIAL_RANKS = Object.keys(BASELINE_PREVIOUS_MATCH)
          .sort((a, b) => BASELINE_PREVIOUS_MATCH[b] - BASELINE_PREVIOUS_MATCH[a])
          .map((id, index) => ({ id, rank: index + 1 }));

        // Current totals come directly from the public/data.xlsx (cumulative Match 35)
        const finalStandings = parsedTeams.map(team => {
          const totalPoints = team.totalPoints;
          const previousPoints = BASELINE_PREVIOUS_MATCH[team.id] || 0;
          return {
            ...team,
            matchPoints: totalPoints - previousPoints,
            totalPoints: totalPoints
          };
        });

        const sortedTeams = [...finalStandings].sort((a, b) => b.totalPoints - a.totalPoints);

        // Use INITIAL_RANKS (Match 31) as the fixed baseline for latest match movement
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

        // Take a one-time snapshot of the current state
        saveCurrentStateSnapshot(teamsWithTrend);
        
        // Load snapshot data for the optional viewer
        setSnapshotData(getSavedSnapshots());

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

  const userTeam = teamsWithUser.find(t => t.isUser);
  const upcomingMatch = matches.find(m => !m.isCompleted) || matches[matches.length - 1];
  const nextMatches = matches.filter(m => !m.isCompleted).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Zap size={18} className="text-black dark:text-white" fill="currentColor" />
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">IPL Fantasy</span>
            {upcomingMatch && (
              <div className="hidden lg:flex items-center gap-2 ml-4 px-3 py-1 bg-black/5 dark:bg-white/10 rounded-full border border-black/5 dark:border-white/5 animate-in fade-in slide-in-from-bottom-4">
                <img src={`/Logos/light/${upcomingMatch.abbrs[0].toLowerCase()}.png`} alt="" className="w-4 h-4 object-contain dark:hidden" />
                <img src={`/Logos/dark/${upcomingMatch.abbrs[0].toLowerCase()}.png`} alt="" className="w-4 h-4 object-contain hidden dark:block" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{upcomingMatch.abbrs[0]} v {upcomingMatch.abbrs[1]}</span>
                <img src={`/Logos/light/${upcomingMatch.abbrs[1].toLowerCase()}.png`} alt="" className="w-4 h-4 object-contain dark:hidden" />
                <img src={`/Logos/dark/${upcomingMatch.abbrs[1].toLowerCase()}.png`} alt="" className="w-4 h-4 object-contain hidden dark:block" />
              </div>
            )}
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
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>

              {session && (
                <button 
                  onClick={() => setShowSnapshot(!showSnapshot)}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#00d4ff] transition-all px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg"
                >
                  <Target size={14} />
                  <span className="hidden md:inline">Snapshot</span>
                </button>
              )}

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
          <Home onNavigate={scrollTo} snapshotData={snapshotData} />
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
          <Leaderboard teams={teamsWithUser} hideInternalHeader={true} upcomingMatch={upcomingMatch} />
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
          <Teams teams={teamsWithUser} hideInternalHeader={true} snapshotData={snapshotData} />
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
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Strategy and squad depth for the next {nextMatches.length} fixtures.</p>
          </motion.div>
          <PlanAhead matches={nextMatches} />
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <h3 className="text-sm font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.3em] flex items-center gap-4">
               <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
               Detailed Analysis for Next Match
               <div className="h-px flex-1 bg-black/5 dark:bg-white/5" />
            </h3>
          </div>
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

      {/* Snapshot Viewer Modal */}
      <AnimatePresence>
        {showSnapshot && snapshotData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSnapshot(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-premium w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-[2.5rem] border border-white/10 flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-8 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div>
                  <h2 className="text-sm font-black tracking-[0.2em] text-slate-500 uppercase mb-2">System Backup</h2>
                  <h3 className="text-2xl font-black text-white tracking-tighter">Phase 1 Data Snapshot</h3>
                </div>
                <button 
                  onClick={() => setShowSnapshot(false)}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                >
                  <CheckCircle2 size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Leaderboard Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00d4ff]">Leaderboard Snapshot</h4>
                    <div className="space-y-2">
                      {snapshotData.leaderboard.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs font-bold text-slate-300">{item.name}</span>
                          <span className="text-sm font-black text-white">{item.totalPoints.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Snapshot Info</h4>
                    <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                      <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        This snapshot was captured automatically on first load to preserve the state before major structural changes.
                      </p>
                      <div className="mt-6 pt-6 border-t border-emerald-500/10 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Status</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-400 font-bold uppercase">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Team Details Section */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Historical Squads</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {snapshotData.teams.map((team, idx) => (
                      <div key={idx} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                        <h5 className="text-xs font-black text-white uppercase tracking-wider truncate">{team.userId}</h5>
                        <div className="space-y-1">
                          {team.team.slice(0, 5).map((p, pIdx) => (
                            <div key={pIdx} className="flex justify-between text-[10px]">
                              <span className="text-slate-400 truncate max-w-[100px]">{p.name}</span>
                              <span className="text-slate-200 font-bold">{p.points} pts</span>
                            </div>
                          ))}
                          {team.team.length > 5 && (
                            <p className="text-[9px] text-slate-500 font-bold pt-1">+{team.team.length - 5} more players</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <MobileNav onNavigate={scrollTo} />
    </div>
  );
}

export default App;
