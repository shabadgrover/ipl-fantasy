import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronRight, User } from 'lucide-react';

const playerCodes = {
  "SHABAD123": { name: "Shabad", team: "shabad's Team" },
  "NITESH123": { name: "Nitesh", team: "Aizen" },
  "GURSHARAN123": { name: "Gursharan", team: "GURI XI" },
  "PIYUSH123": { name: "Piyush", team: "Piyush dhiman's Team" },
  "SUMIT123": { name: "Sumit", team: "Sumit's Team" },
  "ANKIT123": { name: "Ankit", team: "Ankit's Team" },
  "BHATTI123": { name: "Deepanshu", team: "Deepanshuu's Team" },
  "HARSH123": { name: "Harsh", team: "Maat maro shota bacha hu" },
  "SAHIL123": { name: "Sahil", team: "Jenna Morrh Warriors" }
};

const Login = ({ onLogin }) => {
  const [showInput, setShowInput] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleObserver = () => {
    onLogin({ role: 'observer' });
  };

  const handlePlayerSubmit = (e) => {
    e.preventDefault();
    const upperCode = code.toUpperCase().trim();
    if (playerCodes[upperCode]) {
      onLogin({
        ...playerCodes[upperCode],
        role: 'player'
      });
    } else {
      setError('Invalid Access Code');
      setTimeout(() => setError(''), 3000);
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
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black/5 border border-black/10 dark:bg-white/5 dark:border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap size={32} className="text-slate-900 dark:text-white opacity-80" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">IPL FANTASY</h1>
          <p className="text-sm text-slate-600 dark:text-slate-500 font-bold uppercase tracking-[0.2em]">Authentication Portal</p>
        </div>

        <div className="bg-white border border-black/5 dark:bg-[#111] dark:border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden transition-colors duration-300">
          <AnimatePresence mode="wait">
            {!showInput ? (
              <motion.div 
                key="options"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4 relative z-10"
              >
                <button 
                  onClick={() => setShowInput(true)}
                  className="w-full flex items-center justify-between p-5 bg-black/5 hover:bg-black/10 border border-black/10 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/20 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <User size={20} className="text-slate-700 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white transition-colors" />
                    <span className="font-bold text-slate-900 dark:text-white tracking-wide">Login as Player</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1" />
                </button>
                
                <button 
                  onClick={handleObserver}
                  className="w-full flex items-center justify-between p-5 bg-black/[0.02] hover:bg-black/5 border border-black/5 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 rounded-2xl transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-600 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-300 tracking-wide transition-colors">Continue as Observer</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                </button>
              </motion.div>
            ) : (
              <motion.form 
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handlePlayerSubmit}
                className="space-y-6 relative z-10"
              >
                <div>
                  <label className="block text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest mb-3">
                    Enter Access Code
                  </label>
                  <input 
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. SHABAD123"
                    className="w-full bg-slate-50 border border-black/10 dark:bg-black/40 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold outline-none focus:border-indigo-500 dark:focus:border-white/30 transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-700 uppercase tracking-widest text-center"
                    autoFocus
                  />
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="text-red-500 dark:text-red-400 text-xs font-bold text-center mt-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowInput(false);
                      setError('');
                      setCode('');
                    }}
                    className="px-6 py-4 bg-black/5 hover:bg-black/10 border border-black/5 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/5 rounded-2xl text-slate-600 dark:text-slate-300 font-bold transition-all"
                  >
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 rounded-2xl font-black transition-all"
                  >
                    Authenticate
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
