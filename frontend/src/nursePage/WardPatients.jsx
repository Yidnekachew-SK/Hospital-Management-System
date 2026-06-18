import React from "react";
import { Users, AlertCircle } from "lucide-react";

export default function WardPatients({ patients }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="text-emerald-700 stroke-[2.5]" size={20} />
            Attending Ward Patients
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Admitted Patients In Assigned Rooms
          </p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100/30 font-bold text-xs uppercase tracking-tight px-3 py-1">
          {patients.length} Active Patients
        </div>
      </div>
      
      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 px-4">Patient ID</th>
              <th className="pb-4 px-4">Patient Name</th>
              <th className="pb-4 px-4">Gender</th>
              <th className="pb-4 px-4">Birthdate</th>
              <th className="pb-4 px-4">Room Number</th>
              <th className="pb-4 px-4">Admission Date</th>
              <th className="pb-4 px-4 text-right">Diagnosis</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {patients.length > 0 ? (
              patients.map((pat) => (
                <tr key={pat.PatientID} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 px-4 font-mono font-bold text-emerald-800">
                    PAT-{String(pat.PatientID).padStart(3, '0')}
                  </td>
                  <td className="py-5 px-4 font-extrabold text-slate-800">
                    {pat.PatientName}
                  </td>
                  <td className="py-5 px-4 text-slate-600">
                    {pat.Gender === "F" ? "Female" : "Male"}
                  </td>
                  <td className="py-5 px-4 text-slate-500 font-mono">
                    {new Date(pat.DOB_DATE).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-4 font-mono text-slate-700 font-bold">
                    Rm {pat.RoomNumber}
                  </td>
                  <td className="py-5 px-4 text-slate-500 font-mono">
                    {new Date(pat.AdmissionDate).toLocaleDateString()}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className="inline-flex px-2 py-0.5 bg-rose-50 border border-rose-100/50 text-rose-600 rounded font-bold uppercase text-[9px] tracking-tight">
                      {pat.PrimaryDiagnosis || "UNDIAGNOSED"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold italic">
                  No active patients found in your ward.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
