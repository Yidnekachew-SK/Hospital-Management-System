import React, { useState } from "react";
import { AlertTriangle, Home, RefreshCw, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

export default function ErrorPage({ 
  error = { message: "An unexpected system error occurred while loading your workstation." }, 
  resetErrorBoundary, // If you are using react-error-boundary, you can pass this
  onGoHome 
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Fallbacks in case functions/handlers are undefined
  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans text-[#1E293B]">
      
      {/* Central Card */}
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-10 text-center relative overflow-hidden">
        
        {/* Subtle Background Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-500" />

        {/* Warning Icon Badge */}
        <div className="mx-auto w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <AlertTriangle className="w-8 h-8 text-rose-500" />
        </div>

        {/* Main Headings */}
        <h1 className="text-2xl font-bold font-display text-slate-800 tracking-tight mb-2">
          Something went wrong
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-6">
          We encountered an error rendering this workplace dashboard. Your session stays secure, but the view needs to be reloaded.
        </p>

        {/* Action Button Suite */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleReload}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Workstation</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleGoBack}
              className="py-2.5 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Go Back</span>
            </button>
            
            <button
              onClick={onGoHome || (() => window.location.href = "/")}
              className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go Home</span>
            </button>
          </div>
        </div>

        {/* Collapsible Error Debug Details */}
        {error && (
          <div className="border-t border-slate-100 pt-4 text-left">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-slate-400 hover:text-slate-600 transition-colors text-[11px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
            >
              <span>Technical Diagnostics</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            
            {showDetails && (
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-100 rounded-xl font-mono text-[11px] text-slate-500 max-h-40 overflow-y-auto leading-relaxed select-all">
                {error.stack ? (
                  <pre className="whitespace-pre-wrap">{error.stack}</pre>
                ) : (
                  <p>{error.message || "Error schema validation failed: inspect environment variables."}</p>
                )}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Subtle Footer Meta */}
      <span className="text-[10px] font-mono text-slate-400 mt-6 tracking-wide">
        Error Reference ID: ERR-{Math.random().toString(36).substr(2, 9).toUpperCase()}
      </span>
    </div>
  );
}