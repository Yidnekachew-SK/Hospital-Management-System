import React from "react";
import { 
  Calendar, 
  Pill, 
  Scissors, 
  Receipt
} from "lucide-react";

export default function DashboardTab({ profile, stats, data, setActiveTab }) {
  if (!profile || !data) return null;

  return (
    <div className="space-y-6 animate-fade-in py-2">

      {/* Grid: Stats Bento Cards in 2x2 layout */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-4xl">
        
        {/* Appointments Card */}
        <div 
          onClick={() => setActiveTab("appointments")}
          className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs cursor-pointer hover:border-teal-500/30 hover:shadow-md transition-all group flex flex-col justify-between h-36 md:h-40"
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-[10px] md:text-xs text-slate-400 font-extrabold block uppercase tracking-wider">Scheduled Visits</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors shrink-0">
              <Calendar size={18} />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl md:text-3xl font-black text-slate-800 block group-hover:text-teal-700 transition-colors">
              {stats.apptsCount}
            </span>
            <span className="text-[10px] md:text-xs text-teal-600 block font-semibold">Active Consultations</span>
          </div>
        </div>

        {/* Prescriptions Card */}
        <div 
          onClick={() => setActiveTab("prescriptions")}
          className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs cursor-pointer hover:border-teal-500/30 hover:shadow-md transition-all group flex flex-col justify-between h-36 md:h-40"
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-[10px] md:text-xs text-slate-400 font-extrabold block uppercase tracking-wider">Clinical Medications</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors shrink-0">
              <Pill size={18} />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl md:text-3xl font-black text-slate-800 block group-hover:text-teal-700 transition-colors">
              {stats.medsCount}
            </span>
            <span className="text-[10px] md:text-xs text-emerald-600 block font-semibold">Prescriptions Loaded</span>
          </div>
        </div>

        {/* Surgery Card */}
        <div 
          onClick={() => setActiveTab("surgeries")}
          className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs cursor-pointer hover:border-teal-500/30 hover:shadow-md transition-all group flex flex-col justify-between h-36 md:h-40"
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-[10px] md:text-xs text-slate-400 font-extrabold block uppercase tracking-wider">Scheduled Operations</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:bg-orange-100 transition-colors shrink-0">
              <Scissors size={18} />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-xl md:text-3xl font-black text-slate-800 block group-hover:text-teal-700 transition-colors">
              {stats.surgeriesCount}
            </span>
            <span className="text-[10px] md:text-xs text-orange-600 block font-semibold">Pending Procedures</span>
          </div>
        </div>

        {/* Billings Card */}
        <div 
          onClick={() => setActiveTab("billing")}
          className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs cursor-pointer hover:border-rose-500/30 hover:shadow-md transition-all group flex flex-col justify-between h-36 md:h-40"
        >
          <div className="flex items-start justify-between w-full">
            <span className="text-[10px] md:text-xs text-slate-400 font-extrabold block uppercase tracking-wider">Outstanding Invoices</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors shrink-0">
              <Receipt size={18} />
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-lg md:text-2xl font-black text-rose-700 block transition-colors">
              {stats.unpaidAmount.toLocaleString()} ETB
            </span>
            <span className="text-[10px] md:text-xs text-rose-500 block font-semibold">Co-pay & Dispatches</span>
          </div>
        </div>

      </div>

    </div>
  );
}
