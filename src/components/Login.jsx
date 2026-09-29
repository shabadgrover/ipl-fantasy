import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, User, Mail, Lock, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ onLogin }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    // Client-side required field validation
    if (mode === 'register' && !trimmedName) {
      setError('Name is required');
      return;
    }

    if (!trimmedEmail) {
      setError('Email is required');
      return;
    }

    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (mode === 'login') {
        result = await login({ email: trimmedEmail, password });
      } else {
        result = await register({ name: trimmedName, email: trimmedEmail, password });
      }

      if (onLogin) {
        onLogin(result);
      }
    } catch (err) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f5f5f7] dark:bg-black relative overflow-hidden transition-colors duration-300">
      {/* Subtle cinematic glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-black/[0.03] dark:bg-white/[0.02] rounded-[100%] blur-[100px] pointer-events-none transition-colors duration-300" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap size={32} className="text-slate-900 dark:text-white opacity-80" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">IPL FANTASY</h1>
          <p className="text-sm text-slate-600 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">Authentication Portal</p>
        </div>

        <div className="bg-white border border-black/5 dark:bg-[#111] dark:border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          {/* Mode Switcher */}
          <div className="flex bg-black/5 dark:bg-white/5 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchMode('register')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-black text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  key="register-name"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                    Your Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Virat Kohli"
                      disabled={isSubmitting}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-black/10 dark:bg-black/40 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:border-indigo-500 dark:focus:border-white/30 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50"
                      autoFocus={mode === 'register'}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-black/10 dark:bg-black/40 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:border-indigo-500 dark:focus:border-white/30 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50"
                  autoFocus={mode === 'login'}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'At least 8 characters' : '••••••••'}
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-black/10 dark:bg-black/40 dark:border-white/10 rounded-2xl text-slate-900 dark:text-white text-sm font-semibold outline-none focus:border-indigo-500 dark:focus:border-white/30 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 disabled:opacity-50"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-500 dark:text-red-400 text-xs font-bold text-center">
                  {error}
                </p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <span>
                {isSubmitting
                  ? mode === 'login'
                    ? 'Signing in...'
                    : 'Creating Account...'
                  : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
              </span>
              {!isSubmitting && (
                <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {mode === 'login' ? (
                <>Need an account? <span className="underline">Create one</span></>
              ) : (
                <>Already have an account? <span className="underline">Sign in</span></>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
