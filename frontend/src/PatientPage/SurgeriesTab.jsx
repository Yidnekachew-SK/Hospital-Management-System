import React from "react";
import { Scissors, ShieldAlert, Calendar, LayoutGrid, CheckCircle } from "lucide-react";

export default function SurgeriesTab({ surgeries }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden font-sans">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-800 tracking-tight">Surgical Interventions & Operations</h3>
          <p className="text-xs text-slate-400 font-medium font-sans">Track scheduled surgical protocols, registered intensive OR suites, and procedural clearances.</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-655 flex items-center justify-center">
          <Scissors size={18} />
        </div>
      </div>

      <div className="p-6">
        {surgeries.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mx-auto">
              <Scissors className="w-5 h-5 text-slate-350" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No Surgery Protocols Scheduled</p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              Your medical account does not indicate any scheduled surgical operations or upcoming theatre theater bookings.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {surgeries.map((surgery) => {
              const isPending = surgery.Outcome === "Pending" || !surgery.Outcome;
              return (
                <div key={surgery.SurgeryID} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
                  
                  <div className="space-y-3 md:space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="py-0.5 px-2 bg-orange-50 text-orange-800 border border-orange-105 rounded-lg text-[10px] font-bold font-mono">
                        {surgery.SurgeryID}
                      </span>
                      <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{surgery.SurgeryType}</h4>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs font-medium text-slate-500">
                      <p className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>Date: <strong className="text-slate-700 font-bold">{surgery.SurgeryDate}</strong></span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <LayoutGrid size={13} className="text-slate-400 shrink-0" />
                        <span>Room: <strong className="text-slate-700 font-bold">{surgery.RoomName || surgery.RoomID}</strong></span>
                      </p>
                      <p className="col-span-2 sm:col-span-1">
                        Surgeon: <strong className="text-slate-700 font-bold">Dr. Sarah Chen</strong>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-t border-slate-200/60 pt-3 md:pt-0 md:border-t-0 shrink-0">
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                      isPending
                        ? "bg-amber-50 border-amber-100 text-amber-700" 
                        : "bg-emerald-50 border-emerald-100 text-emerald-700"
                    }`}>
                      {surgery.Outcome}
                    </span>
                    
                    {isPending ? (
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
                        <ShieldAlert size={13} className="text-slate-400 animate-pulse" />
                        <span>Awaiting clearance</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
                        <CheckCircle size={13} />
                        <span>Stage Resolved</span>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
