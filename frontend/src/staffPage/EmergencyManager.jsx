import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, ShieldAlert, Check, UserPlus, Search } from "lucide-react";

export default function EmergencyManager({ 
  emergencyCases, 
  patients, 
  employees, 
  onAdd, 
  onUpdate,
  onRegisterPatient 
}) {
  // Mode toggle for selecting patient vs registering a new one
  const [patientMode, setPatientMode] = useState("select"); // "select" or "create"

  const [formData, setFormData] = useState({
    CaseID: "",
    PatientID: "",
    EmployeeID: "",
    AdmissionID: "",
    AdmissionTime: new Date().toISOString().replace("T", " ").split(".")[0],
    SeverityLevel: "Moderate",
    Outcome: "Ongoing"
  });

  // State for registering a brand new patient
  const [newPatientForm, setNewPatientForm] = useState({
    PatientName: "",
    DOB_DATE: "",
    Gender: "M",
    Phone: "",
    NationalID: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Automatically select the first patient when list or mode changes
  useEffect(() => {
    if (patientMode === "select" && !formData.PatientID && patients.length > 0) {
      setFormData(prev => ({ ...prev, PatientID: patients[0].PatientID }));
    }
  }, [patients, patientMode, formData.PatientID]);

  const handleEditClick = (caseItem) => {
    setFormData({
      CaseID: caseItem.CaseID || "",
      PatientID: caseItem.PatientID || "",
      EmployeeID: caseItem.EmployeeID || "",
      AdmissionID: caseItem.AdmissionID || "",
      AdmissionTime: caseItem.AdmissionTime || new Date().toISOString().replace("T", " ").split(".")[0],
      SeverityLevel: caseItem.SeverityLevel || "Moderate",
      Outcome: caseItem.Outcome || "Ongoing"
    });
    setIsEditing(true);
    // Force mode to select when editing to prevent dual registration views
    setPatientMode("select");
    setSuccessMessage("");
    setErrorMessage("");
    setShowForm(true);
  };

  const handleReset = () => {
    setFormData({
      CaseID: "",
      PatientID: patients[0]?.PatientID || "",
      EmployeeID: employees[0]?.EmployeeID || "",
      AdmissionID: "",
      AdmissionTime: new Date().toISOString().replace("T", " ").split(".")[0],
      SeverityLevel: "Moderate",
      Outcome: "Ongoing"
    });
    setNewPatientForm({
      PatientName: "",
      DOB_DATE: "",
      Gender: "M",
      Phone: "",
      NationalID: "",
    });
    setIsEditing(false);
    setSuccessMessage("");
    setErrorMessage("");
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    try {
      let finalPatientID = formData.PatientID;

      // 1. If in "create/register new" mode and registering a newly arrived trauma case
      if (!isEditing && patientMode === "create") {
        if (!newPatientForm.PatientName.trim()) {
          setErrorMessage("Please input a valid Patient Name.");
          return;
        }
        if (!newPatientForm.DOB_DATE) {
          setErrorMessage("Please select a Patient Date of Birth.");
          return;
        }

        // Register new patient through backend API
        const regPayload = {
          ...newPatientForm,
          Region: "Addis",
          City: "Addis",
          HouseNumber: "N/A",
          InsuranceID: "INS-000" // Standard default self-pay
        };

        const registeredPatient = await onRegisterPatient(regPayload);
        if (!registeredPatient || !registeredPatient.PatientID) {
          throw new Error("Patient registration call did not return a valid PatientID.");
        }
        finalPatientID = registeredPatient.PatientID;
      }

      if (!finalPatientID) {
        setErrorMessage("Please designate an active patient record.");
        return;
      }

      // 2. Add or update emergency case
      if (isEditing) {
        await onUpdate(formData.CaseID, {
          ...formData,
          PatientID: finalPatientID // Map it consistently
        });
        setSuccessMessage(`Emergency Case ${formData.CaseID} successfully updated!`);
      } else {
        const payload = { 
          ...formData, 
          PatientID: finalPatientID 
        };
        delete payload.CaseID; // API autogenerates blank IDs
        await onAdd(payload);
        setSuccessMessage(`Emergency intake logged successfully for Patient ID: ${finalPatientID}!`);
      }
      handleReset();
    } catch (err) {
      setErrorMessage("Failed to submit emergency record. Check input fields.");
      console.error(err);
    }
  };

  return (
    <div id="emergency-manager-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table Section */}
      <div id="emergency-table-pane" className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="font-display font-bold text-slate-800 text-lg">Active Emergency Incidents</h3>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs bg-rose-50 border border-rose-100 px-3 py-1 rounded-full text-rose-700 font-bold">
              Alert Cases: {emergencyCases.length}
            </span>
            {!showForm && (
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  setShowForm(true);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Log New Emergency Case</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                <th className="py-3 px-4 font-mono text-xs">CaseID</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Assigned Attending</th>
                <th className="py-3 px-4 text-center">Severity</th>
                <th className="py-3 px-4 text-center">Outcome</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {emergencyCases.map((ec) => {
                const patient = patients.find(p => p.PatientID === ec.PatientID);
                const emp = employees.find(e => e.EmployeeID === ec.EmployeeID);
                
                // Color mapping for severity
                const severityColors = {
                  Critical: "bg-rose-100 text-rose-800 border-rose-200",
                  Severe: "bg-amber-100 text-amber-800 border-amber-200",
                  Moderate: "bg-blue-100 text-blue-800 border-blue-200",
                  Minor: "bg-slate-100 text-slate-700 border-slate-200"
                };
                const badgeStyle = severityColors[ec.SeverityLevel] || "bg-slate-50 text-slate-600";

                return (
                  <tr key={ec.CaseID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-800 font-bold">{ec.CaseID}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{patient ? patient.PatientName : "Triage patient"}</div>
                      <div className="text-[10px] font-mono text-slate-450">{ec.PatientID}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div className="font-medium text-slate-700">{emp ? (emp.EmployeeName || `${emp.FirstName} ${emp.LastName}`) : "ER On-Call Response"}</div>
                      <div className="text-[10px] font-mono text-slate-400">Intended: {ec.AdmissionTime}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${badgeStyle}`}>
                        {ec.SeverityLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-center font-medium">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        ec.Outcome === "Recovered" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : ec.Outcome === "Ongoing" 
                          ? "bg-amber-50 text-amber-700 border border-amber-100 animate-pulse font-bold" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {ec.Outcome}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleEditClick(ec)}
                        className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Click to populate update form below"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {emergencyCases.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    All emergency incidents resolved. System clear.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div id="emergency-form-pane" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-display font-bold text-slate-800 text-lg">
                {isEditing ? "Update Incident Status" : "Log Emergent Entry"}
              </h3>
              <p className="text-slate-450 text-xs mt-0.5">
                {isEditing 
                  ? "Modify ongoing incident record. Name and ID columns are read-only." 
                  : "Select an existing demographic profile or register a new one."
                }
              </p>
            </div>

            {successMessage && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* DYNAMIC MODE SWITCHER - ONLY AVAILABLE WHEN ADDING NEW */}
            {!isEditing && (
              <div className="flex gap-2 p-1 bg-slate-100 rounded-xl mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPatientMode("select")}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  patientMode === "select" 
                    ? "bg-white text-emerald-800 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>Existing Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setPatientMode("create")}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  patientMode === "create" 
                    ? "bg-white text-emerald-800 shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Register New</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* IF EDITING: Show non-editable Patient and ID details */}
            {isEditing ? (
              <div className="space-y-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Incident Reference ID
                  </label>
                  <input
                    type="text"
                    value={formData.CaseID}
                    disabled
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Patient Reference ID
                  </label>
                  <input
                    type="text"
                    value={formData.PatientID}
                    disabled
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                    Patient Full Name
                  </label>
                  <input
                    type="text"
                    value={patients.find(p => p.PatientID === formData.PatientID)?.PatientName || "Attending Patient"}
                    disabled
                    className="w-full px-2.5 py-1.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-lg cursor-not-allowed font-bold"
                  />
                </div>
              </div>
            ) : (
              /* IF ADDING: Render dynamic picker based on toggled mode */
              <div>
                {patientMode === "select" ? (
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Select Patient
                    </label>
                    <select
                      value={formData.PatientID}
                      onChange={(e) => setFormData(prev => ({ ...prev, PatientID: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      required
                    >
                      <option value="">-- Choose patient --</option>
                      {patients.map(p => (
                        <option key={p.PatientID} value={p.PatientID}>
                          {p.PatientName} ({p.PatientID}) {p.Phone ? `- ${p.Phone}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  /* REGISTER NEW INLINE FORM BLOCK */
                  <div className="space-y-2.5 p-3.5 bg-rose-50/20 border border-rose-100 rounded-xl">
                    <div className="text-[11px] font-bold text-rose-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>demographic triage card</span>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Almaz Kebede"
                        value={newPatientForm.PatientName}
                        onChange={(e) => setNewPatientForm(prev => ({ ...prev, PatientName: e.target.value }))}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        required={patientMode === "create"}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Birth Date *
                        </label>
                        <input
                          type="date"
                          value={newPatientForm.DOB_DATE}
                          onChange={(e) => setNewPatientForm(prev => ({ ...prev, DOB_DATE: e.target.value }))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                          required={patientMode === "create"}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Gender *
                        </label>
                        <select
                          value={newPatientForm.Gender}
                          onChange={(e) => setNewPatientForm(prev => ({ ...prev, Gender: e.target.value }))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-rose-500 focus:outline-none"
                        >
                          <option value="F">Female (F)</option>
                          <option value="M">Male (M)</option>
                          <option value="O">Other (O)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 0911223344"
                          value={newPatientForm.Phone}
                          onChange={(e) => setNewPatientForm(prev => ({ ...prev, Phone: e.target.value }))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                          National ID / Passport
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. N09282"
                          value={newPatientForm.NationalID}
                          onChange={(e) => setNewPatientForm(prev => ({ ...prev, NationalID: e.target.value }))}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Physician on Call
              </label>
              <select
                value={formData.EmployeeID}
                onChange={(e) => setFormData(prev => ({ ...prev, EmployeeID: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">-- No Clinician Assigned --</option>
                {employees.map(emp => (
                  <option key={emp.EmployeeID} value={emp.EmployeeID}>
                    {emp.EmployeeName || `${emp.FirstName} ${emp.LastName}`} ({emp.Specialty || "Staff"})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Incident Registry Date & Time
              </label>
              <input
                type="text"
                value={formData.AdmissionTime}
                onChange={(e) => setFormData(prev => ({ ...prev, AdmissionTime: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Triage Severity
              </label>
              <select
                value={formData.SeverityLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, SeverityLevel: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                <option value="Critical">Critical (Immediate Treatment)</option>
                <option value="Severe">Severe (Urgent Observation)</option>
                <option value="Moderate">Moderate (Stable Routine)</option>
                <option value="Minor">Minor (Non-emergent Walk-in)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Outcome Track
              </label>
              <select
                value={formData.Outcome}
                onChange={(e) => setFormData(prev => ({ ...prev, Outcome: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              >
                <option value="Ongoing">Ongoing (Active in ER)</option>
                <option value="Recovered">Recovered & Discharged</option>
                <option value="Admitted">Transferred to Inpatient Ward</option>
                <option value="Deceased">Deceased</option>
              </select>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{isEditing ? "Modify Incident Data" : "Log Emergent Entry"}</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs rounded-xl transition-colors border border-slate-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </div>
  );
}
