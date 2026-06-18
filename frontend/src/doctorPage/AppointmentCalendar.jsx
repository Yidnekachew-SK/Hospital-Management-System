import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Plus 
} from "lucide-react";

export default function AppointmentCalendar({
  calendarYear,
  calendarMonth,
  selectedCalendarDate,
  setSelectedCalendarDate,
  appointments,
  patients,
  calendarDays,
  monthNames,
  changeMonth,
  selectedDateAppointments,
  setShowAppointmentModal,
  setNewApptForm,
  setEditAppointmentForm,
  setShowUpdateAppointmentModal,
  activeDoctor
}) {
  const todayDateStr = new Date().toISOString().split("T")[0];

  return (
    <div id="calendar-view" className="space-y-6 fade-in-slide">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Calendar monthly template UI */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          {/* Header Month Controller */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-black text-slate-800">{monthNames[calendarMonth]} {calendarYear}</h2>
              <p className="text-xs text-slate-400">Click cells below to trigger daily consultation schedules</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => changeMonth("prev")}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold cursor-pointer transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => changeMonth("next")}
                className="p-1.5 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 font-bold cursor-pointer transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Week Header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-3 mb-2">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cell, idx) => {
              const cellAppts = appointments.filter(a => a.AppointmentDate === cell.dateString);
              const isToday = cell.dateString === todayDateStr;
              const isSelected = selectedCalendarDate === cell.dateString;
              const isPast = cell.dateString < todayDateStr;

              return (
                <div
                  key={`${cell.dateString}-${idx}`}
                  onClick={() => setSelectedCalendarDate(cell.dateString)}
                  className={`min-h-[70px] border rounded-xl p-2 cursor-pointer flex flex-col justify-between transition-all ${
                    isPast ? "bg-slate-50/40 border-slate-100 text-slate-400 opacity-60" :
                    !cell.isCurrentMonth ? "bg-slate-50/50 border-slate-100 text-slate-300" :
                    isSelected ? "bg-teal-600/5 text-teal-700 border-teal-500 ring-1 ring-teal-500/20" :
                    isToday ? "bg-slate-50 text-slate-800 border-slate-300 font-extrabold" :
                    "bg-white border-slate-100 text-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className={`text-xs block font-bold ${isToday ? "text-teal-600" : ""}`}>
                    {cell.dayNum}
                  </span>

                  {cellAppts.length > 0 && (
                    <div className="space-y-1">
                      <span className={`text-[8px] font-bold px-1 py-0.2 rounded-full block text-center truncate ${
                        isSelected ? "bg-teal-600 text-white" : "bg-teal-50 text-teal-600 border border-teal-100/50"
                      }`}>
                        {cellAppts.length} Appt{cellAppts.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Today selected schedules + Form trigger */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col h-full min-h-[500px] shadow-sm">
          <div>
            {/* Active header info */}
            <div className="border-b border-teal-50 pb-4 mb-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Active Schedule Focus</span>
                  <h3 className="text-sm font-black text-slate-800">
                    {selectedCalendarDate === todayDateStr ? `Today (${selectedCalendarDate})` : selectedCalendarDate}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Clinical booking roster</p>
                </div>
                {selectedCalendarDate < todayDateStr ? (
                  <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">Past</span>
                ) : (
                  <button
                    onClick={() => {
                      const firstPatId = (patients && patients.length > 0) ? patients[0].PatientID : "1";
                      setNewApptForm({ patientId: firstPatId, date: selectedCalendarDate, time: "10:30", status: "Scheduled" });
                      setShowAppointmentModal(true);
                    }}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1.5 px-3 rounded-xl text-xs flex items-center gap-1.5 border border-teal-700 shadow-sm transition-all cursor-pointer"
                  >
                    <Plus size={13} />
                    Add Appt
                  </button>
                )}
              </div>
            </div>

            {/* Schedule detail loop */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              {selectedDateAppointments.length === 0 ? (
                <div className="text-center py-10">
                  <Clock size={22} className="text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 italic font-medium">No clinical bookings filed for this date cell.</p>
                </div>
              ) : (
                selectedDateAppointments.map(appt => (
                  <div key={appt.AppointmentID} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5 shadow-xs">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-[9px] font-bold font-mono text-slate-400">ID: {appt.AppointmentID}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                        appt.Status === "Completed" ? "bg-slate-200 text-slate-500" : "bg-teal-100 text-teal-700"
                      }`}>
                        {appt.Status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{appt.PatientName}</p>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Clock size={11} /> Appointment Hour: {appt.AppointmentTime}
                      </p>
                      <button
                        onClick={() => {
                          setEditAppointmentForm({
                            AppointmentID: appt.AppointmentID,
                            PatientID: appt.PatientID,
                            EmployeeID: activeDoctor?.EmployeeID,
                            AppointmentDate: appt.AppointmentDate,
                            AppointmentTime: appt.AppointmentTime ? appt.AppointmentTime.substring(0, 5) : "10:30",
                            AppointmentStatus: appt.AppointmentStatus || appt.Status
                          });
                          setShowUpdateAppointmentModal(true); 
                        }}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
