import React from "react";
import { Calendar, User, Clock, CheckCircle, Clock3 } from "lucide-react";

export default function AppointmentsTab({ appointments }) {
  const getDoctorName = (empId) => {
    if (empId === "EMP-042") return "Dr. Sarah Chen (Cardiology)";
    return "Staff Physician";
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-800 tracking-tight">Clinical Consultation Directory</h3>
          <p className="text-xs text-slate-400 font-medium">Review your historical and upcoming scheduled visits at Addis Hospital.</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Calendar size={18} />
        </div>
      </div>

      <div className="p-6">
        {appointments.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No Appointments Found</p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              You do not have any past or future appointments scheduled in this electronic health database.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 font-mono font-bold">Appt ID</th>
                  <th className="py-3 px-4">Attending Clinician</th>
                  <th className="py-3 px-4">Consultation Date</th>
                  <th className="py-3 px-4">Time Slot</th>
                  <th className="py-3 px-4 text-center">Status Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700 font-medium">
                {appointments.map((appt) => {
                  const isScheduled = appt.Status === "Scheduled";
                  return (
                    <tr key={appt.AppointmentID} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-500 font-bold">{appt.AppointmentID}</td>
                      <td className="py-4 px-4 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                          Dr
                        </div>
                        <span className="font-bold text-slate-800">{getDoctorName(appt.EmployeeID)}</span>
                      </td>
                      <td className="py-4 px-4 text-slate-650 font-bold">{appt.AppointmentDate}</td>
                      <td className="py-4 px-4 font-bold text-slate-600 flex items-center gap-1.5 mt-2">
                        <Clock size={11.5} className="text-slate-400" />
                        {appt.AppointmentTime}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          isScheduled 
                            ? "bg-emerald-50 border-emerald-100/50 text-emerald-700" 
                            : "bg-slate-50 border-slate-200 text-slate-500"
                        }`}>
                          {appt.Status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
