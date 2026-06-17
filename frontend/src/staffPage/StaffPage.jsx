import React, { useState, useEffect } from "react";
import { LogOut, LayoutGrid, ClipboardCheck, ShieldAlert, Users, Coins, HelpCircle } from "lucide-react";
import AdmissionManager from "./AdmissionManager";
import EmergencyManager from "./EmergencyManager";
import VisitorManager from "./VisitorManager";
import PaymentManager from "./PaymentManager";

export default function StaffPage({ username, onLogout }) {
  const [activeTab, setActiveTab] = useState("admissions"); // admissions | emergency | visitors | financial

  // Data State Pools
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [emergencyCases, setEmergencyCases] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  // Loading indicator helper
  const [isLoading, setIsLoading] = useState(true);

  // Fetch helper util
  const getArray = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP Error: ${res.status} on URL: ${url}`);
    return res.json();
  };

  const loadAllStaffData = async () => {
    setIsLoading(true);
    try {
      const [
        pats, 
        rms, 
        emps, 
        adms, 
        emg, 
        vis, 
        bls, 
        pyms
      ] = await Promise.all([
        getArray("/api/v1/patients/patient"),
        getArray("/api/v1/clinic/rooms"),
        getArray("/api/v1/employees/doctors/all/detailed"),
        getArray("/api/v1/appointments/admissions"),
        getArray("/api/v1/support/emergencies"),
        getArray("/api/v1/support/visitors"),
        getArray("/api/v1/finance/bills"),
        getArray("/api/v1/finance/payments")
      ]);

      setPatients(pats?.data?.patients || (Array.isArray(pats) ? pats : []));
      setRooms(rms?.data?.rooms || (Array.isArray(rms) ? rms : []));
      setEmployees(emps?.data?.doctorInfo || (Array.isArray(emps) ? emps : []));
      setAdmissions(adms?.data?.admissions || (Array.isArray(adms) ? adms : []));
      setEmergencyCases(emg?.data?.emergencies || (Array.isArray(emg) ? emg : []));
      setVisitors(vis?.data?.visitors || (Array.isArray(vis) ? vis : []));
      setBills(bls?.data?.bills || (Array.isArray(bls) ? bls : []));
      setPayments(pyms?.data?.payments || (Array.isArray(pyms) ? pyms : []));
    } catch (err) {
      console.error("[Addis Staff Portal Sync Exception]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllStaffData();
  }, []);

  // --- API OPERATIONS ---

  // ADMISSIONS
  const handleAddAdmission = async (formData) => {
    const sanitized = {
      ...formData,
      DischargeDate: formData.DischargeDate || null
    };
    const res = await fetch("/api/v1/appointments/admissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized)
    });
    if (!res.ok) throw new Error("Could not add admission");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  const handleUpdateAdmission = async (id, updatedData) => {
    const sanitized = {
      ...updatedData,
      DischargeDate: updatedData.DischargeDate || null
    };
    const res = await fetch(`/api/v1/appointments/admissions/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized)
    });
    if (!res.ok) throw new Error("Could not update admission");
    await loadAllStaffData();
  };

  const handleDeleteAdmission = async (id) => {
    const res = await fetch(`/api/v1/appointments/admissions/${encodeURIComponent(id)}`, {
      method: "DELETE"
    });
    if (!res.ok) throw new Error("Could not delete admission");
    await loadAllStaffData();
  };

  // EMERGENCY CASES
  const handleAddEmergency = async (formData) => {
    const sanitized = {
      ...formData,
      AdmissionID: formData.AdmissionID || null
    };
    const res = await fetch("/api/v1/support/emergencies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized)
    });
    if (!res.ok) throw new Error("Could not register emergency case");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  const handleUpdateEmergency = async (id, updatedData) => {
    const sanitized = {
      ...updatedData,
      AdmissionID: updatedData.AdmissionID || null
    };
    const res = await fetch(`/api/v1/support/emergencies/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sanitized)
    });
    if (!res.ok) throw new Error("Could not edit emergency entry");
    await loadAllStaffData();
  };

  // VISITORS
  const handleAddVisitor = async (formData) => {
    const res = await fetch("/api/v1/support/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error("Could not track visitor log");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  const handleUpdateVisitor = async (id, updatedData) => {
    const res = await fetch(`/api/v1/support/visitors/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) throw new Error("Could not update visitor check-in");
    await loadAllStaffData();
  };

  // BILLS
  const handleAddBill = async (formData) => {
    const res = await fetch("/api/v1/finance/bills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error("Could not issue bill invoice");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  const handleUpdateBill = async (id, updatedData) => {
    const res = await fetch(`/api/v1/finance/bills/${encodeURIComponent(id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    if (!res.ok) throw new Error("Could not update billing record");
    await loadAllStaffData();
  };


  // PAYMENTS (POST/Record process triggers automated state checks)
  const handleRecordPayment = async (formData) => {
    const res = await fetch("/api/v1/finance/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });
    if (!res.ok) throw new Error("Could not process financial payment");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  // PATIENTS
  const handleAddPatient = async (patientData) => {
    const res = await fetch("/api/v1/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
    });
    if (!res.ok) throw new Error("Could not register patient");
    const json = await res.json();
    await loadAllStaffData();
    return json.data;
  };

  return (
    <div id="staff-workspace" className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden text-[#1E293B]">
      
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-900 font-bold font-display text-sm">
              AH
            </div>
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide leading-tight">Addis Hospital</h2>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#10B981] font-semibold">
                Staff Central
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-xl space-y-1">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Staff Name</div>
            <div className="text-sm font-bold text-white font-mono truncate">{username ? username : "Administrator"}</div>
            <div className="text-[10px] text-emerald-450 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Fully Connected</span>
            </div>
          </div>

          {/* Core Modules Tabs */}
          <nav className="space-y-1.5 pt-4">
            <button
              onClick={() => setActiveTab("admissions")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "admissions" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10 font-bold" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Inpatient Admissions</span>
            </button>

            <button
              onClick={() => setActiveTab("emergency")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "emergency" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10 font-bold" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency Incidents</span>
            </button>

            <button
              onClick={() => setActiveTab("visitors")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "visitors" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10 font-bold" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Visitor Tracker Logs</span>
            </button>

            <button
              onClick={() => setActiveTab("financial")}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === "financial" 
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/10 font-bold" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Coins className="w-4 h-4" />
              <span>Billing & Payments</span>
            </button>
          </nav>
        </div>

        <div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-800 text-rose-450 hover:text-rose-400 font-semibold text-xs rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Workspace</span>
          </button>
        </div>
      </aside>

      {/* Main Container Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header Ribbon */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div>
            <span className="text-slate-400 text-xs font-semibold">Addis Hospital Portal Workspace</span>
            <h1 className="text-sm font-bold text-slate-800 uppercase tracking-wider font-mono">
              Role: Operational Hospital Staff Desk
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={loadAllStaffData}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-250 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              Force Sync Ledger
            </button>
          </div>
        </header>

        {/* Dynamic Core Wrapper */}
        <div className="flex-1 overflow-y-auto p-8">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-450 font-mono font-medium animate-pulse">Syncing Addis General Ledger Datastore...</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {activeTab === "admissions" && (
                <AdmissionManager
                  admissions={admissions}
                  patients={patients}
                  rooms={rooms}
                  onAdd={handleAddAdmission}
                  onUpdate={handleUpdateAdmission}
                  onDelete={handleDeleteAdmission}
                  onRegisterPatient={handleAddPatient}
                />
              )}

              {activeTab === "emergency" && (
                <EmergencyManager
                  emergencyCases={emergencyCases}
                  patients={patients}
                  employees={employees}
                  onAdd={handleAddEmergency}
                  onUpdate={handleUpdateEmergency}
                  onRegisterPatient={handleAddPatient}
                />
              )}

              {activeTab === "visitors" && (
                <VisitorManager
                  visitors={visitors}
                  patients={patients}
                  onAdd={handleAddVisitor}
                  onUpdate={handleUpdateVisitor}
                />
              )}

              {activeTab === "financial" && (
                <PaymentManager
                  bills={bills}
                  payments={payments}
                  patients={patients}
                  onAddBill={handleAddBill}
                  onUpdateBill={handleUpdateBill}
                  onRecordPayment={handleRecordPayment}
                />
              )}

            </div>
          )}
        </div>
      </main>

    </div>
  );
}
