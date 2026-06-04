CREATE DATABASE IF NOT EXISTS  hospital_management;
USE hospital_management;

CREATE TABLE Departments (
  DeptID int AUTO_INCREMENT,
  DeptName varchar(30) NOT NULL,
  Building varchar(30) NOT NULL,
  PRIMARY KEY (DeptID)
);

CREATE TABLE Wards (
  WardID int AUTO_INCREMENT,
  WardName varchar(30) NOT NULL,
  DeptID int NOT NULL,
  Capacity int NOT NULL,
  PRIMARY KEY (WardID),
  CONSTRAINT fk_ward_dept FOREIGN KEY (DeptID) REFERENCES Departments (DeptID)
);

CREATE TABLE Rooms (
  RoomID int AUTO_INCREMENT,
  WardID int NOT NULL,
  RoomNumber varchar(10) NOT NULL,
  RoomType varchar(20) NOT NULL,
  MaxCapacity int NOT NULL,
  CurrentOccupancy int DEFAULT 0,
  PRIMARY KEY (RoomID),
  CONSTRAINT fk_room_ward FOREIGN KEY (WardID) REFERENCES Wards (WardID)
);

CREATE TABLE Employees (
  EmployeeID varchar(10),
  NationalID varchar(16) NOT NULL,
  EmployeeName varchar(50) NOT NULL,
  Gender char(1) NOT NULL,
  Phone char(12) NOT NULL,
  Email varchar(50) DEFAULT NULL,
  Address varchar(100) NOT NULL,
  DeptID int DEFAULT NULL,
  Salary decimal(5,0) NOT NULL,
  PRIMARY KEY (EmployeeID),
  UNIQUE KEY NationalID_Email (NationalID,Email),
  CONSTRAINT fk_employee_dept FOREIGN KEY (DeptID) REFERENCES Departments (DeptID),
  CONSTRAINT chk_employee_salary CHECK (Salary >= 0),
  CONSTRAINT chk_employee_gender CHECK (Gender IN ('M','F'))
);

CREATE TABLE Insurance (
  InsuranceID int AUTO_INCREMENT,
  ProviderName varchar(100) NOT NULL,
  PolicyNumber varchar(50) NOT NULL,
  CoverageDetails text,
  PRIMARY KEY (InsuranceID),
  UNIQUE KEY PolicyNumber (PolicyNumber)
);

CREATE TABLE Patients (
  PatientID int AUTO_INCREMENT,
  NationalID varchar(16) DEFAULT NULL,
  PatientName varchar(50) NOT NULL,
  DOB_DATE date NOT NULL,
  Gender char(1) NOT NULL,
  Region varchar(50),
  City varchar(50),
  HouseNumber varchar(10),
  Phone varchar(12) NOT NULL,
  InsuranceID int DEFAULT NULL,
  PRIMARY KEY (PatientID),
  UNIQUE KEY Patient_NationalID (NationalID),
  CONSTRAINT fk_patient_insurance FOREIGN KEY (InsuranceID) REFERENCES Insurance (InsuranceID),
  CONSTRAINT chk_patient_gender CHECK (Gender IN ('M','F'))
);

CREATE TABLE Doctors (
  EmployeeID varchar(10) NOT NULL,
  Specialty varchar(50) NOT NULL,
  LicenseNumber varchar(15) NOT NULL,
  PRIMARY KEY (EmployeeID),
  CONSTRAINT fk_doctor_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID)
);

CREATE TABLE Nurses (
  EmployeeID varchar(10) NOT NULL,
  Certification varchar(15) NOT NULL,
  AssignedWard int NOT NULL,
  PRIMARY KEY (EmployeeID),
  CONSTRAINT fk_nurse_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID),
  CONSTRAINT fk_nurse_ward FOREIGN KEY (AssignedWard) REFERENCES Wards (WardID)
);

CREATE TABLE Staff (
  EmployeeID varchar(10) NOT NULL,
  StaffRole varchar(20) NOT NULL,
  PRIMARY KEY (EmployeeID),
  CONSTRAINT fk_staff_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID)
);

CREATE TABLE Appointments (
  AppointmentID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  AppointmentDate date NOT NULL,
  AppointmentTime time NOT NULL,
  AppointmentStatus varchar(20) DEFAULT NULL,
  PRIMARY KEY (AppointmentID),
  UNIQUE KEY Patient_Doctor_DateTime (PatientID,EmployeeID,AppointmentDate,AppointmentTime),
  CONSTRAINT fk_appointment_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_appointment_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE Admissions (
  AdmissionID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  RoomID int NOT NULL,
  AdmissionDate date NOT NULL,
  DischargeDate date DEFAULT NULL,
  PrimaryDiagnosis varchar(200) DEFAULT NULL,
  PRIMARY KEY (AdmissionID),
  UNIQUE KEY Patient_Room_Date (PatientID,RoomID,AdmissionDate),
  CONSTRAINT fk_admission_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID),
  CONSTRAINT fk_admission_room FOREIGN KEY (RoomID) REFERENCES Rooms (RoomID)
);

