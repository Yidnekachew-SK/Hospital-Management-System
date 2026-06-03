import React, { useState } from 'react';

const StatusBadge = ({ value, context }) => {
  const colorMap = {
    'ACTIVE': 'bg-emerald-50 text-emerald-600',
    'COMPLETED': 'bg-emerald-50 text-emerald-600',
    'OCCUPIED': 'bg-emerald-50 text-emerald-600',
    'AVAILABLE': 'bg-blue-50 text-blue-600',
    'ON LEAVE': 'bg-blue-50 text-blue-600',
    'PENDING': 'bg-amber-50 text-amber-600',
    'MAINTENANCE': 'bg-amber-50 text-amber-600',
    'TERMINATED': 'bg-red-50 text-red-600',
    'FAILED': 'bg-red-50 text-red-600'
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold ${colorMap[value] || 'bg-slate-50 text-slate-400'}`}>
      <div className="w-1 h-1 rounded-full bg-current" />
      {value}
    </div>
  );
};

const DataInterface = ({ current, activeTab, isReadOnly, onAdd, onEdit, dbData, isLoading }) => {
  const [subTab, setSubTab] = useState('All');

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
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest italic">Relational Integrity Verified</p>
          </div>
          {!isReadOnly && <button onClick={onAdd} className="bg-[#008564] text-white px-6 py-3 rounded-2xl text-[10px] font-black tracking-widest uppercase transition-all hover:brightness-110 active:scale-95">Insert {activeTab}</button>}
        </div>

        <div className="p-6 overflow-x-auto custom-scrollbar">
          <table className="w-max text-left border-separate border-spacing-x-0">
            <thead>
              <tr className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                {current.cols.map(c => <th key={c} className="px-6 py-4 w-[180px] min-w-[180px]">{c}</th>)}
                {!isReadOnly && <th className="px-6 py-4 w-[120px] min-w-[120px] text-right">Operations</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {isLoading ? (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400 italic">Syncing with database...</td></tr>
              ) : dbData.length > 0 ? (
                dbData.map((record, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-all">
                    {current.cols.map((colName, idx) => {
                      const searchKey = colName.toLowerCase().replace(/\s/g, '');
                      const dbKey = Object.keys(record).find(k => k.toLowerCase().replace(/_/g, '') === searchKey);
                      const displayValue = dbKey ? record[dbKey] : "—";

                      return (
                        <td key={idx} className="px-6 py-5 w-[180px] min-w-[180px]">
                          {colName.toLowerCase().includes('status') || colName === 'Occupancy' || colName === 'Role' ? (
                            <StatusBadge value={displayValue} context={activeTab} />
                          ) : (
                            <span className={`text-xs ${idx === 0 ? 'font-mono text-[#008564] font-bold' : 'text-slate-600'}`}>
                              {displayValue}
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
              ) : (
                <tr><td colSpan={current.cols.length + 1} className="p-10 text-center text-slate-400 uppercase font-bold text-xs tracking-widest">No relational records found for {activeTab}.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataInterface;