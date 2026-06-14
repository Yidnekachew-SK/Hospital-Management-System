import React, { useState } from 'react';

const StatusBadge = ({ value, context }) => {
  const getTheme = () => {
    const val = String(value || '').toUpperCase();
    if (context === 'Employees') {
      if (val === 'ACTIVE' || val === 'COMPLETED') return { label: 'ACTIVE', style: 'bg-emerald-50 text-emerald-600' };
      if (val === 'ON LEAVE' || val === 'ON_LEAVE') return { label: 'ON LEAVE', style: 'bg-blue-50 text-blue-600' };
      if (val === 'TERMINATED' || val === 'FAILED') return { label: 'TERMINATED', style: 'bg-red-50 text-red-600' };
      return { label: 'PENDING', style: 'bg-amber-50 text-amber-600' };
    }
    if (context === 'Rooms') {
      if (val === 'OCCUPIED' || val === '1' || val === 'COMPLETED') return { label: 'OCCUPIED', style: 'bg-emerald-50 text-emerald-600' };
      if (val === 'AVAILABLE' || val === '0' || val === 'PENDING') return { label: 'AVAILABLE', style: 'bg-blue-50 text-blue-600' };
      if (val === 'MAINTENANCE' || val === 'FAILED') return { label: 'MAINTENANCE', style: 'bg-amber-50 text-amber-600' };
      return { label: 'AVAILABLE', style: 'bg-blue-50 text-blue-600' };
    }
    // Billing and others
    if (val === 'PAID' || val === 'COMPLETED' || val === 'ACTIVE') return { label: 'COMPLETED', style: 'bg-emerald-50 text-emerald-600' };
    if (val === 'FAILED' || val === 'TERMINATED') return { label: 'FAILED', style: 'bg-red-50 text-red-600' };
    return { label: 'PENDING', style: 'bg-amber-50 text-amber-600' };
  };

  const theme = getTheme();
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${theme.style}`}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {theme.label}
    </div>
  );
};

const DataInterface = ({ current, activeTab, isReadOnly, onAdd, onEdit, dbData, isLoading, subTab, setSubTab }) => {
  const getTableTitle = () => {
    if (activeTab === 'Employees') {
      if (subTab === 'Doctors') return 'Doctors';
      if (subTab === 'Nurses') return 'Nurses';
      if (subTab === 'Staff') return 'Staff';
      return 'Employees';
    }
    const titles = {
      'UserAccounts': 'User Accounts',
      'Departments': 'Departments',
      'Wards': 'Wards',
      'Rooms': 'Rooms',
      'Patients': 'Patients',
      'Insurance': 'Insurance',
      'Billing': 'Billing',
      'Logs': 'System Logs',
      'ActivityLog': 'Activity Log'
    };
    return titles[activeTab] || activeTab;
  };

  const getInsertLabel = () => {
    if (activeTab === 'Employees') {
      if (subTab === 'Doctors') return 'Insert Doctor';
      if (subTab === 'Nurses') return 'Insert Nurse';
      if (subTab === 'Staff') return 'Insert Staff';
      return 'Insert Employee';
    }
    const labels = {
      'UserAccounts': 'Insert User Account',
      'Departments': 'Insert Department',
      'Wards': 'Insert Ward',
      'Rooms': 'Insert Room',
      'Patients': 'Insert Patient',
      'Insurance': 'Insert Insurance Policy',
      'Billing': 'Insert Bill'
    };
    return labels[activeTab] || `Insert ${activeTab}`;
  };

  return (
    <div className="space-y-6">
      {activeTab === 'Employees' && (
        <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-100">
          {['All', 'Doctors', 'Nurses', 'Staff'].map(cat => (
            <button key={cat} onClick={() => setSubTab(cat)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${subTab === cat ? 'bg-white text-[#008564] shadow-sm' : 'text-slate-400'}`}>{cat}</button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30">
          <h3 className="text-xl font-bold text-slate-900">{getTableTitle()}</h3>
          {!isReadOnly && <button onClick={onAdd} className="bg-[#008564] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all hover:brightness-110 active:scale-95">{getInsertLabel()}</button>}
        </div>

        <div className="p-6 overflow-x-auto custom-scrollbar">
          <table className="w-max text-left border-separate border-spacing-x-0">
            <thead>
              <tr className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {current.cols.map(c => <th key={c} className="px-6 py-4 w-[200px] min-w-[200px]">{c}</th>)}
                {!isReadOnly && <th className="px-6 py-4 w-[120px] min-w-[120px] text-right">Operations</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {isLoading ? (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400 italic font-bold">Syncing Database...</td></tr>
              ) : dbData.length > 0 ? (
                dbData.map((record, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all">
                    {current.cols.map((colName, idx) => {
                      // CLINICAL FIX: Find data regardless of capitalization (e.g. PATIENTID vs PatientID)
                      const search = colName.toLowerCase().replace(/\s/g, '');
                      const dbKey = Object.keys(record).find(k => k.toLowerCase().replace(/_/g, '') === search);
                      const displayVal = dbKey ? record[dbKey] : "—";

                      return (
                        <td key={idx} className="px-6 py-5 w-[200px] min-w-[200px]">
                          {colName.toLowerCase().includes('status') || colName.toLowerCase().includes('occupancy') || colName.toLowerCase().includes('role') ? (
                            <StatusBadge value={displayVal} context={activeTab} />
                          ) : (
                            <span className={`text-xs ${idx === 0 ? 'font-mono text-[#008564] font-bold' : 'text-slate-600'}`}>{displayVal}</span>
                          )}
                        </td>
                      );
                    })}
                    {!isReadOnly && (
                      <td className="px-6 py-5 w-[120px] min-w-[120px] text-right">
                        <button onClick={() => onEdit(record)} className="text-[#008564] text-[10px] font-black uppercase hover:underline">Update</button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400 font-bold uppercase text-[10px]">No records found in database</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataInterface;