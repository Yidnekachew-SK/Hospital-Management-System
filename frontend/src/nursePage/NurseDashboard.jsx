import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import Hub from './Hub.jsx';
import DataTable from './DataTable.jsx';

const NurseDashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-white text-slate-700 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      
      <main className="flex-1 flex flex-col overflow-hidden bg-white">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Addis Hospital</span>
             <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round"/></svg>
             <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 px-4 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black tracking-widest flex items-center border border-emerald-100 uppercase shadow-sm">Patient Vault</div>
             <div className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-400">AAU</div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-12 bg-white">
          <div className="max-w-7xl mx-auto">
             {activeTab === 'Dashboard' ? <Hub /> : <DataTable activeTab={activeTab} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default NurseDashboard;