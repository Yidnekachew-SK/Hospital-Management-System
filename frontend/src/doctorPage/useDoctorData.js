import { useState, useMemo, useEffect } from "react";
import { generateCalendarDays, MONTH_NAMES } from "./calendarHelper";

/**
 * Custom React Hook that encapsulates state, API interactions, 
 * data transforms, filtering, and form handlers for the Doctor Portal.
 * 
 * @param {string} username - The logged in doctor's username passed from the router
 */
export function useDoctorData(username) {
  // --- DYNAMIC CORE STATES ---
  const [activeDoctor, setActiveDoctor] = useState(null);

  // --- DATABASE STATE LAYERS ---
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  
  // Dynamic collections replacing constants.js
  const [rooms, setRooms] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [medications, setMedications] = useState([]);

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
    patientId: "1",
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    status: "Scheduled"
  });

  const [newRxForm, setNewRxForm] = useState({
    patientId: "1",
    items: [
      { medicationId: "1", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }
    ]
  });

  const [newLabForm, setNewLabForm] = useState({
    patientId: "1",
    testType: "Lipid Profile Panel",
    requestDate: new Date().toISOString().split("T")[0]
  });

  const [newSurgeryForm, setNewSurgeryForm] = useState({
    patientId: "1",
    surgeryType: "Diagnostic Angioplasty",
    date: new Date().toISOString().split("T")[0],
    roomId: "1"
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

  // Helper to format ISO dates to clean YYYY-MM-DD strings
  const formatDateStr = (dateVal) => {
    if (!dateVal) return "";
    return dateVal.split("T")[0];
  };

  // Load backend data from REST API endpoints
  const loadAllData = async () => {
    try {
      // 1. Patients
      const patientsRes = await fetch('/api/v1/patients/patient');
      const patientsJson = await patientsRes.json();
      setPatients(patientsJson.data.patients || []);

      // 2. Appointments
      const apptsRes = await fetch('/api/v1/appointments');
      const apptsJson = await apptsRes.json();
      const formattedAppts = (apptsJson.data.appointments || []).map(a => ({
        ...a,
        AppointmentDate: formatDateStr(a.AppointmentDate),
        Status: a.AppointmentStatus || a.Status // Fallback mapping to handle frontend Status references
      }));
      setAppointments(formattedAppts);

      // 3. Prescriptions
      const rxRes = await fetch('/api/v1/pharmacy/prescriptions');
      const rxJson = await rxRes.json();
      const formattedRx = (rxJson.data.prescriptions || []).map(r => ({
        ...r,
        DateIssued: formatDateStr(r.DateIssued)
      }));
      setPrescriptions(formattedRx);

      // 4. Prescription Items
      const rxItemsRes = await fetch('/api/v1/pharmacy/prescription-items');
      const rxItemsJson = await rxItemsRes.json();
      setPrescriptionItems(rxItemsJson.data.prescriptionItems || []);

      // 5. Lab Tests
      const labTestsRes = await fetch('/api/v1/diagnostics/lab-tests');
      const labTestsJson = await labTestsRes.json();
      
      // 6. Lab Reports
      const labReportsRes = await fetch('/api/v1/diagnostics/lab-reports');
      const labReportsJson = await labReportsRes.json();
      const formattedReports = (labReportsJson.data.labReports || []).map(rep => ({
        ...rep,
        ReportDate: formatDateStr(rep.ReportDate)
      }));
      setLabReports(formattedReports);

      // Resolve Lab Test Status dynamically based on report presence (no Status column exists in MySQL)
      const formattedLabTests = (labTestsJson.data.labTests || []).map(test => {
        const hasReport = formattedReports.some(rep => rep.TestID === test.TestID);
        return {
          ...test,
          RequestDate: formatDateStr(test.RequestDate),
          Status: hasReport ? "Completed" : "Pending"
        };
      });
      setLabTests(formattedLabTests);

      // 7. Surgeries
      const surgeriesRes = await fetch('/api/v1/diagnostics/surgeries');
      const surgeriesJson = await surgeriesRes.json();
      const formattedSurgeries = (surgeriesJson.data.surgeries || []).map(s => ({
        ...s,
        SurgeryDate: formatDateStr(s.SurgeryDate)
      }));
      setSurgeries(formattedSurgeries);

      // 8. Dynamic list configurations (replacing constant files)
      const roomsRes = await fetch('/api/v1/clinic/rooms');
      const roomsJson = await roomsRes.json();
      setRooms(roomsJson.data.rooms || []);

      const insRes = await fetch('/api/v1/patients/insurance');
      const insJson = await insRes.json();
      setInsurances(insJson.data.insuranceRecords || []);

      const medsRes = await fetch('/api/v1/pharmacy/medications');
      const medsJson = await medsRes.json();
      setMedications(medsJson.data.medications || []);

    } catch (err) {
      console.error("[Addis Hospital Sync Error]: Failed to background sync API data:", err);
    }
  };

  // --- SYNC ACTIVE DOCTOR AND SPECIFIC RECORDS ON MOUNT/PROP CHANGE ---
  useEffect(() => {
    const initializeProfileAndData = async () => {
      await loadAllData();
      
      try {
        const response = await fetch('/api/v1/employees/doctors/all/detailed');
        const json = await response.json();
        const detailedDoctors = json.data.doctorInfo || [];
        
        // Match active username from the router (e.g. 'sarahlee')
        const matchedDoctor = detailedDoctors.find(d => {
          const normalizedName = d.EmployeeName.toLowerCase().replace("dr. ", "").replace(/\s+/g, "");
          return normalizedName === username?.toLowerCase() || d.EmployeeID === username;
        }) || detailedDoctors[0];
        
        setActiveDoctor(matchedDoctor);

        // Fetch medical records matching this doctor's EmployeeID
        if (matchedDoctor) {
          const recordsRes = await fetch(`/api/v1/records/employee/${matchedDoctor.EmployeeID}`);
          const recordsJson = await recordsRes.json();
          const formattedRecords = (recordsJson.data.records || []).map(rec => ({
            ...rec,
            RecordDate: formatDateStr(rec.RecordDate)
          }));
          setMedicalRecords(formattedRecords);
        }
      } catch (err) {
        console.error("Failed to initialize active doctor credentials:", err);
      }
    };

    initializeProfileAndData();
  }, [username]);

  // Fetch full medical record history dynamically when a patient is selected in detail view
  useEffect(() => {
    if (!selectedPatientId) return;
    const fetchPatientRecords = async () => {
      try {
        const res = await fetch(`/api/v1/records/patient/${selectedPatientId}`);
        const json = await res.json();
        if (json.success && json.data.records) {
          setMedicalRecords(prev => {
            const existingMap = new Map(prev.map(r => [r.RecordID, r]));
            json.data.records.forEach(r => {
              existingMap.set(r.RecordID, {
                ...r,
                RecordDate: formatDateStr(r.RecordDate)
              });
            });
            return Array.from(existingMap.values());
          });
        }
      } catch (err) {
        console.error("Failed to load records for patient:", err);
      }
    };
    fetchPatientRecords();
  }, [selectedPatientId]);

  // --- ACTION SUBMISSIONS ---
  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      const response = await fetch('/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: parseInt(newApptForm.patientId, 10) || newApptForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          AppointmentDate: newApptForm.date,
          AppointmentTime: newApptForm.time + ":00", // Seconds formatting for SQL
          AppointmentStatus: newApptForm.status
        })
      });
      const json = await response.json();
      if (json.success) {
        setShowAppointmentModal(false);
        loadAllData();
      } else {
        console.error("Failed to add appointment:", json.message);
      }
    } catch (err) {
      console.error("Failed to add appointment:", err);
    }
  };

  const handleAddPrescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!activeDoctor) return;
    setSigningPrescription(true);
    try {
      // 1. Create prescription header record
      const rxResponse = await fetch('/api/v1/pharmacy/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: parseInt(newRxForm.patientId, 10) || newRxForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          DateIssued: new Date().toISOString().split("T")[0]
        })
      });
      const rxJson = await rxResponse.json();
      if (!rxJson.success) {
        throw new Error(rxJson.message || "Failed to create prescription header");
      }

      const prescriptionId = rxJson.data.PrescriptionID;

      // 2. Submit individual item records
      for (const item of newRxForm.items) {
        const itemResponse = await fetch('/api/v1/pharmacy/prescription-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            PrescriptionID: prescriptionId,
            MedicationID: parseInt(item.medicationId, 10) || item.medicationId,
            Dosage: item.dosage,
            Duration: item.duration,
            Frequency: item.frequency
          })
        });
        const itemJson = await itemResponse.json();
        if (!itemJson.success) {
          console.error("Failed to add prescription item:", itemJson.message);
        }
      }

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
    if (!activeDoctor) return;
    try {
      const response = await fetch('/api/v1/diagnostics/lab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: parseInt(newLabForm.patientId, 10) || newLabForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          TestType: newLabForm.testType,
          RequestDate: newLabForm.requestDate
        })
      });
      const json = await response.json();
      if (json.success) {
        setShowLabRequestModal(false);
        loadAllData();
      } else {
        console.error("Failed to order lab:", json.message);
      }
    } catch (err) {
      console.error("Failed to order lab:", err);
    }
  };

  const handleScheduleSurgerySubmit = async (e) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      const response = await fetch('/api/v1/diagnostics/surgeries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: parseInt(newSurgeryForm.patientId, 10) || newSurgeryForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          RoomID: parseInt(newSurgeryForm.roomId, 10) || newSurgeryForm.roomId,
          SurgeryDate: newSurgeryForm.date,
          SurgeryType: newSurgeryForm.surgeryType,
          Outcome: "Pending"
        })
      });
      const json = await response.json();
      if (json.success) {
        setShowSurgeryRequestModal(false);
        loadAllData();
      } else {
        console.error("Failed to schedule surgery theatre:", json.message);
      }
    } catch (err) {
      console.error("Failed to schedule surgery theatre:", err);
    }
  };

  const handleAddLabReportSubmit = async (e) => {
    e.preventDefault();
    if (!newLabReportForm.testId) return;
    try {
      const response = await fetch('/api/v1/diagnostics/lab-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          TestID: parseInt(newLabReportForm.testId, 10) || newLabReportForm.testId,
          ResultSummary: newLabReportForm.resultSummary,
          ReportDate: new Date().toISOString().split("T")[0],
          PathologistComments: newLabReportForm.pathologistComments
        })
      });
      const json = await response.json();
      if (json.success) {
        setShowAddLabReportModal(false);
        loadAllData();
      } else {
        console.error("Failed to publish lab report:", json.message);
      }
    } catch (err) {
      console.error("Failed to publish lab report:", err);
    }
  };

  const handleUpdateRecordSubmit = async (e) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      const isNew = !editRecordForm.RecordID;
      const url = isNew ? '/api/v1/records' : `/api/v1/records/${editRecordForm.RecordID}`;
      const method = isNew ? 'POST' : 'PUT';

      const bodyData = isNew
        ? {
            PatientID: parseInt(editRecordForm.PatientID, 10) || editRecordForm.PatientID,
            EmployeeID: activeDoctor.EmployeeID,
            RecordDate: editRecordForm.RecordDate || new Date().toISOString().split("T")[0],
            ClinicalNotes: editRecordForm.ClinicalNotes,
            FinalDiagnosis: editRecordForm.FinalDiagnosis
          }
        : {
            ClinicalNotes: editRecordForm.ClinicalNotes,
            FinalDiagnosis: editRecordForm.FinalDiagnosis
          };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });
      const json = await response.json();
      if (json.success) {
        setShowUpdateRecordModal(false);
        loadAllData();
      } else {
        console.error("Failed to submit medical record:", json.message);
      }
    } catch (err) {
      console.error("Failed to update medical record:", err);
    }
  };

  const handleUpdateSurgerySubmit = async (e) => {
    e.preventDefault();
    if (!activeDoctor) return;
    try {
      const response = await fetch(`/api/v1/diagnostics/surgeries/${editSurgeryForm.SurgeryID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          PatientID: parseInt(editSurgeryForm.PatientID, 10) || editSurgeryForm.PatientID,
          EmployeeID: editSurgeryForm.EmployeeID || activeDoctor.EmployeeID,
          RoomID: parseInt(editSurgeryForm.RoomID, 10) || editSurgeryForm.RoomID,
          SurgeryDate: editSurgeryForm.SurgeryDate,
          SurgeryType: editSurgeryForm.SurgeryType,
          Outcome: editSurgeryForm.Outcome
        })
      });
      const json = await response.json();
      if (json.success) {
        setShowUpdateSurgeryModal(false);
        loadAllData();
      } else {
        console.error("Failed to update surgery:", json.message);
      }
    } catch (err) {
      console.error("Failed to update surgery scheduled event:", err);
    }
  };

  // --- ENHANCED PATIENT DATA LOOKUP ---
  const enrichedPatients = useMemo(() => {
    return patients.map(pat => {
      const insurance = insurances.find(ins => ins.InsuranceID === pat.InsuranceID) || null;
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
  }, [patients, medicalRecords, labTests, insurances]);

  // --- FILTERED SELECTIONS ---
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return enrichedPatients;
    const query = searchQuery.toLowerCase();
    return enrichedPatients.filter(
      p => p.PatientName.toLowerCase().includes(query) || 
           String(p.PatientID).toLowerCase().includes(query) || 
           (p.NationalID && p.NationalID.includes(query)) || 
           p.condition.toLowerCase().includes(query)
    );
  }, [enrichedPatients, searchQuery]);

  const filteredLabTests = useMemo(() => {
    if (!searchQuery) return labTests;
    const q = searchQuery.toLowerCase();
    return labTests.filter(lab => {
      const pat = patients.find(p => p.PatientID === lab.PatientID);
      return String(lab.TestID).toLowerCase().includes(q) || 
             lab.TestType.toLowerCase().includes(q) || 
             (pat && pat.PatientName.toLowerCase().includes(q)) || 
             String(lab.PatientID).toLowerCase().includes(q);
    });
  }, [labTests, searchQuery, patients]);

  const filteredSurgeries = useMemo(() => {
    if (!searchQuery) return surgeries;
    const q = searchQuery.toLowerCase();
    return surgeries.filter(s => {
      const pat = patients.find(p => p.PatientID === s.PatientID);
      return String(s.SurgeryID).toLowerCase().includes(q) || 
             s.SurgeryType.toLowerCase().includes(q) || 
             (pat && pat.PatientName.toLowerCase().includes(q)) || 
             String(s.PatientID).toLowerCase().includes(q);
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
      const rm = rooms.find(r => r.RoomID === s.RoomID);
      return { ...s, RoomName: rm ? rm.RoomNumber : s.RoomID };
    }).filter(s => s.PatientID === selectedPatientId);

    const rxList = prescriptions.filter(rx => rx.PatientID === selectedPatientId).map(rx => {
      const items = prescriptionItems.filter(item => item.PrescriptionID === rx.PrescriptionID).map(item => {
        const drug = medications.find(m => m.MedicationID === item.MedicationID);
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
  }, [selectedPatientId, enrichedPatients, medicalRecords, labTests, labReports, surgeries, prescriptions, prescriptionItems, rooms, medications]);

  // --- CALENDAR GRID GENERATION ---
  const calendarDays = useMemo(() => {
    return generateCalendarDays(calendarYear, calendarMonth);
  }, [calendarYear, calendarMonth]);

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

  // --- FORM ROW MANIPULATORS ---
  const addRxItemRow = () => {
    setNewRxForm(prev => ({
      ...prev,
      items: [...prev.items, { medicationId: "1", dosage: "250mg", duration: "7 Days", frequency: "Daily" }]
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

  const displayDoctorName = activeDoctor ? activeDoctor.EmployeeName : "Loading Clinician Profile...";

  return {
    // Core Profile Context
    activeDoctor,
    displayDoctorName,

    // Basic layouts
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    
    // Server collections
    patients,
    appointments,
    medicalRecords,
    labTests,
    surgeries,
    labReports,
    rooms,
    insurances,
    medications,
    
    // Derived outputs
    filteredPatients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatientData,
    filteredLabTests,
    filteredSurgeries,
    
    // Calendar settings
    calendarYear,
    calendarMonth,
    selectedCalendarDate,
    setSelectedCalendarDate,
    calendarDays,
    monthNames: MONTH_NAMES,
    changeMonth,
    selectedDateAppointments,
    
    // Form and Modals Visibility
    showAppointmentModal,
    setShowAppointmentModal,
    showPrescriptionModal,
    setShowPrescriptionModal,
    showLabRequestModal,
    setShowLabRequestModal,
    showSurgeryRequestModal,
    setShowSurgeryRequestModal,
    showAddLabReportModal,
    setShowAddLabReportModal,
    signingPrescription,
    showUpdateRecordModal,
    setShowUpdateRecordModal,
    showUpdateSurgeryModal,
    setShowUpdateSurgeryModal,
    
    // Submission handlers
    handleAddAppointment,
    handleAddPrescriptionSubmit,
    handleRequestLabSubmit,
    handleScheduleSurgerySubmit,
    handleAddLabReportSubmit,
    handleUpdateRecordSubmit,
    handleUpdateSurgerySubmit,
    
    // Items manipulators
    addRxItemRow,
    updateRxItemRow,
    removeRxItemRow,
    
    // Form models
    newApptForm,
    setNewApptForm,
    newRxForm,
    setNewRxForm,
    newLabForm,
    setNewLabForm,
    newSurgeryForm,
    setNewSurgeryForm,
    newLabReportForm,
    setNewLabReportForm,
    editRecordForm,
    setEditRecordForm,
    editSurgeryForm,
    setEditSurgeryForm
  };
}