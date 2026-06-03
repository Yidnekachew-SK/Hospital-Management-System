import React, { useMemo } from "react";
import { 
  User, 
  Calendar as CalendarIcon, 
  FlaskConical, 
  Scissors, 
  Clock, 
  Plus,
  ArrowRight
} from "lucide-react";

export default function DashboardOverview({
  patients,
  appointments,
  labTests,
  surgeries,
  filteredPatients,
  setSelectedPatientId,
  setActiveTab,
  setShowLabRequestModal,
  setShowSurgeryRequestModal,
  setShowAppointmentModal
}) {
  
  // Dynamic metrics
  const todayDateStr = new Date().toISOString().split("T")[0];
  const todayAppointments = useMemo(() => {
    return appointments.filter(a => a.AppointmentDate === todayDateStr);
  }, [appointments, todayDateStr]);

  const pendingLabsCount = useMemo(() => {
    return labTests.filter(l => l.Status === "Pending").length;
  }, [labTests]);

  const pendingSurgeriesCount = useMemo(() => {
    return surgeries.filter(s => s.Outcome === "Pending").length;
  }, [surgeries]);

  return (
    <div className="space-y-6 fade-in-slide">
      
      {/* Immersive Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Assigned Patients</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{patients.length}</h3>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1">100% active primary coverage</p>
          </div>
          <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
            <User size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Today's Appts</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{todayAppointments.length}</h3>
            <p className="text-[10px] text-slate-500 font-semibold mt-1">Today's clinical schedule</p>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <CalendarIcon size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Total Labs Requested</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{labTests.length}</h3>
            <p className="text-[10px] text-amber-600 font-semibold mt-1">
              {pendingLabsCount} laboratory tests pending
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <FlaskConical size={20} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Scheduled Surgeries</p>
            <h3 className="text-2xl font-extrabold text-slate-800">{pendingSurgeriesCount}</h3>
            <p className="text-[10px] text-teal-600 font-semibold mt-1">Surgical theatre ready</p>
          </div>
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
            <Scissors size={20} />
          </div>
        </div>

      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active patients summary list */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[480px]">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-800 text-sm">Actionable Patient Worklist</h2>
              <p className="text-xs text-slate-400">Attending clinical oversight needed immediately</p>
            </div>
            <button
              onClick={() => setActiveTab("patients")}
              className="text-xs text-teal-600 hover:text-teal-700 font-bold flex items-center gap-1 transition-all"
            >
              <span>View Full Directory</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="flex-1 overflow-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/55 text-[10px] uppercase tracking-wider font-bold text-slate-500 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-100">Patient</th>
                  <th className="px-6 py-3 border-b border-slate-100">Condition</th>
                  <th className="px-6 py-3 border-b border-slate-100">Lab Status</th>
                  <th className="px-6 py-3 border-b border-slate-100 text-right">Records</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-slate-100/60">
                {filteredPatients.slice(0, 5).map(p => (
                  <tr key={p.PatientID} className="hover:bg-slate-50 group">
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          p.Gender === "M" ? "bg-teal-50 text-teal-600" : "bg-purple-50 text-purple-600"
                        }`}>
                          {p.PatientName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.PatientName}</p>
                          <p className="text-[10px] text-slate-400">ID: {p.PatientID} • Age {new Date().getFullYear() - new Date(p.DOB_DATE).getFullYear()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide inline-block ${
                        p.condition.includes("Hypertension") ? "bg-red-50 text-red-600 border border-red-100" :
                        p.condition.includes("Recovery") ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {p.condition}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          p.labStatus === "Pending" ? "bg-amber-500" :
                          p.labStatus === "Ready" ? "bg-emerald-500" :
                          "bg-slate-300"
                        }`} />
                        {p.labStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button
                        onClick={() => { setSelectedPatientId(p.PatientID); setActiveTab("patients"); }}
                        className="text-teal-600 hover:underline font-bold text-xs"
                      >
                        Open Record
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 italic">No patient records matched the search query.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Panel and mini Calendar sidebar */}
        <div className="space-y-6 flex flex-col h-[480px]">
          {/* Small calendar snippet widget */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                TODAY'S BOOKINGS
              </span>
              <button
                onClick={() => setActiveTab("appointments")}
                className="hover:underline text-[10px] text-teal-600 font-bold"
              >
                All Schedules &rarr;
              </button>
            </div>
            
            {/* Interactive compact appointment snippet on current local date */}
            <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
              {todayAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2 text-center">No clinician bookings scheduled for today.</p>
              ) : (
                todayAppointments.map(a => {
                  const pat = patients.find(p => p.PatientID === a.PatientID);
                  return (
                    <div key={a.AppointmentID} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock size={11} className="text-slate-400 shrink-0" />
                        <span className="text-xs font-bold text-slate-650 shrink-0">{a.AppointmentTime}</span>
                        <span className="text-xs text-slate-700 truncate font-semibold">{pat?.PatientName || "Unknown"}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold shrink-0 ${
                        a.Status === "Completed" ? "bg-slate-100 text-slate-400" : "bg-blue-100 text-blue-750"
                      }`}>
                        {a.Status}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick action trigger card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex-1 flex flex-col justify-between">
            <div className="h-full flex flex-col justify-between">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide mb-3">Clinician Fast-track</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowLabRequestModal(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                      <FlaskConical size={15} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Request Lab Work</span>
                  </div>
                  <Plus size={14} className="text-slate-400 group-hover:text-teal-650 transition-colors" />
                </button>

                <button
                  onClick={() => setShowSurgeryRequestModal(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                      <Scissors size={15} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Schedule Surgery</span>
                  </div>
                  <Plus size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </button>

                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <CalendarIcon size={15} />
                    </div>
                    <span className="text-xs font-bold text-slate-700">Book Appointment</span>
                  </div>
                  <Plus size={14} className="text-slate-400 group-hover:text-blue-650 transition-colors" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
