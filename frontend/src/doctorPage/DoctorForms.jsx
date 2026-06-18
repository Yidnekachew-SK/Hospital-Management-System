import React from "react";
import { 
  X, 
  Calendar as CalendarIcon, 
  Plus, 
  FlaskConical, 
  Scissors, 
  CheckCircle2,
  FileText
} from "lucide-react";

export default function DoctorForms({
  patients,
  medications = [],
  rooms = [],
  activeDoctor = null,

  // Appointment modal props
  showAppointmentModal,
  setShowAppointmentModal,
  newApptForm,
  setNewApptForm,
  handleAddAppointment,
  showUpdateAppointmentModal,
  setShowUpdateAppointmentModal,
  editAppointmentForm,
  setEditAppointmentForm,
  handleUpdateAppointmentSubmit,

  // Prescription modal props
  showPrescriptionModal,
  setShowPrescriptionModal,
  newRxForm,
  setNewRxForm,
  handleAddPrescriptionSubmit,
  addRxItemRow,
  updateRxItemRow,
  removeRxItemRow,
  signingPrescription,

  // Lab modal props
  showLabRequestModal,
  setShowLabRequestModal,
  newLabForm,
  setNewLabForm,
  handleRequestLabSubmit,

  // Surgery modal props
  showSurgeryRequestModal,
  setShowSurgeryRequestModal,
  newSurgeryForm,
  setNewSurgeryForm,
  handleScheduleSurgerySubmit,

  // Lab Report modal props
  showAddLabReportModal,
  setShowAddLabReportModal,
  newLabReportForm,
  setNewLabReportForm,
  handleAddLabReportSubmit,

  // Update Medical Record props
  showUpdateRecordModal,
  setShowUpdateRecordModal,
  editRecordForm,
  setEditRecordForm,
  handleUpdateRecordSubmit,

  // Update Surgery props
  showUpdateSurgeryModal,
  setShowUpdateSurgeryModal,
  editSurgeryForm,
  setEditSurgeryForm,
  handleUpdateSurgerySubmit
}) {
  const getRelativeDate = (offsetDays) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    return d.toISOString().split("T")[0];
  };

  const doctorNameDisplay = activeDoctor 
    ? activeDoctor.EmployeeName 
    : "Attending Clinical Practitioner";

  const doctorLicenseDisplay = activeDoctor 
    ? activeDoctor.LicenseNumber 
    : "System Clearance Granted";

  return (
    <>
      {/* MODAL 1: BOOK APPOINTMENT FORM */}
      {showAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon size={16} className="text-teal-600" />
                Book Clinical Appointment
              </h3>
              <button onClick={() => setShowAppointmentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Select Patient</label>
                <select
                  value={newApptForm.patientId}
                  onChange={(e) => setNewApptForm({ ...newApptForm, patientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>{p.PatientName} ({p.PatientID})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Date Scheduled</label>
                  <input
                    type="date"
                    min={getRelativeDate(0)}
                    value={newApptForm.date}
                    onChange={(e) => setNewApptForm({ ...newApptForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Time (HH:MM)</label>
                  <input
                    type="time"
                    value={newApptForm.time}
                    onChange={(e) => setNewApptForm({ ...newApptForm, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Appointment Status</label>
                <select
                  value={newApptForm.status || "Scheduled"}
                  onChange={(e) => setNewApptForm({ ...newApptForm, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 text-[10px] text-slate-400 font-semibold leading-relaxed">
                Appointing Practitioner: <strong>{doctorNameDisplay}</strong> (License: {doctorLicenseDisplay})
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Add Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PRESCRIPTION TO PATIENT */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Plus size={16} className="text-teal-600" />
                Sign Pharmacological Prescription
              </h3>
              <button onClick={() => setShowPrescriptionModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPrescriptionSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Select Target Patient</label>
                <select
                  value={newRxForm.patientId}
                  onChange={(e) => setNewRxForm({ ...newRxForm, patientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>{p.PatientName} ({p.PatientID})</option>
                  ))}
                </select>
              </div>

              {/* Rx Items dynamic list */}
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-500">Prescription Item Lines</span>
                  <button
                    type="button"
                    onClick={addRxItemRow}
                    className="text-[10px] text-teal-600 font-bold hover:underline cursor-pointer"
                  >
                    + Add Compound Row
                  </button>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {newRxForm.items && newRxForm.items.map((row, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 relative space-y-2">
                      {newRxForm.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRxItemRow(idx)}
                          className="absolute top-2 right-2 text-slate-404 hover:text-red-500 cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-404 block">Active Formula</label>
                          <select
                            value={row.medicationId}
                            onChange={(e) => updateRxItemRow(idx, "medicationId", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 font-semibold text-xs"
                          >
                            {medications.map(m => (
                              <option key={m.MedicationID} value={m.MedicationID}>{m.MedicationName} ({m.MedicationType})</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-404 block">Measurement Dosage</label>
                          <input
                            type="text"
                            placeholder="e.g. 500mg"
                            value={row.dosage}
                            onChange={(e) => updateRxItemRow(idx, "dosage", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 font-semibold text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-404 block">Administration Interval</label>
                          <input
                            type="text"
                            placeholder="e.g. Twice Daily"
                            value={row.frequency}
                            onChange={(e) => updateRxItemRow(idx, "frequency", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 font-semibold text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-404 block">Duration</label>
                          <input
                            type="text"
                            placeholder="e.g. 7 Days"
                            value={row.duration}
                            onChange={(e) => updateRxItemRow(idx, "duration", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded p-1 font-semibold text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPrescriptionModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  disabled={signingPrescription}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {signingPrescription ? "Signing Prescription..." : "Sign Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST LAB TEST ORDER */}
      {showLabRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <FlaskConical size={16} className="text-teal-600" />
                Submit Diagnostic Lab Order
              </h3>
              <button onClick={() => setShowLabRequestModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRequestLabSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Target Patient profile</label>
                <select
                  value={newLabForm.patientId}
                  onChange={(e) => setNewLabForm({ ...newLabForm, patientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>{p.PatientName} ({p.PatientID})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Diagnostic Test Type</label>
                <input
                  type="text"
                  placeholder="e.g. Thyroid Stimulating Hormone, Lipid Panel, ECG"
                  value={newLabForm.testType}
                  onChange={(e) => setNewLabForm({ ...newLabForm, testType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Order Date</label>
                <input
                  type="date"
                  min={getRelativeDate(0)}
                  value={newLabForm.requestDate}
                  onChange={(e) => setNewLabForm({ ...newLabForm, requestDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                />
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-800 font-medium leading-relaxed">
                Notice: Submitting places a "Pending" record in patients lab test history log. Attending clinician can manually compile reports locally.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLabRequestModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Order Lab Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SCHEDULE SURGERY ORDER */}
      {showSurgeryRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Scissors size={16} className="text-teal-600" />
                Reserve Surgical Room / Schedule Surgery
              </h3>
              <button onClick={() => setShowSurgeryRequestModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSurgerySubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Patient Roster</label>
                <select
                  value={newSurgeryForm.patientId}
                  onChange={(e) => setNewSurgeryForm({ ...newSurgeryForm, patientId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>{p.PatientName} ({p.PatientID})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Surgical Procedure Type</label>
                <input
                  type="text"
                  placeholder="e.g. Mitral Valve Reconstruction, Appendectomy"
                  value={newSurgeryForm.surgeryType}
                  onChange={(e) => setNewSurgeryForm({ ...newSurgeryForm, surgeryType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Schedule Date</label>
                  <input
                    type="date"
                    min={getRelativeDate(0)}
                    value={newSurgeryForm.date}
                    onChange={(e) => setNewSurgeryForm({ ...newSurgeryForm, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Operating Wing-Room</label>
                  <select
                    value={newSurgeryForm.roomId}
                    onChange={(e) => setNewSurgeryForm({ ...newSurgeryForm, roomId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold"
                  >
                    {rooms.map(r => (
                      <option key={r.RoomID} value={r.RoomID}>{r.RoomNumber} ({r.RoomType})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] text-slate-400 font-semibold leading-relaxed">
                Surgeon Assignee: <strong>{doctorNameDisplay}</strong> (License: {doctorLicenseDisplay})
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSurgeryRequestModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Schedule Surgical Procedure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: PATHOLOGIST OUTCOME SIMULATOR FORM */}
      {showAddLabReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                Compile and Sign Lab Report Results
              </h3>
              <button onClick={() => setShowAddLabReportModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddLabReportSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 block">Target Lab Test Code: {newLabReportForm.testId}</label>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Lab Test Results Summary Outcome</label>
                <textarea
                  placeholder="e.g. WBC: 11.2x10^9/L, Lymphocytes: 42.1%, Thrombocyte Count: Stable."
                  value={newLabReportForm.resultSummary}
                  onChange={(e) => setNewLabReportForm({ ...newLabReportForm, resultSummary: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold custom-scrollbar text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Pathologist/Attending Professional Comments</label>
                <textarea
                  placeholder="e.g. Indicating minor inflammation trigger. Recommend patient start focused oral hydration therapy."
                  value={newLabReportForm.pathologistComments}
                  onChange={(e) => setNewLabReportForm({ ...newLabReportForm, pathologistComments: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold custom-scrollbar text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLabReportModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Dismiss
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Publish Lab Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 6: UPDATE PATIENT MEDICAL RECORD */}
      {showUpdateRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <FileText size={16} className="text-teal-600" />
                Update Electronic Medical Record ({editRecordForm?.RecordID || ""})
              </h3>
              <button onClick={() => setShowUpdateRecordModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateRecordSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Patient Identifier</label>
                <input
                  type="text"
                  readOnly
                  value={`${patients?.find(p => p.PatientID === editRecordForm?.PatientID)?.PatientName || "Unknown Patient"} (${editRecordForm?.PatientID || ""})`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-semibold text-slate-500 cursor-not-allowed outline-none select-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Record Filing Date</label>
                <input
                  type="date"
                  min={getRelativeDate(0)}
                  value={editRecordForm?.RecordDate || ""}
                  onChange={(e) => setEditRecordForm && setEditRecordForm({ ...editRecordForm, RecordDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Final Diagnostic Statement</label>
                <input
                  type="text"
                  value={editRecordForm?.FinalDiagnosis || ""}
                  onChange={(e) => setEditRecordForm && setEditRecordForm({ ...editRecordForm, FinalDiagnosis: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Clinical Assessment Notes</label>
                <textarea
                  value={editRecordForm?.ClinicalNotes || ""}
                  onChange={(e) => setEditRecordForm && setEditRecordForm({ ...editRecordForm, ClinicalNotes: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800 custom-scrollbar text-xs focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateRecordModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Save Record Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7: UPDATE SCHEDULED SURGERY */}
      {showUpdateSurgeryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 font-sans">
                <Scissors size={16} className="text-teal-600" />
                Update Scheduled Surgery Details ({editSurgeryForm?.SurgeryID || ""})
              </h3>
              <button onClick={() => setShowUpdateSurgeryModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSurgerySubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Surgical Patient</label>
                <input
                  type="text"
                  readOnly
                  value={`${patients?.find(p => p.PatientID === editSurgeryForm?.PatientID)?.PatientName || "Unknown Patient"} (${editSurgeryForm?.PatientID || ""})`}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 font-semibold text-slate-500 cursor-not-allowed outline-none select-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Theatre Procedure Type</label>
                <input
                  type="text"
                  value={editSurgeryForm?.SurgeryType || ""}
                  onChange={(e) => setEditSurgeryForm && setEditSurgeryForm({ ...editSurgeryForm, SurgeryType: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Scheduled Date</label>
                  <input
                    type="date"
                    min={getRelativeDate(0)}
                    value={editSurgeryForm?.SurgeryDate || ""}
                    onChange={(e) => setEditSurgeryForm && setEditSurgeryForm({ ...editSurgeryForm, SurgeryDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Operating Room ID</label>
                  <select
                    value={editSurgeryForm?.RoomID || ""}
                    onChange={(e) => setEditSurgeryForm && setEditSurgeryForm({ ...editSurgeryForm, RoomID: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-850"
                  >
                    {rooms.map(r => (
                      <option key={r.RoomID} value={r.RoomID}>{r.RoomNumber} ({r.RoomType})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Surgical Outcome Status</label>
                  <select
                    value={editSurgeryForm?.Outcome || "Pending"}
                    onChange={(e) => setEditSurgeryForm && setEditSurgeryForm({ ...editSurgeryForm, Outcome: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-855"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Successful">Successful</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Employee ID (Surgeon)</label>
                  <input
                    type="text"
                    value={editSurgeryForm?.EmployeeID || ""}
                    onChange={(e) => setEditSurgeryForm && setEditSurgeryForm({ ...editSurgeryForm, EmployeeID: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateSurgeryModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Save Surgery Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    
    {/* MODAL 8: UPDATE APPOINTMENT FORM */}
      {showUpdateAppointmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 modal-overlay px-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-md w-full p-6 modal-content space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon size={16} className="text-teal-600" />
                Update Existing Appointment
              </h3>
              <button onClick={() => setShowUpdateAppointmentModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateAppointmentSubmit} className="space-y-4 text-xs text-slate-700">
              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Select Patient</label>
                <select
                  value={editAppointmentForm?.PatientID}
                  onChange={(e) => setEditAppointmentForm({ ...editAppointmentForm, PatientID: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                >
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>{p.PatientName} ({p.PatientID})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Date Scheduled</label>
                  <input
                    type="date"
                    value={editAppointmentForm?.AppointmentDate || ""}
                    onChange={(e) => setEditAppointmentForm({ ...editAppointmentForm, AppointmentDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Time (HH:MM)</label>
                  <input
                    type="time"
                    value={editAppointmentForm?.AppointmentTime || ""}
                    onChange={(e) => setEditAppointmentForm({ ...editAppointmentForm, AppointmentTime: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-500 block">Appointment Status</label>
                <select
                  value={editAppointmentForm?.AppointmentStatus || "Scheduled"}
                  onChange={(e) => setEditAppointmentForm({ ...editAppointmentForm, AppointmentStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 font-semibold text-slate-800"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUpdateAppointmentModal(false)}
                  className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold py-2 rounded-lg border border-slate-200 text-center cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-lg border border-teal-700 text-center shadow-sm cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}