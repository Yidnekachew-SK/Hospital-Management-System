import { useState, useMemo, useEffect } from "react";
import { AddisHospitalApi } from "./api";
import { 
  INITIAL_INSURANCES, 
  INITIAL_ROOMS, 
  INITIAL_MEDICATIONS, 
  STAGED_DOCTOR 
} from "./constants";
import { generateCalendarDays, MONTH_NAMES } from "./calendarHelper";

/**
 * Custom React Hook that encapsulates state, API interactions, 
 * data transforms, filtering, and form handlers for the Doctor Portal.
 */
export function useDoctorData() {
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
      p => p.PatientName.toLowerCase().includes(query) || 
           p.PatientID.toLowerCase().includes(query) || 
           p.NationalID.includes(query) || 
           p.condition.toLowerCase().includes(query)
    );
  }, [enrichedPatients, searchQuery]);

  const filteredLabTests = useMemo(() => {
    if (!searchQuery) return labTests;
    const q = searchQuery.toLowerCase();
    return labTests.filter(lab => {
      const pat = patients.find(p => p.PatientID === lab.PatientID);
      return lab.TestID.toLowerCase().includes(q) || 
             lab.TestType.toLowerCase().includes(q) || 
             (pat && pat.PatientName.toLowerCase().includes(q)) || 
             lab.PatientID.toLowerCase().includes(q);
    });
  }, [labTests, searchQuery, patients]);

  const filteredSurgeries = useMemo(() => {
    if (!searchQuery) return surgeries;
    const q = searchQuery.toLowerCase();
    return surgeries.filter(s => {
      const pat = patients.find(p => p.PatientID === s.PatientID);
      return s.SurgeryID.toLowerCase().includes(q) || 
             s.SurgeryType.toLowerCase().includes(q) || 
             (pat && pat.PatientName.toLowerCase().includes(q)) || 
             s.PatientID.toLowerCase().includes(q);
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

  return {
    // Basic layouts
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    displayDoctorName,
    
    // Server collections
    patients,
    appointments,
    medicalRecords,
    labTests,
    surgeries,
    labReports,
    
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
    
    // Submition handlers
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
