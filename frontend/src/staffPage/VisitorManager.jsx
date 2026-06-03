import React, { useState } from "react";
import { PlusCircle, Edit3, Users, Check } from "lucide-react";

export default function VisitorManager({ 
  visitors, 
  patients, 
  onAdd, 
  onUpdate 
}) {
  const [formData, setFormData] = useState({
    VisitorID: "",
    PatientID: "",
    VisitorName: "",
    RelationToPatient: "Friend",
    VisitDate: new Date().toISOString().split("T")[0]
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleEditClick = (vis) => {
    setFormData({
      VisitorID: vis.VisitorID || "",
      PatientID: vis.PatientID || "",
      VisitorName: vis.VisitorName || "",
      RelationToPatient: vis.RelationToPatient || "Friend",
      VisitDate: vis.VisitDate || new Date().toISOString().split("T")[0]
    });
    setIsEditing(true);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleReset = () => {
    setFormData({
      VisitorID: "",
      PatientID: patients[0]?.PatientID || "",
      VisitorName: "",
      RelationToPatient: "Friend",
      VisitDate: new Date().toISOString().split("T")[0]
    });
    setIsEditing(false);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!formData.PatientID) {
      setErrorMessage("Please select a valid patient to log a visit.");
      return;
    }
    if (!formData.VisitorName.trim()) {
      setErrorMessage("Visitor name is required.");
      return;
    }

    try {
      if (isEditing) {
        await onUpdate(formData.VisitorID, formData);
        setSuccessMessage(`Visitor record ${formData.VisitorID} successfully saved!`);
      } else {
        const payload = { ...formData };
        delete payload.VisitorID;
        await onAdd(payload);
        setSuccessMessage(`New visitor check-in logged successfully!`);
      }
      handleReset();
    } catch (err) {
      setErrorMessage("Could not record visitor logging details. Review input.");
      console.error(err);
    }
  };

  return (
    <div id="visitor-manager-container" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Table grid */}
      <div id="visitors-table-pane" className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h3 className="font-display font-bold text-slate-800 text-lg">Hospital Visitor Logs</h3>
          </div>
          <span className="text-xs bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full text-indigo-700 font-bold">
            Today Visitors: {visitors.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                <th className="py-3 px-4 font-mono text-xs">VisitorID</th>
                <th className="py-3 px-4">Visitor Guest Name</th>
                <th className="py-3 px-4">Visiting Patient</th>
                <th className="py-3 px-4">Relationship</th>
                <th className="py-3 px-4">Visit Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {visitors.map((v) => {
                const patient = patients.find(p => p.PatientID === v.PatientID);
                return (
                  <tr key={v.VisitorID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-slate-800 font-semibold">{v.VisitorID}</td>
                    <td className="py-3 px-4 font-semibold text-slate-700">{v.VisitorName}</td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-700">{patient ? patient.PatientName : "Hospital Care Taker"}</div>
                      <div className="text-[10px] font-mono text-slate-400">{v.PatientID}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold text-slate-600">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded-full">
                        {v.RelationToPatient || "Friend"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">{v.VisitDate}</td>
                    <td className="py-3 px-4 text-right font-medium">
                      <button
                        onClick={() => handleEditClick(v)}
                        className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Edit log details"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {visitors.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    No visitors recorded in this care ward today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Section */}
      <div id="visitor-form-pane" className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="mb-4">
          <h3 className="font-display font-bold text-slate-800 text-lg">
            {isEditing ? "Modify Visitor Record" : "Visitor Desk Check-In"}
          </h3>
          <p className="text-slate-400 text-xs mt-0.5">
            Log family, friends, and support guardians upon ward entry.
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEditing && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Visitor ID
              </label>
              <input
                type="text"
                value={formData.VisitorID}
                disabled
                className="w-full px-3 py-2 text-sm bg-slate-50 text-slate-550 border border-slate-200 rounded-xl cursor-not-allowed font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Visitor Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Mulu Kassa"
              value={formData.VisitorName}
              onChange={(e) => setFormData(prev => ({ ...prev, VisitorName: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Patient Visited
            </label>
            <select
              value={formData.PatientID}
              onChange={(e) => setFormData(prev => ({ ...prev, PatientID: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="">-- Select Patient Profile --</option>
              {patients.map(p => (
                <option key={p.PatientID} value={p.PatientID}>
                  {p.PatientName} ({p.PatientID})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Relationship to Patient
            </label>
            <select
              value={formData.RelationToPatient}
              onChange={(e) => setFormData(prev => ({ ...prev, RelationToPatient: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="Mother">Mother</option>
              <option value="Father">Father</option>
              <option value="Spouse">Spouse / Partner</option>
              <option value="Brother">Brother</option>
              <option value="Sister">Sister</option>
              <option value="Child">Child</option>
              <option value="Friend">Friend</option>
              <option value="Guardian">Legal Guardian</option>
              <option value="Colleague">Work Colleague</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Visit Date
            </label>
            <input
              type="date"
              value={formData.VisitDate}
              onChange={(e) => setFormData(prev => ({ ...prev, VisitDate: e.target.value }))}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{isEditing ? "Save Guest Detail" : "Check-In Guest"}</span>
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
  );
}
