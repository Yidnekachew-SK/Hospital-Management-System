import React, { useState } from 'react';

// Manages table display and ensures row values match the update panel options
const DataInterface = ({ current, activeTab, isReadOnly, onAdd, onEdit, dbData, isLoading }) => {
  const [subTab, setSubTab] = useState('All');

  // Logic for context-aware status and role badges
  const StatusBadge = ({ value, context }) => {
    const colorMap = {
      // Employees & Rooms
      'ACTIVE': 'bg-emerald-50 text-emerald-600',
      'COMPLETED': 'bg-emerald-50 text-emerald-600',
      'OCCUPIED': 'bg-emerald-50 text-emerald-600',
      'AVAILABLE': 'bg-blue-50 text-blue-600',
      'ON LEAVE': 'bg-blue-50 text-blue-600',
      'PENDING': 'bg-amber-50 text-amber-600',
      'MAINTENANCE': 'bg-amber-50 text-amber-600',
      'TERMINATED': 'bg-red-50 text-red-600',
      'FAILED': 'bg-red-50 text-red-600',
      // UserAccounts Roles
      'Admin': 'bg-emerald-50 text-emerald-600',
      'Doctor': 'bg-blue-50 text-blue-600',
      'Nurse': 'bg-blue-50 text-blue-600',
      'Staff': 'bg-amber-50 text-amber-600'
    };

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${colorMap[value] || 'bg-slate-50 text-slate-400'}`}>
        <div className="w-1 h-1 rounded-full bg-current" />
        {value}
      </div>
    );
  };

  // Logic to provide context-correct data for the role/status columns
  const getMockStatus = (index) => {
    if (activeTab === 'Employees') {
      const states = ['ACTIVE', 'ON LEAVE', 'TERMINATED', 'PENDING', 'ACTIVE'];
      return states[index];
    }
    if (activeTab === 'Rooms') {
      const states = ['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'OCCUPIED', 'AVAILABLE'];
      return states[index];
    }
    // Match the specific roles from the UserAccounts update panel
    if (activeTab === 'UserAccounts') {
      const roles = ['Admin', 'Doctor', 'Nurse', 'Staff', 'Staff'];
      return roles[index];
    }
    const states = ['PENDING', 'COMPLETED', 'FAILED', 'COMPLETED', 'PENDING'];
    return states[index];
  };

  return (
    <div className="space-y-6">
      {activeTab === 'Employees' && (
        <div className="flex gap-2 p-1.5 bg-slate-100/50 w-fit rounded-2xl border border-slate-100">
          {['All', 'Doctors', 'Nurses', 'Staff'].map(cat => (
            <button key={cat} onClick={() => setSubTab(cat)} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${subTab === cat ? 'bg-white text-[#008564] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{cat}</button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/30 shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900">{activeTab === 'Employees' && subTab !== 'All' ? `${subTab} Directory` : `${activeTab} Management`}</h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest italic">Database relational records</p>
          </div>
          {!isReadOnly && <button onClick={onAdd} className="bg-[#008564] text-white px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all hover:brightness-110 active:scale-95 uppercase">Insert {activeTab}</button>}
        </div>

        <div className="p-6 overflow-x-auto custom-scrollbar">
          <table className="w-max text-left border-separate border-spacing-x-0">
            <thead>
              <tr className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {current.cols.map(c => (
                  <th key={c} className="px-6 py-4 w-[180px] min-w-[180px]">{c}</th>
                ))}
                {!isReadOnly && <th className="px-6 py-4 w-[120px] min-w-[120px] text-right">Operations</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {isLoading ? (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400 italic">Connecting to Hospital Database...</td></tr>
              ) : dbData.length === 0 ? (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400">No relational records found for {activeTab}.</td></tr>
              ) : (
                dbData.map((record, rowIndex) => (
                  <tr key={record.id || rowIndex} className="hover:bg-slate-50/50 transition-all">
                    {current.cols.map((col, colIndex) => {
                      // Pulls the value from the database object using the column name as the key
                      const cellValue = record[col] || record[col.replace(' ', '')] || "—";

                      return (
                        <td key={colIndex} className="px-6 py-5 w-[180px] min-w-[180px]">
                          {col.toLowerCase().includes('status') || col === 'Occupancy' ? (
                            <StatusBadge value={cellValue} context={activeTab} />
                          ) : (
                            <span className={`text-xs ${colIndex === 0 ? 'font-mono text-[#008564] font-bold' : 'text-slate-600'}`}>
                              {cellValue}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    {!isReadOnly && (
                      <td className="px-6 py-5 w-[120px] min-w-[120px] text-right">
                        <button onClick={onEdit} className="text-[#008564] text-[10px] font-black uppercase hover:underline">Update</button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataInterface;