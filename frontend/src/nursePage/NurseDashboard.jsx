import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar.jsx';
import Hub from './Hub.jsx';
import DataTable from './DataTable.jsx';
import { Activity, ShieldAlert, X, FileText, Calendar, User } from 'lucide-react';

const NurseDashboard = ({ username, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Database-resolved states
  const [nurseProfile, setNurseProfile] = useState(null);
  const [shifts, setShifts] = useState([]);
  const [assignedWard, setAssignedWard] = useState(null);
  const [wardRooms, setWardRooms] = useState([]);
  const [wardPatients, setWardPatients] = useState([]);
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);

  // Medical Record modal viewer states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRecords, setPatientRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  useEffect(() => {
    const fetchNursePortalData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Step 1: Resolve the logged-in nurse profile from all detailed nurses
        const nursesRes = await fetch('/api/v1/employees/nurses/all/detailed');
        const nursesJson = await nursesRes.json();
        
        if (!nursesJson.success) {
          throw new Error(nursesJson.message || 'Failed to query nurse directory');
        }

        const detailedNurses = nursesJson.data.nurseInfo || [];
        
        // Match user by normalized username or ID
        const matchedNurse = detailedNurses.find(n => {
          const normalizedName = n.EmployeeName.toLowerCase().replace(/\s+/g, '');
          return normalizedName === username?.toLowerCase() || n.EmployeeID === username;
        }) || detailedNurses[0];

        if (!matchedNurse) {
          throw new Error('Attending nurse credentials not found in database.');
        }

        // Step 2: Fetch related database entities concurrently
        const [
          shiftsRes,
          wardsRes,
          roomsRes,
          admissionsRes,
          patientsRes,
          prescriptionsRes,
          prescriptionItemsRes,
          medicationsRes,
          salariesRes
        ] = await Promise.all([
          fetch(`/api/v1/employees/shifts/${matchedNurse.EmployeeID}`),
          fetch('/api/v1/clinic/wards'),
          fetch('/api/v1/clinic/rooms'),
          fetch('/api/v1/appointments/admissions'),
          fetch('/api/v1/patients/patient'),
          fetch('/api/v1/pharmacy/prescriptions'),
          fetch('/api/v1/pharmacy/prescription-items'),
          fetch('/api/v1/pharmacy/medications'),
          fetch('/api/v1/finance/salary-payments')
        ]);

        const [
          shiftsJson,
          wardsJson,
          roomsJson,
          admissionsJson,
          patientsJson,
          prescriptionsJson,
          prescriptionItemsJson,
          medicationsJson,
          salariesJson
        ] = await Promise.all([
          shiftsRes.json(),
          wardsRes.json(),
          roomsRes.json(),
          admissionsRes.json(),
          patientsRes.json(),
          prescriptionsRes.json(),
          prescriptionItemsRes.json(),
          medicationsRes.json(),
          salariesRes.json()
        ]);

        // Step 3: Parse and filter datasets based on nurse's AssignedWard
        const rawShifts = shiftsJson.data || [];
        const rawWards = (wardsJson.success && (wardsJson.data.wards || wardsJson.data)) || [];
        const rawRooms = (roomsJson.success && (roomsJson.data.rooms || roomsJson.data)) || [];
        const rawAdmissions = (admissionsJson.success && (admissionsJson.data.admissions || admissionsJson.data)) || [];
        const rawPatients = (patientsJson.success && (patientsJson.data.patients || patientsJson.data)) || [];
        const rawPrescriptionHeaders = (prescriptionsJson.success && (prescriptionsJson.data.prescriptions || prescriptionsJson.data)) || [];
        const rawPrescriptionItems = (prescriptionItemsJson.success && (prescriptionItemsJson.data.prescriptionItems || prescriptionItemsJson.data)) || [];
        const rawMedications = (medicationsJson.success && (medicationsJson.data.medications || medicationsJson.data)) || [];
        const rawSalaries = (salariesJson.success && (salariesJson.data.salaryPayments || salariesJson.data)) || [];

        // Match assigned ward object
        const wardObj = rawWards.find(w => w.WardID === matchedNurse.AssignedWard) || {
          WardID: matchedNurse.AssignedWard,
          WardName: `Ward #${matchedNurse.AssignedWard}`,
          DeptID: matchedNurse.DeptID,
          Capacity: 20
        };
        setAssignedWard(wardObj);

        // Update profile with ward name
        const updatedProfile = {
          ...matchedNurse,
          WardName: wardObj.WardName
        };
        setNurseProfile(updatedProfile);

        // Filter rooms belonging to this ward
        const filterRooms = rawRooms.filter(r => r.WardID === matchedNurse.AssignedWard);
        setWardRooms(filterRooms);

        // Filter active admissions in ward rooms (DischargeDate is null or empty)
        const activeAdmissions = rawAdmissions.filter(adm => 
          filterRooms.some(r => r.RoomID === adm.RoomID) && !adm.DischargeDate
        );

        // Map admissions to patient demographic records
        const mappedPatients = activeAdmissions.map(adm => {
          const patientObj = rawPatients.find(p => p.PatientID === adm.PatientID) || {};
          const roomObj = filterRooms.find(r => r.RoomID === adm.RoomID) || {};
          return {
            PatientID: adm.PatientID,
            PatientName: patientObj.PatientName || `Patient #${adm.PatientID}`,
            Gender: patientObj.Gender || 'M',
            DOB_DATE: patientObj.DOB_DATE || '1990-01-01',
            RoomNumber: roomObj.RoomNumber || 'N/A',
            AdmissionDate: adm.AdmissionDate,
            PrimaryDiagnosis: adm.PrimaryDiagnosis || 'Monitoring'
          };
        });
        setWardPatients(mappedPatients);

        // Filter prescriptions for ward patients
        const wardPrescriptionHeaders = rawPrescriptionHeaders.filter(h => 
          mappedPatients.some(p => p.PatientID === h.PatientID)
        );

        // Filter and join prescription items
        const mappedRxItems = rawPrescriptionItems
          .filter(item => wardPrescriptionHeaders.some(h => h.PrescriptionID === item.PrescriptionID))
          .map(item => {
            const headerObj = wardPrescriptionHeaders.find(h => h.PrescriptionID === item.PrescriptionID) || {};
            const patientObj = mappedPatients.find(p => p.PatientID === headerObj.PatientID) || {};
            const medicationObj = rawMedications.find(m => m.MedicationID === item.MedicationID) || {};
            return {
              ItemID: item.ItemID,
              PrescriptionID: item.PrescriptionID,
              PatientName: patientObj.PatientName || `Patient #${headerObj.PatientID}`,
              MedicationName: medicationObj.MedicationName || 'Unknown Medication',
              MedicationType: medicationObj.MedicationType || 'N/A',
              Dosage: item.Dosage,
              Frequency: item.Frequency,
              Duration: item.Duration
            };
          });
        setPrescriptionItems(mappedRxItems);

        // Shifts for this specific nurse
        setShifts(rawShifts);

        // Salaries filtered by EmployeeID
        const nurseSalaries = rawSalaries.filter(s => s.EmployeeID === matchedNurse.EmployeeID);
        setSalaryPayments(nurseSalaries);

      } catch (err) {
        console.error('[Addis Hospital Nurse Fetch Error]:', err);
        setError(err.message || 'Failed to initialize database tables.');
      } finally {
        setLoading(false);
      }
    };

    fetchNursePortalData();
  }, [username]);

  // Handle viewing a patient's historical medical records
  const handleViewPatientRecord = async (patient) => {
    setSelectedPatient(patient);
    setLoadingRecords(true);
    setPatientRecords([]);
    try {
      const res = await fetch(`/api/v1/records/patient/${patient.PatientID}`);
      const json = await res.json();
      if (json.success) {
        setPatientRecords(json.data.records || []);
      }
    } catch (err) {
      console.error('Failed to load patient records:', err);
    } finally {
      setLoadingRecords(false);
    }
  };

  const getActiveTableData = () => {
    switch (activeTab) {
      case 'My Shift':
        return shifts;
      case 'Assigned Ward':
        return { ward: assignedWard, rooms: wardRooms };
      case 'Ward Patients':
        return wardPatients;
      case 'Prescriptions':
        return prescriptionItems;
      case 'My Payroll':
        return salaryPayments;
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4FAF8] text-slate-700">
        <div className="text-center space-y-4">
          <Activity className="w-12 h-12 text-[#008564] animate-pulse mx-auto" />
          <h2 className="text-xl font-bold tracking-tight text-slate-800">Synchronizing Nurse Station...</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Securing Addis Hospital Ledger</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-rose-50 text-slate-700 p-6">
        <div className="text-center bg-white rounded-3xl border border-rose-100 p-12 max-w-md shadow-lg">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">Sync Failure</h2>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const hubStats = {
    patientCount: wardPatients.length,
    roomCount: wardRooms.length,
    prescriptionsCount: prescriptionItems.length,
    shiftsCount: shifts.length
  };

  return (
    <div className="flex h-screen bg-[#FDFEFE] text-slate-700 font-sans overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={onLogout} 
        profile={nurseProfile}
      />
      
      <main className="flex-grow flex flex-col overflow-hidden bg-white">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 select-none">
          <div className="flex items-center gap-2">
             <span className="text-[10px] font-black text-slate-350 uppercase tracking-[0.2em]">Addis Hospital</span>
             <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round"/></svg>
             <span className="text-xs font-bold text-slate-800 uppercase tracking-widest">{activeTab}</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 px-4 rounded-full bg-[#E6F3F0] text-[#008564] text-[10px] font-black tracking-widest flex items-center border border-[#CCE7E1] uppercase shadow-xs">
               Patient Vault
             </div>
             <div className="h-8 w-8 rounded-full border border-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 bg-slate-50">
               AAU
             </div>
          </div>
        </header>

        {/* Scrollable Content View */}
        <div className="flex-grow overflow-auto p-12 bg-white">
          <div className="max-w-7xl mx-auto">
             {activeTab === 'Dashboard' ? (
               <Hub 
                 stats={hubStats} 
                 worklist={wardPatients} 
                 onViewRecord={handleViewPatientRecord} 
               />
             ) : (
               <DataTable 
                 activeTab={activeTab} 
                 data={getActiveTableData()} 
               />
             )}
          </div>
        </div>
      </main>

      {/* High-Fidelity Historical Medical Records Modal Viewer */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col h-[550px] border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-[#F4FAF8]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#008564]/10 rounded-xl flex items-center justify-center text-[#008564]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{selectedPatient.PatientName}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    Patient ID: PAT-{String(selectedPatient.PatientID).padStart(3, '0')} • Vitals & Logs
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)} 
                className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {loadingRecords ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Activity className="w-8 h-8 text-[#008564] animate-pulse mx-auto" />
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Loading clinical logs...</p>
                  </div>
                </div>
              ) : patientRecords.length > 0 ? (
                <div className="space-y-6">
                  {patientRecords.map((rec, index) => (
                    <div key={rec.RecordID || index} className="border border-slate-100 rounded-2xl p-6 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-4">
                        <span className="inline-flex px-3 py-1 rounded-full text-[9px] font-black bg-rose-50 border border-rose-100/50 text-rose-700 uppercase tracking-wide">
                          {rec.FinalDiagnosis || 'Unspecified Condition'}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(rec.RecordDate).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-xs text-slate-650 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100/50">
                        {rec.ClinicalNotes || 'No clinical notes recorded.'}
                      </p>
                      <div className="flex items-center gap-2 mt-4 text-[9px] font-bold text-slate-400 uppercase">
                        <User className="w-3 h-3 text-[#008564]" />
                        Attending Doctor: DR-{rec.EmployeeID}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                  <FileText className="w-10 h-10 text-slate-305 mb-2" />
                  <p className="text-xs text-slate-550 font-bold">No historical medical records on file for this patient.</p>
                  <p className="text-[10px] text-slate-400 mt-1">New medical records can only be created by attending doctors.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button 
                onClick={() => setSelectedPatient(null)} 
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-55 rounded-xl text-xs font-bold text-slate-500 cursor-pointer shadow-xs"
              >
                Close Vault
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NurseDashboard;
