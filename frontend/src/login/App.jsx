import React, { useState, useEffect } from "react";
import LoginCard from "./LoginCard.jsx";
import RoleRouter from "./RoleRouter.jsx";
import PageLoader from "./PageLoader.jsx";
import { 
  Heart, 
  Loader2, 
  CheckCircle2, 
  ShieldCheck, 
  ServerCrash 
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isPreparingPage, setIsPreparingPage] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState("");

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setIsPreparingPage(true);
    setLoadingStepText("Secure token granted. Auditing role clearance...");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsPreparingPage(false);
  };

  // High fidelity asynchronous simulated loading pipeline for the Transition state
  useEffect(() => {
    if (!isPreparingPage) return;

    const timer1 = setTimeout(() => {
      setLoadingStepText("Accessing Addis Hospital department medical databases...");
    }, 800);

    const timer2 = setTimeout(() => {
      setLoadingStepText("Querying secure patient HIPAA records and vitals ledger...");
    }, 1600);

    const timer3 = setTimeout(() => {
      setLoadingStepText("Allocating system workspace and interface layouts...");
    }, 2400);

    const timerEnd = setTimeout(() => {
      setIsPreparingPage(false);
    }, 3200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerEnd);
    };
  }, [isPreparingPage]);

  const isWorkspaceActive = currentUser && !isPreparingPage;

  return (
    <div className={`bg-slate-50 flex flex-col relative ${isWorkspaceActive ? "h-screen overflow-hidden" : "min-h-screen justify-between overflow-hidden"} font-sans text-slate-800`}>
      {/* Dynamic background items */}
      {!isWorkspaceActive && (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-500/5 to-teal-500/10 rounded-full blur-2xl -z-10 pointer-events-none"></div>
        </>
      )}

      {/* Main Body */}
      <main className={`flex-grow flex ${isWorkspaceActive ? "w-full h-screen p-0 overflow-hidden" : "items-center justify-center p-4 md:p-8"}`}>
        
        {/* State A: Simulating database verification transition load */}
        {isPreparingPage ? (
          <PageLoader 
            title="Preparing Hospital Portal" 
            subtitle={loadingStepText || "Verifying clearances and loading your workspace..."} 
          />
        ) : currentUser ? (
          
          /* State B: User Logged In - Delegate routing to the modular RoleRouter */
          <div className="w-full h-full transition-all duration-500 transform scale-100">
            <RoleRouter currentUser={currentUser} onLogout={handleLogout} />
          </div>

        ) : (

          /* State C: Login Card form displayed */
          <div className="w-full max-w-md mx-auto space-y-4">
            <div className="text-center space-y-2 py-4">
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 flex items-center justify-center gap-2">
                <Heart className="w-8 h-8 text-emerald-600 animate-pulse" />
                Addis Hospital
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm max-w-sm mx-auto font-medium">
                Authorized clinicians, emergency triages, administrative managers, and active patients database gateway.
              </p>
            </div>

            {/* Login Card handles core verify processes */}
            <LoginCard onLoginSuccess={handleLoginSuccess} />
          </div>

        )}

      </main>

      {/* Clean padded container end */}
      {!isWorkspaceActive && <div className="py-2" />}
    </div>
  );
}
