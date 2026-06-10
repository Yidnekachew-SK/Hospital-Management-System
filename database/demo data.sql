use hospital_management;

-- 1. Departments
INSERT INTO Departments (DeptName, Building) VALUES
('Cardiology','Building A'),
('Neurology','Building B'),
('Pediatrics','Building C'),
('Orthopedics','Building D');

-- 2. Wards
INSERT INTO Wards (WardName, DeptID, Capacity) VALUES
('Cardio Ward 1',1,20),('Cardio Ward 2',1,25),
('Neuro Ward 1',2,15),('Neuro Ward 2',2,18),
('Ortho Ward 1',4,22),('Ortho Ward 2',4,24);

-- 3. Rooms
-- Rooms (6 total, occupancy matches Admissions)
INSERT INTO Rooms (WardID, RoomNumber, RoomType, MaxCapacity, CurrentOccupancy) VALUES
(1,'C101','ICU',2,1), (2,'C201','General',3,1),
(3,'N101','General',3,1), (4,'N201','General',3,1),
(5,'P101','General',3,1), (6,'P201','General',3,1);


-- 4. Employees (Doctors, Nurses, Staff)
INSERT INTO Employees (EmployeeID, NationalID, EmployeeName, Gender, Phone, Email, Address, DeptID, Salary) VALUES
('E001','NID001','Dr. John Smith','M','0911111111','john@hospital.com','Addis Ababa',1,5000),
('E002','NID002','Dr. Sarah Lee','F','0911111112','sarah@hospital.com','Addis Ababa',2,5200),
('E003','NID003','Dr. Ahmed Musa','M','0911111113','ahmed@hospital.com','Addis Ababa',3,5100),
('E004','NID004','Dr. Maria Gomez','F','0911111114','maria@hospital.com','Addis Ababa',4,5300),
('E005','NID005','Nurse Helen','F','0911111115','helen@hospital.com','Addis Ababa',1,3000),
('E006','NID006','Nurse Daniel','M','0911111116','daniel@hospital.com','Addis Ababa',2,3100),
('E007','NID007','Nurse Amina','F','0911111117','amina@hospital.com','Addis Ababa',3,3200),
('E008','NID008','Staff Michael','M','0911111118','michael@hospital.com','Addis Ababa',1,2500),
('E009','NID009','Staff Ruth','F','0911111119','ruth@hospital.com','Addis Ababa',2,2600),
('E010','NID010','Staff Samuel','M','0911111120','samuel@hospital.com','Addis Ababa',3,2700),
('E011','NID011','Staff Lily','F','0911111121','lily@hospital.com','Addis Ababa',4,2800);

-- Doctors
INSERT INTO Doctors VALUES
('E001','Cardiology','LIC001'),
('E002','Neurology','LIC002'),
('E003','Pediatrics','LIC003'),
('E004','Orthopedics','LIC004');

-- Nurses
INSERT INTO Nurses VALUES
('E005','CertA',1),
('E006','CertB',3),
('E007','CertC',5);

-- Staff
INSERT INTO Staff VALUES
('E008','Receptionist'),
('E009','Cleaner'),
('E010','Technician'),
('E011','Admin');

-- ShiftSchedules
INSERT INTO ShiftSchedules (EmployeeID, ShiftDate, ShiftStartTime, ShiftEndTime, ShiftStatus) VALUES
('E005','2026-06-01','08:00:00','16:00:00','Active'),
('E006','2026-06-01','08:00:00','16:00:00','Active'),
('E007','2026-06-01','16:00:00','00:00:00','Active'),
('E008','2026-06-01','08:00:00','16:00:00','Active');

-- 5. Insurance
INSERT INTO Insurance (ProviderName, PolicyNumber, CoverageDetails) VALUES
('EthioHealth','POL001','Full coverage'),
('GlobalCare','POL002','Partial coverage');

-- 6. Patients
INSERT INTO Patients (NationalID, PatientName, DOB_DATE, Gender, Region, City, HouseNumber, Phone, InsuranceID) VALUES
('P001','Alice','1990-01-01','F','Addis','Addis','12','0922222221',1),
('P002','Bob','1985-02-02','M','Addis','Addis','34','0922222222',2),
('P003','Charlie','2000-03-03','M','Addis','Addis','56','0922222223',1),
('P004','Diana','1995-04-04','F','Addis','Addis','78','0922222224',2),
('P005','Ethan','1988-05-05','M','Addis','Addis','90','0922222225',1),
('P006','Fatima','1992-06-06','F','Addis','Addis','11','0922222226',2),
('P007','George','1987-07-07','M','Addis','Addis','22','0922222227',1),
('P008','Hana','1993-08-08','F','Addis','Addis','33','0922222228',2);

