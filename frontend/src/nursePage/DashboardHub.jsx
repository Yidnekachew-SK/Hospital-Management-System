import React from "react";
import { Users, Calendar, LabIcon, Scissors, ChevronRight, Activity, ClipboardList } from "lucide-react";

export default function DashboardHub({ stats, worklist, onViewRecord }) {
  const metrics = [
    { label: "Assigned Patients", val: stats.patientCount, sub: "Attending ward occupancy", color: "text-emerald-700", bg: "bg-emerald-50/70 border-emerald-100", icon: Users },
    { label: "Today's Bookings", val: stats.bookingsCount, sub: "Attending ward appointments", color: "text-amber-700", bg: "bg-amber-50/70 border-amber-100", icon: Calendar },
    { label: "Total Labs Requested", val: stats.labsCount, sub: "Pending/completed lab tests", color: "text-teal-700", bg: "bg-teal-50/70 border-teal-100", icon: ClipboardList },
    { label: "Scheduled Surgeries", val: stats.surgeriesCount, sub: "Attending ward surgical procedures", color: "text-purple-700", bg: "bg-purple-50/70 border-purple-100", icon: Scissors }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Activity size={20} className="text-emerald-700 stroke-[2.5]" />
        Attending Ward Overview
      </h2>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map(m => {
          const IconComp = m.icon;
          return (
            <div key={m.label} className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs flex flex-col justify-between h-40 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-2">{m.val}</p>
                 </div>
                 <div className={`w-10 h-10 rounded-xl ${m.bg} ${m.color} flex items-center justify-center border font-bold text-sm`}>
                   <IconComp size={18} />
                 </div>
              </div>
              <p className={`text-[10px] font-bold ${m.color} uppercase tracking-tight`}>{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Patient Worklist Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">Actionable Patient Worklist</h3>
              <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100/50 rounded-full px-2.5 py-0.5 uppercase">
                Active Ward Admissions
              </span>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-3 px-2">Patient</th>
                    <th className="pb-3 px-2">Condition / Diagnosis</th>
                    <th className="pb-3 px-2">Room</th>
                    <th className="pb-3 px-2 text-right">Medical Record</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {worklist.length > 0 ? (
                    worklist.map((patient) => (
                      <tr key={patient.PatientID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-2">
                          <p className="font-bold text-slate-800">{patient.PatientName}</p>
                          <p className="text-slate-400 uppercase text-[9px] font-semibold mt-0.5">
                            ID: PAT-{patient.PatientID} • {patient.Gender === "F" ? "Female" : "Male"}
                          </p>
                        </td>
                        <td className="py-4 px-2">
                          <span className="inline-flex px-2 py-0.5 bg-rose-50 text-rose-600 font-bold rounded text-[10px] border border-rose-100/30 uppercase">
                            {patient.PrimaryDiagnosis || "UNDIAGNOSED"}
                          </span>
                        </td>
                        <td className="py-4 px-2">
                          <span className="font-mono font-bold text-slate-600">Rm {patient.RoomNumber}</span>
                        </td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => onViewRecord(patient)}
                            className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline uppercase text-[10px] cursor-pointer"
                          >
                            Open Record <ChevronRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-400 font-semibold italic">
                        No active admissions found in your assigned ward.
                      </td>
                    </tr>
                  )}
                </tbody>
             </table>
           </div>
        </div>

        {/* Info / Quick Links panel */}
        <div className="space-y-6">
           <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">attending ward information</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                As a primary care nurse, you are responsible for monitoring the vitals, medical records, and administering scheduled medications for all patients admitted to your ward's rooms.
              </p>
              <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-xs font-bold text-slate-700">All services connected to DB</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
