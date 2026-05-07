import React from 'react';
import TeamCard from './TeamCard';

const Teams = ({ teams, hideInternalHeader, snapshotData }) => {
  // Sort to bring user's team to the top
  const sortedTeams = [...teams].sort((a, b) => (b.isUser ? 1 : 0) - (a.isUser ? 1 : 0));

  return (
    <div className="w-full max-w-[1600px] mx-auto py-12 px-4">
      {!hideInternalHeader && (
        <div className="mb-10">
          <h2 className="text-sm font-black tracking-widest text-slate-600 dark:text-slate-500 uppercase mb-2">Squad Highlights</h2>
          <h1 className="text-4xl font-black mb-4 tracking-tighter text-slate-900 dark:text-white">Participating Teams</h1>
          <p className="text-slate-600 dark:text-slate-400">Explore squads and points breakdown across all fantasy franchises.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {sortedTeams.map((team) => (
          <TeamCard key={team.id} team={team} snapshotData={snapshotData} />
        ))}
      </div>
    </div>
  );
};

export default Teams;
