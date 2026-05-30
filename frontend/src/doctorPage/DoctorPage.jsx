import React, { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import "./DoctorPage.css";
import { AddisHospitalApi } from "./api";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import PatientDirectory from "./PatientDirectory";
import AppointmentCalendar from "./AppointmentCalendar";
import LabsDirectory from "./LabsDirectory";
import SurgeriesScheduler from "./SurgeriesScheduler";
import DoctorForms from "./DoctorForms";
import './DoctorPage.css';

const INITIAL_INSURANCES = [
  { InsuranceID: "INS-101", ProviderName: "BlueCross BlueShield", PolicyNumber: "BC-889-1029", CoverageDetails: "Premium PPO - 90% outpatient coverage, full diagnostic imaging" },
  { InsuranceID: "INS-102", ProviderName: "Aetna", PolicyNumber: "AE-201-9923", CoverageDetails: "Standard HMO - Co-pay $25, requires specialist referrals" },
  { InsuranceID: "INS-103", ProviderName: "Cigna Health", PolicyNumber: "CI-541-6651", CoverageDetails: "Global Platinum - 100% inpatient cover, $0 deductible" }
];

const INITIAL_ROOMS = [
  { RoomID: "RM-301", WardID: "WD-01", RoomNumber: "301-A", RoomType: "ICU", MaxCapacity: 2, CurrentOccupancy: 1 },
  { RoomID: "RM-302", WardID: "WD-01", RoomNumber: "302", RoomType: "Private", MaxCapacity: 1, CurrentOccupancy: 0 },
  { RoomID: "RM-104", WardID: "WD-03", RoomNumber: "104-B", RoomType: "General", MaxCapacity: 4, CurrentOccupancy: 3 },
  { RoomID: "RM-201", WardID: "WD-04", RoomNumber: "OR-1", RoomType: "Private", MaxCapacity: 1, CurrentOccupancy: 1 }
];

const INITIAL_MEDICATIONS = [
  { MedicationID: "MED-01", MedicationName: "Lisinopril", MedicationType: "ACE Inhibitor" },
  { MedicationID: "MED-02", MedicationName: "Metoprolol", MedicationType: "Beta-Blocker" },
  { MedicationID: "MED-03", MedicationName: "Atorvastatin", MedicationType: "Lipid-Lowering Agent" },
  { MedicationID: "MED-04", MedicationName: "Warfarin", MedicationType: "Anticoagulant" },
  { MedicationID: "MED-05", MedicationName: "Amoxicillin", MedicationType: "Antibiotic" }
];

const STAGED_DOCTOR = {
  EmployeeID: "EMP-042",
  NationalID: "NAT-194820",
  FirstName: "Sarah",
  LastName: "Chen",
  Gender: "F",
  Phone: "+1 (555) 124-7832",
  Email: "sarah.chen@medcore.org",
  Address: "88 Silver Maple Dr, Boston, MA",
  DeptID: "DEP-01",
  Salary: 185000,
  Specialty: "Cardiology & Vascular Medicine",
  LicenseNumber: "LIC-MC-998242"
};

export default function DoctorPage({ username, onLogout }) {
  // --- DATABASE STATE LAYERS ---
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [surgeries, setSurgeries] = useState([]);

  // --- UI STATES ---
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  
  // Custom interactive date state
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date().toISOString().split("T")[0]);

  // --- FORM OVERLAY MODAL MANAGERS ---
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showLabRequestModal, setShowLabRequestModal] = useState(false);
  const [showSurgeryRequestModal, setShowSurgeryRequestModal] = useState(false);
  const [showAddLabReportModal, setShowAddLabReportModal] = useState(false);
  const [signingPrescription, setSigningPrescription] = useState(false);

  // --- SPECIFIC FORM DATA OBJECTS ---
  const [newApptForm, setNewApptForm] = useState({
    patientId: "PAT-001",
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    status: "Scheduled"
  });

  const [newRxForm, setNewRxForm] = useState({
    patientId: "PAT-001",
    items: [
      { medicationId: "MED-01", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }
    ]
  });

  const [newLabForm, setNewLabForm] = useState({
    patientId: "PAT-001",
    testType: "Lipid Profile Panel",
    requestDate: new Date().toISOString().split("T")[0]
  });

  const [newSurgeryForm, setNewSurgeryForm] = useState({
    patientId: "PAT-001",
    surgeryType: "Diagnostic Angioplasty",
    date: new Date().toISOString().split("T")[0],
    roomId: "RM-201"
  });

  const [newLabReportForm, setNewLabReportForm] = useState({
    testId: "",
    resultSummary: "",
    pathologistComments: ""
  });

  // --- UPDATE MODALS STATE ---
  const [showUpdateRecordModal, setShowUpdateRecordModal] = useState(false);
  const [editRecordForm, setEditRecordForm] = useState({
    RecordID: "",
    PatientID: "",
    RecordDate: "",
    FinalDiagnosis: "",
    ClinicalNotes: ""
  });

  const [showUpdateSurgeryModal, setShowUpdateSurgeryModal] = useState(false);
  const [editSurgeryForm, setEditSurgeryForm] = useState({
    SurgeryID: "",
    PatientID: "",
    EmployeeID: "",
    SurgeryDate: "",
    SurgeryType: "",
    Outcome: "",
    RoomID: ""
  });

  // Asynchronous API Calling Mechanism to populate the data from AddisHospitalApi helper
  const loadAllData = async () => {
    try {
      const fetchedPatients = await AddisHospitalApi.getPatients();
      setPatients(fetchedPatients);

      const fetchedAppts = await AddisHospitalApi.getAppointments();
      setAppointments(fetchedAppts);

      const fetchedRecords = await AddisHospitalApi.getMedicalRecords();
      setMedicalRecords(fetchedRecords);

      const fetchedRx = await AddisHospitalApi.getPrescriptions();
      setPrescriptions(fetchedRx);

      const fetchedRxItems = await AddisHospitalApi.getPrescriptionItems();
      setPrescriptionItems(fetchedRxItems);

      const fetchedLabTests = await AddisHospitalApi.getLabTests();
      setLabTests(fetchedLabTests);

      const fetchedLabReports = await AddisHospitalApi.getLabReports();
      setLabReports(fetchedLabReports);

      const fetchedSurgeries = await AddisHospitalApi.getSurgeries();
      setSurgeries(fetchedSurgeries);
    } catch (err) {
      console.error("[Addis Hospital Mount Error]: Failed to background sync API schemas:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- ACTION SUBMISSIONS ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await AddisHospitalApi.createAppointment({
        PatientID: newApptForm.patientId,
        EmployeeID: STAGED_DOCTOR.EmployeeID,
        AppointmentDate: newApptForm.date,
        AppointmentTime: newApptForm.time,
        Status: newApptForm.status
      });
      setShowAppointmentModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to add appointment:", err);
    }
  };

  const handleAddPrescriptionSubmit = async (e) => {
    e.preventDefault();
    setSigningPrescription(true);
    try {
      await AddisHospitalApi.createPrescription(
        newRxForm.patientId,
        STAGED_DOCTOR.EmployeeID,
        newRxForm.items
      );
      setSigningPrescription(false);
      setShowPrescriptionModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to submit prescription:", err);
      setSigningPrescription(false);
    }
  };

  const handleRequestLabSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddisHospitalApi.createLabTest({
        PatientID: newLabForm.patientId,
        EmployeeID: STAGED_DOCTOR.EmployeeID,
        TestType: newLabForm.testType,
        RequestDate: newLabForm.requestDate
      });
      setShowLabRequestModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to order lab:", err);
    }
  };

  const handleScheduleSurgerySubmit = async (e) => {
    e.preventDefault();
    try {
      await AddisHospitalApi.createSurgery({
        PatientID: newSurgeryForm.patientId,
        EmployeeID: STAGED_DOCTOR.EmployeeID,
        SurgeryDate: newSurgeryForm.date,
        SurgeryType: newSurgeryForm.surgeryType,
        RoomID: newSurgeryForm.roomId
      });
      setShowSurgeryRequestModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to schedule surgery theatre:", err);
    }
  };

  const handleAddLabReportSubmit = async (e) => {
    e.preventDefault();
    if (!newLabReportForm.testId) return;
    try {
      await AddisHospitalApi.submitLabReport(
        newLabReportForm.testId,
        newLabReportForm.resultSummary,
        newLabReportForm.pathologistComments
      );
      setShowAddLabReportModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to publish lab report:", err);
    }
  };

  const handleUpdateRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      await AddisHospitalApi.updateMedicalRecord(editRecordForm.RecordID, {
        PatientID: editRecordForm.PatientID,
        RecordDate: editRecordForm.RecordDate,
        FinalDiagnosis: editRecordForm.FinalDiagnosis,
        ClinicalNotes: editRecordForm.ClinicalNotes
      });
      setShowUpdateRecordModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to update medical record:", err);
    }
  };

  const handleUpdateSurgerySubmit = async (e) => {
    e.preventDefault();
    try {
      await AddisHospitalApi.updateSurgery(editSurgeryForm.SurgeryID, {
        PatientID: editSurgeryForm.PatientID,
        EmployeeID: editSurgeryForm.EmployeeID,
        SurgeryDate: editSurgeryForm.SurgeryDate,
        SurgeryType: editSurgeryForm.SurgeryType,
        Outcome: editSurgeryForm.Outcome,
        RoomID: editSurgeryForm.RoomID
      });
      setShowUpdateSurgeryModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to update surgery scheduled event:", err);
    }
  };

  // --- ENHANCED PATIENT DATA LOOKUP ---
  const enrichedPatients = useMemo(() => {
    return patients.map(pat => {
      const insurance = INITIAL_INSURANCES.find(ins => ins.InsuranceID === pat.InsuranceID) || null;
      const patientRecords = medicalRecords.filter(rec => rec.PatientID === pat.PatientID);
      const latestClinicalRecord = patientRecords[patientRecords.length - 1] || null;
      
      const patLabs = labTests.filter(t => t.PatientID === pat.PatientID);
      const pendingLabsCount = patLabs.filter(l => l.Status === "Pending").length;
      const latestLab = patLabs[patLabs.length - 1] || null;

      return {
        ...pat,
        insuranceDetails: insurance,
        clinicalNotesPreview: latestClinicalRecord ? latestClinicalRecord.ClinicalNotes : "No active clinical entries",
        condition: latestClinicalRecord ? latestClinicalRecord.FinalDiagnosis : "Stable Evaluation Required",
        labStatus: pendingLabsCount > 0 ? "Pending" : (latestLab ? "Ready" : "None"),
        recordsCount: patientRecords.length
      };
    });
  }, [patients, medicalRecords, labTests]);

  // --- FILTERED SELECTIONS ---
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return enrichedPatients;
    const query = searchQuery.toLowerCase();
    return enrichedPatients.filter(
      p => p.PatientName.toLowerCase().includes(query) || p.PatientID.toLowerCase().includes(query) || p.NationalID.includes(query) || p.condition.toLowerCase().includes(query)
    );
  }, [enrichedPatients, searchQuery]);

  const filteredLabTests = useMemo(() => {
    if (!searchQuery) return labTests;
    const q = searchQuery.toLowerCase();
    return labTests.filter(lab => {
      const pat = patients.find(p => p.PatientID === lab.PatientID);
      return lab.TestID.toLowerCase().includes(q) || lab.TestType.toLowerCase().includes(q) || (pat && pat.PatientName.toLowerCase().includes(q)) || lab.PatientID.toLowerCase().includes(q);
    });
  }, [labTests, searchQuery, patients]);

  const filteredSurgeries = useMemo(() => {
    if (!searchQuery) return surgeries;
    const q = searchQuery.toLowerCase();
    return surgeries.filter(s => {
      const pat = patients.find(p => p.PatientID === s.PatientID);
      return s.SurgeryID.toLowerCase().includes(q) || s.SurgeryType.toLowerCase().includes(q) || (pat && pat.PatientName.toLowerCase().includes(q)) || s.PatientID.toLowerCase().includes(q);
    });
  }, [surgeries, searchQuery, patients]);

  const selectedPatientData = useMemo(() => {
    if (!selectedPatientId) return null;
    const basic = enrichedPatients.find(p => p.PatientID === selectedPatientId);
    if (!basic) return null;

    const notes = medicalRecords.filter(m => m.PatientID === selectedPatientId);
    const labs = labTests.map(test => {
      const report = labReports.find(rep => rep.TestID === test.TestID);
      return { ...test, report };
    }).filter(t => t.PatientID === selectedPatientId);

    const activeSurgs = surgeries.map(s => {
      const rm = INITIAL_ROOMS.find(r => r.RoomID === s.RoomID);
      return { ...s, RoomName: rm ? rm.RoomNumber : s.RoomID };
    }).filter(s => s.PatientID === selectedPatientId);

    const rxList = prescriptions.filter(rx => rx.PatientID === selectedPatientId).map(rx => {
      const items = prescriptionItems.filter(item => item.PrescriptionID === rx.PrescriptionID).map(item => {
        const drug = INITIAL_MEDICATIONS.find(m => m.MedicationID === item.MedicationID);
        return { ...item, drugName: drug ? drug.MedicationName : "Prescribed Formula" };
      });
      return { ...rx, items };
    });

    return {
      basic,
      notes,
      labs,
      surgeries: activeSurgs,
      prescriptions: rxList,
      admissions: []
    };
  }, [selectedPatientId, enrichedPatients, medicalRecords, labTests, labReports, surgeries, prescriptions, prescriptionItems]);

  // --- CALENDAR GRID GENERATION ---
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const startOffsetDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysArr = [];

    const prevMonthTotal = new Date(calendarYear, calendarMonth, 0).getDate();
    for (let i = startOffsetDay - 1; i >= 0; i--) {
      const prevMonthDay = prevMonthTotal - i;
      const prevY = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
      const prevM = calendarMonth === 0 ? 11 : calendarMonth - 1;
      const mStr = String(prevM + 1).padStart(2, "0");
      const dStr = String(prevMonthDay).padStart(2, "0");
      daysArr.push({
        dateString: `${prevY}-${mStr}-${dStr}`,
        dayNum: prevMonthDay,
        isCurrentMonth: false
      });
    }

    for (let d = 1; d <= totalDays; d++) {
      const mStr = String(calendarMonth + 1).padStart(2, "0");
      const dStr = String(d).padStart(2, "0");
      daysArr.push({
        dateString: `${calendarYear}-${mStr}-${dStr}`,
        dayNum: d,
        isCurrentMonth: true
      });
    }

    const rem = 42 - daysArr.length;
    for (let n = 1; n <= rem; n++) {
      const nextY = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
      const nextM = calendarMonth === 11 ? 0 : calendarMonth + 1;
      const mStr = String(nextM + 1).padStart(2, "0");
      const dStr = String(n).padStart(2, "0");
      daysArr.push({
        dateString: `${nextY}-${mStr}-${dStr}`,
        dayNum: n,
        isCurrentMonth: false
      });
    }

    return daysArr;
  }, [calendarYear, calendarMonth]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const changeMonth = (dir) => {
    if (dir === "prev") {
      if (calendarMonth === 0) {
        setCalendarMonth(11);
        setCalendarYear(y => y - 1);
      } else {
        setCalendarMonth(m => m - 1);
      }
    } else {
      if (calendarMonth === 11) {
        setCalendarMonth(0);
        setCalendarYear(y => y + 1);
      } else {
        setCalendarMonth(m => m + 1);
      }
    }
  };

  const selectedDateAppointments = useMemo(() => {
    return appointments.map(appt => {
      const client = patients.find(p => p.PatientID === appt.PatientID);
      return { ...appt, PatientName: client ? client.PatientName : "Unknown Patient" };
    }).filter(appt => appt.AppointmentDate === selectedCalendarDate);
  }, [appointments, selectedCalendarDate, patients]);

  const addRxItemRow = () => {
    setNewRxForm(prev => ({
      ...prev,
      items: [...prev.items, { medicationId: "MED-01", dosage: "250mg", duration: "7 Days", frequency: "Daily" }]
    }));
  };

  const updateRxItemRow = (idx, key, val) => {
    const updated = [...newRxForm.items];
    updated[idx] = { ...updated[idx], [key]: val };
    setNewRxForm({ ...newRxForm, items: updated });
  };

  const removeRxItemRow = (idx) => {
    if (newRxForm.items.length === 1) return;
    setNewRxForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== idx)
    }));
  };

  const displayDoctorName = `Dr. ${STAGED_DOCTOR.FirstName} ${STAGED_DOCTOR.LastName}`;

  return (
    <div id="doctor-workspace" className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden text-[#1E293B]">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        patientsCount={patients.length} 
        doctorName={displayDoctorName} 
        onLogout={onLogout} 
      />

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* TOP BAR / CONTROL GRID */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-extrabold tracking-tight">
            {activeTab === "dashboard" && "Clinical Hub Overview"}
            {activeTab === "patients" && "Patient Directory Database"}
            {activeTab === "appointments" && "Interactive Appointment Calendar"}
            {activeTab === "labs" && "Lab Tests & Pathologist Reports"}
            {activeTab === "surgeries" && "Operation Room & Surgery Schedules"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Patient Name, ID or active diagnose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-teal-500/20"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            </div>

            {activeTab === "patients" && (
              <button
                 onClick={() => {
                   setNewRxForm({ patientId: "PAT-001", items: [{ medicationId: "MED-01", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }] });
                   setShowPrescriptionModal(true);
                 }}
                 className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-teal-700 shadow-sm transition-all cursor-pointer"
              >
                + New Prescription
              </button>
            )}
          </div>
        </header>

        {/* COMPONENT DRAWER DISPLAY AREA */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="h-full w-full overflow-y-auto pr-1 custom-scrollbar">

            {activeTab === "dashboard" && (
              <DashboardOverview
                patients={patients}
                appointments={appointments}
                labTests={labTests}
                surgeries={surgeries}
                filteredPatients={filteredPatients}
                setSelectedPatientId={setSelectedPatientId}
                setActiveTab={setActiveTab}
                setShowLabRequestModal={setShowLabRequestModal}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                setShowAppointmentModal={setShowAppointmentModal}
              />
            )}

            {activeTab === "patients" && (
              <PatientDirectory
                filteredPatients={filteredPatients}
                medicalRecords={medicalRecords}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                selectedPatientData={selectedPatientData}
                setShowPrescriptionModal={setShowPrescriptionModal}
                setShowLabRequestModal={setShowLabRequestModal}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                setNewRxForm={setNewRxForm}
                setNewLabForm={setNewLabForm}
                setNewSurgeryForm={setNewSurgeryForm}
                setNewLabReportForm={setNewLabReportForm}
                setShowAddLabReportModal={setShowAddLabReportModal}
                onTriggerUpdateRecord={(record) => {
                  setEditRecordForm(record);
                  setShowUpdateRecordModal(true);
                }}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentCalendar
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                selectedCalendarDate={selectedCalendarDate}
                setSelectedCalendarDate={setSelectedCalendarDate}
                appointments={appointments}
                patients={patients}
                calendarDays={calendarDays}
                monthNames={monthNames}
                changeMonth={changeMonth}
                selectedDateAppointments={selectedDateAppointments}
                setShowAppointmentModal={setShowAppointmentModal}
                setNewApptForm={setNewApptForm}
              />
            )}

            {activeTab === "labs" && (
              <LabsDirectory
                filteredLabTests={filteredLabTests}
                patients={patients}
                labReports={labReports}
                searchQuery={searchQuery}
                setShowLabRequestModal={setShowLabRequestModal}
                setSelectedPatientId={setSelectedPatientId}
                setActiveTab={setActiveTab}
                setNewLabReportForm={setNewLabReportForm}
                setShowAddLabReportModal={setShowAddLabReportModal}
              />
            )}

            {activeTab === "surgeries" && (
              <SurgeriesScheduler
                filteredSurgeries={filteredSurgeries}
                patients={patients}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                onTriggerUpdateSurgery={(surgery) => {
                  setEditSurgeryForm(surgery);
                  setShowUpdateSurgeryModal(true);
                }}
              />
            )}

          </div>
        </div>
      </main>

      {/* FLOATING OVERLAY DIALOGS COORDINATOR */}
      <DoctorForms
        patients={patients}
        showAppointmentModal={showAppointmentModal}
        setShowAppointmentModal={setShowAppointmentModal}
        newApptForm={newApptForm}
        setNewApptForm={setNewApptForm}
        handleAddAppointment={handleAddAppointment}
        showPrescriptionModal={showPrescriptionModal}
        setShowPrescriptionModal={setShowPrescriptionModal}
        newRxForm={newRxForm}
        setNewRxForm={setNewRxForm}
        handleAddPrescriptionSubmit={handleAddPrescriptionSubmit}
        addRxItemRow={addRxItemRow}
        updateRxItemRow={updateRxItemRow}
        removeRxItemRow={removeRxItemRow}
        signingPrescription={signingPrescription}
        showLabRequestModal={showLabRequestModal}
        setShowLabRequestModal={setShowLabRequestModal}
        newLabForm={newLabForm}
        setNewLabForm={setNewLabForm}
        handleRequestLabSubmit={handleRequestLabSubmit}
        showSurgeryRequestModal={showSurgeryRequestModal}
        setShowSurgeryRequestModal={setShowSurgeryRequestModal}
        newSurgeryForm={newSurgeryForm}
        setNewSurgeryForm={setNewSurgeryForm}
        handleScheduleSurgerySubmit={handleScheduleSurgerySubmit}
        showAddLabReportModal={showAddLabReportModal}
        setShowAddLabReportModal={setShowAddLabReportModal}
        newLabReportForm={newLabReportForm}
        setNewLabReportForm={setNewLabReportForm}
        handleAddLabReportSubmit={handleAddLabReportSubmit}
        // Update medical record and surgery forms props
        showUpdateRecordModal={showUpdateRecordModal}
        setShowUpdateRecordModal={setShowUpdateRecordModal}
        editRecordForm={editRecordForm}
        setEditRecordForm={setEditRecordForm}
        handleUpdateRecordSubmit={handleUpdateRecordSubmit}
        showUpdateSurgeryModal={showUpdateSurgeryModal}
        setShowUpdateSurgeryModal={setShowUpdateSurgeryModal}
        editSurgeryForm={editSurgeryForm}
        setEditSurgeryForm={setEditSurgeryForm}
        handleUpdateSurgerySubmit={handleUpdateSurgerySubmit}
      />

    </div>
  );
}
