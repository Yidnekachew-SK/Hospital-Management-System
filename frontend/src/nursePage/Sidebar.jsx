import React from 'react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const groups = [
    { label: 'HOSPITAL HUB', items: ['Dashboard'] },
    { label: 'WARD MANAGEMENT', items: ['My Shift', 'Assigned Ward', 'Ward Patients'] },
    { label: 'PATIENT CARE', items: ['Prescriptions'] },
    { label: 'PERSONNEL', items: ['My Payroll'] }
  ];

  return (
    <aside className="w-64 bg-[#F9FAFB] border-r border-slate-100 flex flex-col shrink-0 h-full">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#008564] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#008564]/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">Addis Hospital</h1>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">Hospital Hub</p>
          </div>
        </div>

        <nav className="space-y-8">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest px-3 mb-3">{group.label}</p>
              <div className="space-y-1">
                {group.items.map(item => (
                  <button 
                    key={item} 
                    onClick={() => setActiveTab(item)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === item ? 'bg-[#E6F3F0] text-[#008564] shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {item}
                    {activeTab === item && <div className="w-1.5 h-1.5 rounded-full bg-[#008564]" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <div className="bg-[#F3F4F6] rounded-[2rem] p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] flex items-center justify-center text-[#008564] font-bold text-xs">SC</div>
            <div className="overflow-hidden text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Attending Nurse</p>
              <p className="text-xs font-bold text-slate-900 truncate">Dr. Sarah Chen</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full py-2 bg-white rounded-xl text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors uppercase border border-slate-100 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;