-- Admissions
INSERT INTO Admissions (PatientID, RoomID, AdmissionDate, DischargeDate, PrimaryDiagnosis) VALUES
(1,1,'2026-05-20','2026-05-25','Heart Disease'),
(2,2,'2026-05-21','2026-05-26','Stroke'),
(3,3,'2026-05-22','2026-05-27','Flu'),
(4,4,'2026-05-23','2026-05-28','Fracture'),
(5,5,'2026-05-24','2026-05-29','Asthma'),
(6,6,'2026-05-25','2026-05-30','Diabetes');

-- EmergencyCases
INSERT INTO EmergencyCases (PatientID, EmployeeID, AdmissionID, AdmissionTime, SeverityLevel, Outcome) VALUES
(7,'E001',NULL,'2026-05-30 10:00:00','Critical','Recovered'),
(8,'E002',NULL,'2026-05-31 12:00:00','Severe','Ongoing');

-- Appointments
INSERT INTO Appointments (PatientID, EmployeeID, AppointmentDate, AppointmentTime, AppointmentStatus) VALUES
(1,'E001','2026-06-01','09:00:00','Completed'),
(2,'E002','2026-06-01','10:00:00','Completed'),
(3,'E003','2026-06-01','11:00:00','Pending'),
(4,'E004','2026-06-01','12:00:00','Completed'),
(5,'E001','2026-06-02','09:00:00','Pending');

-- MedicalRecords
INSERT INTO MedicalRecords (PatientID, EmployeeID, RecordDate, ClinicalNotes, FinalDiagnosis) VALUES
(1,'E001','2026-05-20','Chest pain','Heart Disease'),
(2,'E002','2026-05-21','Headache','Stroke'),
(3,'E003','2026-05-22','Fever and cough','Flu'),
(4,'E004','2026-05-23','Broken leg','Fracture'),
(5,'E001','2026-05-24','Shortness of breath','Asthma'),
(6,'E002','2026-05-25','High blood sugar','Diabetes'),
(7,'E003','2026-05-26','Chest pain','Angina'),
(8,'E004','2026-05-27','Joint pain','Arthritis');

-- Surgeries
INSERT INTO Surgeries (PatientID, EmployeeID, RoomID, SurgeryDate, SurgeryType, Outcome) VALUES
(4,'E004',3,'2026-05-28','Bone Repair','Successful');

-- Medications
INSERT INTO Medications (MedicationName, MedicationType, StockQuantity, UnitPrice) VALUES
('Aspirin','Tablet',100,2.50),
('Insulin','Injection',50,15.00),
('Amoxicillin','Capsule',200,1.20),
('Paracetamol','Tablet',150,0.80);

-- Prescriptions
INSERT INTO Prescriptions (PatientID, EmployeeID, DateIssued) VALUES
(1,'E001','2026-05-20'),
(2,'E002','2026-05-21'),
(3,'E003','2026-05-22');

-- PrescriptionItems
INSERT INTO PrescriptionItems (PrescriptionID, MedicationID, Dosage, Duration, Frequency) VALUES
(1,1,'100mg','5 days','Twice daily'),
(2,2,'10 units','7 days','Daily'),
(3,3,'250mg','10 days','Three times daily');

-- LabTests
INSERT INTO LabTests (PatientID, EmployeeID, TestType, RequestDate) VALUES
(1,'E001','Blood Test','2026-05-20'),
(2,'E002','MRI Scan','2026-05-21'),
(3,'E003','X-Ray','2026-05-22');

-- LabReports
INSERT INTO LabReports (TestID, ResultSummary, ReportDate, PathologistComments) VALUES
(1,'Normal blood count','2026-05-21','No issues detected'),
(2,'Signs of stroke','2026-05-22','Immediate treatment required');

-- Billing
INSERT INTO Billing (PatientID, TotalAmount, InsuranceCoverageAmount, BillDate, Status) VALUES
(1,500.00,300.00,'2026-05-25','Paid'),
(2,700.00,400.00,'2026-05-26','Paid'),
(3,200.00,100.00,'2026-05-27','Pending'),
(4,1000.00,600.00,'2026-05-28','Paid'),
(5,300.00,150.00,'2026-05-29','Pending'),
(6,400.00,200.00,'2026-05-30','Paid');

