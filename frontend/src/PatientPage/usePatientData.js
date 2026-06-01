import { useState, useEffect, useMemo } from "react";
import { AddisHospitalApi } from "../DoctorPage/api";
import { INITIAL_MEDICATIONS, INITIAL_ROOMS, INITIAL_INSURANCES } from "../DoctorPage/constants";

/**
 * Custom React Hook that encapsulates state, API interactions, 
 * data transforms, and statistics for the Patient Portal.
 */
export function usePatientData(authenticatedUsername) {
  // --- STATE LAYERS ---
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

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Selected PatientID for simulation (defaults to the first patient, but allows developers to test other profiles)
  const [selectedPatientId, setSelectedPatientId] = useState("PAT-001");
  const [isLoading, setIsLoading] = useState(true);

  // Background Sync Data Loader
  const loadPatientPortalData = async () => {
    setIsLoading(true);
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

      const fetchedBills = await AddisHospitalApi.getBills();
      setBills(fetchedBills);

      const fetchedPayments = await AddisHospitalApi.getPayments();
      setPayments(fetchedPayments);
    } catch (err) {
      console.error("[Patient Hook Load Error]:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPatientPortalData();
  }, []);

  // Set default patient if authenticated username relates to one of the patients in the database
  useEffect(() => {
    if (patients.length > 0) {
      // Map test usernames to specific IDs to create a high-fidelity experience
      // e.g. "test_user" or "tsion" -> "PAT-001"
      const lowerUser = (authenticatedUsername || "").toLowerCase();
      if (lowerUser.includes("nebiyu")) {
        setSelectedPatientId("PAT-002");
      } else if (lowerUser.includes("frehiwot") || lowerUser.includes("frehiw")) {
        setSelectedPatientId("PAT-003");
      } else if (lowerUser.includes("daniel") || lowerUser.includes("danie")) {
        setSelectedPatientId("PAT-004");
      } else {
        setSelectedPatientId("PAT-001"); // Default high fidelity patient profile
      }
    }
  }, [patients, authenticatedUsername]);

  // Derived patient metrics & joined tables
  const currentPatientProfile = useMemo(() => {
    const found = patients.find(p => p.PatientID === selectedPatientId);
    if (!found) {
      // Return a robust default fallback profile to prevent crash during initial load
      return {
        PatientID: "PAT-001",
        PatientName: "Tsion Hailu",
        DOB_DATE: "1994-08-12",
        Gender: "F",
        NationalID: "NAT-100223",
        Phone: "+251 911 234 567",
        HouseNumber: "B-42",
        City: "Addis Ababa",
        Region: "Bole",
        age: 32,
        insurance: {
          ProviderName: "Self Pay / No Insurance Co-pay",
          PolicyNumber: "N/A",
          CoverageDetails: "Out-of-pocket settlement with standard clinical rates"
        }
      };
    }

    // Calculate Age
    const birthYear = new Date(found.DOB_DATE).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear;

    // Join Insurance
    const insurance = INITIAL_INSURANCES.find(ins => ins.InsuranceID === found.InsuranceID) || {
      ProviderName: "Self Pay / No Insurance Co-pay",
      PolicyNumber: "N/A",
      CoverageDetails: "Out-of-pocket settlement with standard clinical rates"
    };

    return {
      ...found,
      age,
      insurance
    };
  }, [patients, selectedPatientId]);

  // Compiled dashboard cards stat indicators
  const stats = useMemo(() => {
    const pId = selectedPatientId || "PAT-001";

    const patientRxIds = prescriptions.filter(rx => rx.PatientID === pId).map(rx => rx.PrescriptionID);
    const medsCount = prescriptionItems.filter(item => patientRxIds.includes(item.PrescriptionID)).length;

    const apptsCount = appointments.filter(appt => appt.PatientID === pId && appt.Status === "Scheduled").length;
    const surgeriesCount = surgeries.filter(s => s.PatientID === pId && s.Outcome === "Pending").length;

    const patientBills = bills.filter(b => b.PatientID === pId);
    const unpaidAmount = patientBills
      .filter(b => b.Status !== "Paid")
      .reduce((sum, b) => sum + (b.TotalAmount - b.PaidAmount), 0);

    return {
      medsCount,
      apptsCount,
      surgeriesCount,
      unpaidAmount
    };
  }, [selectedPatientId, prescriptions, prescriptionItems, appointments, surgeries, bills]);

  // All Join relations for the designated patient
  const selectedPatientData = useMemo(() => {
    const pId = selectedPatientId || "PAT-001";

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
        const rm = INITIAL_ROOMS.find(r => r.RoomID === s.RoomID);
        return { ...s, RoomName: rm ? rm.RoomNumber : s.RoomID };
      })
      .sort((a, b) => new Date(b.SurgeryDate) - new Date(a.SurgeryDate));

    const filterPrescriptions = prescriptions
      .filter(rx => rx.PatientID === pId)
      .map(rx => {
        const items = prescriptionItems.filter(item => item.PrescriptionID === rx.PrescriptionID).map(item => {
          const drug = INITIAL_MEDICATIONS.find(m => m.MedicationID === item.MedicationID);
          return { ...item, drugName: drug ? drug.MedicationName : "Prescribed Formula" };
        });
        return { ...rx, items };
      })
      .sort((a, b) => new Date(b.DateIssued) - new Date(a.DateIssued));

    const filterBills = bills
      .filter(b => b.PatientID === pId)
      .map(b => {
        const billPayments = payments.filter(pay => pay.BillID === b.BillID);
        return { ...b, payments: billPayments };
      })
      .sort((a, b) => new Date(b.BillingDate) - new Date(a.BillingDate));

    return {
      appointments: filterAppts,
      records: filterRecords,
      labs: filterLabs,
      surgeries: filterSurgeries,
      prescriptions: filterPrescriptions,
      bills: filterBills
    };
  }, [selectedPatientId, currentPatientProfile, appointments, medicalRecords, labTests, labReports, surgeries, prescriptions, prescriptionItems, bills, payments]);

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
