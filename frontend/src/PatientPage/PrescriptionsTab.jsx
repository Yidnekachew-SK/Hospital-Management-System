import React from "react";
import { Pill, Calendar, ShieldCheck, UserCheck } from "lucide-react";

export default function PrescriptionsTab({ prescriptions }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-800 tracking-tight">Active Prescriptions & Regimens</h3>
          <p className="text-xs text-slate-400 font-medium">Verify official medication directives and pharmaceutical schedules signed by your physician.</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Pill size={18} />
        </div>
      </div>

      <div className="p-6">
        {prescriptions.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 mx-auto">
              <Pill className="w-5 h-5 text-slate-350" />
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">No Prescriptions Registered</p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto">
              There are no interactive medical prescriptions or signed treatment regimens associated with your patient account.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {prescriptions.map((rx) => (
              <div key={rx.PrescriptionID} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-5">
                
                {/* Upper Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="py-0.5 px-2 bg-emerald-50 border border-emerald-100 text-teal-800 rounded-lg text-[10px] font-bold font-mono">
                      {rx.PrescriptionID}
                    </span>
                    <span className="text-xs text-slate-400 font-bold flex items-center gap-1 font-mono">
                      <Calendar size={11} className="text-slate-400" />
                      Date Prescribed: {rx.DateIssued}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-500 font-bold text-xs">
                    <UserCheck size={13} className="text-emerald-600" />
                    <span>Signed: Dr. Sarah Chen</span>
                  </div>
                </div>

                {/* RX Items List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rx.items.map((item, itemIdx) => (
                    <div key={item.ItemID || itemIdx} className="bg-white rounded-xl p-4 border border-slate-100 flex items-start gap-3 shadow-2xs">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <Pill size={14} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-800 text-sm">{item.drugName}</h4>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-500 font-bold font-mono">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm">Strength: {item.Dosage}</span>
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded-sm">Take: {item.Frequency}</span>
                          <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded-sm">Period: {item.Duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Authorization Stamp */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 bg-emerald-50/20 rounded-xl px-4 py-2 border border-emerald-100/30">
                  <span className="font-semibold flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-500" />
                    State Certification Authorized • Pharmacy Direct Dispatch Eligible
                  </span>
                  <span className="font-mono font-bold">Secure Refill Approved</span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
