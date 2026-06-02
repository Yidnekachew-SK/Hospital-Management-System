import React from "react";
import { FolderHeart, FlaskConical, Quote, Calendar, AlertCircle } from "lucide-react";

export default function MedicalRecordsLabsTab({ records, labs }) {
  return (
    <div className="space-y-6">
      
      {/* SECTION 1: CLINICAL RECORD ARCHIVE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 tracking-tight">Clinical Consultaion Folder</h3>
            <p className="text-xs text-slate-400 font-medium">Read official diagnoses and detailed check-up summary notes compiled by attending doctors.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <FolderHeart size={18} />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No Consultation Records Logged</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">Vitals clearance is currently stable. There are no clinical consultation folders on file.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {records.map((rec) => (
                <div key={rec.RecordID} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="py-0.5 px-2 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-bold font-mono">
                        {rec.RecordID}
                      </span>
                      <h4 className="font-black text-slate-850 text-sm">{rec.FinalDiagnosis}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 font-mono">
                      <Calendar size={11.5} />
                      Consultation Date: {rec.RecordDate}
                    </span>
                  </div>
                  
                  <div className="relative pl-5 border-l-2 border-teal-500/50">
                    <Quote className="w-3.5 h-3.5 absolute -left-1.5 -top-2 text-teal-500/40 rotate-180" />
                    <p className="text-xs text-slate-650 leading-relaxed font-medium font-sans">
                      {rec.ClinicalNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: LABORATORY DIAGNOSTICS ARCHIVE */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 tracking-tight">Lab Tests & Pathologist Reports</h3>
            <p className="text-xs text-slate-400 font-medium">Access detailed blood indices, lipid panels, pathology findings, and clinical clearances.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
            <FlaskConical size={18} />
          </div>
        </div>

        <div className="p-6">
          {labs.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No Lab Diagnostics Initiated</p>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">There are no diagnostic orders or completed CBC / lipid formulas currently tracked.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labs.map((test) => {
                const isCompleted = test.Status === "Completed";
                return (
                  <div key={test.TestID} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <span className="text-[10px] text-slate-400 font-bold font-mono">{test.TestID}</span>
                        <span className={`inline-flex px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          isCompleted ? "bg-violet-50 text-violet-700" : "bg-yellow-50 text-yellow-750"
                        }`}>
                          {test.Status}
                        </span>
                      </div>
                      
                      <div className="space-y-1 mt-3">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Ordered Diagnostic Type</span>
                        <h4 className="font-extrabold text-slate-800 text-sm">{test.TestType}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold font-mono">Date Ordered: {test.RequestDate}</p>
                      </div>
                    </div>

                    {isCompleted && test.report ? (
                      <div className="bg-white rounded-xl p-4 border border-slate-100 gap-3 text-xs space-y-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-teal-750 font-black uppercase block tracking-wider">Report Summary findings</span>
                          <p className="font-black text-slate-750">{test.report.ResultSummary}</p>
                        </div>
                        <div className="pt-2 border-t border-slate-50 space-y-0.5">
                          <span className="text-[9px] text-slate-400 font-black uppercase block tracking-wider">Clinical Comment from Pathologist</span>
                          <p className="text-[11px] text-slate-500 font-medium italic leading-relaxed">
                            "{test.report.PathologistComments}"
                          </p>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold text-right pt-1 font-mono">Released: {test.report.ReportDate}</p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50/30 rounded-xl p-4 border border-yellow-105/30 flex gap-2 text-xs text-yellow-800">
                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">Awaiting Diagnostic Assay</p>
                          <p className="text-[10px] text-yellow-700 leading-relaxed mt-0.5">
                            Our primary lab unit has checked this order and is preparing the values. Results will automatically publish here upon pathologist certification.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
