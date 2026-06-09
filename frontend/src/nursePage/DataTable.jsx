import React from 'react';

const DataTable = ({ activeTab }) => {
  const schema = {
    'My Shift': ['ScheduleID', 'ShiftDate', 'StartTime', 'EndTime', 'Status'],
    'Assigned Ward': ['WardID', 'WardName', 'DeptID', 'Capacity'],
    'Ward Patients': ['PatientID', 'PatientName', 'RoomID', 'AdmissionDate'],
    'Prescriptions': ['ItemID', 'PrescriptionID', 'MedicationID', 'Dosage'],
    'My Payroll': ['SalaryID', 'BaseAmount', 'PayDate', 'Status']
  };
  const cols = schema[activeTab] || ['ID', 'Data', 'Status'];

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-white to-slate-50/50">
        <div><h3 className="text-xl font-bold text-slate-900">{activeTab} Directory</h3><p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest italic">Clinical Relational Logic</p></div>
      </div>
      <div className="p-8 overflow-x-auto">
        <table className="w-full text-left min-w-[850px] table-fixed">
          <thead>
            <tr className="text-[10px] font-bold text-slate-300 uppercase tracking-widest border-b border-slate-50">
              {cols.map(c => <th key={c} className="pb-4">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4].map(i => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                {cols.map((c, idx) => (
                  <td key={idx} className="py-5">
                    <span className={`text-xs ${idx === 0 ? 'font-mono text-[#008564] font-bold' : 'font-medium text-slate-600'}`}>
                      {idx === 0 ? `NR-${activeTab.substring(0,2).toUpperCase()}-${i}` : 'DB_ENTRY'}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;