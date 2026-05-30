import React, { useMemo } from "react";
import { 
  User, 
  FileText, 
  Plus, 
  FlaskConical, 
  Scissors, 
  X, 
  Phone, 
  MapPin, 
  Shield, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer, 
  Heart 
} from "lucide-react";

export default function PatientDirectory({
  filteredPatients,
  medicalRecords = [],
  selectedPatientId,
  setSelectedPatientId,
  selectedPatientData,
  setShowPrescriptionModal,
  setShowLabRequestModal,
  setShowSurgeryRequestModal,
  setNewRxForm,
  setNewLabForm,
  setNewSurgeryForm,
  setNewLabReportForm,
  setShowAddLabReportModal,
  onTriggerUpdateRecord
}) {
  const patientRecordsRows = useMemo(() => {
    const rows = [];
    filteredPatients.forEach(p => {
      const records = (medicalRecords || []).filter(mr => mr.PatientID === p.PatientID);
      if (records.length === 0) {
        rows.push({
          patient: p,
          RecordID: "—",
          RecordDate: "—",
          ClinicalNotes: "No corresponding medical record filed.",
          FinalDiagnosis: "No Diagnosis Established"
        });
      } else {
        records.forEach(rec => {
          rows.push({
            patient: p,
            RecordID: rec.RecordID,
            RecordDate: rec.RecordDate,
            ClinicalNotes: rec.ClinicalNotes,
            FinalDiagnosis: rec.FinalDiagnosis
          });
        });
      }
    });
    return rows;
  }, [filteredPatients, medicalRecords]);
  return (
    <div id="patient-page-layout" className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full items-start fade-in-slide">
      
      {/* Searchable Listing Table */}
      <div className={`${selectedPatientId ? "lg:col-span-3" : "lg:col-span-5"} col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden transition-all duration-300`}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-800 text-sm">Full Patient Records Database</h2>
            <p className="text-xs text-slate-400">Database relation links with complete history lookup</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">
            {filteredPatients.length} Patients Indexed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Record ID</th>
                <th className="px-5 py-3.5">Record Date</th>
                <th className="px-5 py-3.5">Final Diagnosis</th>
                <th className="px-5 py-3.5 w-[380px]">Clinical Notes</th>
                <th className="px-5 py-3.5 text-center">Update</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100">
              {patientRecordsRows.map((row, idx) => {
                const p = row.patient;
                const isSelected = selectedPatientId === p.PatientID;
                return (
                  <tr
                    key={`${p.PatientID}-${row.RecordID}-${idx}`}
                    className={`hover:bg-slate-50 cursor-pointer ${
                      isSelected ? "bg-teal-50/20" : ""
                    }`}
                    onClick={() => setSelectedPatientId(p.PatientID)}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 ${
                          p.Gender === "M" ? "bg-teal-50 text-teal-750" : "bg-purple-50 text-purple-700"
                        }`}>
                          {p.PatientName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{p.PatientName}</p>
                          <p className="text-[10px] text-slate-400">ID: {p.PatientID} • {p.Gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-slate-500">
                      {row.RecordID}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-medium whitespace-nowrap">
                      {row.RecordDate}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-blue-50 text-blue-700 border border-blue-250 inline-block whitespace-normal break-words max-w-[150px]">
                        {row.FinalDiagnosis}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 font-medium whitespace-normal break-words max-w-[380px]" title={row.ClinicalNotes}>
                      {row.ClinicalNotes}
                    </td>
                    <td className="px-5 py-3.5 text-center whitespace-nowrap">
                      {row.RecordID !== "—" ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTriggerUpdateRecord({
                              RecordID: row.RecordID,
                              PatientID: p.PatientID,
                              RecordDate: row.RecordDate,
                              FinalDiagnosis: row.FinalDiagnosis,
                              ClinicalNotes: row.ClinicalNotes
                            });
                          }}
                          className="bg-slate-100 hover:bg-slate-250 text-slate-700 font-extrabold px-2.5 py-1 rounded text-[10px] border border-slate-200 shadow-sm transition-all cursor-pointer"
                        >
                          Update
                        </button>
                      ) : (
                        <span className="text-slate-300 italic text-[10px]">No Record</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPatientId(p.PatientID);
                        }}
                        className="text-teal-600 hover:text-teal-850 font-bold"
                      >
                        View Full &rarr;
                      </button>
                    </td>
                  </tr>
                );
              })}
              {patientRecordsRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 italic">No patient record relations mapped.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Detailed Medical Portfolio View Slider Panel */}
      {selectedPatientId && selectedPatientData && (
        <div className="lg:col-span-2 col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar relative fade-in-slide">
          <button
            onClick={() => setSelectedPatientId(null)}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-750 cursor-pointer"
          >
            <X size={16} />
          </button>

          <div>
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest block mb-1">Electronic Health Portfolio</span>
            <h2 className="text-xl font-black text-slate-800">{selectedPatientData.basic.PatientName}</h2>
            <p className="text-xs text-slate-400 font-mono font-medium">Relational ID: {selectedPatientData.basic.PatientID}</p>
          </div>

          {/* Patient demographics table details */}
          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 space-y-2.5 text-xs text-slate-700">
            <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User size={13} className="text-teal-600" />
              Patient Demographics
            </h4>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              <p><span className="text-slate-400">National ID:</span> <strong className="font-mono text-slate-800 font-bold">{selectedPatientData.basic.NationalID}</strong></p>
              <p><span className="text-slate-400">Gender/DOB:</span> <strong className="text-slate-800 font-bold">{selectedPatientData.basic.Gender} ({selectedPatientData.basic.DOB_DATE})</strong></p>
              <p className="col-span-2"><span className="text-slate-400">Phone:</span> <strong className="text-slate-800 font-bold flex items-center gap-1"><Phone size={10} /> {selectedPatientData.basic.Phone}</strong></p>
              <p className="col-span-2"><span className="text-slate-400">Residence Address:</span> <strong className="text-slate-800 font-bold flex items-center gap-1"><MapPin size={10} /> {selectedPatientData.basic.HouseNumber}, {selectedPatientData.basic.City}, {selectedPatientData.basic.Region}</strong></p>
            </div>

            {selectedPatientData.basic.insuranceDetails && (
              <div className="border-t border-slate-200/60 pt-2.5 mt-2 space-y-1 text-slate-600">
                <p className="flex items-center gap-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                  <Shield size={11} className="text-teal-500" />
                  Insurance Verification
                </p>
                <p><span className="text-slate-400">Provider:</span> <strong className="text-slate-800 font-semibold">{selectedPatientData.basic.insuranceDetails.ProviderName}</strong></p>
                <p><span className="text-slate-400">Policy Holder No:</span> <strong className="text-slate-800 font-semibold">{selectedPatientData.basic.insuranceDetails.PolicyNumber}</strong></p>
                <p className="text-[10px] bg-white border border-slate-200 p-1.5 rounded text-slate-500 italic mt-1 leading-relaxed">{selectedPatientData.basic.insuranceDetails.CoverageDetails}</p>
              </div>
            )}
          </div>

          {/* Section: Clinical Diagnosis history & Notes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <FileText size={14} className="text-teal-600" />
                Consultation/Clinical Records
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">{selectedPatientData.notes.length} logs found</span>
            </div>
            <div className="space-y-3">
              {selectedPatientData.notes.length === 0 ? (
                <p className="text-xs text-slate-400 italic font-medium">No historical consultation records filed by this attending professional.</p>
              ) : (
                selectedPatientData.notes.map(note => (
                  <div key={note.RecordID} className="bg-white border border-slate-200 rounded-xl p-3.5 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Record ID: {note.RecordID}</span>
                      <span className="text-[10px] font-bold text-teal-605 bg-teal-50 px-2 py-0.5 rounded">{note.RecordDate}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-800"><span className="text-slate-400 font-bold">Diag:</span> {note.FinalDiagnosis}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium bg-slate-50/50 p-2.5 rounded-lg border border-slate-100 italic">{note.ClinicalNotes}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Active Pharmacological Prescriptions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Plus size={14} className="text-teal-600" />
                Active Formulas & Prescriptions
              </h3>
              <button
                onClick={() => {
                  setNewRxForm({ patientId: selectedPatientId, items: [{ medicationId: "MED-01", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }] });
                  setShowPrescriptionModal(true);
                }}
                className="text-[10px] text-teal-600 hover:underline font-bold cursor-pointer"
              >
                + Prescribe Formula
              </button>
            </div>
            {selectedPatientData.prescriptions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No formula prescriptions signed for this patient database entry yet.</p>
            ) : (
              selectedPatientData.prescriptions.map(rx => (
                <div key={rx.PrescriptionID} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 border-b border-slate-200/50 pb-1.5">
                    <span>Rx Number: {rx.PrescriptionID}</span>
                    <span>Signed Date: {rx.DateIssued}</span>
                  </div>
                  <div className="space-y-2 pt-1">
                    {rx.items && rx.items.map(item => (
                      <div key={item.ItemID} className="flex justify-between items-start text-xs border-b border-dashed border-slate-200 last:border-0 pb-1.5 last:pb-0">
                        <div>
                          <p className="font-bold text-slate-800">{item.drugName}</p>
                          <p className="text-[10px] text-slate-400">Duration Limit: {item.Duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-teal-600 bg-teal-50 px-1.5 py-0.2 rounded text-[10px] inline-block">{item.Dosage}</p>
                          <p className="text-[10px] text-slate-500 font-medium">{item.Frequency}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Section: Laboratories Result Index */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <FlaskConical size={14} className="text-teal-600" />
                Diagnostic Laboratory Tests
              </h3>
              <button
                onClick={() => {
                  setNewLabForm({ patientId: selectedPatientId, testType: "Lipid Profile Panel", requestDate: new Date().toISOString().split("T")[0] });
                  setShowLabRequestModal(true);
                }}
                className="text-[10px] text-teal-605 hover:underline font-bold cursor-pointer"
              >
                + Request Clinical Lab
              </button>
            </div>
            <div className="space-y-2">
              {selectedPatientData.labs.length === 0 ? (
                <p className="text-xs text-slate-400 italic font-medium">No diagnostic tests currently indexed.</p>
              ) : (
                selectedPatientData.labs.map(lab => (
                  <div key={lab.TestID} className="bg-white border border-slate-150 rounded-xl p-3.5 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[10px] text-slate-400">LAB TARGET: {lab.TestID}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        lab.Status === "Completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {lab.Status}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <FlaskConical size={12} className="text-teal-600" />
                      {lab.TestType} (Date Requested: {lab.RequestDate})
                    </p>

                    {lab.report ? (
                      <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2 space-y-1.5 text-[11px]">
                        <p className="font-bold text-slate-700">Lab Result Checklist:</p>
                        <p className="text-slate-600 font-semibold">{lab.report.ResultSummary}</p>
                        <div className="text-[10px] text-slate-500 italic border-l-2 border-slate-300 pl-2 leading-relaxed mt-1">
                          <strong className="not-italic text-[9px] font-bold text-slate-400 block tracking-wide uppercase">Pathologist Remarks</strong>
                          {lab.report.PathologistComments}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold mt-1 text-right">Filed Report Date: {lab.report.ReportDate}</p>
                      </div>
                    ) : (
                      <div className="mt-2.5 flex justify-between items-center bg-slate-50 p-2 rounded border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1"><AlertCircle size={11} className="text-amber-500" /> Pending pathologist outcome.</p>
                        <button
                          onClick={() => {
                            setNewLabReportForm({ testId: lab.TestID, resultSummary: "", pathologistComments: "" });
                            setShowAddLabReportModal(true);
                          }}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-[10px] font-bold px-2 py-1 rounded text-slate-700 cursor-pointer"
                        >
                          Sign Lab Outcome
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Surgeries Log */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h3 className="font-bold text-slate-805 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Scissors size={14} className="text-teal-600" />
                Surgical Operations Index
              </h3>
              <button
                onClick={() => {
                  setNewSurgeryForm({ patientId: selectedPatientId, surgeryType: "Diagnostic Angioplasty", date: new Date().toISOString().split("T")[0], roomId: "RM-201" });
                  setShowSurgeryRequestModal(true);
                }}
                className="text-[10px] text-teal-605 hover:underline font-bold cursor-pointer"
              >
                + Request Surgery Theatre
              </button>
            </div>
            <div className="space-y-2">
              {selectedPatientData.surgeries.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No surgical histories mapped on database relations.</p>
              ) : (
                selectedPatientData.surgeries.map(surg => (
                  <div key={surg.SurgeryID} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-slate-400">SURG-ID: {surg.SurgeryID}</span>
                      <span className={`px-2 py-0.5 rounded uppercase tracking-wide text-[9px] ${
                        surg.Outcome === "Successful" ? "bg-emerald-50 text-emerald-800 border border-emerald-100" : "bg-amber-50 text-amber-800 border border-amber-100"
                      }`}>
                        {surg.Outcome}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{surg.SurgeryType}</p>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-semibold pt-1">
                      <p>Date: <span className="text-slate-700">{surg.SurgeryDate}</span></p>
                      <p>Theatre Operating Room: <span className="text-slate-700">OR-1 ({surg.RoomID})</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section: Admissions details */}
          <div className="space-y-3 pt-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide border-b border-slate-100 pb-1.5">
              Admission Records
            </h3>
            {selectedPatientData.admissions.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No inpatient room admissions logged currently.</p>
            ) : (
              selectedPatientData.admissions.map(adm => (
                <div key={adm.AdmissionID} className="bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs space-y-1.5 text-slate-700">
                  <div className="font-bold text-slate-850 flex justify-between">
                    <span>Room Admission: {adm.roomDetails?.RoomNumber || "RM-301"} ({adm.roomDetails?.RoomType || "General"})</span>
                    <span className="text-[10px] text-teal-605 bg-teal-50 px-1.5 rounded">{adm.AdmissionDate}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">Diagnostic Context: {adm.PrimaryDiagnosis}</p>
                  
                  {/* Visitor logging connection if any */}
                  {selectedPatientData.visitors && selectedPatientData.visitors.length > 0 && (
                    <div className="border-t border-slate-200/50 pt-1.5 mt-2">
                      <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Approved Hospital Visitors</p>
                      {selectedPatientData.visitors.map(v => (
                        <div key={v.VisitorID} className="flex justify-between text-[11px] font-medium text-slate-600">
                          <span>{v.VisitorName} ({v.RelationToPatient})</span>
                          <span className="text-slate-400">{v.VisitDate}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
}
