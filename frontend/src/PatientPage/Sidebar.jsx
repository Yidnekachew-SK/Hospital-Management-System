import React from "react";
import { 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Activity, 
  Calendar,
  Contact,
  LogOut
} from "lucide-react";

/**
 * Sidebar component dedicated to showcasing the Demographic Master Data
 * of the currently logged-in patient, replacing traditional navigation links.
 */
export default function Sidebar({ profile, onLogout }) {
  if (!profile) return null;

  // Get initials for profile avatar
  const initials = profile.PatientName
    ? profile.PatientName.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()
    : "PT";

  return (
    <aside id="patient-sidebar-panel" className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Header Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-700 rounded-xl flex items-center justify-center text-white shadow-sm shadow-teal-100">
            <Activity size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight block text-slate-900">Addis Hospital</span>
            <span className="text-[10px] text-teal-700 font-extrabold tracking-wider uppercase block">Patient Vault</span>
          </div>
        </div>
      </div>

        {/* Demographic Master Data Fields */}
        <div className="p-6 space-y-6 flex-1">
          {/* Avatar Profile Section */}
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-100">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 text-xl font-black shadow-inner uppercase">
                {initials}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center shadow-xs">
                <ShieldCheck size={11} className="text-white" />
              </div>
            </div>
            <h4 id="demographic-patient-name" className="font-extrabold text-base text-slate-800 mt-3 tracking-tight leading-snug">
              {profile.PatientName}
            </h4>
            <div className="inline-flex py-0.5 px-2 bg-slate-100 text-slate-500 rounded-lg font-mono font-bold text-[10px] mt-1.5 border border-slate-200/50">
              ID: {profile.PatientID}
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] uppercase font-black tracking-wider text-slate-400 flex items-center gap-1.5 font-sans">
              <Contact size={11} className="text-slate-400" />
              Demographic Master Record
            </h5>

            <div className="space-y-3.5 text-xs">
              {/* Profile Details Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Gender</span>
                  <span className="font-bold text-slate-700 text-xs">{profile.Gender === "F" ? "Female" : "Male"}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Age Group</span>
                  <span className="font-bold text-slate-700 text-xs">{profile.age} Years</span>
                </div>
              </div>

              {/* DOB Date */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60 flex items-center gap-2.5">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Birthdate</span>
                  <span className="font-bold text-slate-700 font-mono text-xs">{profile.DOB_DATE}</span>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60 flex items-center gap-2.5">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Primary Contact</span>
                  <span className="font-bold text-slate-700 text-xs">{profile.Phone}</span>
                </div>
              </div>

              {/* Government ID */}
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-150/60 flex items-center gap-2.5">
                <User size={14} className="text-slate-400 shrink-0" />
                <div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">National ID</span>
                  <span className="font-mono font-bold text-slate-700 text-xs">{profile.NationalID}</span>
                </div>
              </div>

              {/* Address Details */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150/60 flex items-start gap-2.5">
                <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Residential Address</span>
                  <p className="text-slate-750 font-semibold leading-relaxed">
                    House {profile.HouseNumber}, {profile.Region}, {profile.City}
                  </p>
                </div>
              </div>

              {/* Insurance Info */}
              <div className="bg-teal-50/40 p-3 rounded-xl border border-teal-100/50 flex items-start gap-2.5">
                <ShieldCheck size={14} className="text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[9px] font-black text-teal-800 uppercase tracking-widest block">Insurance Profile</span>
                  <p className="text-slate-800 font-extrabold text-xs">{profile.insurance.ProviderName}</p>
                  <p className="text-slate-400 font-bold font-mono text-[10px]">Pol: {profile.insurance.PolicyNumber}</p>
                  <p className="text-slate-500 font-medium text-[11px] mt-0.5 leading-snug">{profile.insurance.CoverageDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Logout Security Control */}
      <div className="p-6 border-t border-slate-100 shrink-0 bg-slate-50/50">
        <button
          onClick={onLogout}
          className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-650 hover:text-rose-600 cursor-pointer text-xs font-bold uppercase rounded-xl border border-slate-200/80 flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <LogOut size={13} />
          Sign Out Portal
        </button>
      </div>
    </aside>
  );
}
