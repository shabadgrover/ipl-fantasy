import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Lock, Globe, Plus, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyLeagues, createLeague } from '../api/leagues';
import CreateLeague from './CreateLeague';

/* ─── Small helpers ───────────────────────────────────────────────────────── */

const PrivacyBadge = ({ privacy }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
    privacy === 'PUBLIC'
      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
      : 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
  }`}>
    {privacy === 'PUBLIC' ? <Globe size={9} /> : <Lock size={9} />}
    {privacy === 'PUBLIC' ? 'Public' : 'Private'}
  </span>
);

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
    status === 'ACTIVE'
      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
      : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
  }`}>
    {status === 'ACTIVE' ? 'Active' : 'Archived'}
  </span>
);

/* ─── League Card ─────────────────────────────────────────────────────────── */

const LeagueCard = ({ league }) => {
  const memberCount = league._count?.members ?? league.memberCount ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative bg-white/5 dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-2xl p-6 hover:border-[#00d4ff]/30 hover:bg-white/10 dark:hover:bg-white/[0.06] transition-all duration-300"
      aria-label={`League: ${league.name}`}
    >
      {/* Accent glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00d4ff]/0 to-[#00d4ff]/0 group-hover:from-[#00d4ff]/5 group-hover:to-transparent transition-all duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00d4ff]/20 to-blue-600/20 border border-[#00d4ff]/20 flex items-center justify-center flex-shrink-0">
              <Trophy size={18} className="text-[#00d4ff]" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white truncate leading-tight" title={league.name}>
                {league.name}
              </h3>
              {league.owner?.name && (
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                  Owner: {league.owner.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <PrivacyBadge privacy={league.privacy} />
            <StatusBadge status={league.status} />
          </div>
        </div>

        {/* Member count */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Users size={13} />
          <span className="text-xs font-bold">{memberCount} {memberCount === 1 ? 'member' : 'members'}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/5 dark:bg-white/5" />

        {/* My Team */}
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-2">
            Your Team
          </p>
          {league.myTeam ? (
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-[#00d4ff]/10 to-transparent border border-[#00d4ff]/20 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-[#00d4ff] flex-shrink-0" />
              <span className="text-sm font-black text-slate-900 dark:text-white truncate">
                {league.myTeam.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0" />
              <span className="text-xs font-medium text-slate-500 italic">No team assigned</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Empty State ─────────────────────────────────────────────────────────── */

const EmptyState = ({ onCreateLeague }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center justify-center text-center py-20 px-6"
    aria-label="No leagues yet"
  >
    <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00d4ff]/20 to-blue-600/20 border border-[#00d4ff]/20 flex items-center justify-center mb-6">
      <Trophy size={36} className="text-[#00d4ff]" />
    </div>
    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
      No leagues yet
    </h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-8 text-sm">
      You don&apos;t have any leagues yet. Create your first league to get started.
    </p>
    <button
      id="my-leagues-create-first"
      onClick={onCreateLeague}
      className="inline-flex items-center gap-2 px-6 py-3 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black font-black text-sm rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <Plus size={16} />
      Create Your First League
    </button>
  </motion.div>
);

/* ─── My Leagues Main Component ───────────────────────────────────────────── */

const MyLeagues = () => {
  const { token } = useAuth();
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchLeagues = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getMyLeagues(token);
      setLeagues(data.leagues || []);
    } catch (err) {
      setError(err?.message || 'Failed to load leagues');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLeagues();
  }, [fetchLeagues]);

  const handleLeagueCreated = useCallback(() => {
    setShowCreate(false);
    fetchLeagues();
  }, [fetchLeagues]);

  return (
    <section id="my-leagues" className="max-w-5xl mx-auto px-4 py-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            My Leagues
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Leagues you own or participate in
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="my-leagues-refresh"
            onClick={fetchLeagues}
            disabled={loading}
            className="p-2.5 rounded-xl border border-black/10 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all disabled:opacity-40"
            aria-label="Refresh leagues"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            id="my-leagues-create"
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black font-black text-xs rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">Create League</span>
            <span className="sm:hidden">Create</span>
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20" aria-label="Loading leagues">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-12 h-12 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center mb-4"
          >
            <Zap size={20} className="text-[#00d4ff]" />
          </motion.div>
          <p className="text-slate-500 text-sm font-medium">Loading your leagues...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400"
          role="alert"
          aria-label={`Error: ${error}`}
        >
          <AlertCircle size={18} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Failed to load leagues</p>
            <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* League grid */}
      {!loading && !error && (
        leagues.length === 0 ? (
          <EmptyState onCreateLeague={() => setShowCreate(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leagues.map((league, i) => (
              <motion.div
                key={league.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <LeagueCard league={league} />
              </motion.div>
            ))}
          </div>
        )
      )}

      {/* Create League modal */}
      <AnimatePresence>
        {showCreate && (
          <CreateLeague
            onSuccess={handleLeagueCreated}
            onClose={() => setShowCreate(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default MyLeagues;
