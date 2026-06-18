import React, { useState, useMemo } from "react";
import { 
  Plus, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

export default function LabsDirectory({
  filteredLabTests,
  patients,
  labReports,
  searchQuery,
  setShowLabRequestModal,
  setSelectedPatientId,
  setActiveTab,
  setNewLabReportForm,
  setShowAddLabReportModal
}) {
  const [currentView, setCurrentView] = useState("tests"); // "tests" or "reports"

  const filteredReports = useMemo(() => {
    if (!searchQuery) return labReports;
    const q = searchQuery.toLowerCase();
    return labReports.filter(rep => {
      const test = filteredLabTests.find(t => t.TestID === rep.TestID);
      const pat = test ? patients.find(p => p.PatientID === test.PatientID) : null;
      return (
        rep.ReportID.toLowerCase().includes(q) ||
        rep.TestID.toLowerCase().includes(q) ||
        rep.ResultSummary.toLowerCase().includes(q) ||
        rep.PathologistComments.toLowerCase().includes(q) ||
        (pat && pat.PatientName.toLowerCase().includes(q))
      );
    });
  }, [labReports, filteredLabTests, patients, searchQuery]);

  return (
    <div id="labs-view" className="space-y-6 fade-in-slide bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      
      {/* Title & Submit test Order header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-105 pb-5">
        <div>
          <h2 className="font-bold text-slate-800 text-sm">Laboratories and Diagnostics Directory</h2>
          <p className="text-xs text-slate-400">Database relation links: LabTests and LabReports schemas</p>
        </div>
        {currentView === "tests" ? (
          <button
            onClick={() => setShowLabRequestModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-teal-700 shadow-sm cursor-pointer self-start sm:self-center"
          >
            <Plus size={13} />
            Submit Lab Test Order
          </button>
        ) : (
          <button
            onClick={() => {
              setNewLabReportForm({ testId: "", resultSummary: "", pathologistComments: "" });
              setShowAddLabReportModal(true);
            }}
            className="bg-slate-700 hover:bg-slate-800 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-800 shadow-sm cursor-pointer self-start sm:self-center"
          >
            <Plus size={13} />
            Add Lab Report
          </button>
        )}
      </div>

      {/* Choose between lab tests and lab reports segment - toggle buttons */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl max-w-xs">
        <button
          id="toggle-labs-tests"
          onClick={() => setCurrentView("tests")}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            currentView === "tests"
              ? "bg-white text-teal-650 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Lab Tests
        </button>
        <button
          id="toggle-labs-reports"
          onClick={() => setCurrentView("reports")}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
            currentView === "reports"
              ? "bg-white text-teal-650 shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Lab Reports
        </button>
      </div>

      {/* Conditionally render Lab Tests or Lab Reports table */}
      {currentView === "tests" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Test ID (PK)</th>
                <th className="px-5 py-3">Patient ID (FK)</th>
                <th className="px-5 py-3">Employee ID (FK)</th>
                <th className="px-5 py-3">Test Type</th>
                <th className="px-5 py-3">Request Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-150">
              {filteredLabTests.map(lab => {
                const pat = patients.find(p => p.PatientID === lab.PatientID);
                const hasReport = labReports.some(rep => rep.TestID === lab.TestID);

                return (
                  <tr key={lab.TestID} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono font-bold text-slate-505">
                      {lab.TestID}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{pat?.PatientName || "Unknown"}</p>
                      <p className="text-[10px] text-slate-400">Patient ID: {lab.PatientID}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono text-[11px]">
                      {lab.EmployeeID || "EMP-042"}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {lab.TestType}
                    </td>
                    <td className="px-5 py-4 text-slate-505 whitespace-nowrap">
                      {lab.RequestDate}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                        lab.Status === "Done" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${
                          lab.Status === "Done" ? "bg-emerald-400" : "bg-amber-400"
                        }`} />
                        {lab.Status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {hasReport ? (
                        <button
                          onClick={() => {
                            setSelectedPatientId(lab.PatientID);
                            setActiveTab("patients");
                          }}
                          className="text-teal-600 hover:underline font-bold"
                        >
                          View Report &rarr;
                        </button>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Pending Results</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredLabTests.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 italic">No lab tests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3">Report ID (PK)</th>
                <th className="px-5 py-3">Test ID (FK)</th>
                <th className="px-5 py-3">Patient Profile</th>
                <th className="px-5 py-3">Result Summary</th>
                <th className="px-5 py-3">Report Date</th>
                <th className="px-5 py-3">Pathologist Comments</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-150">
              {filteredReports.map(rep => {
                const associatedTest = filteredLabTests.find(t => t.TestID === rep.TestID);
                const patName = associatedTest 
                  ? (patients.find(p => p.PatientID === associatedTest.PatientID)?.PatientName || "Unknown")
                  : "Unknown";
                const pID = associatedTest ? associatedTest.PatientID : "—";

                return (
                  <tr key={rep.ReportID} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-mono font-bold text-slate-505">
                      {rep.ReportID}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-teal-600">
                      {rep.TestID}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">{patName}</p>
                      <p className="text-[10px] text-slate-400">Patient ID: {pID}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-700 font-bold max-w-xs truncate" title={rep.ResultSummary}>
                      {rep.ResultSummary}
                    </td>
                    <td className="px-5 py-4 text-slate-505 whitespace-nowrap">
                      {rep.ReportDate}
                    </td>
                    <td className="px-5 py-4 text-slate-550 italic max-w-xs truncate" title={rep.PathologistComments}>
                      {rep.PathologistComments}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {associatedTest && (
                        <button
                          onClick={() => {
                            setSelectedPatientId(associatedTest.PatientID);
                            setActiveTab("patients");
                          }}
                          className="text-teal-600 hover:underline font-bold"
                        >
                          Portfolio &rarr;
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 italic">No lab reports found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
