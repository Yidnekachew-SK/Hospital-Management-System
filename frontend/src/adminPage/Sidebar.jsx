import React from 'react';

const Icons = {
  Management: () => <svg className="w-5 h-5 text-[#3BBFC4]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Facilities: () => <svg className="w-5 h-5 text-[#3BBFC4]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
  Relational: () => <svg className="w-5 h-5 text-[#3BBFC4]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  Audit: () => <svg className="w-5 h-5 text-[#3BBFC4]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  Logout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
};

const Sidebar = ({ activeTab, setActiveTab, navGroups, onLogout }) => {
  return (
    <aside className="w-64 bg-[#004D3D] text-white flex flex-col shrink-0 shadow-2xl z-20">
      <div className="p-8 pb-4">
        <button onClick={() => setActiveTab('Overview')} className="flex items-center gap-3 w-full p-2 rounded-2xl hover:bg-white/10 transition-all group">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#008564]/20 font-bold">A</div>
          <h1 className="text-sm font-bold tracking-tight">Addis Hospital</h1>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        {navGroups.map((group) => (
          <div key={group.label}>
            <div className="flex items-center gap-2 px-3 mb-2 text-white/40 font-bold uppercase text-[10px] tracking-[0.2em]">
              {group.label === 'Management' && <Icons.Management />}
              {group.label === 'Facilities' && <Icons.Facilities />}
              {group.label === 'Relational Data' && <Icons.Relational />}
              {group.label === 'System Audit' && <Icons.Audit />}
              <span>{group.label}</span>
            </div>
            <div className="space-y-1">
              {group.items.map(item => (
                <button key={item} onClick={() => setActiveTab(item)} className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === item ? 'bg-white text-[#004D3D] shadow-xl' : 'text-white/60 hover:bg-white/10'}`}>
                  {item}
                  {activeTab === item && <div className="w-1.5 h-1.5 rounded-full bg-[#008564]" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-slate-700">
           <div className="w-10 h-10 rounded-xl bg-[#008564] text-white flex items-center justify-center font-bold text-xs uppercase tracking-tighter">AD</div>
           <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Administrator</p>
              <button onClick={onLogout} className="flex items-center gap-1 text-[9px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-tighter transition-colors">
                <Icons.Logout /> Sign Out
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;