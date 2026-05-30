// api.js
// High fidelity client-side database layer with localStorage backing for persistence.
// This allows the clinician to perform CRUD actions locally in their workspace.

const INITIAL_PATIENTS = [
  {
    PatientID: "PAT-001",
    PatientName: "Tsion Hailu",
    DOB_DATE: "1994-08-12",
    Gender: "F",
    NationalID: "NAT-100223",
    Phone: "+251 911 234 567",
    HouseNumber: "B-42",
    City: "Addis Ababa",
    Region: "Bole",
    InsuranceID: "INS-101"
  },
  {
    PatientID: "PAT-002",
    PatientName: "Nebiyu Tesfaye",
    DOB_DATE: "1988-11-03",
    Gender: "M",
    NationalID: "NAT-872341",
    Phone: "+251 911 876 543",
    HouseNumber: "88",
    City: "Addis Ababa",
    Region: "Kirkos",
    InsuranceID: "INS-102"
  },
  {
    PatientID: "PAT-003",
    PatientName: "Frehiwot Lemma",
    DOB_DATE: "2001-02-15",
    Gender: "F",
    NationalID: "NAT-334412",
    Phone: "+251 900 112 233",
    HouseNumber: "A-501",
    City: "Addis Ababa",
    Region: "Yeka",
    InsuranceID: "INS-103"
  },
  {
    PatientID: "PAT-004",
    PatientName: "Daniel Berhane",
    DOB_DATE: "1975-06-25",
    Gender: "M",
    NationalID: "NAT-998877",
    Phone: "+251 912 345 678",
    HouseNumber: "102-M",
    City: "Addis Ababa",
    Region: "Nifas Silk",
    InsuranceID: "INS-101"
  }
];

const INITIAL_APPOINTMENTS = [
  { AppointmentID: "APP-301", PatientID: "PAT-001", EmployeeID: "EMP-042", AppointmentDate: "2026-05-27", AppointmentTime: "09:30", Status: "Scheduled" },
  { AppointmentID: "APP-302", PatientID: "PAT-002", EmployeeID: "EMP-042", AppointmentDate: "2026-05-27", AppointmentTime: "11:00", Status: "Completed" },
  { AppointmentID: "APP-303", PatientID: "PAT-003", EmployeeID: "EMP-042", AppointmentDate: "2026-05-28", AppointmentTime: "14:15", Status: "Scheduled" },
  { AppointmentID: "APP-304", PatientID: "PAT-004", EmployeeID: "EMP-042", AppointmentDate: "2026-05-29", AppointmentTime: "10:00", Status: "Scheduled" }
];

const INITIAL_MEDICAL_RECORDS = [
  { RecordID: "REC-201", PatientID: "PAT-001", RecordDate: "2026-05-15", FinalDiagnosis: "Essential Hypertension", ClinicalNotes: "Blood pressure elevated to 145/95. Heart rate stable. Suggested low sodium diet and metoprolol daily regimen." },
  { RecordID: "REC-202", PatientID: "PAT-002", RecordDate: "2026-05-20", FinalDiagnosis: "Post-op Recovery", ClinicalNotes: "Recovering well from minor cardiac catheterization. Vitals are stable, checking for potential residual fever spike." },
  { RecordID: "REC-203", PatientID: "PAT-003", RecordDate: "2026-05-25", FinalDiagnosis: "Severe Asthma Path", ClinicalNotes: "Assessed moderate expiratory wheezing. Dispensed nebulizer card. Checking lab values for potential systemic inflammation." }
];

const INITIAL_PRESCRIPTIONS = [
  { PrescriptionID: "PRE-801", PatientID: "PAT-001", EmployeeID: "EMP-042", DateIssued: "2026-05-15" },
  { PrescriptionID: "PRE-802", PatientID: "PAT-003", EmployeeID: "EMP-042", DateIssued: "2026-05-25" }
];

const INITIAL_PRESCRIPTION_ITEMS = [
  { ItemID: "PIT-4001", PrescriptionID: "PRE-801", MedicationID: "MED-02", Dosage: "50mg", Duration: "30 Days", Frequency: "Once Daily" },
  { ItemID: "PIT-4002", PrescriptionID: "PRE-802", MedicationID: "MED-05", Dosage: "500mg", Duration: "7 Days", Frequency: "Three Times Daily" }
];

const INITIAL_LAB_TESTS = [
  { TestID: "LAB-501", PatientID: "PAT-001", EmployeeID: "EMP-042", TestType: "Lipid Profile Panel", RequestDate: "2026-05-26", Status: "Completed" },
  { TestID: "LAB-502", PatientID: "PAT-003", EmployeeID: "EMP-042", TestType: "Complete Blood Count (CBC)", RequestDate: "2026-05-27", Status: "Pending" }
];

const INITIAL_LAB_REPORTS = [
  { ReportID: "REP-901", TestID: "LAB-501", ResultSummary: "Total Cholesterol: 210 mg/dL (Borderline High), HDL: 45 mg/dL, LDL: 135 mg/dL.", ReportDate: "2026-05-26", PathologistComments: "Overall mild dyslipidemia. Patient advised weight management and moderate exercise routine before resorting to major statin therapy." }
];

const INITIAL_SURGERIES = [
  { SurgeryID: "SUR-701", PatientID: "PAT-004", EmployeeID: "EMP-042", SurgeryType: "Cardiac Bypass Angioplasty", SurgeryDate: "2026-05-29", RoomID: "RM-201", Outcome: "Pending" }
];

// LocalStorage loaders helper
const load = (key, fallback) => {
  try {
    const value = localStorage.getItem(`addis_hosp_${key}`);
    return value ? JSON.parse(value) : fallback;
  } catch (e) {
    return fallback;
  }
};

const save = (key, data) => {
  try {
    localStorage.setItem(`addis_hosp_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Failed to persist key: ${key}`, e);
  }
};

export const AddisHospitalApi = {
  getPatients: async () => {
    const data = load("patients", INITIAL_PATIENTS);
    save("patients", data);
    return data;
  },

  getAppointments: async () => {
    const data = load("appointments", INITIAL_APPOINTMENTS);
    save("appointments", data);
    return data;
  },

  getMedicalRecords: async () => {
    const data = load("medical_records", INITIAL_MEDICAL_RECORDS);
    save("medical_records", data);
    return data;
  },

  getPrescriptions: async () => {
    const data = load("prescriptions", INITIAL_PRESCRIPTIONS);
    save("prescriptions", data);
    return data;
  },

  getPrescriptionItems: async () => {
    const data = load("prescription_items", INITIAL_PRESCRIPTION_ITEMS);
    save("prescription_items", data);
    return data;
  },

  getLabTests: async () => {
    const data = load("lab_tests", INITIAL_LAB_TESTS);
    save("lab_tests", data);
    return data;
  },

  getLabReports: async () => {
    const data = load("lab_reports", INITIAL_LAB_REPORTS);
    save("lab_reports", data);
    return data;
  },

  getSurgeries: async () => {
    const data = load("surgeries", INITIAL_SURGERIES);
    save("surgeries", data);
    return data;
  },

  createAppointment: async (appt) => {
    const appts = load("appointments", INITIAL_APPOINTMENTS);
    const newId = `APP-${Math.floor(400 + Math.random() * 600)}`;
    const newRecord = { AppointmentID: newId, ...appt };
    appts.push(newRecord);
    save("appointments", appts);
    return newRecord;
  },

  createPrescription: async (patientId, docId, itemsList) => {
    const prescriptions = load("prescriptions", INITIAL_PRESCRIPTIONS);
    const rxId = `PRE-${Math.floor(100 + Math.random() * 900)}`;
    const newRx = {
      PrescriptionID: rxId,
      PatientID: patientId,
      EmployeeID: docId,
      DateIssued: new Date().toISOString().split("T")[0]
    };
    prescriptions.push(newRx);
    save("prescriptions", prescriptions);

    const rxItems = load("prescription_items", INITIAL_PRESCRIPTION_ITEMS);
    const addedItems = itemsList.map((item, index) => {
      const pId = `PIT-${Math.floor(1000 + Math.random() * 9000)}-${index}`;
      const nItem = {
        ItemID: pId,
        PrescriptionID: rxId,
        MedicationID: item.medicationId,
        Dosage: item.dosage,
        Duration: item.duration,
        Frequency: item.frequency
      };
      rxItems.push(nItem);
      return nItem;
    });
    save("prescription_items", rxItems);

    return { prescription: newRx, items: addedItems };
  },

  createLabTest: async (test) => {
    const labs = load("lab_tests", INITIAL_LAB_TESTS);
    const testId = `LAB-${Math.floor(600 + Math.random() * 400)}`;
    const newRecord = { TestID: testId, Status: "Pending", ...test };
    labs.push(newRecord);
    save("lab_tests", labs);
    return newRecord;
  },

  submitLabReport: async (testId, summary, comments) => {
    const reports = load("lab_reports", INITIAL_LAB_REPORTS);
    const reportId = `REP-${Math.floor(100 + Math.random() * 900)}`;
    const newReport = {
      ReportID: reportId,
      TestID: testId,
      ResultSummary: summary,
      ReportDate: new Date().toISOString().split("T")[0],
      PathologistComments: comments
    };
    reports.push(newReport);
    save("lab_reports", reports);

    // Update status in Lab Tests
    const labs = load("lab_tests", INITIAL_LAB_TESTS);
    const updatedLabs = labs.map(t => t.TestID === testId ? { ...t, Status: "Completed" } : t);
    save("lab_tests", updatedLabs);

    return newReport;
  },

  createSurgery: async (surgery) => {
    const surgeries = load("surgeries", INITIAL_SURGERIES);
    const surgeryId = `SUR-${Math.floor(800 + Math.random() * 200)}`;
    const newRecord = { SurgeryID: surgeryId, Outcome: "Pending", ...surgery };
    surgeries.push(newRecord);
    save("surgeries", surgeries);
    return newRecord;
  },

  updateMedicalRecord: async (recordId, updatedData) => {
    const records = load("medical_records", INITIAL_MEDICAL_RECORDS);
    const index = records.findIndex(r => r.RecordID === recordId);
    if (index !== -1) {
      records[index] = { ...records[index], ...updatedData };
    } else {
      const newRecord = { RecordID: recordId, ...updatedData };
      records.push(newRecord);
    }
    save("medical_records", records);
    return records;
  },

  updateSurgery: async (surgeryId, updatedData) => {
    const surgeries = load("surgeries", INITIAL_SURGERIES);
    const index = surgeries.findIndex(s => s.SurgeryID === surgeryId);
    if (index !== -1) {
      surgeries[index] = { ...surgeries[index], ...updatedData };
    }
    save("surgeries", surgeries);
    return surgeries;
  }
};
