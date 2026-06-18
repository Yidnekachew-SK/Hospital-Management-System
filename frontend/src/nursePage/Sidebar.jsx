import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Layers, 
  Users, 
  Pill, 
  DollarSign, 
  LogOut, 
  Activity, 
  ShieldCheck 
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout, profile }) => {
  const groups = [
    { 
      label: 'HOSPITAL HUB', 
      items: [
        { name: 'Dashboard', icon: LayoutDashboard }
      ] 
    },
    { 
      label: 'WARD MANAGEMENT', 
      items: [
        { name: 'My Shift', icon: Clock },
        { name: 'Assigned Ward', icon: Layers },
        { name: 'Ward Patients', icon: Users }
      ] 
    },
    { 
      label: 'PATIENT CARE', 
      items: [
        { name: 'Prescriptions', icon: Pill }
      ] 
    },
    { 
      label: 'PERSONNEL', 
      items: [
        { name: 'My Payroll', icon: DollarSign }
      ] 
    }
  ];

  // Resolve nurse profile info
  const nurseName = profile?.EmployeeName || 'Attending Nurse';
  const nurseID = profile?.EmployeeID || 'NR-001';
  const certification = profile?.Certification || 'RN';
  const wardName = profile?.WardName || `Ward ${profile?.AssignedWard || 'A'}`;

  // Get initials for profile avatar
  const initials = nurseName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <aside className="w-72 bg-[#F4FAF8] border-r border-[#E2EFEB] flex flex-col shrink-0 h-full select-none font-sans">
      {/* Brand Header */}
      <div className="p-8 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#008564] rounded-xl flex items-center justify-center text-white shadow-md shadow-[#008564]/10">
            <Activity className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-sm font-black text-slate-900 tracking-tight leading-none">Addis Hospital</h1>
            <p className="text-[9px] text-[#008564] font-black mt-1 uppercase tracking-wider">Nurse Terminal</p>
          </div>
        </div>
      </div>

      {/* Navigation Group Items */}
      <nav className="flex-grow p-6 space-y-6 overflow-y-auto custom-scrollbar">
        {groups.map((group) => (
          <div key={group.label} className="space-y-1.5">
            <p className="text-[9px] font-black text-[#A1B8B3] uppercase tracking-widest px-3 mb-2">{group.label}</p>
            <div className="space-y-1">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.name;
                return (
                  <button 
                    key={item.name} 
                    onClick={() => setActiveTab(item.name)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-[11px] font-extrabold tracking-tight transition-all duration-200 border ${
                      isActive 
                        ? 'bg-[#E6F3F0] text-[#008564] border-[#CCE7E1] shadow-sm' 
                        : 'text-slate-650 hover:bg-[#EDF5F3] hover:text-[#006E52] border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#008564]' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#008564]" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Attending Nurse Profile Card */}
      <div className="p-6 mt-auto border-t border-[#E2EFEB] bg-[#EBF4F1]/40 shrink-0">
        <div className="bg-[#FFFFFF] border border-[#E2EFEB] rounded-[1.8rem] p-4 flex flex-col gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] text-[#008564] border border-[#A7F3D0] flex items-center justify-center font-extrabold text-sm uppercase">
                {initials}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border border-white flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="overflow-hidden text-left leading-tight">
              <p className="text-[9px] font-black text-[#8BAEA5] uppercase tracking-wider">Attending Nurse</p>
              <p className="text-xs font-bold text-slate-800 truncate" title={nurseName}>{nurseName}</p>
              <p className="text-[9px] font-mono font-bold text-slate-400 mt-0.5">{nurseID} • {certification}</p>
            </div>
          </div>
          
          <div className="px-3 py-1.5 bg-[#F4FAF8] border border-[#E2EFEB] rounded-xl text-[9px] font-bold text-[#008564] uppercase text-center tracking-wide block">
            {wardName}
          </div>

          <button 
            onClick={onLogout} 
            className="w-full py-2 bg-[#FDFEFE] hover:bg-red-50 hover:text-red-650 hover:border-red-200 text-slate-500 text-[10px] font-extrabold transition-all uppercase border border-slate-200/80 rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
