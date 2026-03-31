export const teamColors = {
  "Chennai Super Kings": "text-yellow-500 dark:text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Mumbai Indians": "text-blue-500 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Royal Challengers Bengaluru": "text-red-500 dark:text-red-400 bg-red-500/10 border-red-500/20",
  "Kolkata Knight Riders": "text-purple-600 dark:text-purple-400 bg-purple-600/10 border-purple-600/20",
  "Sunrisers Hyderabad": "text-orange-500 dark:text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Rajasthan Royals": "text-pink-500 dark:text-pink-400 bg-pink-500/10 border-pink-500/20",
  "Delhi Capitals": "text-blue-600 dark:text-blue-500 bg-blue-600/10 border-blue-600/20",
  "Punjab Kings": "text-red-600 dark:text-red-500 bg-red-600/10 border-red-600/20",
  "Gujarat Titans": "text-teal-500 dark:text-teal-400 bg-teal-500/10 border-teal-500/20",
  "Lucknow Super Giants": "text-cyan-600 dark:text-cyan-400 bg-cyan-600/10 border-cyan-600/20",
};

export const getTeamAccent = (teamName) => {
  return teamColors[teamName] || "text-slate-900 dark:text-white bg-black/5 dark:bg-white/10 border-black/10 dark:border-white/20";
};

export const getTeamBorder = (teamName) => {
  const mapping = {
    "Chennai Super Kings": "ring-yellow-500/30",
    "Mumbai Indians": "ring-blue-500/30",
    "Royal Challengers Bengaluru": "ring-red-500/30",
    "Kolkata Knight Riders": "ring-purple-600/30",
    "Sunrisers Hyderabad": "ring-orange-500/30",
    "Rajasthan Royals": "ring-pink-500/30",
    "Delhi Capitals": "ring-blue-600/30",
    "Punjab Kings": "ring-red-600/30",
    "Gujarat Titans": "ring-teal-500/30",
    "Lucknow Super Giants": "ring-cyan-600/30",
  };
  return mapping[teamName] || "ring-black/10 dark:ring-white/20";
};
