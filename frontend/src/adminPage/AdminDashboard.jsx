import React, { useState, useEffect } from 'react';
import api, { getEndpoint } from '../utils/api.js';
import Sidebar from './Sidebar.jsx';
import MetricHub from './MetricHub.jsx';
import DataInterface from './DataInterface.jsx';

const Icons = {
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round"/></svg>,
  Chevron: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showForm, setShowForm] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(false);

  const schema = {
    'Employees': { cols: ['EmployeeID', 'NationalID', 'FirstName', 'LastName', 'Status'], fields: ['NationalID', 'FirstName', 'LastName', 'Gender', 'DeptID', 'Salary', 'Status'] },
    'Insurance': { cols: ['InsuranceID', 'ProviderName', 'PolicyNumber', 'Details'], fields: ['ProviderName', 'PolicyNumber', 'CoverageDetails'] },
    'Rooms': { cols: ['RoomID', 'WardID', 'RoomNumber', 'Occupancy'], fields: ['WardID', 'RoomNumber', 'RoomType', 'MaxCapacity', 'Status'] },
    'Patients': { cols: ['PatientID', 'NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'City'], fields: ['NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'Region', 'City', 'HouseNumber', 'Phone', 'InsuranceID'] },
    'Billing': { cols: ['BillID', 'PatientID', 'Total', 'Status'], fields: ['PatientID', 'TotalAmount', 'BillDate', 'Status'] },
    'Logs': { cols: ['LogID', 'TableName', 'RecordID', 'ActionType', 'ActionDate', 'UserID'], fields: [] }
  };

  const current = schema[activeTab] || { cols: ['ID', 'Attribute', 'Value'], fields: ['Field_Value'] };
  const metrics = [
    { label: 'Personnel', val: '142', tab: 'Employees', color: 'bg-blue-50 text-blue-500', d: "M17 20h5v-2a3 3 0 00-5.356-1.857" },
    { label: 'Revenue', val: '154k', tab: 'Billing', color: 'bg-amber-50 text-amber-500', d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" },
    { label: 'Occupancy', val: '75%', tab: 'Rooms', color: 'bg-red-50 text-red-500', d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" },
    { label: 'Security', val: 'Active', tab: 'Logs', color: 'bg-emerald-50 text-emerald-500', d: "M9 12l2 2 4-4" }
  ];

  useEffect(() => {
    const syncDatabase = async () => {
      const path = getEndpoint(activeTab);
      if (!path || activeTab === 'Overview') return;
      setLoading(true);
      try {
        const response = await api.get(path);
        const result = response.data.data || response.data;
        const records = Array.isArray(result) ? result : (Object.values(result).find(val => Array.isArray(val)) || [result]);
        setDbData(records);
      } catch (error) { setDbData([]); }
      finally { setLoading(false); }
    };
    syncDatabase();
  }, [activeTab]);

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-700 font-sans overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} navGroups={[
        { label: 'Management', items: ["Employees", "UserAccounts", "Departments"] },
        { label: 'Facilities', items: ["Wards", "Rooms"] },
        { label: 'Relational Data', items: ["Patients", "Insurance", "Billing"] },
        { label: 'System Audit', items: ["Logs", "ActivityLog"] }
      ]} />
      
      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter cursor-pointer" onClick={() => setActiveTab('Overview')}>System Hub <Icons.Chevron /> <span className="text-[#008564]">{activeTab}</span></h2>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#008564] transition-colors"><Icons.Search /></span>
            <input type="text" placeholder="Search resources..." className="pl-10 pr-4 py-2 bg-slate-100/50 rounded-xl text-xs w-64 outline-none" />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 bg-[#F9FAFB]">
          {activeTab === 'Overview' ? (
            <div className="space-y-10">
               <div><h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Infrastructure Summary</h2><p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Relational Monitoring Active</p></div>
               <MetricHub metrics={metrics} isMini={false} onNavigate={setActiveTab} />
            </div>
          ) : (
            <div className="space-y-6">
              <MetricHub metrics={metrics} isMini={true} onNavigate={setActiveTab} />
              <DataInterface current={current} activeTab={activeTab} isReadOnly={['Logs', 'ActivityLog'].includes(activeTab)} onAdd={() => {setIsUpdateMode(false); setShowForm(true)}} onEdit={() => {setIsUpdateMode(true); setShowForm(true)}} dbData={dbData} isLoading={loading} />
            </div>
          )}
        </div>
      </section>

      {/* Slide-over panel */}
      <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col p-10">
            <div className="flex justify-between items-center mb-10">
               <div><h2 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">{isUpdateMode ? 'Update' : 'New'} {activeTab}</h2><p className="text-xs text-[#008564] font-bold uppercase">Enforcing relational integrity</p></div>
               <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Icons.X /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
               {current.fields.map(f => (
                 <div key={f}>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{f.replace('_', ' ')}</label>
                   {f.toLowerCase().includes('status') || f === 'Occupancy' ? (
                     <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#008564]/5 outline-none appearance-none font-bold">
                        {activeTab === 'Employees' ? <><option>ACTIVE</option><option>PENDING</option><option>ON LEAVE</option><option>TERMINATED</option></> : activeTab === 'Rooms' ? <><option>AVAILABLE</option><option>OCCUPIED</option><option>MAINTENANCE</option></> : <><option>PENDING</option><option>COMPLETED</option><option>FAILED</option></>}
                     </select>
                   ) : (
                     <input type="text" placeholder={`Enter ${f.toLowerCase()}...`} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#008564]/5 outline-none" />
                   )}
                 </div>
               ))}
            </div>
            <div className="pt-10 flex gap-4">
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-2xl uppercase">Discard</button>
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 bg-[#008564] text-white text-xs font-bold rounded-2xl shadow-xl shadow-[#008564]/20 uppercase tracking-widest">Execute Commit</button>
            </div>
         </div>
      </div>
      {showForm && <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity" />}
    </div>
  );
};

export default AdminDashboard;