CREATE TABLE MedicalRecords (
  RecordID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  RecordDate date NOT NULL,
  ClinicalNotes text,
  FinalDiagnosis varchar(200) DEFAULT NULL,
  PRIMARY KEY (RecordID),
  UNIQUE KEY Patient_Doctor_Date (PatientID,EmployeeID,RecordDate),
  CONSTRAINT fk_medRecord_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_medRecord_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE Medications (
  MedicationID int AUTO_INCREMENT,
  MedicationName varchar(50) NOT NULL,
  MedicationType varchar(50) NOT NULL,
  StockQuantity int NOT NULL,
  UnitPrice decimal(7,2) NOT NULL,
  PRIMARY KEY (MedicationID)
);

CREATE TABLE Prescriptions (
  PrescriptionID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  DateIssued date NOT NULL,
  PRIMARY KEY (PrescriptionID),
  UNIQUE KEY Patient_Doctor_DateIssued (PatientID,EmployeeID,DateIssued),
  CONSTRAINT fk_prescription_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_prescription_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE PrescriptionItems (
  ItemID int AUTO_INCREMENT,
  PrescriptionID int NOT NULL,
  MedicationID int NOT NULL,
  Dosage varchar(50) NOT NULL,
  Duration varchar(50) NOT NULL,
  Frequency varchar(50) NOT NULL,
  PRIMARY KEY (ItemID),
  UNIQUE (PrescriptionID, MedicationID),
  CONSTRAINT fk_prescriptItem_medication FOREIGN KEY (MedicationID) REFERENCES Medications (MedicationID),
  CONSTRAINT fk_prescriptItem_prescription FOREIGN KEY (PrescriptionID) REFERENCES Prescriptions (PrescriptionID)
);

CREATE TABLE LabTests (
  TestID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  TestType varchar(100) NOT NULL,
  RequestDate date NOT NULL,
  PRIMARY KEY (TestID),
  UNIQUE KEY Patient_Doctor_Test_Date (PatientID,EmployeeID,TestType,RequestDate),
  CONSTRAINT fk_LabTest_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_LabTest_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE LabReports (
  ReportID int NOT NULL AUTO_INCREMENT,
  TestID int NOT NULL,
  ResultSummary text NOT NULL,
  ReportDate date NOT NULL,
  PathologistComments text,
  PRIMARY KEY (ReportID),
  UNIQUE KEY Unique_Test_Report (TestID),
  CONSTRAINT fk_labReport_labTest FOREIGN KEY (TestID) REFERENCES LabTests (TestID)
);

CREATE TABLE Surgeries (
  SurgeryID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  RoomID int NOT NULL,
  SurgeryDate date NOT NULL,
  SurgeryType varchar(100) NOT NULL,
  Outcome varchar(200) DEFAULT NULL,
  PRIMARY KEY (SurgeryID),
  UNIQUE (PatientID, EmployeeID, SurgeryDate, SurgeryType),
  CONSTRAINT fk_surgery_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_surgery_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID),
  CONSTRAINT fk_surgery_room FOREIGN KEY (RoomID) REFERENCES Rooms (RoomID)
);

CREATE TABLE Billing (
  BillID int NOT NULL AUTO_INCREMENT,
  PatientID int NOT NULL,
  TotalAmount decimal(10,2) NOT NULL,
  InsuranceCoverageAmount decimal(10,2) DEFAULT NULL,
  BillDate date NOT NULL,
  Status varchar(20) DEFAULT NULL,
  PRIMARY KEY (BillID),
  CONSTRAINT fk_billing_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE Payments (
  PaymentID int AUTO_INCREMENT,
  BillID int NOT NULL,
  PaymentDate date NOT NULL,
  AmountPaid decimal(10,2) NOT NULL,
  PaymentMethod varchar(50) NOT NULL,
  PRIMARY KEY (PaymentID),
  UNIQUE (BillID, PaymentDate),
  CONSTRAINT fk_payment_billing FOREIGN KEY (BillID) REFERENCES Billing (BillID)
);

CREATE TABLE SalaryPayments (
  SalaryID int AUTO_INCREMENT,
  EmployeeID varchar(10) NOT NULL,
  BaseAmount decimal(5,0) NOT NULL,
  Bonus decimal(4,0) DEFAULT NULL,
  Deductions decimal(4,0) DEFAULT NULL,
  PayDate date NOT NULL,
  PRIMARY KEY (SalaryID),
  UNIQUE SalaryPayment(EmployeeID, PayDate),
  CONSTRAINT fk_salaryPay_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID)
);

CREATE TABLE ShiftSchedules (
  ScheduleID int AUTO_INCREMENT,
  EmployeeID varchar(10) NOT NULL,
  ShiftDate date NOT NULL,
  ShiftStartTime time NOT NULL,
  ShiftEndTime time NOT NULL,
  ShiftStatus varchar(20) DEFAULT NULL,
  PRIMARY KEY (ScheduleID),
  UNIQUE Shift_Schedule (EmployeeID, ShiftDate, ShiftStartTime),
  CONSTRAINT fk_shift_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID)
);

CREATE TABLE Suppliers (
  SupplierID int AUTO_INCREMENT,
  SupplierName varchar(100) NOT NULL,
  ContactPerson varchar(100) DEFAULT NULL,
  Phone char(12) DEFAULT NULL,
  Address varchar(200) DEFAULT NULL,
  PRIMARY KEY (SupplierID)
);

CREATE TABLE Inventory (
  ItemID int AUTO_INCREMENT,
  ItemName varchar(30) NOT NULL,
  Category varchar(30) NOT NULL,
  Quantity int NOT NULL,
  ReorderLevel int NOT NULL,
  SupplierID int NOT NULL,
  PRIMARY KEY (ItemID),
  UNIQUE Inventory_Item (ItemName, SupplierID),
  CONSTRAINT fk_inventory_supplier FOREIGN KEY (SupplierID) REFERENCES Suppliers (SupplierID)
);

CREATE TABLE EmergencyCases (
  CaseID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  EmployeeID varchar(10) NOT NULL,
  AdmissionID int DEFAULT NULL,
  AdmissionTime datetime NOT NULL,
  SeverityLevel varchar(20) NOT NULL,
  Outcome varchar(100) DEFAULT NULL,
  PRIMARY KEY (CaseID),
  UNIQUE Emergency_Case (PatientID, AdmissionTime),
  CONSTRAINT fk_emergency_admission FOREIGN KEY (AdmissionID) REFERENCES Admissions (AdmissionID),
  CONSTRAINT fk_emergency_doctor FOREIGN KEY (EmployeeID) REFERENCES Doctors (EmployeeID),
  CONSTRAINT fk_emergency_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE Visitors (
  VisitorID int AUTO_INCREMENT,
  PatientID int NOT NULL,
  VisitorName varchar(50) NOT NULL,
  RelationToPatient varchar(50) DEFAULT NULL,
  VisitDate date NOT NULL,
  PRIMARY KEY (VisitorID),
  UNIQUE KEY Patient_Visitor (PatientID,VisitorName,VisitDate),
  CONSTRAINT fk_visitor_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID)
);

CREATE TABLE UserAccounts (
  UserID int AUTO_INCREMENT,
  EmployeeID varchar(10) NULL,
  PatientID int NULL,
  Username varchar(50) NOT NULL,
  PasswordHash varchar(50) NOT NULL,
  UserRole varchar(30) NOT NULL,
  PRIMARY KEY (UserID),
  UNIQUE KEY Username (Username),
  CONSTRAINT fk_user_employee FOREIGN KEY (EmployeeID) REFERENCES Employees (EmployeeID),
  CONSTRAINT fk_user_patient FOREIGN KEY (PatientID) REFERENCES Patients (PatientID),
  CONSTRAINT chk_user CHECK (
        (EmployeeID IS NOT NULL AND PatientID IS NULL) OR
        (PatientID IS NOT NULL AND EmployeeID IS NULL)
    )
);

CREATE TABLE logs (
  LogID int NOT NULL AUTO_INCREMENT,
  TableName varchar(20) NOT NULL,
  RecordID int NOT NULL,
  ActionType varchar(20) NOT NULL,
  ActionDate datetime NOT NULL,
  UserID int NOT NULL,
  Description text,
  PRIMARY KEY (LogID),
  CONSTRAINT fk_log_user FOREIGN KEY (UserID) REFERENCES UserAccounts (UserID)
);

CREATE TABLE ActivityLog (
  ActivityID int AUTO_INCREMENT,
  UserID int NOT NULL,
  LoginTime datetime NOT NULL,
  LogoutTime datetime DEFAULT NULL,
  PRIMARY KEY (ActivityID),
  CONSTRAINT fk_activityLog_user FOREIGN KEY (UserID) REFERENCES UserAccounts (UserID)
  );

## creating roles and access control
CREATE ROLE IF NOT EXISTS doctor;
CREATE ROLE IF NOT EXISTS nurse;
CREATE ROLE IF NOT EXISTS patient;
CREATE ROLE IF NOT EXISTS admin;
CREATE ROLE IF NOT EXISTS staff;

GRANT SELECT ON hospital_management.Patients TO doctor;
GRANT SELECT, INSERT, UPDATE ON hospital_management.MedicalRecords TO doctor;
GRANT SELECT, INSERT, UPDATE, DELETE ON hospital_management.Appointments TO doctor;
GRANT SELECT, INSERT, UPDATE ON hospital_management.LabTests TO doctor;
GRANT SELECT, INSERT, UPDATE ON hospital_management.LabReports TO doctor;

GRANT SELECT ON hospital_management.Patients TO nurse;
GRANT SELECT ON hospital_management.MedicalRecords TO nurse;
GRANT SELECT ON hospital_management.ShiftSchedules TO nurse;
GRANT SELECT ON hospital_management.PrescriptionItems TO nurse;

GRANT SELECT ON hospital_management.PrescriptionItems TO patient;
GRANT SELECT ON hospital_management.Billing TO patient;
GRANT SELECT ON hospital_management.Appointments TO patient;

GRANT ALL PRIVILEGES ON hospital_management.* TO admin;
