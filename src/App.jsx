import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Login from './components/Login';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import UpcomingMatch from './components/UpcomingMatch';
import Home from './components/Home';
import Schedule from './components/Schedule';
import { Home as HomeIcon, LayoutDashboard, Users, Zap, Calendar, Target, Loader2, Sun, Moon } from 'lucide-react';
import { parseExcelData } from './utils/excelParser';
import ImpactAnalysis from './components/ImpactAnalysis';

function App() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  const [session, setSession] = useState(() => JSON.parse(localStorage.getItem('userSession')) || null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

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
        let response;
        try {
          response = await fetch('/cricket_spirit_ipl26_Teams_2026-03-29.xlsx');
          if (!response.ok) throw new Error('New file not found');
        } catch (e) {
          response = await fetch('/data.xlsx');
          if (!response.ok) throw new Error('Failed to load excel data');
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const parsedTeams = parseExcelData(arrayBuffer);
        const sortedTeams = [...parsedTeams].sort((a, b) => b.totalPoints - a.totalPoints);
        setTeams(sortedTeams);
        
        const now = new Date();
        setLastUpdated(now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-slate-900 dark:text-white animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">Parsing Live Data...</h2>
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

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black transition-colors duration-300">
      {/* Navigation Header */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 transition-all duration-500">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Zap size={18} className="text-black dark:text-white" fill="currentColor" />
            <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white">IPL Fantasy</span>
          </div>
          
          <nav className="flex gap-1 md:gap-4 overflow-x-auto items-center">
            {tabs.slice(1).map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollTo(tab.id)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors tracking-wide px-3 py-2 whitespace-nowrap"
              >
                {tab.name}
              </button>
            ))}
            
            <button
              onClick={toggleTheme}
              className="ml-2 px-3 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {session?.role === 'player' && (
              <button
                onClick={handleLogout}
                className="ml-2 md:ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                Logout
              </button>
            )}
            {session?.role === 'observer' && (
              <button
                onClick={handleLogout}
                className="ml-2 md:ml-4 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-3 py-1.5 border border-black/10 dark:border-white/10 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                Exit
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content Areas */}
      <main className="flex flex-col">
        <section id="home">
          <Home onNavigate={scrollTo} />
        </section>

        <section id="leaderboard" className="pt-32 pb-20 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white">Track Every Point.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">The live leaderboard updated in real-time. Last Refreshed: {lastUpdated}</p>
          </motion.div>
          <Leaderboard teams={teamsWithUser} hideInternalHeader={true} />
        </section>
        
        <section id="all-teams" className="pt-32 pb-20 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white">Know Your Team.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Every squad, every player, every stat beautifully organized.</p>
          </motion.div>
          <Teams teams={teamsWithUser} hideInternalHeader={true} />
        </section>

        <section id="upcoming" className="pt-32 pb-10 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white">Plan Ahead.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Deep impact analysis for the next upcoming fixture.</p>
          </motion.div>
          <UpcomingMatch teams={teamsWithUser} hideInternalHeader={true} />
        </section>

        <section id="impact" className="pb-20 pt-10">
          <ImpactAnalysis teams={teamsWithUser} hideInternalHeader={true} />
        </section>

        <section id="schedule" className="pt-32 pb-32 border-t border-black/5 dark:border-white/5">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto px-4 mb-4 text-center"
          >
            <h2 className="text-[clamp(3rem,5vw,4.5rem)] font-black tracking-tighter leading-tight text-slate-900 dark:text-white">The Long Game.</h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-500 mt-2 tracking-tight">Full tournament schedule and fixture tracking.</p>
          </motion.div>
          <Schedule teams={teamsWithUser} hideInternalHeader={true} />
        </section>
      </main>

      {/* Apple Style Footer */}
      <footer className="border-t border-black/5 dark:border-white/5 bg-[#f5f5f7] dark:bg-black py-16 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-500 font-medium">© 2026 IPL Fantasy League. All rights reserved.</p>
          <p className="text-xs text-slate-600 dark:text-slate-700 mt-2">Designed for the purists.</p>
        </div>
      </footer>

    </div>
  );
}

export default App;
