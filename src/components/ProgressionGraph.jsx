import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import { motion } from 'framer-motion';

const data = [
  { match: 3, ankit: 550, piyush: 470, aizen: 425, jenna: 422, shabad: 301, guri: 227, deepanshuu: 192, maat: 83, sumit: 41.5 },
  { match: 4, ankit: 671, piyush: 583, aizen: 425, jenna: 439, shabad: 479, guri: 288, deepanshuu: 356, maat: 345.5, sumit: 350.5 },
  { match: 5, ankit: 671, piyush: 713, aizen: 437, jenna: 694, shabad: 657, guri: 288, deepanshuu: 490.5, maat: 426.5, sumit: 406.5 },
  { match: 6, ankit: 689, piyush: 713, aizen: 548, jenna: 817, shabad: 906, guri: 360, deepanshuu: 578.5, maat: 530.5, sumit: 565.5 },
  { match: 7, ankit: 743, piyush: 736, aizen: 564, jenna: 1016, shabad: 920, guri: 396, deepanshuu: 643.5, maat: 1012.5, sumit: 737.5 },
  { match: 8, ankit: 738, piyush: 1053, aizen: 605, jenna: 1077, shabad: 994, guri: 483, deepanshuu: 643.5, maat: 1027.5, sumit: 742.5 },
  { match: 9, ankit: 927, piyush: 1468.5, aizen: 676, jenna: 1077, shabad: 1163.5, guri: 723, deepanshuu: 803.5, maat: 1107.5, sumit: 864.5 },
  { match: 10, ankit: 957, piyush: 1468.5, aizen: 716.5, jenna: 1253, shabad: 1332.5, guri: 723, deepanshuu: 1073.5, maat: 1122.5, sumit: 1241.5 },
  { match: 11, ankit: 1293, piyush: 1468.5, aizen: 716.5, jenna: 1287, shabad: 1535.5, guri: 897, deepanshuu: 1124.5, maat: 1149.5, sumit: 1389.5 },
  { match: 12, ankit: 1293, piyush: 1468.5, aizen: 716.5, jenna: 1287, shabad: 1535.5, guri: 897, deepanshuu: 1124.5, maat: 1149.5, sumit: 1389.5 }, // Washed out
  { match: 13, ankit: 1318.5, piyush: 1681.5, aizen: 805.5, jenna: 1345.5, shabad: 1795, guri: 1011.5, deepanshuu: 1128.5, maat: 1197.5, sumit: 1389.5 },
  { match: 14, ankit: 1360.5, piyush: 1813.5, aizen: 892.5, jenna: 1357.5, shabad: 2134, guri: 1149.5, deepanshuu: 1392.5, maat: 1221.5, sumit: 1798.5 },
  { match: 15, ankit: 1443.5, piyush: 1813.5, aizen: 984.5, jenna: 1484.5, shabad: 2314, guri: 1170.5, deepanshuu: 1599, maat: 1221.5, sumit: 1895.5 },
  { match: 16, ankit: 1739.5, piyush: 1977.5, aizen: 1160.5, jenna: 1484.5, shabad: 2476.5, guri: 1461.5, deepanshuu: 1667, maat: 1228.5, sumit: 1984.5 },
  { match: 17, ankit: 1749.5, piyush: 1990.5, aizen: 1250, jenna: 1661.5, shabad: 2500.5, guri: 1493.5, deepanshuu: 1941, maat: 1722.5, sumit: 2354.5 },
  { match: 18, ankit: 1749.5, piyush: 2003.5, aizen: 1322, jenna: 1658.5, shabad: 2539.5, guri: 1549.5, deepanshuu: 2113, maat: 1973.5, sumit: 2434.5 },
  { match: 19, ankit: 1780.5, piyush: 2086.5, aizen: 1322, jenna: 1744.5, shabad: 2852.5, guri: 1575.5, deepanshuu: 2499.5, maat: 1999.5, sumit: 2837.5 },
  { match: 20, ankit: 2207.5, piyush: 2280.5, aizen: 1322, jenna: 2027.5, shabad: 2979.5, guri: 1845.5, deepanshuu: 2499.5, maat: 1999.5, sumit: 2889.5 },
  { match: 21, ankit: 2215.5, piyush: 2368.5, aizen: 1592.5, jenna: 2049.5, shabad: 3077, guri: 1857.5, deepanshuu: 2648.5, maat: 2051.5, sumit: 2896.5 },
  { match: 22, ankit: 2263.5, piyush: 2380.5, aizen: 1656.5, jenna: 2215.5, shabad: 3132, guri: 2036.5, deepanshuu: 2872.5, maat: 2237.5, sumit: 2933.5 },
  { match: 23, ankit: 2594.5, piyush: 2380.5, aizen: 1656.5, jenna: 2231.5, shabad: 3232, guri: 2209.5, deepanshuu: 3074.5, maat: 2237.5, sumit: 3126.5 },
  { match: 24, ankit: 2606.5, piyush: 2646.5, aizen: 1656.5, jenna: 2306.5, shabad: 3232, guri: 2244.5, deepanshuu: 3122.5, maat: 2713.5, sumit: 3296.5 },
  { match: 25, ankit: 2652.5, piyush: 2900.5, aizen: 1969.5, jenna: 2377.5, shabad: 3580, guri: 2335.5, deepanshuu: 3318.5, maat: 2724.5, sumit: 3488.5 },
];

