import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, ClipboardList, Check, Trash2, UserPlus, Search } from "lucide-react";

export default function AdmissionManager({ 
  admissions, 
  patients, 
  rooms, 
  onAdd, 
  onUpdate, 
  onDelete,
  onRegisterPatient 
}) {
  // Mode toggle for selecting patient vs registering a new one
  const [patientMode, setPatientMode] = useState("select"); // "select" or "create"

  const [formData, setFormData] = useState({
    AdmissionID: "",
    PatientID: "",
    RoomID: "",
    AdmissionDate: new Date().toISOString().split("T")[0],
    DischargeDate: "",
    PrimaryDiagnosis: "",
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

  // Populate form with row info when update is clicked
  const handleEditClick = (admission) => {
    setFormData({
      AdmissionID: admission.AdmissionID || "",
      PatientID: admission.PatientID || "",
      RoomID: admission.RoomID || "",
      AdmissionDate: admission.AdmissionDate || new Date().toISOString().split("T")[0],
      DischargeDate: admission.DischargeDate || "",
      PrimaryDiagnosis: admission.PrimaryDiagnosis || "",
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
      AdmissionID: "",
      PatientID: patients[0]?.PatientID || "",
      RoomID: rooms[0]?.RoomID || "",
      AdmissionDate: new Date().toISOString().split("T")[0],
      DischargeDate: "",
      PrimaryDiagnosis: "",
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

      // 1. If in "create/register new" mode and registering a new admission
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

      // 2. Validate input mappings
      if (!finalPatientID) {
        setErrorMessage("Please designate an active patient record.");
        return;
      }
      if (!formData.RoomID) {
        setErrorMessage("Please select an inpatient room.");
        return;
      }

      // 3. Add or update admission sequence
      if (isEditing) {
        await onUpdate(formData.AdmissionID, {
          ...formData,
          PatientID: finalPatientID // Cannot be edited from UI but we map it consistently
        });
        setSuccessMessage(`Admission record ${formData.AdmissionID} successfully updated!`);
      } else {
        const payload = { 
          ...formData, 
          PatientID: finalPatientID 
        };
        delete payload.AdmissionID; // API autogenerates blank IDs
        await onAdd(payload);
        setSuccessMessage(`Admission logged successfully for Patient ID: ${finalPatientID}!`);
      }
      handleReset();
    } catch (err) {
      setErrorMessage("Failed to submit admission record schema. Please check validation endpoints.");
      console.error(err);
    }
  };

  return (
    <div id="admission-manager-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table Side */}
      <div id="admissions-table-pane" className={`${showForm ? "lg:col-span-2" : "lg:col-span-3"} bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden`}>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-emerald-600" />
            <h3 className="font-display font-bold text-slate-800 text-lg">Active & Closed Admissions</h3>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs bg-slate-150 font-mono px-3 py-1 rounded-full text-slate-750 font-semibold border border-slate-205">
              Total Intake: {admissions.length}
            </span>
            {!showForm && (
              <button
                type="button"
                onClick={() => {
                  handleReset();
                  setShowForm(true);
                }}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Record New Admission</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                <th className="py-3 px-4 font-mono text-xs">ID</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4 text-center">Room assigned</th>
                <th className="py-3 px-4">Initial Diagnosis</th>
                <th className="py-3 px-4">Registry / Discharge</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {admissions.find((adm) => {
                const pObj = patients.find(p => p.PatientID === adm.PatientID);
                return (
                  <tr key={adm.AdmissionID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-800 font-bold">{adm.AdmissionID}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{pObj ? pObj.PatientName : "Triage patient"}</div>
                      <div className="text-[10px] font-mono text-slate-450">{adm.PatientID}</div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 font-mono text-xs px-2.5 py-0.5 rounded">
                        Room {adm.RoomID}
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-[130px] truncate" title={adm.PrimaryDiagnosis}>
                      {adm.PrimaryDiagnosis || "No diagnosis logged"}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <div><span className="text-slate-400">Admit:</span> <span className="font-mono">{adm.AdmissionDate}</span></div>
                      {adm.DischargeDate ? (
                        <div className="text-emerald-600 font-medium"><span className="text-slate-400">Disch:</span> <span className="font-mono">{adm.DischargeDate}</span></div>
                      ) : (
                        <div className="text-rose-600 font-semibold italic mt-0.5 bg-rose-50 px-1.5 py-0.5 rounded inline-block">Inpatient Care</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={() => handleEditClick(adm)}
                          className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          title="Click to populate update form below"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                        {onDelete && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove admission entry ${adm.AdmissionID}?`)) {
                                onDelete(adm.AdmissionID);
                              }
                            }}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete admission logs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {admissions.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No active admissions found in the dynamically populated registry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Side */}
      {showForm && (
        <div id="admission-form-pane" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-display font-bold text-slate-800 text-lg">
                {isEditing ? "Update Patient Admission" : "Admit Patient Intake"}
              </h3>
              <p className="text-slate-450 text-xs mt-0.5">
                {isEditing 
                  ? "Modify ongoing clinical record. Name and ID columns are read-only." 
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
                      Admission Reference ID
                    </label>
                    <input
                      type="text"
                      value={formData.AdmissionID}
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
                    <div className="space-y-2.5 p-3.5 bg-emerald-50/30 border border-emerald-100 rounded-xl">
                      <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide mb-1 flex items-center gap-1">
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>demographic profile card</span>
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
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
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
                  Assign Ward Room
                </label>
                <select
                  value={formData.RoomID}
                  onChange={(e) => setFormData(prev => ({ ...prev, RoomID: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map(r => (
                    <option key={r.RoomID} value={r.RoomID}>
                      Room {r.RoomID} ({r.Capacity ? `Max Cap: ${r.Capacity}` : "Standard Suite"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  value={formData.AdmissionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, AdmissionDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Discharge Date <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="date"
                  value={formData.DischargeDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, DischargeDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Primary Diagnosis
                </label>
                <textarea
                  placeholder="e.g. Chronic carditis, diabetic ketoacidosis, standard observation..."
                  value={formData.PrimaryDiagnosis}
                  onChange={(e) => setFormData(prev => ({ ...prev, PrimaryDiagnosis: e.target.value }))}
                  className="w-full h-20 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEditing ? "Save Selection Row" : "Record Admission"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium text-xs rounded-xl transition-colors border border-slate-205 cursor-pointer"
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
