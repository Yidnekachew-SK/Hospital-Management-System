import React from "react";
import { 
  Plus, 
  Scissors 
} from "lucide-react";

export default function SurgeriesScheduler({
  filteredSurgeries,
  patients,
  setShowSurgeryRequestModal,
  onTriggerUpdateSurgery
}) {
  return (
    <div id="surgeries-view" className="space-y-6 fade-in-slide bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center border-b border-slate-100 pb-5">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Attending Surgeon's Scheduler</h2>
          <p className="text-xs text-slate-400">Hospital management schema link: Operating theatre room OR-1 reserved rosters</p>
        </div>
        <button
          onClick={() => setShowSurgeryRequestModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 border border-teal-700 shadow-sm cursor-pointer"
        >
          <Plus size={13} />
          Schedule Theatre Room
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-bold text-slate-400 border-b border-slate-100">
            <tr>
              <th className="px-5 py-3">Surgery ID (PK)</th>
              <th className="px-5 py-3">Patient ID (FK)</th>
              <th className="px-5 py-3">Employee ID (FK)</th>
              <th className="px-5 py-3">Surgery Date</th>
              <th className="px-5 py-3">Surgery Type</th>
              <th className="px-5 py-3">Outcome</th>
              <th className="px-5 py-3">Room ID</th>
              <th className="px-5 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-200">
            {filteredSurgeries.map(surg => {
              const pat = patients.find(p => p.PatientID === surg.PatientID);

              return (
                <tr key={surg.SurgeryID} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-mono font-bold text-slate-505">
                    {surg.SurgeryID}
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-800">{pat?.PatientName || "Unknown Patient"}</p>
                    <p className="text-[10px] text-slate-400 font-mono">Patient ID: {surg.PatientID}</p>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-505">
                    {surg.EmployeeID || "EMP-042"}
                  </td>
                  <td className="px-5 py-4 text-slate-505 font-medium whitespace-nowrap">
                    {surg.SurgeryDate}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {surg.SurgeryType}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 font-bold uppercase text-[9px] px-2.5 py-0.5 rounded-full ${
                      surg.Outcome === "Successful" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                      surg.Outcome === "In-Progress" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      surg.Outcome === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      "bg-slate-50 text-slate-500 border border-slate-100"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${
                        surg.Outcome === "Successful" ? "bg-emerald-400" :
                        surg.Outcome === "In-Progress" ? "bg-blue-400" :
                        surg.Outcome === "Pending" ? "bg-amber-400" :
                        "bg-slate-400"
                      }`} />
                      {surg.Outcome}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono font-bold text-slate-550">
                    {surg.RoomID}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => {
                        onTriggerUpdateSurgery({
                          SurgeryID: surg.SurgeryID,
                          PatientID: surg.PatientID,
                          EmployeeID: surg.EmployeeID || "EMP-042",
                          SurgeryDate: surg.SurgeryDate,
                          SurgeryType: surg.SurgeryType,
                          Outcome: surg.Outcome,
                          RoomID: surg.RoomID
                        });
                      }}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-705 font-extrabold px-2.5 py-1 rounded text-[10px] border border-slate-200 shadow-sm transition-all cursor-pointer"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredSurgeries.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-10 text-slate-400 italic">No scheduled procedures found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
