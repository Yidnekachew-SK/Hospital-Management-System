import { useState, useMemo, useEffect } from "react";
import { generateCalendarDays, MONTH_NAMES } from "./calendarHelper";

/**
 * Custom React Hook that encapsulates state, API interactions, 
 * data transforms, filtering, and form handlers for the Doctor Portal.
 */
export function useDoctorData(authenticatedUsername) {
  // --- DATABASE STATE LAYERS ---
  const [employees, setEmployees] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [rooms, setRooms] = useState([]);
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
    patientId: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:30",
    status: "Scheduled"
  });

  const [newRxForm, setNewRxForm] = useState({
    patientId: "",
    items: [
      { medicationId: "", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }
    ]
  });

  const [newLabForm, setNewLabForm] = useState({
    patientId: "",
    testType: "",
    requestDate: new Date().toISOString().split("T")[0]
  });

  const [newSurgeryForm, setNewSurgeryForm] = useState({
    patientId: "",
    surgeryType: "",
    date: new Date().toISOString().split("T")[0],
    roomId: ""
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

  const [showUpdateAppointmentModal, setShowUpdateAppointmentModal] = useState(false);
  const [editAppointmentForm, setEditAppointmentForm] = useState({
    AppointmentID: "",
    PatientID: "",
    EmployeeID: "",
    AppointmentDate: "",
    AppointmentTime: "",
    AppointmentStatus: ""
  });

  // Base loader helper
  const getArray = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`[getArray Warn] Fetching ${url} returned status:`, response.status);
        return [];
      }
      const json = await response.json();
      
      // Highly robust array extraction logic
      const findFirstArray = (obj) => {
        if (!obj || typeof obj !== "object") return null;
        if (Array.isArray(obj)) return obj;
        
        // Priority keys for clinical data unpacks
        const priorityKeys = [
          "data", "records", "patients", "appointments", 
          "prescriptions", "prescriptionItems", "labTests", 
          "labReports", "employees", "doctors", "clinics", "rooms"
        ];
        for (const k of priorityKeys) {
          if (Array.isArray(obj[k])) return obj[k];
          if (obj[k] && typeof obj[k] === "object") {
            const nested = findFirstArray(obj[k]);
            if (nested) return nested;
          }
        }
        
        // Generic object scan
        for (const val of Object.values(obj)) {
          if (Array.isArray(val)) return val;
          if (val && typeof val === "object") {
            const nested = findFirstArray(val);
            if (nested) return nested;
          }
        }
        return null;
      };

      const extracted = findFirstArray(json);
      if (extracted) return extracted;
      return [];
    } catch (err) {
      console.error(`[getArray Error] Fetch ${url} threw exception:`, err);
      return [];
    }
  };

  // Asynchronous API Calling Mechanism to populate the data
  const loadAllData = async () => {
    try {
      const [pats, appts, recs, rxs, rxItems, tests, reports, surgs, rms, meds, emps, ins] = await Promise.all([
        getArray("/api/v1/patients/patient"),
        getArray("/api/v1/appointments"),
        getArray("/api/v1/records"),
        getArray("/api/v1/pharmacy/prescriptions"),
        getArray("/api/v1/pharmacy/prescription-items"),
        getArray("/api/v1/diagnostics/lab-tests"),
        getArray("/api/v1/diagnostics/lab-reports"),
        getArray("/api/v1/diagnostics/surgeries"),
        getArray("/api/v1/clinic/rooms"),
        getArray("/api/v1/pharmacy/medications"),
        getArray("/api/v1/employees/doctors/all/detailed"),
        getArray("/api/v1/patients/insurance")
      ]);

      setPatients(pats || []);
       const normalizedAppts = (appts || []).map(a => {
        let cleanDate = a.AppointmentDate;
        if (cleanDate) {
          const str = String(cleanDate).trim();
          const match = str.match(/^(\d{4}-\d{2}-\d{2})/);
          if (match) {
            cleanDate = match[1];
          }
        }
        return {
          ...a,
          AppointmentDate: cleanDate,
          Status: a.Status || a.AppointmentStatus || "Scheduled"
        };
      });
      setAppointments(normalizedAppts);
      setMedicalRecords(recs || []);
      setPrescriptions(rxs || []);
      setPrescriptionItems(rxItems || []);
      setLabTests(tests || []);
      setLabReports(reports || []);
      setSurgeries(surgs || []);
      setRooms(rms || []);
      setMedications(meds || []);
      setEmployees(emps || []);
      setInsurances(ins || []);
    } catch (err) {
      console.error("[Addis Hospital Mount Error]: Failed to background sync API schemas:", err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Dynamically initialize form selections when live collections load
  useEffect(() => {
    if (patients.length > 0) {
      const firstPatientId = patients[0].PatientID;
      setNewApptForm(prev => prev.patientId ? prev : { ...prev, patientId: firstPatientId });
      setNewRxForm(prev => prev.patientId ? prev : { ...prev, patientId: firstPatientId });
      setNewLabForm(prev => prev.patientId ? prev : { ...prev, patientId: firstPatientId });
      setNewSurgeryForm(prev => prev.patientId ? prev : { ...prev, patientId: firstPatientId });
    }
  }, [patients]);

  useEffect(() => {
    if (medications.length > 0) {
      const firstMedId = medications[0].MedicationID;
      setNewRxForm(prev => {
        if (prev.items[0] && !prev.items[0].medicationId) {
          const items = [...prev.items];
          items[0] = { ...items[0], medicationId: firstMedId };
          return { ...prev, items };
        }
        return prev;
      });
    }
  }, [medications]);

  useEffect(() => {
    if (rooms.length > 0) {
      const firstRoomId = rooms[0].RoomID;
      setNewSurgeryForm(prev => prev.roomId ? prev : { ...prev, roomId: firstRoomId });
    }
  }, [rooms]);

  // Set active doctor dynamically based on login user matching
  const activeDoctor = useMemo(() => {
    const targetUser = (authenticatedUsername || "").toLowerCase().trim();
    if (!targetUser) {
      if (employees.length > 0) {
        const fallback = {
          EmployeeID: employees[0].EmployeeID,
          EmployeeName: employees[0].EmployeeName || `EMP-${employees[0].EmployeeID}`,
          Specialty: employees[0].Specialty || "",
          LicenseNumber: employees[0].LicenseNumber || ""
        };
        return fallback;
      }
      const loadingDoc = {
        EmployeeID: "",
        EmployeeName: "Clinician Profile Loading...",
        Specialty: "",
        LicenseNumber: ""
      };
      return loadingDoc;
    }

    const found = employees.find(emp => {
      const eName = (emp.EmployeeName || "").toLowerCase();
      const slugName = eName
        .replace(/^dr\.\s+/g, "")
        .replace(/^nurse\s+/g, "")
        .replace(/^staff\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

      const slugEmail = emp.Email ? emp.Email.split("@")[0].toLowerCase() : "";

      return slugName === targetUser || slugEmail === targetUser || String(emp.EmployeeID).toLowerCase() === targetUser;
    });

    if (found) {
      const resDoc = {
        EmployeeID: found.EmployeeID,
        EmployeeName: found.EmployeeName,
        Specialty: found.Specialty || "",
        LicenseNumber: found.LicenseNumber || ""
      };
      return resDoc;
    }

    if (employees.length > 0) {
      const fallback = {
        EmployeeID: employees[0].EmployeeID,
        EmployeeName: employees[0].EmployeeName || `EMP-${employees[0].EmployeeID}`,
        Specialty: employees[0].Specialty || "",
        LicenseNumber: employees[0].LicenseNumber || ""
      };
      return fallback;
    }

    const loadingDoc = {
      EmployeeID: "",
      EmployeeName: "Clinician Profile Loading...",
      Specialty: "",
      LicenseNumber: ""
    };
    return loadingDoc;
  }, [employees, authenticatedUsername]);

  // --- ACTION SUBMISSIONS ---
  const handleAddAppointment = async (e) => {
      e.preventDefault();
      try {
        // Normalize patient ID to clean integer for MySQL/relational tables compatibility
        let cleanPatientId = newApptForm.patientId;
        if (cleanPatientId !== undefined && cleanPatientId !== null) {
          const strVal = String(cleanPatientId).trim();
          if (strVal.toUpperCase().startsWith("PAT-")) {
            const num = parseInt(strVal.substring(4), 10);
            if (!isNaN(num)) {
              cleanPatientId = num;
            }
          } else {
            const num = parseInt(strVal, 10);
            if (!isNaN(num)) {
              cleanPatientId = num;
            }
          }
        }

        // Format time to HH:MM:SS to perfectly match MySQL TIME data type
        let formattedTime = "00:00:00";
        if (newApptForm.time) {
          const parts = newApptForm.time.split(":");
          if (parts.length === 2) {
            formattedTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
          } else if (parts.length === 3) {
            formattedTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
          } else {
            formattedTime = newApptForm.time;
          }
        }

        const res = await fetch("/api/v1/appointments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PatientID: cleanPatientId,
            EmployeeID: activeDoctor.EmployeeID,
            AppointmentDate: newApptForm.date,
            AppointmentTime: formattedTime,
            AppointmentStatus: newApptForm.status
          })
        });
        if (res.ok) {
          setShowAppointmentModal(false);
          loadAllData();
        }
      } catch (err) {
        console.error("Failed to add appointment:", err);
      }
    };

  const handleAddPrescriptionSubmit = async (e) => {
    e.preventDefault();
    setSigningPrescription(true);
    try {
      const rxRes = await fetch("/api/v1/pharmacy/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID: newRxForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          DateIssued: new Date().toISOString().split("T")[0]
        })
      });
      if (!rxRes.ok) throw new Error("Failed to create parent prescription");
      const rxData = await rxRes.json();
      const rxId = rxData.PrescriptionID;

      for (const item of newRxForm.items) {
        await fetch("/api/v1/pharmacy/prescription-items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PrescriptionID: rxId,
            MedicationID: item.medicationId,
            Dosage: item.dosage,
            Duration: item.duration,
            Frequency: item.frequency
          })
        });
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
    try {
      const res = await fetch("/api/v1/diagnostics/lab-tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID: newLabForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          TestType: newLabForm.testType,
          RequestDate: newLabForm.requestDate
        })
      });
      if (res.ok) {
        setShowLabRequestModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error("Failed to order lab:", err);
    }
  };

  const handleScheduleSurgerySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/v1/diagnostics/surgeries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID: newSurgeryForm.patientId,
          EmployeeID: activeDoctor.EmployeeID,
          SurgeryDate: newSurgeryForm.date,
          SurgeryType: newSurgeryForm.surgeryType,
          RoomID: newSurgeryForm.roomId,
          Outcome: "Pending"
        })
      });
      if (res.ok) {
        setShowSurgeryRequestModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error("Failed to schedule surgery theatre:", err);
    }
  };

  const handleAddLabReportSubmit = async (e) => {
    e.preventDefault();
    if (!newLabReportForm.testId) return;
    try {
      const res = await fetch("/api/v1/diagnostics/lab-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TestID: newLabReportForm.testId,
          ResultSummary: newLabReportForm.resultSummary,
          PathologistComments: newLabReportForm.pathologistComments,
          ReportDate: new Date().toISOString().split("T")[0]
        })
      });
      if (res.ok) {
        setShowAddLabReportModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error("Failed to publish lab report:", err);
    }
  };

  const handleUpdateRecordSubmit = async (e) => {
    e.preventDefault();
    try {
      const checkRes = await fetch("/api/v1/records");
      const records = await checkRes.json();
      const recordsList = Array.isArray(records) ? records : (records.data || []);
      const exists = recordsList.some((r) => r.RecordID === editRecordForm.RecordID);
      
      if (exists) {
        await fetch(`/api/v1/records/${editRecordForm.RecordID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PatientID: editRecordForm.PatientID,
            RecordDate: editRecordForm.RecordDate,
            FinalDiagnosis: editRecordForm.FinalDiagnosis,
            ClinicalNotes: editRecordForm.ClinicalNotes
          })
        });
      } else {
        await fetch("/api/v1/records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            RecordID: editRecordForm.RecordID,
            PatientID: editRecordForm.PatientID || "PAT-001",
            EmployeeID: "E001",
            RecordDate: editRecordForm.RecordDate || new Date().toISOString().split("T")[0],
            ClinicalNotes: editRecordForm.ClinicalNotes,
            FinalDiagnosis: editRecordForm.FinalDiagnosis
          })
        });
      }

      setShowUpdateRecordModal(false);
      loadAllData();
    } catch (err) {
      console.error("Failed to update medical record:", err);
    }
  };

  const handleUpdateSurgerySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/v1/diagnostics/surgeries/${editSurgeryForm.SurgeryID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID: editSurgeryForm.PatientID,
          EmployeeID: editSurgeryForm.EmployeeID,
          SurgeryDate: editSurgeryForm.SurgeryDate,
          SurgeryType: editSurgeryForm.SurgeryType,
          Outcome: editSurgeryForm.Outcome,
          RoomID: editSurgeryForm.RoomID
        })
      });
      if (res.ok) {
        setShowUpdateSurgeryModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error("Failed to update surgery scheduled event:", err);
    }
  };

  const handleUpdateAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      // Normalize patient ID to clean integer for database compatibility
      let cleanPatientId = editAppointmentForm.PatientID;
      if (cleanPatientId !== undefined && cleanPatientId !== null) {
        const strVal = String(cleanPatientId).trim();
        if (strVal.toUpperCase().startsWith("PAT-")) {
          const num = parseInt(strVal.substring(4), 10);
          if (!isNaN(num)) {
            cleanPatientId = num;
          }
        } else {
          const num = parseInt(strVal, 10);
          if (!isNaN(num)) {
            cleanPatientId = num;
          }
        }
      }

      // Format time to HH:MM:SS to match SQL TIME type
      let formattedTime = "00:00:00";
      if (editAppointmentForm.AppointmentTime) {
        const parts = editAppointmentForm.AppointmentTime.split(":");
        if (parts.length === 2) {
          formattedTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:00`;
        } else if (parts.length === 3) {
          formattedTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}:${parts[2].padStart(2, "0")}`;
        } else {
          formattedTime = editAppointmentForm.AppointmentTime;
        }
      }

      const res = await fetch(`/api/v1/appointments/${editAppointmentForm.AppointmentID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          PatientID: cleanPatientId,
          EmployeeID: activeDoctor.EmployeeID,
          AppointmentDate: editAppointmentForm.AppointmentDate,
          AppointmentTime: formattedTime,
          AppointmentStatus: editAppointmentForm.AppointmentStatus,
        })
      });
      if (res.ok) {
        setShowUpdateAppointmentModal(false);
        loadAllData();
      }
    } catch (err) {
      console.error("Failed to update appointment:", err);
    }
  };

  // --- DOCTOR ASSOCIATED ENTITIES FILTERING ---
  const doctorAppointments = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    return appointments.filter(a => String(a.EmployeeID || "").toLowerCase().trim() === docId);
  }, [appointments, activeDoctor]);

  const doctorMedicalRecords = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    return medicalRecords.filter(r => String(r.EmployeeID || "").toLowerCase().trim() === docId);
  }, [medicalRecords, activeDoctor]);

  const doctorLabTests = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    return labTests.filter(t => String(t.EmployeeID || "").toLowerCase().trim() === docId);
  }, [labTests, activeDoctor]);

  const doctorSurgeries = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    return surgeries.filter(s => String(s.EmployeeID || "").toLowerCase().trim() === docId);
  }, [surgeries, activeDoctor]);

  const doctorPrescriptions = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    return prescriptions.filter(p => String(p.EmployeeID || "").toLowerCase().trim() === docId);
  }, [prescriptions, activeDoctor]);

  const doctorLabReports = useMemo(() => {
    const doctorTestIds = new Set(doctorLabTests.map(t => String(t.TestID || "").toLowerCase().trim()));
    return labReports.filter(rep => doctorTestIds.has(String(rep.TestID || "").toLowerCase().trim()));
  }, [labReports, doctorLabTests]);

  const doctorPatients = useMemo(() => {
    if (!activeDoctor || !activeDoctor.EmployeeID) return [];
    const docId = String(activeDoctor.EmployeeID).toLowerCase().trim();
    
    const associatedPatientIds = new Set([
      ...appointments.filter(a => String(a.EmployeeID || "").toLowerCase().trim() === docId).map(a => String(a.PatientID || "").toLowerCase().trim()),
      ...medicalRecords.filter(r => String(r.EmployeeID || "").toLowerCase().trim() === docId).map(r => String(r.PatientID || "").toLowerCase().trim()),
      ...surgeries.filter(s => String(s.EmployeeID || "").toLowerCase().trim() === docId).map(s => String(s.PatientID || "").toLowerCase().trim()),
      ...prescriptions.filter(p => String(p.EmployeeID || "").toLowerCase().trim() === docId).map(p => String(p.PatientID || "").toLowerCase().trim()),
      ...labTests.filter(l => String(l.EmployeeID || "").toLowerCase().trim() === docId).map(l => String(l.PatientID || "").toLowerCase().trim())
    ]);

    return patients.filter(p => associatedPatientIds.has(String(p.PatientID || "").toLowerCase().trim()));
  }, [patients, appointments, medicalRecords, surgeries, prescriptions, labTests, activeDoctor]);

  // --- ENHANCED PATIENT DATA LOOKUP ---
  const enrichedPatients = useMemo(() => {
    return doctorPatients.map(pat => {
      const insurance = insurances.find(ins => ins.InsuranceID === pat.InsuranceID) || null;
      const patientRecords = doctorMedicalRecords.filter(rec => String(rec.PatientID) === String(pat.PatientID));
      const latestClinicalRecord = patientRecords[patientRecords.length - 1] || null;
      
      const patLabs = doctorLabTests.filter(t => String(t.PatientID) === String(pat.PatientID));
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
  }, [doctorPatients, doctorMedicalRecords, doctorLabTests, insurances]);

  // --- FILTERED SELECTIONS ---
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return enrichedPatients;
    const query = searchQuery.toLowerCase();
    return enrichedPatients.filter(
      p => (p.PatientName || "").toLowerCase().includes(query) || 
           String(p.PatientID || "").toLowerCase().includes(query) || 
           String(p.NationalID || "").toLowerCase().includes(query) || 
           (p.condition || "").toLowerCase().includes(query)
    );
  }, [enrichedPatients, searchQuery]);

  const filteredLabTests = useMemo(() => {
    if (!searchQuery) return doctorLabTests;
    const q = searchQuery.toLowerCase();
    return doctorLabTests.filter(lab => {
      const p = patients.find(pat => pat.PatientID === lab.PatientID);
      const pName = p ? (p.PatientName || "").toLowerCase() : "";
      return String(lab.TestID || "").toLowerCase().includes(q) || (lab.TestType || "").toLowerCase().includes(q) || String(lab.PatientID || "").toLowerCase().includes(q) || pName.includes(q);
    });
  }, [doctorLabTests, searchQuery, patients]);

  const filteredSurgeries = useMemo(() => {
    if (!searchQuery) return doctorSurgeries;
    const q = searchQuery.toLowerCase();
    return doctorSurgeries.filter(s => {
      const p = patients.find(pat => pat.PatientID === s.PatientID);
      const pName = p ? (p.PatientName || "").toLowerCase() : "";
      return String(s.SurgeryID || "").toLowerCase().includes(q) || (s.SurgeryType || "").toLowerCase().includes(q) || String(s.PatientID || "").toLowerCase().includes(q) || pName.includes(q);
    });
  }, [doctorSurgeries, searchQuery, patients]);

  const selectedPatientData = useMemo(() => {
    if (!selectedPatientId) return null;
    const basic = enrichedPatients.find(p => String(p.PatientID) === String(selectedPatientId));
    if (!basic) return null;

    const notes = medicalRecords.filter(m => String(m.PatientID || "").trim() === String(selectedPatientId || "").trim());
    const labs = doctorLabTests.map(test => {
      const report = doctorLabReports.find(rep => String(rep.TestID) === String(test.TestID));
      return { ...test, report };
    }).filter(t => String(t.PatientID) === String(selectedPatientId));

    const activeSurgs = doctorSurgeries.map(s => {
      const rm = rooms.find(r => String(r.RoomID) === String(s.RoomID));
      return { ...s, RoomName: rm ? rm.RoomNumber : s.RoomID };
    }).filter(s => String(s.PatientID) === String(selectedPatientId));

    const rxList = doctorPrescriptions.filter(rx => String(rx.PatientID) === String(selectedPatientId)).map(rx => {
      const items = prescriptionItems.filter(item => String(item.PrescriptionID) === String(rx.PrescriptionID)).map(item => {
        const drug = medications.find(m => String(m.MedicationID) === String(item.MedicationID));
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
  }, [selectedPatientId, enrichedPatients, doctorMedicalRecords, doctorLabTests, doctorLabReports, doctorSurgeries, doctorPrescriptions, prescriptionItems, rooms, medications]);

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
    return doctorAppointments.map(appt => {
      const client = patients.find(p => String(p.PatientID) === String(appt.PatientID));
      return { ...appt, PatientName: client ? client.PatientName : "Unknown Patient" };
    }).filter(appt => appt.AppointmentDate === selectedCalendarDate);
  }, [doctorAppointments, selectedCalendarDate, patients]);

  // --- FORM ROW MANIPULATORS ---
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

  const displayDoctorName = activeDoctor ? activeDoctor.EmployeeName : "Loading Clinician...";

  return {
    // Basic layouts
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    displayDoctorName,
    
    // Server collections (doctor-filtered)
    patients: doctorPatients,
    allPatients: patients,
    appointments: doctorAppointments,
    medicalRecords: medicalRecords,
    labTests: doctorLabTests,
    surgeries: doctorSurgeries,
    labReports: doctorLabReports,
    
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
    showUpdateAppointmentModal,
    setShowUpdateAppointmentModal,
    rooms,
    medications,
    
    // Submition handlers
    handleAddAppointment,
    handleUpdateAppointmentSubmit,
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
    setEditSurgeryForm,
    editAppointmentForm,
    setEditAppointmentForm
  };
}
