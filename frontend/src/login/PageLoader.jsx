import React from "react";

/**
 * Dedicated PageLoader component that displays a clean, elegant hospital-branded
 * loading overlay or screen layout without any central icon as requested.
 */
export default function PageLoader({ title = "Preparing Hospital Portal", subtitle = "Verifying clearances and loading your workspace..." }) {
  return (
    <div id="loading-portal-container" className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center space-y-6 animate-pulse transition-all duration-300">
      <div className="relative inline-flex items-center justify-center">
        {/* Modern Spinning Ring */}
        <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-emerald-600 animate-spin"></div>
      </div>

      {/* Dynamic Display Textures */}
      <div className="space-y-2">
        <h3 id="loader-title" className="font-display text-xl font-bold text-slate-900">
          {title}
        </h3>
        <p id="loader-subtitle" className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
