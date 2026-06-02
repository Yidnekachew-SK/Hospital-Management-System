import React from "react";
import { LogOut } from "lucide-react";

export default function NurseDashboard({ username, userRole, onLogout }) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-pink-600 mb-8">Nurse Station</h2>
        <nav className="flex-1 space-y-3">
          <div className="p-3 bg-pink-50 rounded-lg">
            <p className="text-pink-700 font-medium">Dashboard</p>
          </div>
          <div className="p-3 hover:bg-slate-100 rounded-lg cursor-pointer">
            <p className="text-slate-700">Vitals</p>
          </div>
        </nav>
        <button
          onClick={onLogout}
          className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Welcome, {username}</h1>
            <p className="text-slate-500 mt-2">Nurse Dashboard</p>
          </div>
          <div className="px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm font-semibold">
            NURSE
          </div>
        </div>

        {/* Simple Demo Content */}
        <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-pink-600">NURSE</h2>
            <p className="text-slate-500 text-lg">Nurse Role Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  );
}
