import React from "react";
import { Search } from "lucide-react";
import "./DoctorPage.css";
import "./index.css";
import Sidebar from "./Sidebar";
import DashboardOverview from "./DashboardOverview";
import PatientDirectory from "./PatientDirectory";
import AppointmentCalendar from "./AppointmentCalendar";
import LabsDirectory from "./LabsDirectory";
import SurgeriesScheduler from "./SurgeriesScheduler";
import DoctorForms from "./DoctorForms";
import { useDoctorData } from "./useDoctorData";

export default function DoctorPage({ username, onLogout }) {
  const {
    // Basic navigation & general profile
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    displayDoctorName,
    
    // Loaded entities collections
    patients,
    appointments,
    medicalRecords,
    labTests,
    surgeries,
    labReports,
    rooms,
    medications,
    
    // Filtered data layers
    filteredPatients,
    selectedPatientId,
    setSelectedPatientId,
    selectedPatientData,
    filteredLabTests,
    filteredSurgeries,
    
    // Month & Date Calendar calculations
    calendarYear,
    calendarMonth,
    selectedCalendarDate,
    setSelectedCalendarDate,
    calendarDays,
    monthNames,
    changeMonth,
    selectedDateAppointments,
    
    // Overlay Modals management
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
    setEditAppointmentForm,

    
    // Form event submissions
    handleAddAppointment,
    handleAddPrescriptionSubmit,
    handleRequestLabSubmit,
    handleScheduleSurgerySubmit,
    handleAddLabReportSubmit,
    handleUpdateRecordSubmit,
    handleUpdateSurgerySubmit,
    handleUpdateAppointmentSubmit,

    activeDoctor,
    
    // Prescription table actions
    addRxItemRow,
    updateRxItemRow,
    removeRxItemRow
  } = useDoctorData(username);
  
  return (
    <div id="doctor-workspace" className="flex h-screen w-full bg-[#F8FAFC] font-sans overflow-hidden text-[#1E293B]">
      
      {/* SIDEBAR NAVIGATION - Modular Workspace */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        patientsCount={patients.length} 
        doctorName={displayDoctorName} 
        onLogout={onLogout} 
      />

      {/* PORTAL MAIN AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* UPPER NAVIGATION BAR & SEARCH */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-extrabold tracking-tight">
            {activeTab === "dashboard" && "Clinical Hub Overview"}
            {activeTab === "patients" && "Patient Directory Database"}
            {activeTab === "appointments" && "Interactive Appointment Calendar"}
            {activeTab === "labs" && "Lab Tests & Pathologist Reports"}
            {activeTab === "surgeries" && "Operation Room & Surgery Schedules"}
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Patient Name, ID or active diagnose..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-1.5 bg-slate-100 border border-transparent rounded-lg text-xs placeholder-slate-400 text-slate-700 focus:outline-none focus:bg-white focus:border-slate-200 focus:ring-2 focus:ring-teal-500/20"
              />
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            </div>

            {activeTab === "patients" && (
              <button
                 onClick={() => {
                  const firstPatId = (patients && patients.length > 0) ? patients[0].PatientID : "1";
                   setNewRxForm({ patientId: "PAT-001", items: [{ medicationId: "MED-01", dosage: "10mg", duration: "30 Days", frequency: "Once Daily" }] });
                   setShowPrescriptionModal(true);
                 }}
                 className="bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-teal-700 shadow-sm transition-all cursor-pointer"
              >
                + New Prescription
              </button>
            )}
          </div>
        </header>

        {/* WORKSPACE MIDDLEVIEW DISPLAY AREA */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50">
          <div className="h-full w-full overflow-y-auto pr-1 custom-scrollbar">

            {activeTab === "dashboard" && (
              <DashboardOverview
                patients={patients}
                appointments={appointments}
                labTests={labTests}
                surgeries={surgeries}
                filteredPatients={filteredPatients}
                setSelectedPatientId={setSelectedPatientId}
                setActiveTab={setActiveTab}
                setShowLabRequestModal={setShowLabRequestModal}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                setShowAppointmentModal={setShowAppointmentModal}
              />
            )}

            {activeTab === "patients" && (
              <PatientDirectory
                filteredPatients={filteredPatients}
                medicalRecords={medicalRecords}
                selectedPatientId={selectedPatientId}
                setSelectedPatientId={setSelectedPatientId}
                selectedPatientData={selectedPatientData}
                setShowPrescriptionModal={setShowPrescriptionModal}
                setShowLabRequestModal={setShowLabRequestModal}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                setNewRxForm={setNewRxForm}
                setNewLabForm={setNewLabForm}
                setNewSurgeryForm={setNewSurgeryForm}
                setNewLabReportForm={setNewLabReportForm}
                setShowAddLabReportModal={setShowAddLabReportModal}
                onTriggerUpdateRecord={(record) => {
                  setEditRecordForm(record);
                  setShowUpdateRecordModal(true);
                }}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentCalendar
                calendarYear={calendarYear}
                calendarMonth={calendarMonth}
                selectedCalendarDate={selectedCalendarDate}
                setSelectedCalendarDate={setSelectedCalendarDate}
                appointments={appointments}
                patients={patients}
                calendarDays={calendarDays}
                monthNames={monthNames}
                changeMonth={changeMonth}
                selectedDateAppointments={selectedDateAppointments}
                setShowAppointmentModal={setShowAppointmentModal}
                setNewApptForm={setNewApptForm}
                setEditAppointmentForm={setEditAppointmentForm}
                setShowUpdateAppointmentModal={setShowUpdateAppointmentModal}
                activeDoctor={activeDoctor}
              />
            )}

            {activeTab === "labs" && (
              <LabsDirectory
                filteredLabTests={filteredLabTests}
                patients={patients}
                labReports={labReports}
                searchQuery={searchQuery}
                setShowLabRequestModal={setShowLabRequestModal}
                setSelectedPatientId={setSelectedPatientId}
                setActiveTab={setActiveTab}
                setNewLabReportForm={setNewLabReportForm}
                setShowAddLabReportModal={setShowAddLabReportModal}
              />
            )}

            {activeTab === "surgeries" && (
              <SurgeriesScheduler
                filteredSurgeries={filteredSurgeries}
                patients={patients}
                setShowSurgeryRequestModal={setShowSurgeryRequestModal}
                onTriggerUpdateSurgery={(surgery) => {
                  setEditSurgeryForm(surgery);
                  setShowUpdateSurgeryModal(true);
                }}
              />
            )}

          </div>
        </div>
      </main>

      {/* OVERLAY FORMS COORDINATOR */}
      <DoctorForms
        patients={patients}
        showAppointmentModal={showAppointmentModal}
        setShowAppointmentModal={setShowAppointmentModal}
        newApptForm={newApptForm}
        setNewApptForm={setNewApptForm}
        handleAddAppointment={handleAddAppointment}
        showPrescriptionModal={showPrescriptionModal}
        setShowPrescriptionModal={setShowPrescriptionModal}
        newRxForm={newRxForm}
        setNewRxForm={setNewRxForm}
        handleAddPrescriptionSubmit={handleAddPrescriptionSubmit}
        addRxItemRow={addRxItemRow}
        updateRxItemRow={updateRxItemRow}
        removeRxItemRow={removeRxItemRow}
        signingPrescription={signingPrescription}
        showLabRequestModal={showLabRequestModal}
        setShowLabRequestModal={setShowLabRequestModal}
        newLabForm={newLabForm}
        setNewLabForm={setNewLabForm}
        handleRequestLabSubmit={handleRequestLabSubmit}
        showSurgeryRequestModal={showSurgeryRequestModal}
        setShowSurgeryRequestModal={setShowSurgeryRequestModal}
        newSurgeryForm={newSurgeryForm}
        setNewSurgeryForm={setNewSurgeryForm}
        handleScheduleSurgerySubmit={handleScheduleSurgerySubmit}
        showAddLabReportModal={showAddLabReportModal}
        setShowAddLabReportModal={setShowAddLabReportModal}
        newLabReportForm={newLabReportForm}
        setNewLabReportForm={setNewLabReportForm}
        handleAddLabReportSubmit={handleAddLabReportSubmit}
        // Dr Update operations
        showUpdateRecordModal={showUpdateRecordModal}
        setShowUpdateRecordModal={setShowUpdateRecordModal}
        editRecordForm={editRecordForm}
        setEditRecordForm={setEditRecordForm}
        handleUpdateRecordSubmit={handleUpdateRecordSubmit}
        showUpdateSurgeryModal={showUpdateSurgeryModal}
        setShowUpdateSurgeryModal={setShowUpdateSurgeryModal}
        editSurgeryForm={editSurgeryForm}
        setEditSurgeryForm={setEditSurgeryForm}
        handleUpdateSurgerySubmit={handleUpdateSurgerySubmit}
        handleUpdateAppointmentSubmit={handleUpdateAppointmentSubmit}
        editAppointmentForm={editAppointmentForm}
        setEditAppointmentForm={setEditAppointmentForm}
        showUpdateAppointmentModal={showUpdateAppointmentModal}
        setShowUpdateAppointmentModal={setShowUpdateAppointmentModal}
        rooms={rooms}
        medications={medications}
        activeDoctor={activeDoctor}
      />

    </div>
  );
}
