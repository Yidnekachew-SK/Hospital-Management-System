import React, { useState } from "react";
import LoginCard from "./LoginCard.jsx";
import { LogOut, CheckCircle2, Shield, Clock, Terminal } from "lucide-react";
import "./index.css";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative overflow-hidden">
      {/* Interactive geometric background element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-emerald-500/5 to-slate-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/5 to-slate-200/20 rounded-full blur-2xl -z-10 pointer-events-none"></div>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md mx-auto space-y-6">
          
          {currentUser ? (
            /* Authenticated Account Dashboard View */
            <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden transition-all duration-500 transform scale-100">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 p-6 text-white text-center relative">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                
                <div className="inline-flex p-3 bg-white/10 rounded-full mb-3 backdrop-blur-sm">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight">Access Granted</h1>
                <p className="text-emerald-100 text-xs mt-1">
                  Secure asynchronous database validation passed
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Card & Details */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Identity
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        ACTIVE SESSION
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-slate-500">Welcome Back</p>
                      <h3 className="font-display text-xl font-bold text-slate-900">
                        {currentUser.username}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 font-mono text-[11px] text-slate-600">
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-1">
                      <span className="text-slate-400 font-sans font-semibold uppercase text-[9px] tracking-wider">
                        Login Stamp
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-800">
                        <Clock className="w-3.5 h-3.5 text-emerald-500" />
                        {currentUser.loginTime}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex flex-col gap-1">
                      <span className="text-slate-400 font-sans font-semibold uppercase text-[9px] tracking-wider">
                        Authorization
                      </span>
                      <span className="flex items-center gap-1 font-medium text-slate-800">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        Validated API
                      </span>
                    </div>
                  </div>
                </div>

                {/* Secure Session Info */}
                <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
                    <Terminal className="w-3.5 h-3.5 text-emerald-600" /> Session Logs
                  </span>
                  <div className="font-mono text-[10px] text-slate-500 leading-relaxed space-y-0.5 max-h-[80px] overflow-y-auto">
                    <div>[API] Session key successfully issued for {currentUser.username}</div>
                    <div>[SYS] Access credentials matching verified OK</div>
                    <div>[DB] Connection terminated successfully</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-sm rounded-xl transition-all cursor-pointer border border-rose-200"
                  type="button"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate Session (Log Out)</span>
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated Login Screen View */
            <div className="space-y-4">
              <div className="text-center space-y-2 py-4">
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900">
                  Addis Hospital
                </h1>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                  Sign in using your pre-registered database credentials. Only authorized identities are permitted access.
                </p>
              </div>

              {/* Login Card component containing the authentication form and async workflows */}
              <LoginCard onLoginSuccess={handleLoginSuccess} />
            </div>
          )}

        </div>
      </main>

      {/* Modern, clean footer */}
      <footer className="py-4 text-center border-t border-slate-100 text-[11px] text-slate-400 font-mono mt-auto relative z-10">
        <div>
          Welcome to our hospital.
        </div>
      </footer>
    </div>
  );
}
