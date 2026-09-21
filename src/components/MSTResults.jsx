import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, UserMinus, UserPlus } from 'lucide-react';

const mstTransfers = [
  { "team": "shabad's Team", "out": "Prashant Veer", "in": "Akeal Hosein", "type": "Low (-100)" },
  { "team": "shabad's Team", "out": "MS Dhoni", "in": "Sakib Hussain", "type": "Free" },
  { "team": "GURI XI", "out": "Jitesh Sharma", "in": "Cooper Connolly", "type": "Paid (-200)" },
  { "team": "GURI XI", "out": "Nehal Wadhera", "in": "Naman Dhir", "type": "Low (-100)" },
  { "team": "GURI XI", "out": "Finn Allen", "in": "Nitish Rana", "type": "Paid (-200)" },
  { "team": "Sumit's Team", "out": "Navdeep Saini", "in": "Xavier Bartlett", "type": "Bug Adj (-10)" },
  { "team": "Jenna Morrh Warriors", "out": "Rachin Ravindra", "in": "Sarfaraz Khan", "type": "Free" },
  { "team": "Piyush dhiman's Team", "out": "Jacob Bethell", "in": "AM Ghazanfar", "type": "Free" },
  { "team": "Piyush dhiman's Team", "out": "Glenn Phillips", "in": "Jason Holder", "type": "Paid (-200)" },
  { "team": "Ankit's Team", "out": "Mitchell Starc", "in": "Anshul Kamboj", "type": "Free" },
  { "team": "Ankit's Team", "out": "Venkatesh Iyer", "in": "Rasikh Dar Salam", "type": "Low (-100)" },
  { "team": "Ankit's Team", "out": "Harshal Patel", "in": "Prince Yadav", "type": "Low (-100)" },
  { "team": "Ankit's Team", "out": "Trent Boult", "in": "Nandre Burger", "type": "Paid (-200)" },
  { "team": "Maat maro shota bacha hu", "out": "Aqib Nabi", "in": "Mukesh Kumar", "type": "Low (-100)" },
  { "team": "Maat maro shota bacha hu", "out": "Abhishek Porel", "in": "Sameer Rizvi", "type": "Free" },
  { "team": "Maat maro shota bacha hu", "out": "Ayush Mhatre", "in": "Romario Shepherd", "type": "Free" },
  { "team": "Maat maro shota bacha hu", "out": "Rahul Tewatia", "in": "Harsh Dubey", "type": "Paid (-200)" },
  { "team": "Maat maro shota bacha hu", "out": "Khaleel Ahmed", "in": "Kartik Tyagi", "type": "Free" },
  { "team": "Deepanshuu's Team", "out": "Azmatullah Omarzai", "in": "Jamie Overton", "type": "Free" },
  { "team": "Deepanshuu's Team", "out": "Matheesha Pathirana", "in": "Eshan Malinga", "type": "Free" },
  { "team": "Aizen", "out": "Prithvi Shaw", "in": "Devdutt Padikkal", "type": "Free" },
  { "team": "Aizen", "out": "Ishant Sharma", "in": "Pathum Nissanka", "type": "Free" },
  { "team": "Aizen", "out": "Rahul Chahar", "in": "Suyash Sharma", "type": "Free" },
  { "team": "Aizen", "out": "Ashutosh Sharma", "in": "Rovman Powell", "type": "Free" }
];

const MSTResults = () => {
  return (
    <motion.div 
      id="mst-results"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      {/* Group by team */}
      {Object.entries(
        mstTransfers.reduce((acc, curr) => {
          if (!acc[curr.team]) acc[curr.team] = [];
          acc[curr.team].push(curr);
          return acc;
        }, {})
      ).map(([team, transfers], idx) => (
        <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-white/5 pb-2">
            {team}
          </h4>
          <div className="space-y-2">
            {transfers.map((t, tIdx) => (
              <div key={tIdx} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[11px] font-bold text-rose-500/80 line-through truncate max-w-[80px]">{t.out}</span>
                  <ArrowRight size={10} className="text-slate-600 flex-shrink-0" />
                  <span className="text-[11px] font-black text-emerald-400 truncate max-w-[80px]">{t.in}</span>
                </div>
                <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                  t.type.includes('Free') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {t.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default MSTResults;
