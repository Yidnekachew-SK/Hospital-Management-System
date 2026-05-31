export const INITIAL_INSURANCES = [
  { InsuranceID: "INS-101", ProviderName: "BlueCross BlueShield", PolicyNumber: "BC-889-1029", CoverageDetails: "Premium PPO - 90% outpatient coverage, full diagnostic imaging" },
  { InsuranceID: "INS-102", ProviderName: "Aetna", PolicyNumber: "AE-201-9923", CoverageDetails: "Standard HMO - Co-pay $25, requires specialist referrals" },
  { InsuranceID: "INS-103", ProviderName: "Cigna Health", PolicyNumber: "CI-541-6651", CoverageDetails: "Global Platinum - 100% inpatient cover, $0 deductible" }
];

export const INITIAL_ROOMS = [
  { RoomID: "RM-301", WardID: "WD-01", RoomNumber: "301-A", RoomType: "ICU", MaxCapacity: 2, CurrentOccupancy: 1 },
  { RoomID: "RM-302", WardID: "WD-01", RoomNumber: "302", RoomType: "Private", MaxCapacity: 1, CurrentOccupancy: 0 },
  { RoomID: "RM-104", WardID: "WD-03", RoomNumber: "104-B", RoomType: "General", MaxCapacity: 4, CurrentOccupancy: 3 },
  { RoomID: "RM-201", WardID: "WD-04", RoomNumber: "OR-1", RoomType: "Private", MaxCapacity: 1, CurrentOccupancy: 1 }
];

export const INITIAL_MEDICATIONS = [
  { MedicationID: "MED-01", MedicationName: "Lisinopril", MedicationType: "ACE Inhibitor" },
  { MedicationID: "MED-02", MedicationName: "Metoprolol", MedicationType: "Beta-Blocker" },
  { MedicationID: "MED-03", MedicationName: "Atorvastatin", MedicationType: "Lipid-Lowering Agent" },
  { MedicationID: "MED-04", MedicationName: "Warfarin", MedicationType: "Anticoagulant" },
  { MedicationID: "MED-05", MedicationName: "Amoxicillin", MedicationType: "Antibiotic" }
];

export const STAGED_DOCTOR = {
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