const teams = [
  { key: 'shabad', name: "shabad's Team", color: '#8B5CF6', strokeWidth: 4, glow: true },
  { key: 'piyush', name: "Piyush dhiman's Team", color: '#F59E0B', strokeWidth: 2 },
  { key: 'sumit', name: "Sumit's Team", color: '#10B981', strokeWidth: 2 },
  { key: 'ankit', name: "Ankit's Team", color: '#EF4444', strokeWidth: 2 },
  { key: 'jenna', name: "Jenna Morrh Warriors", color: '#EC4899', strokeWidth: 2 },
  { key: 'deepanshuu', name: "Deepanshuu's Team", color: '#06B6D4', strokeWidth: 2 },
  { key: 'maat', name: "Maat maro shota bacha hu", color: '#F97316', strokeWidth: 2 },
  { key: 'guri', name: "GURI XI", color: '#82ca9d', strokeWidth: 2 },
  { key: 'aizen', name: "Aizen", color: '#94a3b8', strokeWidth: 2 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-premium p-4 rounded-2xl border border-black/5 dark:border-white/10 shadow-2xl backdrop-blur-xl">
        <p className="text-sm font-black text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-widest">Match {label}</p>
        <div className="space-y-1.5">
          {payload.sort((a, b) => b.value - a.value).map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{entry.name}</span>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">{entry.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const ProgressionGraph = () => {
  const [activeTeam, setActiveTeam] = React.useState(null);
  const isDark = document.documentElement.classList.contains('dark');

  return (
    <div className="w-full max-w-6xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-premium rounded-[2.5rem] p-6 md:p-10 overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-sm font-black tracking-[0.2em] text-slate-500 uppercase mb-2">Analytics</h2>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter text-shiny">Fantasy League Progression</h3>
          </div>
          <motion.div 
            animate={{ 
              boxShadow: activeTeam === 'shabad' ? '0 0 20px rgba(139, 92, 246, 0.3)' : 'none',
              borderColor: activeTeam === 'shabad' ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
            }}
            className="flex items-center gap-4 bg-black/5 dark:bg-white/5 rounded-2xl p-4 border border-black/10 dark:border-white/10"
          >
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Leader</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">Sumit's Team</span>
             </div>
          </motion.div>
        </div>

        {/* Chart Container */}
        <div className="h-[500px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              onMouseMove={(e) => {
                if (e.activeTooltipIndex !== undefined) {
                  // Optional: trigger something on hover
                }
              }}
              onMouseLeave={() => setActiveTeam(null)}
            >
              <defs>
                <filter id="shadow" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="0" dy="0" result="offsetblur" />
                  <feFlood floodColor="currentColor" />
                  <feComposite in2="offsetblur" operator="in" />
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
              />
              
              <XAxis 
                dataKey="match" 
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dy={10}
                interval={window.innerWidth < 768 ? 1 : 0} // Show every other match on mobile
                label={{ 
                  value: 'Match', 
                  position: 'bottom', 
                  offset: -5,
                  fill: 'rgba(255,255,255,0.4)',
                  fontSize: 10,
                  fontWeight: 900,
                  textAnchor: 'middle'
                }}
              />
              
              <YAxis 
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                fontSize={10} 
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dx={-5}
                tickFormatter={(value) => value >= 1000 ? `${(value/1000).toFixed(1)}k` : value}
              />

              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ stroke: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', strokeWidth: 2 }}
                isAnimationActive={false}
              />
              
              <Legend 
                verticalAlign="top" 
                height={70}
                onMouseEnter={(e) => setActiveTeam(e.dataKey)}
                onMouseLeave={() => setActiveTeam(null)}
                content={({ payload }) => (
                  <div className="flex overflow-x-auto no-scrollbar pb-6 px-2 -mx-2 snap-x items-center gap-6">
                    {payload.map((entry, index) => {
                      const team = teams.find(t => t.name === entry.value);
                      const isHovered = activeTeam === team?.key;
                      const isOtherHovered = activeTeam && !isHovered;
                      
                      return (
                        <div 
                          key={`item-${index}`} 
                          className={`flex items-center gap-2 cursor-pointer transition-all duration-300 whitespace-nowrap snap-center ${isOtherHovered ? 'opacity-30' : 'opacity-100'}`}
                          onMouseEnter={() => setActiveTeam(team?.key)}
                          onMouseLeave={() => setActiveTeam(null)}
                          onClick={() => setActiveTeam(activeTeam === team?.key ? null : team?.key)}
                        >
                          <div className={`w-2.5 h-2.5 rounded-full transition-transform ${isHovered ? 'scale-125' : 'scale-100'}`} style={{ backgroundColor: entry.color, boxShadow: isHovered ? `0 0 10px ${entry.color}` : 'none' }} />
                          <span className={`text-[10px] font-black uppercase tracking-widest ${isHovered ? (isDark ? 'text-white' : 'text-slate-900') : 'text-slate-500 dark:text-slate-400'}`}>{entry.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              />

              {teams.map((team, index) => {
                const isHovered = activeTeam === team.key;
                const isOtherHovered = activeTeam && !isHovered;
                
                return (
                  <Line
                    key={team.key}
                    type="monotone"
                    dataKey={team.key}
                    name={team.name}
                    stroke={team.color}
                    strokeWidth={isHovered ? team.strokeWidth + 2 : team.strokeWidth}
                    strokeOpacity={isOtherHovered ? 0.15 : 1}
                    dot={isHovered ? { r: 6, fill: team.color, strokeWidth: 0 } : { r: 3, strokeWidth: 2, fill: '#000', stroke: team.color, opacity: isOtherHovered ? 0.2 : 1 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: team.color }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                    style={{ 
                      transition: 'all 0.3s ease',
                      filter: (isHovered || (team.glow && !activeTeam)) ? `drop-shadow(0 0 8px ${team.color}CC)` : 'none'
                    }}
                    onMouseEnter={() => setActiveTeam(team.key)}
                  />
                );
              })}

              {/* Highlight Match 12 (Washed out) */}
              <ReferenceArea 
                x1={11.5} 
                x2={12.5} 
                fill={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} 
                label={{ 
                  value: 'Washed Out', 
                  position: 'insideTop', 
                  fill: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.4)", 
                  fontSize: 10, 
                  fontWeight: 900,
                  offset: 20
                }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Interactive Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default ProgressionGraph;
