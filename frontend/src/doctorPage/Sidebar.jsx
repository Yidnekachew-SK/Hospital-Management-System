import React from "react";
import { 
  User, 
  Calendar as CalendarIcon, 
  FlaskConical, 
  Scissors, 
  Activity, 
  Database,
  LogOut
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab, patientsCount, doctorName, onLogout }) {
  return (
    <aside id="sidebar-panel" className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-full">
      <div>
        {/* Header Branding */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-sm shadow-teal-200">
              <Activity size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight block">Addis Hospital</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">Hospital Hub</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="py-6 px-4 space-y-1">
          <button
            id="tab-dashboard"
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "dashboard" ? "tab-active" : "tab-inactive"
            }`}
          >
            <Database size={17} />
            Hospital Dashboard
          </button>

          <button
            id="tab-patients"
            onClick={() => setActiveTab("patients")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "patients" ? "tab-active" : "tab-inactive"
            }`}
          >
            <User size={17} />
            Patient Records ({patientsCount})
          </button>

          <button
            id="tab-appointments"
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "appointments" ? "tab-active" : "tab-inactive"
            }`}
          >
            <CalendarIcon size={17} />
            Appointments
          </button>

          <button
            id="tab-labs"
            onClick={() => setActiveTab("labs")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "labs" ? "tab-active" : "tab-inactive"
            }`}
          >
            <FlaskConical size={17} />
            Labs and Reports
          </button>

          <button
            id="tab-surgeries"
            onClick={() => setActiveTab("surgeries")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "surgeries" ? "tab-active" : "tab-inactive"
            }`}
          >
            <Scissors size={17} />
            Surgery Scheduler
          </button>
        </nav>
      </div>

      {/* Doctor Personal Profile Section & Exit switch */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold border border-teal-200">
              SC
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Attending Doctor</p>
              <p className="text-sm font-black text-slate-800">{doctorName}</p>
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-red-650 cursor-pointer text-xs font-bold uppercase rounded-lg border border-slate-200 flex items-center justify-center gap-2 transition-all"
        >
          <LogOut size={13} />
          Logout
        </button>
      </div>
    </aside>
  );
}