-- Payments
INSERT INTO Payments (BillID, PaymentDate, AmountPaid, PaymentMethod) VALUES
(1,'2026-05-25',200.00,'Cash'),
(2,'2026-05-26',300.00,'Card'),
(4,'2026-05-28',400.00,'Cash'),
(6,'2026-05-30',200.00,'Card');

-- SalaryPayments
INSERT INTO SalaryPayments (EmployeeID, BaseAmount, Bonus, Deductions, PayDate) VALUES
('E001',5000,500,100,'2026-05-31'),
('E002',5200,400,200,'2026-05-31'),
('E003',5100,300,150,'2026-05-31'),
('E004',5300,600,100,'2026-05-31'),
('E005',3000,200,50,'2026-05-31'),
('E006',3100,250,100,'2026-05-31');

-- Suppliers
INSERT INTO Suppliers (SupplierName, ContactPerson, Phone, Address) VALUES
('MedSupply','Jonas','0933333331','Addis Ababa'),
('PharmaPlus','Selam','0933333332','Addis Ababa'),
('HealthEquip','Kebede','0933333333','Addis Ababa');

-- Inventory
INSERT INTO Inventory (ItemName, Category, Quantity, ReorderLevel, SupplierID) VALUES
('Syringe','Equipment',100,20,1),
('Gloves','Consumable',200,50,2),
('Stethoscope','Equipment',20,5,3),
('Bandage','Consumable',150,30,2),
('Thermometer','Equipment',30,10,1);

-- Visitors
INSERT INTO Visitors (PatientID, VisitorName, RelationToPatient, VisitDate) VALUES
(1,'Mulu','Mother','2026-05-21'),
(2,'Kassa','Brother','2026-05-22'),
(3,'Sara','Friend','2026-05-23');

-- UserAccounts
INSERT INTO UserAccounts (EmployeeID, PatientID, Username, PasswordHash, UserRole) VALUES
('E001','null','johnsmith','$2b$10$E0qhfStFVhD2.7NK1PU/XuWMccTz8NUYDoHlmlI1ArMVBEQMzM1be','Doctor'),
('E002','null','sarahlee','$2b$10$1eVPmNI8rssSjAd.mfKbVu.cgXqSpaWw4OyMmqpcQRQ0u4bmlCPJK','Doctor'),
('E005','null','helen','$2b$10$58rSt.gW0O6jXHbhjnJo..SYHU/L9Gkh958ZC.KE7aBN5V5VPUWki','Nurse'),
('E006','null','daniel','$2b$10$xXObWyUZlRkhaEnKDNODYeVOwqsIhjmCtAcjmzMwa9lwPOtSjQIgm','Nurse'),
('E008','null','michael','$2b$10$att905d.M.DwoGNJgW3DoOuyZZc2wWg0i9ww263rFVbRjOZaQ3cQ2','Staff'),
('E009','null','ruth','$2b$10$ZqTde2ZmTecAtcxN9X0E0OFW0.SaTmVkYfauBbXs5m2veCU3BjVHe','Staff'),
('null', 1, 'alice', '$2b$10$4fVYGBGlI3Mdgu9akcR4WuZk5bst6IItCi6wS9R7oYxXTsDwi5zxy', 'patient'),
('null', 3, 'charlie', '$2b$10$HxEiiy3mtWOtUgAp72ku7.RlRJFOvwlYT6J7erMH3uGP0TEDpM7Su', 'patient');

-- Logs
INSERT INTO logs (TableName, RecordID, ActionType, ActionDate, UserID, Description) VALUES
('Patients',1,'INSERT','2026-05-20 09:00:00',1,'New patient added'),
('Appointments',1,'UPDATE','2026-05-21 10:00:00',2,'Appointment status updated'),
('Billing',1,'DELETE','2026-05-22 11:00:00',3,'Billing record removed');

-- ActivityLog
INSERT INTO ActivityLog (UserID, LoginTime, LogoutTime) VALUES
(1,'2026-05-20 08:03:00','2026-05-20 10:00:00'),
(2,'2026-05-21 09:00:00','2026-05-21 9:30:00'),
(3,'2026-05-22 03:00:00','2026-05-22 8:00:00');
