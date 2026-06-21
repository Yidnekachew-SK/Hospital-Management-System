import React, { useState, useEffect } from 'react';
import api, { getEndpoint } from '../utils/api';
import Sidebar from '../components/admin/Sidebar.jsx';
import MetricHub from '../components/admin/MetricHub.jsx';
import DataInterface from '../components/admin/DataInterface.jsx';

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

  const fetchDatabaseRecords = async () => {
    const path = getEndpoint(activeTab);
    if (!path || activeTab === 'Overview') return;

    setLoading(true);
    try {
      const response = await api.get(path);
      // Backend usually sends data inside a 'data' field or directly as an array
      setDbData(response.data.data || response.data || []);
    } catch (error) {
      console.error("Database connection error:", error);
      setDbData([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch every time the user clicks a new tab
  useEffect(() => {
    fetchDatabaseRecords();
  }, [activeTab]);

  // Relational schema definitions mapping 1-to-1 with the database model
  const schema = {
    'Employees': { 
      cols: ['EmployeeID', 'NationalID', 'FirstName', 'LastName', 'Status'], 
      fields: ['NationalID', 'FirstName', 'LastName', 'Gender', 'Phone', 'Email', 'DeptID', 'Salary', 'Status'] 
    },
    'UserAccounts': { 
      cols: ['UserID', 'EmployeeID', 'Username', 'Role'], 
      fields: ['EmployeeID', 'Username', 'PasswordHash', 'Role'] 
    },
    'Departments': { 
      cols: ['DeptID', 'Name', 'Building'], 
      fields: ['Name', 'Building'] 
    },
    'Wards': { 
      cols: ['WardID', 'WardName', 'DeptID', 'Capacity'], 
      fields: ['WardName', 'DeptID', 'Capacity'] 
    },
    'Rooms': { 
      cols: ['RoomID', 'WardID', 'RoomNumber', 'Occupancy'], 
      fields: ['WardID', 'RoomNumber', 'RoomType', 'MaxCapacity', 'Occupancy'] 
    },
    'Patients': { 
      cols: ['PatientID', 'NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'City'], 
      fields: ['NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'Region', 'City', 'HouseNumber', 'Phone', 'InsuranceID'] 
    },
    'Insurance': { 
      cols: ['InsuranceID', 'ProviderName', 'PolicyNumber', 'Details'], 
      fields: ['ProviderName', 'PolicyNumber', 'CoverageDetails'] 
    },
    'Billing': { 
      cols: ['BillID', 'PatientID', 'Total', 'Status'], 
      fields: ['PatientID', 'TotalAmount', 'BillDate', 'Status'] 
    },
    'Logs': { 
      cols: ['LogID', 'TableName', 'RecordID', 'ActionType', 'ActionDate', 'UserID'], 
      fields: [] 
    },
    'ActivityLog': { 
      cols: ['ActivityID', 'UserID', 'LoginTime', 'LogoutTime'], 
      fields: [] 
    }
  };

  const metrics = [
    { label: 'Personnel', val: '142', tab: 'Employees', color: 'bg-blue-50 text-blue-500' },
    { label: 'Revenue', val: '154k', tab: 'Billing', color: 'bg-amber-50 text-amber-500' },
    { label: 'Occupancy', val: '75%', tab: 'Rooms', color: 'bg-red-50 text-red-500' },
    { label: 'Security', val: 'Active', tab: 'Logs', color: 'bg-emerald-50 text-emerald-500' }
  ];

  const current = schema[activeTab] || { cols: ['ID', 'Attribute', 'Value'], fields: ['Field_Value'] };
  const isReadOnly = ['Logs', 'ActivityLog'].includes(activeTab);

  // Operations handlers for relational commits
  const triggerInsert = () => { setIsUpdateMode(false); setShowForm(true); };
  const triggerUpdate = () => { setIsUpdateMode(true); setShowForm(true); };

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
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter">Hub <Icons.Chevron /> <span className="text-[#008564]">{activeTab}</span></h2>
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
              <DataInterface 
                current={current} 
                activeTab={activeTab} 
                isReadOnly={isReadOnly} 
                onAdd={triggerInsert} 
                onEdit={triggerUpdate} 
                dbData={dbData} 
                isLoading={loading} 
              />
            </div>
          )}
        </div>
      </section>

      {/* Database control panel for specific relational updates */}
      <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col p-10">
            <div className="flex justify-between items-center mb-10">
               <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">{isUpdateMode ? 'Update' : 'New'} {activeTab}</h2>
                  <p className="text-xs text-[#008564] font-bold uppercase tracking-widest">Enforcing relational integrity</p>
               </div>
               <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Icons.X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
               {current.fields.map(f => (
                 <div key={f}>
                   <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{f.replace('_', ' ')}</label>
                   {/* Context-aware selection inputs for status fields */}
                   {f === 'Status' || f === 'Occupancy' || f === 'Role' ? (
                     <select className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#008564]/5 outline-none appearance-none font-bold">
                        {activeTab === 'Employees' && (
                          <>
                            <option>ACTIVE</option>
                            <option>PENDING</option>
                            <option>ON LEAVE</option>
                            <option>TERMINATED</option>
                          </>
                        )}
                        {activeTab === 'Rooms' && (
                          <>
                            <option>AVAILABLE</option>
                            <option>OCCUPIED</option>
                            <option>MAINTENANCE</option>
                          </>
                        )}
                        {activeTab === 'Billing' && (
                          <>
                            <option>PENDING</option>
                            <option>COMPLETED</option>
                            <option>FAILED</option>
                          </>
                        )}
                        {activeTab === 'UserAccounts' && (
                          <>
                            <option>Admin</option>
                            <option>Doctor</option>
                            <option>Nurse</option>
                            <option>Staff</option>
                          </>
                        )}
                        {!['Employees', 'Rooms', 'Billing', 'UserAccounts'].includes(activeTab) && (
                          <>
                            <option>PENDING</option>
                            <option>COMPLETED</option>
                            <option>FAILED</option>
                          </>
                        )}
                     </select>
                   ) : (
                     <input type="text" placeholder={`Enter ${f.toLowerCase()}...`} className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#008564]/5 outline-none" />
                   )}
                 </div>
               ))}
            </div>
            
            <div className="pt-10 flex gap-4">
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-2xl uppercase tracking-widest">Discard</button>
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 bg-[#008564] text-white text-xs font-bold rounded-2xl shadow-xl shadow-[#008564]/20 uppercase tracking-widest">Execute {isUpdateMode ? 'Update' : 'Commit'}</button>
            </div>
         </div>
      </div>
      {showForm && <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity" />}
    </div>
  );
};

export default AdminDashboard;