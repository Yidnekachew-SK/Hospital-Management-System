import React from 'react';

const Hub = () => {
  const metrics = [
    { label: 'Assigned Patients', val: '4', sub: '100% active primary coverage', color: 'text-emerald-500', bg: 'bg-emerald-50', icon: "U" },
    { label: "Today's Appts", val: '0', sub: "Today's clinical schedule", color: 'text-amber-500', bg: 'bg-amber-50', icon: "C" },
    { label: 'Total Labs Requested', val: '4', sub: '3 laboratory tests pending', color: 'text-teal-500', bg: 'bg-teal-50', icon: "L" },
    { label: 'Scheduled Surgeries', val: '1', sub: 'Surgical theatre ready', color: 'text-purple-500', bg: 'bg-purple-50', icon: "S" }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <h2 className="text-xl font-bold text-slate-800">Clinical Hub Overview</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {metrics.map(m => (
          <div key={m.label} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between h-44">
            <div className="flex justify-between items-start">
               <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                  <p className="text-4xl font-black text-slate-900 mt-2">{m.val}</p>
               </div>
               <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center font-bold text-sm`}>{m.icon}</div>
            </div>
            <p className={`text-[10px] font-bold ${m.color} uppercase tracking-tight`}>{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm">
           <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-800">Actionable Patient Worklist</h3>
              <button className="text-xs font-bold text-[#008564] hover:underline">View Full Directory →</button>
           </div>
           <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-50">
                  <th className="pb-4">Patient</th>
                  <th className="pb-4">Condition</th>
                  <th className="pb-4">Lab Status</th>
                  <th className="pb-4 text-right">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                <tr>
                  <td className="py-6"><p className="font-bold text-slate-800">Tsion Hailu</p><p className="text-slate-400 uppercase text-[9px]">ID: PAT-001 • Age 32</p></td>
                  <td className="py-6"><span className="px-2 py-1 bg-rose-50 text-rose-600 font-bold rounded">ESSENTIAL HYPERTENSION</span></td>
                  <td className="py-6"><div className="flex items-center gap-2 font-bold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pending</div></td>
                  <td className="py-6 text-right font-bold text-[#008564] cursor-pointer hover:underline uppercase text-[9px]">Open Record</td>
                </tr>
                <tr>
                  <td className="py-6"><p className="font-bold text-slate-800">Nebiyu Tesfaye</p><p className="text-slate-400 uppercase text-[9px]">ID: PAT-002 • Age 38</p></td>
                  <td className="py-6"><span className="px-2 py-1 bg-amber-50 text-amber-600 font-bold rounded">POST-OP RECOVERY</span></td>
                  <td className="py-6"><div className="flex items-center gap-2 font-bold text-slate-400"><div className="w-1.5 h-1.5 rounded-full bg-slate-300" /> None</div></td>
                  <td className="py-6 text-right font-bold text-[#008564] cursor-pointer hover:underline uppercase text-[9px]">Open Record</td>
                </tr>
              </tbody>
           </table>
        </div>
        <div className="space-y-6">
           <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-800 uppercase tracking-widest mb-4">Today's Bookings</h4>
              <p className="text-xs text-slate-400 italic">No clinician bookings scheduled for today.</p>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm h-48 flex items-center justify-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">Clinician Fast-Track</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hub;