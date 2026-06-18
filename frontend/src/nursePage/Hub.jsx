import React from 'react';
import { 
  Users, 
  Layers, 
  Pill, 
  Calendar, 
  Activity, 
  ChevronRight,
  ClipboardList
} from 'lucide-react';

const Hub = ({ stats, worklist, onViewRecord }) => {
  const metrics = [
    { 
      label: 'Assigned Patients', 
      val: stats?.patientCount || '0', 
      sub: 'Active primary ward coverage', 
      color: 'text-emerald-700', 
      bg: 'bg-emerald-50 border-[#A7F3D0]/30', 
      icon: Users 
    },
    { 
      label: 'Ward Rooms Count', 
      val: stats?.roomCount || '0', 
      sub: 'Total rooms in ward', 
      color: 'text-[#008564]', 
      bg: 'bg-[#E6F3F0] border-[#CCE7E1]', 
      icon: Layers 
    },
    { 
      label: 'Active Prescriptions', 
      val: stats?.prescriptionsCount || '0', 
      sub: 'Medications to administer', 
      color: 'text-teal-700', 
      bg: 'bg-teal-50 border-teal-150', 
      icon: Pill 
    },
    { 
      label: 'Logged Shifts', 
      val: stats?.shiftsCount || '0', 
      sub: 'Total scheduled shift blocks', 
      color: 'text-cyan-700', 
      bg: 'bg-cyan-50 border-cyan-150', 
      icon: Calendar 
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#008564] stroke-[2.5]" />
            Clinical Hub Overview
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">Real-time Patient and Ward Demographics</p>
        </div>
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">Secure DB Connection</span>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(m => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white p-6 rounded-3xl border border-slate-150 shadow-xs flex flex-col justify-between h-40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-black text-[#A1B8B3] uppercase tracking-widest">{m.label}</p>
                    <p className="text-3xl font-black text-slate-800 mt-2.5 leading-none">{m.val}</p>
                 </div>
                 <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center border shadow-inner`}>
                   <Icon className="w-5 h-5 stroke-[2]" />
                 </div>
              </div>
              <p className={`text-[10px] font-bold ${m.color} uppercase tracking-tight`}>{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Patient Worklist Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-150 p-8 shadow-sm">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Actionable Patient Worklist</h3>
              <span className="text-[9px] font-black text-[#008564] bg-[#E6F3F0] border border-[#CCE7E1] rounded-full px-3 py-1 uppercase tracking-wide">
                Primary Admitted Patient list
              </span>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3.5 px-2">Patient</th>
                    <th className="pb-3.5 px-2">Condition</th>
                    <th className="pb-3.5 px-2">Admitted Room</th>
                    <th className="pb-3.5 px-2 text-right">Records</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {worklist && worklist.length > 0 ? (
                    worklist.map(pat => (
                      <tr key={pat.PatientID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <p className="font-bold text-slate-800">{pat.PatientName}</p>
                          <p className="text-slate-400 uppercase text-[9px] font-mono mt-0.5">
                            ID: PAT-{String(pat.PatientID).padStart(3, '0')} • {pat.Gender === 'F' ? 'Female' : 'Male'}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <span className="px-2 py-0.5 bg-rose-50 border border-rose-100/50 text-rose-605 font-bold rounded text-[9px] uppercase tracking-wide">
                            {pat.PrimaryDiagnosis || 'ESSENTIAL MONITORING'}
                          </span>
                        </td>
                        <td className="py-4 px-2 font-mono font-bold text-slate-600">
                          Rm {pat.RoomNumber}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button 
                            onClick={() => onViewRecord(pat)}
                            className="inline-flex items-center gap-1 font-bold text-[#008564] hover:underline uppercase text-[9px] cursor-pointer"
                          >
                            Open Record <ChevronRight className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-450 italic font-semibold">
                        No active admissions found in your assigned ward.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
           </div>
        </div>

        {/* Info panel */}
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] border border-slate-150 p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-[#008564]" />
                Primary Care Duties
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                As a primary care nurse on shift, you are authorized to review active patient vitals, verify active prescriptions in rooms, and review ward room layouts. Please ensure all administered medications match doctor directives exactly.
              </p>
              <div className="mt-6 p-4 bg-[#F4FAF8] border border-[#E2EFEB] rounded-2xl">
                 <p className="text-[10px] font-black text-[#008564] uppercase mb-1">Assigned Ward Capacity</p>
                 <p className="text-xs text-slate-600">Ensure room assignments do not exceed maximum occupancy levels.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;
