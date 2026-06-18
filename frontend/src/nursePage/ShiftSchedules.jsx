import React from "react";
import { Clock, CalendarCheck } from "lucide-react";

export default function ShiftSchedules({ shifts }) {
  const formatTime = (timeStr) => {
    if (!timeStr) return "—";
    try {
      const parts = timeStr.split(":");
      const hours = parseInt(parts[0]);
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${parts[1]} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  const getStatusStyle = (status) => {
    const val = String(status || '').toLowerCase();
    if (val === 'active') return 'bg-emerald-50 text-emerald-700 border-emerald-100/50';
    if (val === 'completed') return 'bg-blue-50 text-blue-700 border-blue-100/50';
    return 'bg-amber-50 text-amber-700 border-amber-100/50';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="text-emerald-700 stroke-[2.5]" size={20} />
            My Shift Ledger
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Database Shift Schedules
          </p>
        </div>
        <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100/30">
          <CalendarCheck size={18} />
        </div>
      </div>
      
      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 px-4">Schedule ID</th>
              <th className="pb-4 px-4">Shift Date</th>
              <th className="pb-4 px-4">Start Time</th>
              <th className="pb-4 px-4">End Time</th>
              <th className="pb-4 px-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shifts.length > 0 ? (
              shifts.map((shift) => (
                <tr key={shift.ScheduleID} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 px-4 font-mono text-xs text-emerald-800 font-bold">
                    SCH-{String(shift.ScheduleID).padStart(3, '0')}
                  </td>
                  <td className="py-5 px-4 text-xs font-bold text-slate-700">
                    {new Date(shift.ShiftDate).toLocaleDateString(undefined, { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="py-5 px-4 text-xs text-slate-600 font-medium font-mono">
                    {formatTime(shift.ShiftStartTime)}
                  </td>
                  <td className="py-5 px-4 text-xs text-slate-600 font-medium font-mono">
                    {formatTime(shift.ShiftEndTime)}
                  </td>
                  <td className="py-5 px-4 text-right">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusStyle(shift.ShiftStatus)}`}>
                      {shift.ShiftStatus || "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold italic">
                  No shift schedules found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
