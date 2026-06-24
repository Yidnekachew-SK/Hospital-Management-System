import { useState, useEffect, useMemo } from "react";

/**
 * Custom React Hook that encapsulates state, API interactions, 
 * data transforms, and statistics for the Patient Portal.
 */
export function usePatientData(authenticatedUsername) {
  // --- STATE LAYERS FROM DB ---
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [insurances, setInsurances] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [medications, setMedications] = useState([]);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Selected PatientID for simulation (defaults dynamically to the first patient)
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Background Sync Data Loader
  const loadPatientPortalData = async () => {
    setIsLoading(true);
    try {
      const getArray = async (url) => {
        const response = await fetch(url);
        if (!response.ok) return [];
        const json = await response.json();
        
        // Defensive unpacking for wrapping endpoints or raw database tables
        if (Array.isArray(json)) return json;
        if (json && typeof json === "object") {
          if (Array.isArray(json.data)) return json.data;
          if (json.data && typeof json.data === "object") {
            const possibleArrays = Object.values(json.data).filter(v => Array.isArray(v));
            if (possibleArrays.length > 0) return possibleArrays[0];
          }
          if (json.records && Array.isArray(json.records)) return json.records;
          if (json.patients && Array.isArray(json.patients)) return json.patients;
          if (json.appointments && Array.isArray(json.appointments)) return json.appointments;
          if (json.prescriptions && Array.isArray(json.prescriptions)) return json.prescriptions;
          if (json.prescriptionItems && Array.isArray(json.prescriptionItems)) return json.prescriptionItems;
          if (json.labTests && Array.isArray(json.labTests)) return json.labTests;
          if (json.labReports && Array.isArray(json.labReports)) return json.labReports;
          if (json.bills && Array.isArray(json.bills)) return json.bills;
          if (json.payments && Array.isArray(json.payments)) return json.payments;
        }
        return [];
      };

      const [pats, appts, recs, rxs, rxItems, tests, reports, surgs, blls, pays, ins, rms, meds] = await Promise.all([
        getArray("/api/v1/patients/patient"),
        getArray("/api/v1/appointments"),
        getArray("/api/v1/records"),
        getArray("/api/v1/pharmacy/prescriptions"),
        getArray("/api/v1/pharmacy/prescription-items"),
        getArray("/api/v1/diagnostics/lab-tests"),
        getArray("/api/v1/diagnostics/lab-reports"),
        getArray("/api/v1/diagnostics/surgeries"),
        getArray("/api/v1/finance/bills"),
        getArray("/api/v1/finance/payments"),
        getArray("/api/v1/patients/insurance"),
        getArray("/api/v1/clinic/rooms"),
        getArray("/api/v1/pharmacy/medications")
      ]);

      setPatients(pats);
      setAppointments(appts);
      setMedicalRecords(recs);
      setPrescriptions(rxs);
      setPrescriptionItems(rxItems);
      setLabTests(tests);
      setLabReports(reports);
      setSurgeries(surgs);
      setBills(blls);
      setPayments(pays);
      setInsurances(ins);
      setRooms(rms);
      setMedications(meds);

      // Default the selected patient ID dynamically if loaded and not set yet
      if (pats.length > 0 && !selectedPatientId) {
        setSelectedPatientId(pats[0].PatientID);
      }
    } catch (err) {
      console.error("[Patient Hook Load Error]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientPortalData();
  }, []);

  // Set default patient dynamically based on logged in username, querying the live patients list
  useEffect(() => {
    if (patients.length > 0) {
      const lowerUser = (authenticatedUsername || "").toLowerCase().trim();
      if (lowerUser) {
        // 1. First, search for exact match of PatientName (case-insensitive)
        let found = patients.find(p => p.PatientName && p.PatientName.toLowerCase() === lowerUser);
        
        // 2. Substring matching of PatientName
        if (!found) {
          found = patients.find(p => p.PatientName && p.PatientName.toLowerCase().includes(lowerUser));
        }

        // 3. Match against PatientID
        if (!found) {
          found = patients.find(p => p.PatientID && p.PatientID.toLowerCase() === lowerUser);
        }

        if (found) {
          setSelectedPatientId(found.PatientID);
        } else {
          // Dynamic fallback to the first patient in database
          setSelectedPatientId(patients[0].PatientID);
        }
      } else {
        setSelectedPatientId(patients[0].PatientID);
      }
    }
  }, [patients, authenticatedUsername]);

  // Derived patient metrics & joined tables
  const currentPatientProfile = useMemo(() => {
    const found = patients.find(p => p.PatientID === selectedPatientId) || patients[0];
    if (!found) {
      return {
        PatientID: "",
        PatientName: "No Database Profile",
        DOB_DATE: "",
        Gender: "",
        NationalID: "",
        Phone: "",
        HouseNumber: "",
        City: "",
        Region: "",
        age: 0,
        insurance: {
          ProviderName: "Direct Bill",
          PolicyNumber: "N/A",
          CoverageDetails: "Processing live connection..."
        }
      };
    }

    // Calculate Age from Patient data DOB (or standard Year calculation)
    const birthYear = found.DOB_DATE ? new Date(found.DOB_DATE).getFullYear() : 1990;
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Join Insurance dynamically from live collection
    const insurance = insurances.find(ins => ins.InsuranceID === found.InsuranceID) || {
      ProviderName: "Self Pay",
      PolicyNumber: "N/A",
      CoverageDetails: "Direct Billing"
    };

    return {
      ...found,
      age,
      insurance
    };
  }, [patients, selectedPatientId, insurances]);

  // Compiled dashboard cards stat indicators
  const stats = useMemo(() => {
    const pId = selectedPatientId || (patients[0] ? patients[0].PatientID : "");

    const patientRxIds = prescriptions.filter(rx => rx.PatientID === pId).map(rx => rx.PrescriptionID);
    const medsCount = prescriptionItems.filter(item => patientRxIds.includes(item.PrescriptionID)).length;

    const apptsCount = appointments.filter(appt => appt.PatientID === pId && appt.Status === "Scheduled").length;
    const surgeriesCount = surgeries.filter(s => s.PatientID === pId && s.Outcome === "Pending").length;

    const patientBills = bills.filter(b => b.PatientID === pId);
    const unpaidAmount = patientBills
      .filter(b => b.Status !== "Paid")
      .reduce((sum, b) => {
        const billPayments = payments.filter(pay => pay.BillID === b.BillID);
        const paidAmt = b.PaidAmount !== undefined ? b.PaidAmount : billPayments.reduce((s, pay) => s + (pay.AmountPaid || 0), 0);
        return sum + Math.max(0, b.TotalAmount - paidAmt);
      }, 0);

    return {
      medsCount,
      apptsCount,
      surgeriesCount,
      unpaidAmount
    };
  }, [selectedPatientId, patients, prescriptions, prescriptionItems, appointments, surgeries, bills, payments]);

  // All Join relations for the designated patient
  const selectedPatientData = useMemo(() => {
    const pId = selectedPatientId || (patients[0] ? patients[0].PatientID : "");

    const filterAppts = appointments
      .filter(appt => appt.PatientID === pId)
      .sort((a, b) => new Date(b.AppointmentDate) - new Date(a.AppointmentDate));

    const filterRecords = medicalRecords
      .filter(rec => rec.PatientID === pId)
      .sort((a, b) => new Date(b.RecordDate) - new Date(a.RecordDate));

    const filterLabs = labTests
      .filter(test => test.PatientID === pId)
      .map(test => {
        const report = labReports.find(rep => rep.TestID === test.TestID);
        return { ...test, report };
      })
      .sort((a, b) => new Date(b.RequestDate) - new Date(a.RequestDate));

    const filterSurgeries = surgeries
      .filter(s => s.PatientID === pId)
      .map(s => {
        const rm = rooms.find(r => r.RoomID === s.RoomID);
        return { ...s, RoomName: rm ? rm.RoomNumber : s.RoomID };
      })
      .sort((a, b) => new Date(b.SurgeryDate) - new Date(a.SurgeryDate));

    const filterPrescriptions = prescriptions
      .filter(rx => rx.PatientID === pId)
      .map(rx => {
        const items = prescriptionItems.filter(item => item.PrescriptionID === rx.PrescriptionID).map(item => {
          const drug = medications.find(m => m.MedicationID === item.MedicationID);
          return { ...item, drugName: drug ? drug.MedicationName : "Prescribed Formula" };
        });
        return { ...rx, items };
      })
      .sort((a, b) => new Date(b.DateIssued) - new Date(a.DateIssued));

    const filterBills = bills
      .filter(b => b.PatientID === pId)
      .map(b => {
        const billPayments = payments.filter(pay => pay.BillID === b.BillID);
        const paidAmt = b.PaidAmount !== undefined ? b.PaidAmount : billPayments.reduce((s, pay) => s + (pay.AmountPaid || 0), 0);
        const fallbackDate = new Date().toISOString().split("T")[0];
        return {
          ...b,
          payments: billPayments,
          PaidAmount: paidAmt,
          BillingDate: b.BillingDate || b.BillDate || fallbackDate,
          Description: b.Description || `Medical Invoice ${b.BillID || ""}`
        };
      })
      .sort((a, b) => new Date(b.BillingDate || b.BillDate || new Date().toISOString().split("T")[0]) - new Date(a.BillingDate || a.BillDate || new Date().toISOString().split("T")[0]));

    return {
      appointments: filterAppts,
      records: filterRecords,
      labs: filterLabs,
      surgeries: filterSurgeries,
      prescriptions: filterPrescriptions,
      bills: filterBills
    };
  }, [selectedPatientId, currentPatientProfile, appointments, medicalRecords, labTests, labReports, surgeries, prescriptions, prescriptionItems, bills, payments, rooms, medications]);

  return {
    activeTab,
    setActiveTab,
    patients,
    selectedPatientId,
    setSelectedPatientId,
    currentPatientProfile,
    stats,
    data: selectedPatientData,
    isLoading
  };
}
