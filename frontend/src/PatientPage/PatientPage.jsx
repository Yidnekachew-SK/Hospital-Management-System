import React from "react";
import { usePatientData } from "./usePatientData";
import Sidebar from "./Sidebar";
import DashboardTab from "./DashboardTab";
import AppointmentsTab from "./AppointmentsTab";
import PrescriptionsTab from "./PrescriptionsTab";
import SurgeriesTab from "./SurgeriesTab";
import BillsPaymentsTab from "./BillsPaymentsTab";
import "./doctorPage/index.css"
import { 
  LayoutDashboard, 
  Calendar, 
  Pill, 
  Scissors, 
  Receipt,
  ShieldCheck,
  Activity
} from "lucide-react";

export default function PatientPage({ currentUser, onLogout }) {
  const {
    activeTab,
    setActiveTab,
    currentPatientProfile,
    stats,
    data,
    isLoading
  } = usePatientData(currentUser?.username);

  // Horizontal Portal Navigation Configuration
  const tabsList = [
    { id: "dashboard", label: "Dashboard Hub", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments Schedule", icon: Calendar },
    { id: "prescriptions", label: "Active Prescriptions", icon: Pill },
    { id: "surgeries", label: "Surgery Schedule", icon: Scissors },
    { id: "billing", label: "Bills & Payments", icon: Receipt }
  ];

  return (
    <div id="patient-portal-root" className="h-screen overflow-hidden w-full bg-slate-100 flex text-slate-800 antialiased font-sans">
      
      {/* 1. COMPONENT: Left Sidebar presenting demographic data */}
      <Sidebar 
        profile={currentPatientProfile}
        onLogout={onLogout} 
      />

      {/* 2. MAIN WORKSPACE CONTAINER */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Workspace Top Header Bar without dev selector or credentials badges */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="font-display font-extrabold text-sm md:text-base text-slate-900 tracking-tight flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-700 animate-pulse" />
              Electronic Health Record Access
            </h1>
          </div>
        </header>

        {/* 3. SCROLLABLE CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-md border border-teal-800">
            {/* Subtle grid pattern inside header bg */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="relative z-10 space-y-2">
              <div className="inline-flex py-1 px-2.5 bg-white/10 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10">
                Secure Patient Portal
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black tracking-tight leading-none text-teal-50">
                Welcome back, {currentPatientProfile.PatientName}!
              </h2>
              <p className="text-slate-300 text-xs md:text-sm max-w-xl font-medium leading-relaxed">
                Access your real-time Addis Hospital demographic details, scheduling, medications, surgery directives, and statements safely.
              </p>
            </div>
          </div>

          {/* Horizontal Portal Navigation Tabs spread below the Welcome Banner */}
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto flex gap-1 shrink-0 scrollbar-thin">
            {tabsList.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`horizontal-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-teal-700 text-white shadow-xs"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <IconComp size={15} className={isActive ? "text-white" : "text-slate-400"} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display Area */}
          <div id="patient-tab-content-wrapper" className="pt-2">
            {activeTab === "dashboard" && (
              <DashboardTab 
                profile={currentPatientProfile} 
                stats={stats} 
                data={data}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "appointments" && (
              <AppointmentsTab appointments={data.appointments} />
            )}

            {activeTab === "prescriptions" && (
              <PrescriptionsTab prescriptions={data.prescriptions} />
            )}

            {activeTab === "surgeries" && (
              <SurgeriesTab surgeries={data.surgeries} />
            )}

            {activeTab === "billing" && (
              <BillsPaymentsTab bills={data.bills} />
            )}
          </div>

          {/* Footer showing Addis Hospital name only */}
          <footer className="pt-6 border-t border-slate-200/60 flex items-center justify-center text-xs text-slate-400 font-sans font-semibold">
            <p>Addis Hospital</p>
          </footer>

        </div>
      </main>

    </div>
  );
}
