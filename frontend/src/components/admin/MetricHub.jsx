import React from 'react';

// Renders metric summaries in either large cards (Hub) or compact bar (Sub-pages)
const MetricHub = ({ metrics, isMini, onNavigate }) => {
  const paths = {
    'Personnel': "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    'Revenue': "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    'Occupancy': "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    'Security': "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  };

  if (isMini) {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {metrics.map(s => (
          <button key={s.label} onClick={() => onNavigate(s.tab)} className="bg-white px-4 py-3 rounded-2xl border border-slate-100 flex items-center gap-3 shrink-0 hover:bg-slate-50 transition-all">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color.split(' ')[0]}`}>
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={paths[s.label]} /></svg>
            </div>
            <div className="text-left"><p className="text-[9px] font-bold text-slate-400 uppercase">{s.label}</p><p className="text-xs font-black text-slate-900">{s.val}</p></div>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-8">
      {metrics.map(s => (
        <button key={s.label} onClick={() => onNavigate(s.tab)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all text-left flex flex-col justify-between h-48 group">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color} transition-transform group-hover:scale-110`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={paths[s.label]} /></svg>
          </div>
          <div><p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</p><p className="text-3xl font-black text-slate-900 mt-1">{s.val}</p></div>
        </button>
      ))}
    </div>
  );
};

export default MetricHub;