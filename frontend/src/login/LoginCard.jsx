import React, { useState } from "react";
import { 
  User as UserIcon, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  LockKeyhole, 
  ArrowRight
} from "lucide-react";

export default function LoginCard({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  
  // High fidelity step tracking for visualization
  const [step, setStep] = useState("idle");

  const handleLogin = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setErrorMsg("");

    // 1. Core validations
    const errors = {};
    if (!username.trim()) {
      errors.username = "Username is required";
    }
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length !== 8) {
      errors.password = "Password must be exactly 8 characters";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      // Step A: Verifying username in the database
      setStep("verifying-username");
      console.log(`[API Request] Querying database for username: "${username}"`);

      // Using the exact GET verification method for username of the backend API
      const usernameResponse = await fetch(`/api/verify-username/${encodeURIComponent(username.trim())}`);
      
      if (!usernameResponse.ok) {
        setStep("error");
        setErrorMsg("invalid username provided");
        console.error("invalid username provided");
        return;
      }

      const usernameData = await usernameResponse.json();
      console.log(`[API Success] Database found username matching "${usernameData.username}"`);

      // Step B: Verifying password matching
      setStep("verifying-password");
      console.log(`[API Request] Initiating password match call asynchronously...`);

      // Using the get password method of the backend API to verify the password is matched
      const passwordQueryUrl = `/api/verify-password?username=${encodeURIComponent(username.trim())}&password=${encodeURIComponent(password)}`;
      const passwordResponse = await fetch(passwordQueryUrl);

      if (!passwordResponse.ok) {
        setStep("error");
        if (passwordResponse.status === 401) {
          setErrorMsg("invalid password");
          console.error("invalid password");
        } else if (passwordResponse.status === 404) {
          setErrorMsg("invalid username provided");
          console.error("invalid username provided");
        } else {
          setErrorMsg("invalid username provided");
          console.error("An unexpected validation error occurred");
        }
        return;
      }

      const passwordData = await passwordResponse.json();
      
      if (passwordData.match) {
        setStep("success");
        console.log("[Authentication Success] Credentials verified. Session successfully authorized.");
        
        // Brief pleasant delay to show completion animation
        setTimeout(() => {
          onLoginSuccess({
            username: username.trim(),
            loginTime: new Date().toLocaleTimeString()
          });
        }, 1000);
      } else {
        setStep("error");
        setErrorMsg("invalid password");
        console.error("invalid password");
      }

    } catch (err) {
      setStep("error");
      setErrorMsg("Failed to connect to the authentication server. Please retry.");
      console.error("Networking error during asynchronous login:", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden transition-all duration-300">
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 p-6 text-white text-center relative overflow-hidden">
        {/* Subtle grid pattern inside header bg */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        
        <div className="inline-flex p-3 bg-white/10 rounded-xl mb-3 backdrop-blur-sm">
          <LockKeyhole className="w-6 h-6 text-emerald-400" />
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight">Addis Hospital</h2>
        <p className="text-emerald-100/80 text-xs mt-1">
          Hospital Secure Identity Access Gateway
        </p>
      </div>

      <div className="p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Username Input Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMsg("");
                  if (fieldErrors.username) setFieldErrors(prev => ({ ...prev, username: undefined }));
                }}
                placeholder="e.g. adminuser"
                className={`block w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border ${
                  fieldErrors.username ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-600 focus:border-emerald-600"
                } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200`}
                disabled={step !== "idle" && step !== "error" && step !== "success"}
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1.5 text-xs text-rose-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 flex-shrink-0" />
                {fieldErrors.username}
              </p>
            )}
          </div>

          {/* Password Input Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg("");
                  if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                }}
                maxLength={8}
                placeholder="8 characters"
                className={`block w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border ${
                  fieldErrors.password ? "border-rose-300 focus:ring-rose-500 focus:border-rose-500" : "border-slate-200 focus:ring-emerald-600 focus:border-emerald-600"
                } rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 font-mono`}
                disabled={step !== "idle" && step !== "error" && step !== "success"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="mt-1.5 flex justify-between items-center">
              {fieldErrors.password ? (
                <p className="text-xs text-rose-500 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  {fieldErrors.password}
                </p>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  {password.length}/8 Characters Required
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100/80 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-pulse">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Submit Button */}
          <button
            type="submit"
            disabled={step !== "idle" && step !== "error"}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none hover:shadow-lg cursor-pointer"
          >
            {step === "verifying-username" || step === "verifying-password" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Authenticating...</span>
              </>
            ) : step === "success" ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                <span>Redirecting...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
