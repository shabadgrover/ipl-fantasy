import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Lock, Globe, AlertCircle, CheckCircle2, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createLeague } from '../api/leagues';

/**
 * CreateLeague modal/form.
 *
 * - Never sends ownerId; backend derives owner from JWT.
 * - Calls onSuccess() after a league is created (triggers parent refresh).
 * - Calls onClose() when the user dismisses.
 */
const CreateLeague = ({ onSuccess, onClose }) => {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [privacy, setPrivacy] = useState('PRIVATE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('League name is required');
      return;
    }
    if (name.trim().length > 100) {
      setError('League name cannot exceed 100 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Deliberately NOT passing ownerId — backend derives from JWT
      await createLeague({ name: name.trim(), privacy }, token);
      onSuccess();
    } catch (err) {
      setError(err?.message || 'Failed to create league');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      aria-modal="true"
      role="dialog"
      aria-label="Create League dialog"
    >
      <motion.div
        initial={{ scale: 0.93, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.93, y: 20, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-md bg-white dark:bg-[#111] rounded-3xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-black/5 dark:border-white/5">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Create a League
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              A fantasy team will be created automatically for you.
            </p>
          </div>
          <button
            id="create-league-close"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* League name */}
          <div>
            <label
              htmlFor="create-league-name"
              className="block text-xs font-black uppercase tracking-[0.15em] text-slate-500 mb-2"
            >
              League Name
            </label>
            <input
              id="create-league-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(null); }}
              placeholder="e.g. IPL Friends League 2027"
              maxLength={100}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#00d4ff]/50 focus:bg-white dark:focus:bg-white/[0.08] transition-all disabled:opacity-50"
            />
            <p className="text-[10px] text-slate-400 mt-1 text-right">
              {name.length}/100
            </p>
          </div>

          {/* Privacy */}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.15em] text-slate-500 mb-2">
              Privacy
            </p>
            <div className="flex gap-3">
              {[
                { value: 'PRIVATE', label: 'Private', icon: Lock, desc: 'Only invited members' },
                { value: 'PUBLIC', label: 'Public', icon: Globe, desc: 'Discoverable by anyone' },
              ].map(({ value, label, icon: Icon, desc }) => (
                <button
                  key={value}
                  type="button"
                  id={`create-league-privacy-${value.toLowerCase()}`}
                  onClick={() => setPrivacy(value)}
                  disabled={loading}
                  className={`flex-1 flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all disabled:opacity-50 ${
                    privacy === value
                      ? 'border-[#00d4ff]/50 bg-[#00d4ff]/10 text-[#00d4ff]'
                      : 'border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-500 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <Icon size={16} />
                  <span className="text-xs font-black">{label}</span>
                  <span className="text-[10px] text-slate-400 leading-tight">{desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              role="alert"
              aria-label={`Error: ${error}`}
            >
              <AlertCircle size={15} className="flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            id="create-league-submit"
            type="submit"
            disabled={loading || !name.trim()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#00d4ff] hover:bg-[#00d4ff]/90 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-black disabled:text-slate-500 font-black text-sm rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader size={15} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={15} />
                Create League
              </>
            )}
          </button>

          <p className="text-[10px] text-center text-slate-400 leading-relaxed">
            Your fantasy team will be created automatically when the league is set up.
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateLeague;
