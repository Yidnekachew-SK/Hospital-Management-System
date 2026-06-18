import React from "react";
import { Pill } from "lucide-react";

export default function Prescriptions({ prescriptionItems }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 font-sans">
      <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Pill className="text-emerald-700 stroke-[2.5]" size={20} />
            Prescription Registry
          </h3>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Attending Medical Prescriptions and Items
          </p>
        </div>
        <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-100/30 font-bold text-xs uppercase tracking-tight px-3 py-1">
          {prescriptionItems.length} active prescriptions
        </div>
      </div>
      
      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <th className="pb-4 px-4">Item ID</th>
              <th className="pb-4 px-4">Prescription ID</th>
              <th className="pb-4 px-4">Patient Name</th>
              <th className="pb-4 px-4">Medication</th>
              <th className="pb-4 px-4">Dosage</th>
              <th className="pb-4 px-4">Frequency</th>
              <th className="pb-4 px-4 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {prescriptionItems.length > 0 ? (
              prescriptionItems.map((item) => (
                <tr key={item.ItemID} className="hover:bg-slate-50/30 transition-colors">
                  <td className="py-5 px-4 font-mono font-bold text-emerald-800">
                    ITM-{String(item.ItemID).padStart(3, '0')}
                  </td>
                  <td className="py-5 px-4 font-mono text-slate-500 font-bold">
                    RX-{String(item.PrescriptionID).padStart(3, '0')}
                  </td>
                  <td className="py-5 px-4 font-extrabold text-slate-800">
                    {item.PatientName || `Patient #${item.PatientID}`}
                  </td>
                  <td className="py-5 px-4">
                    <span className="font-bold text-slate-700">{item.MedicationName}</span>
                    <span className="text-slate-400 font-semibold text-[9px] block uppercase font-mono mt-0.5">
                      Type: {item.MedicationType}
                    </span>
                  </td>
                  <td className="py-5 px-4 text-slate-600 font-bold font-mono">
                    {item.Dosage}
                  </td>
                  <td className="py-5 px-4 text-slate-600">
                    {item.Frequency}
                  </td>
                  <td className="py-5 px-4 text-right font-bold text-emerald-700">
                    {item.Duration}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold italic">
                  No active prescriptions found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
