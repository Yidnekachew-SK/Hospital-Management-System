import React, { useState, useEffect } from 'react';
import api, { getEndpoint } from '../utils/api.js';
import Sidebar from './Sidebar.jsx';
import MetricHub from './MetricHub.jsx';
import DataInterface from './DataInterface.jsx';

const Icons = {
  Chevron: () => <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2" strokeLinecap="round"/></svg>,
  Alert: () => <svg className="w-12 h-12 text-rose-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [subTab, setSubTab] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formData, setFormData] = useState({});
  const [dbData, setDbData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterText, setFilterText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Dynamically determines schema based on selected tab and subTab
  const getActiveSchema = () => {
    if (activeTab === 'Employees') {
      if (subTab === 'Doctors') {
        return { 
          cols: ['EmployeeID', 'EmployeeName', 'Specialty', 'LicenseNumber', 'Phone', 'Email'], 
          fields: ['EmployeeID', 'NationalID', 'EmployeeName', 'Gender', 'Phone', 'Email', 'Address', 'DeptID', 'Salary', 'Specialty', 'LicenseNumber'] 
        };
      }
      if (subTab === 'Nurses') {
        return { 
          cols: ['EmployeeID', 'EmployeeName', 'Certification', 'AssignedWard', 'Phone', 'Email'], 
          fields: ['EmployeeID', 'NationalID', 'EmployeeName', 'Gender', 'Phone', 'Email', 'Address', 'DeptID', 'Salary', 'Certification', 'AssignedWard'] 
        };
      }
      if (subTab === 'Staff') {
        return { 
          cols: ['EmployeeID', 'EmployeeName', 'StaffRole', 'Phone', 'Email'], 
          fields: ['EmployeeID', 'NationalID', 'EmployeeName', 'Gender', 'Phone', 'Email', 'Address', 'DeptID', 'Salary', 'StaffRole'] 
        };
      }
      return { 
        cols: ['EmployeeID', 'NationalID', 'EmployeeName', 'Gender', 'Phone', 'Email', 'Address', 'Salary'], 
        fields: ['EmployeeID', 'NationalID', 'EmployeeName', 'Gender', 'Phone', 'Email', 'Address', 'DeptID', 'Salary'] 
      };
    }

    const schema = {
      'UserAccounts': { cols: ['UserID', 'EmployeeID', 'Username', 'Role'], fields: ['EmployeeID', 'Username', 'PasswordHash', 'Role'] },
      'Departments': { cols: ['DeptID', 'DeptName', 'Building'], fields: ['DeptName', 'Building'] },
      'Wards': { cols: ['WardID', 'WardName', 'DeptID', 'Capacity'], fields: ['WardName', 'DeptID', 'Capacity'] },
      'Rooms': { cols: ['RoomID', 'WardID', 'RoomNumber', 'RoomType', 'MaxCapacity', 'CurrentOccupancy'], fields: ['WardID', 'RoomNumber', 'RoomType', 'MaxCapacity', 'CurrentOccupancy'] },
      'Patients': { cols: ['PatientID', 'NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'Phone', 'InsuranceID'], fields: ['NationalID', 'PatientName', 'DOB_DATE', 'Gender', 'Region', 'City', 'HouseNumber', 'Phone', 'InsuranceID'] },
      'Insurance': { cols: ['InsuranceID', 'ProviderName', 'PolicyNumber', 'CoverageDetails'], fields: ['ProviderName', 'PolicyNumber', 'CoverageDetails'] },
      'Billing': { cols: ['BillID', 'PatientID', 'TotalAmount', 'BillDate', 'Status'], fields: ['PatientID', 'TotalAmount', 'BillDate', 'Status'] },
      'Logs': { cols: ['LogID', 'TableName', 'ActionType', 'ActionDate', 'Description'], fields: [] },
      'ActivityLog': { cols: ['ActivityID', 'UserID', 'LoginTime', 'LogoutTime'], fields: [] }
    };
    return schema[activeTab] || { cols: ['ID', 'Attribute', 'Value'], fields: ['Field'] };
  };

  const current = getActiveSchema();

  const getFormTitle = () => {
    const prefix = isUpdateMode ? 'Update' : 'New';
    if (activeTab === 'Employees') {
      if (subTab === 'Doctors') return `${prefix} Doctor`;
      if (subTab === 'Nurses') return `${prefix} Nurse`;
      if (subTab === 'Staff') return `${prefix} Staff`;
      return `${prefix} Employee`;
    }
    const singulars = {
      'UserAccounts': 'User Account',
      'Departments': 'Department',
      'Wards': 'Ward',
      'Rooms': 'Room',
      'Patients': 'Patient',
      'Insurance': 'Insurance Policy',
      'Billing': 'Bill'
    };
    return `${prefix} ${singulars[activeTab] || activeTab}`;
  };

  const metrics = [
    { label: 'Personnel', val: '142', tab: 'Employees', color: 'bg-blue-50 text-blue-500', d: "M17 20h5v-2a3 3 0 00-5.356-1.857" },
    { label: 'Revenue', val: '154k', tab: 'Billing', color: 'bg-amber-50 text-amber-500', d: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2" },
    { label: 'Occupancy', val: '75%', tab: 'Rooms', color: 'bg-red-50 text-red-500', d: "M19 21V5a2 2 0 00-2-2H7" },
    { label: 'Security', val: 'Active', tab: 'Logs', color: 'bg-emerald-50 text-emerald-500', d: "M9 12l2 2 4-4" }
  ];

  // Helper to get active API fetch URL
  const getFetchPath = () => {
    if (activeTab === 'Employees') {
      if (subTab === 'All') return '/employees/';
      if (subTab === 'Doctors') return '/employees/doctors/all/detailed';
      if (subTab === 'Nurses') return '/employees/nurses/all/detailed';
      if (subTab === 'Staff') return '/employees/staff/all/detailed';
    }
    return getEndpoint(activeTab);
  };

  const syncDatabase = async () => {
    const path = getFetchPath();
    if (!path || activeTab === 'Overview') return;
    setLoading(true);
    try {
      const response = await api.get(path);
      const result = response.data.data || response.data;
      const records = Array.isArray(result) ? result : (Object.values(result).find(val => Array.isArray(val)) || [result]);
      setDbData(records);
    } catch (error) { 
      setDbData([]); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    syncDatabase();
    setSearchQuery('');
    setFilterText('');
    setShowSuggestions(false);
  }, [activeTab, subTab]);

  // Handle Search Queries
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val === '') {
      setFilterText('');
    }
    setShowSuggestions(true);
  };

  // Generate dynamic search suggestions from dbData
  const getSuggestions = () => {
    if (!searchQuery) return [];
    const lower = searchQuery.toLowerCase();
    
    const matches = dbData.filter(record => {
      return Object.values(record).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(lower)
      );
    });

    const unique = new Set();
    const suggestionsList = [];

    matches.forEach(record => {
      const nameKey = Object.keys(record).find(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('username') || k.toLowerCase().includes('number'));
      const idKey = Object.keys(record).find(k => k.toLowerCase().includes('id'));
      
      const nameVal = nameKey ? record[nameKey] : '';
      const idVal = idKey ? record[idKey] : '';
      
      let displayStr = '';
      if (nameVal && idVal) {
        displayStr = `${nameVal} (${idVal})`;
      } else if (nameVal) {
        displayStr = String(nameVal);
      } else if (idVal) {
        displayStr = String(idVal);
      } else {
        const keys = Object.keys(record);
        displayStr = keys.length > 0 ? String(record[keys[0]]) : '';
      }

      if (displayStr && !unique.has(displayStr)) {
        unique.add(displayStr);
        suggestionsList.push({
          display: displayStr,
          filterVal: nameVal || idVal || displayStr
        });
      }
    });

    return suggestionsList;
  };

  // Filter display rows matching search filterText
  const displayedData = dbData.filter(record => {
    if (!filterText) return true;
    const lowerFilter = filterText.toLowerCase();
    return Object.values(record).some(val => 
      val !== null && val !== undefined && String(val).toLowerCase().includes(lowerFilter)
    );
  });

  const getIdentifierKey = () => {
    if (activeTab === 'Employees') return 'EmployeeID';
    if (activeTab === 'UserAccounts') return 'UserID';
    if (activeTab === 'Departments') return 'DeptID';
    if (activeTab === 'Wards') return 'WardID';
    if (activeTab === 'Rooms') return 'RoomID';
    if (activeTab === 'Patients') return 'PatientID';
    if (activeTab === 'Insurance') return 'InsuranceID';
    if (activeTab === 'Billing') return 'BillID';
    return null;
  };

  const getRecordId = (record) => {
    const idKey = getIdentifierKey();
    if (!idKey || !record) return null;
    const dbKey = Object.keys(record).find(k => k.toLowerCase() === idKey.toLowerCase());
    return dbKey ? record[dbKey] : null;
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    setIsUpdateMode(false);
    const initialForm = {};
    current.fields.forEach(f => {
      initialForm[f] = '';
    });
    setFormData(initialForm);
    setShowForm(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsUpdateMode(true);
    const initialForm = {};
    current.fields.forEach(f => {
      const searchKey = f.toLowerCase().replace(/_/g, '');
      const dbKey = Object.keys(record).find(k => k.toLowerCase().replace(/_/g, '') === searchKey);
      initialForm[f] = dbKey ? record[dbKey] : '';
    });
    setFormData(initialForm);
    setShowForm(true);
  };

  const handleCommit = async () => {
    try {
      let url = '';
      if (activeTab === 'Employees') {
        if (subTab === 'All') url = '/employees/';
        else if (subTab === 'Doctors') url = '/employees/doctors';
        else if (subTab === 'Nurses') url = '/employees/nurses';
        else if (subTab === 'Staff') url = '/employees/staff';
      } else {
        url = getEndpoint(activeTab);
      }

      if (isUpdateMode) {
        const recordId = getRecordId(selectedRecord);
        if (activeTab === 'Employees') {
          if (subTab === 'All') {
            await api.put(`/employees/${recordId}`, formData);
          } else if (subTab === 'Doctors') {
            // Update base employee part
            await api.put(`/employees/${recordId}`, formData);
            // Update doctor specific part
            await api.put(`/employees/doctors/${recordId}`, formData);
          } else if (subTab === 'Nurses') {
            await api.put(`/employees/${recordId}`, formData);
            await api.put(`/employees/nurses/${recordId}`, formData);
          } else if (subTab === 'Staff') {
            await api.put(`/employees/${recordId}`, formData);
            await api.put(`/employees/staff/${recordId}`, formData);
          }
        } else if (activeTab === 'Patients') {
          url = `/patients/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'UserAccounts') {
          url = `/auth/user-accounts/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'Departments') {
          url = `/employees/departments/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'Wards') {
          url = `/clinic/wards/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'Rooms') {
          url = `/clinic/rooms/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'Insurance') {
          url = `/patients/insurance/${recordId}`;
          await api.put(url, formData);
        } else if (activeTab === 'Billing') {
          url = `/finance/bills/${recordId}`;
          await api.put(url, formData);
        }
      } else {
        if (activeTab === 'Employees') {
          if (subTab === 'All') {
            await api.post('/employees/', formData);
          } else if (subTab === 'Doctors') {
            // First post base employee details
            await api.post('/employees/', formData);
            // Then register as doctor
            await api.post('/employees/doctors', formData);
          } else if (subTab === 'Nurses') {
            await api.post('/employees/', formData);
            await api.post('/employees/nurses', formData);
          } else if (subTab === 'Staff') {
            await api.post('/employees/', formData);
            await api.post('/employees/staff', formData);
          }
        } else {
          await api.post(url, formData);
        }
      }

      await syncDatabase();
      setShowForm(false);
    } catch (error) {
      console.error('Commit Error:', error);
      alert('Error committing changes: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-slate-700 font-sans overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setShowLogoutModal(true)} navGroups={[
        { label: 'Management', items: ["Employees", "UserAccounts", "Departments"] },
        { label: 'Facilities', items: ["Wards", "Rooms"] },
        { label: 'Relational Data', items: ["Patients", "Insurance", "Billing"] },
        { label: 'System Audit', items: ["Logs", "ActivityLog"] }
      ]} />
      
      <section className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 uppercase tracking-tighter cursor-pointer" onClick={() => { setActiveTab('Overview'); setSubTab('All'); }}>System Hub <Icons.Chevron /> <span className="text-[#008564]">{activeTab}</span></h2>
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#008564] transition-colors"><Icons.Search /></span>
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setFilterText(searchQuery);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => setShowSuggestions(true)}
              className="pl-10 pr-4 py-2 bg-slate-100/50 rounded-xl text-xs w-64 outline-none" 
            />
            {searchQuery && showSuggestions && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-xl shadow-lg z-[200] max-h-48 overflow-y-auto py-2 text-xs">
                {getSuggestions().length > 0 ? (
                  getSuggestions().map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(s.display);
                        setFilterText(s.filterVal);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors truncate font-bold text-slate-700"
                    >
                      {s.display}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-slate-400 italic">Not found</div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 bg-[#F9FAFB]">
          {activeTab === 'Overview' ? (
            <div className="space-y-10">
               <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Infrastructure Summary</h2>
               <MetricHub metrics={metrics} isMini={false} onNavigate={(tab) => { setActiveTab(tab); setSubTab('All'); }} />
            </div>
          ) : (
            <div className="space-y-6">
              <MetricHub metrics={metrics} isMini={true} onNavigate={(tab) => { setActiveTab(tab); setSubTab('All'); }} />
              <DataInterface 
                current={current} 
                activeTab={activeTab} 
                isReadOnly={['Logs', 'ActivityLog'].includes(activeTab)} 
                onAdd={handleAdd} 
                onEdit={handleEdit} 
                dbData={displayedData} 
                isLoading={loading} 
                subTab={subTab}
                setSubTab={setSubTab}
              />
            </div>
          )}
        </div>
      </section>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] p-12 w-full max-w-md shadow-2xl text-center">
            <div className="flex justify-center"><Icons.Alert /></div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">End Session?</h2>
            <p className="text-sm text-slate-500 mb-10">Are you sure you want to sign out of the hospital management gateway?</p>
            <div className="flex gap-4">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-2xl transition-all">CANCEL</button>
              <button onClick={() => window.location.reload()} className="flex-1 py-4 bg-rose-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all">YES, SIGN OUT</button>
            </div>
          </div>
        </div>
      )}

      {/* Insert/Update Slide-over Panel */}
      <div className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-2xl transform transition-transform duration-500 ease-out z-50 ${showForm ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col p-10">
            <div className="flex justify-between items-center mb-10">
               <div><h2 className="text-2xl font-bold text-slate-900 tracking-tighter uppercase">{getFormTitle()}</h2></div>
               <button onClick={() => setShowForm(false)} className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"><Icons.X /></button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
               {current.fields.map(f => (
                 <div key={f}>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{f.replace('_', ' ')}</label>
                    {f.toLowerCase().includes('status') || f === 'Occupancy' || f === 'CurrentOccupancy' || f === 'Gender' || f === 'Role' ? (
                      <select 
                        value={formData[f] || ''}
                        onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-[#008564]/5 outline-none appearance-none font-bold uppercase"
                      >
                         <option value="">Select Option...</option>
                         {f === 'Gender' ? (
                           <><option value="M">MALE (M)</option><option value="F">FEMALE (F)</option></>
                         ) : f === 'Role' ? (
                           <><option value="Admin">Admin</option><option value="Doctor">Doctor</option><option value="Nurse">Nurse</option><option value="Staff">Staff</option></>
                         ) : activeTab === 'Employees' ? (
                           <><option value="ACTIVE">ACTIVE</option><option value="PENDING">PENDING</option><option value="ON LEAVE">ON LEAVE</option><option value="TERMINATED">TERMINATED</option></>
                         ) : activeTab === 'Rooms' ? (
                           <><option value="AVAILABLE">AVAILABLE</option><option value="OCCUPIED">OCCUPIED</option><option value="MAINTENANCE">MAINTENANCE</option></>
                         ) : (
                           <><option value="PENDING">PENDING</option><option value="COMPLETED">COMPLETED</option><option value="FAILED">FAILED</option></>
                         )}
                      </select>
                    ) : (
                      <input 
                        type="text" 
                        value={formData[f] || ''}
                        onChange={(e) => setFormData({ ...formData, [f]: e.target.value })}
                        placeholder={`Enter ${f.toLowerCase()}...`} 
                        className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 text-sm focus:bg-white focus:ring-4 focus:ring-[#008564]/5 outline-none" 
                      />
                    )}
                 </div>
               ))}
            </div>
            <div className="pt-10 flex gap-4">
               <button onClick={() => setShowForm(false)} className="flex-1 py-4 text-xs font-bold text-slate-400 hover:bg-slate-50 rounded-2xl uppercase tracking-widest">Discard</button>
               <button onClick={handleCommit} className="flex-1 py-4 bg-[#008564] text-white text-xs font-bold rounded-2xl shadow-xl shadow-[#008564]/20 uppercase tracking-widest">Commit Changes</button>
            </div>
         </div>
      </div>
      {showForm && <div onClick={() => setShowForm(false)} className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-40 transition-opacity" />}
    </div>
  );
};

export default AdminDashboard;