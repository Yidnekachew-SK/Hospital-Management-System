import React from 'react';
import { 
  Clock, 
  Layers, 
  Users, 
  Pill, 
  DollarSign, 
  Hotel,
  CalendarCheck
} from 'lucide-react';

const DataTable = ({ activeTab, data }) => {
  // Helper to format 24h SQL time to readable AM/PM
  const formatTime = (timeStr) => {
    if (!timeStr) return '—';
    try {
      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${parts[1]} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };

  const getStatusStyle = (status) => {
    const val = String(status || '').toLowerCase();
    if (val === 'active' || val === 'completed') return 'bg-emerald-50 text-emerald-800 border-emerald-100';
    if (val === 'scheduled' || val === 'pending') return 'bg-amber-50 text-amber-800 border-amber-105';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  const getOccupancyStyle = (occupancy) => {
    const val = String(occupancy || '').toUpperCase();
    if (val === 'AVAILABLE') return 'bg-blue-50 text-blue-805 border-blue-100/50';
    if (val === 'OCCUPIED') return 'bg-emerald-50 text-emerald-805 border-emerald-100/50';
    return 'bg-rose-50 text-rose-805 border-rose-100/50';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'My Shift': {
        const shifts = data || [];
        return (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[750px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-4">Schedule ID</th>
                  <th className="pb-4 px-4">Shift Date</th>
                  <th className="pb-4 px-4">Start Time</th>
                  <th className="pb-4 px-4">End Time</th>
                  <th className="pb-4 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {shifts.length > 0 ? (
                  shifts.map(shift => (
                    <tr key={shift.ScheduleID} className="hover:bg-[#F4FAF8]/30 transition-colors">
                      <td className="py-5 px-4 font-mono font-bold text-[#008564]">
                        SCH-{String(shift.ScheduleID).padStart(3, '0')}
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-800">
                        {new Date(shift.ShiftDate).toLocaleDateString(undefined, { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-600">
                        {formatTime(shift.ShiftStartTime)}
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-600">
                        {formatTime(shift.ShiftEndTime)}
                      </td>
                      <td className="py-5 px-4 text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black border uppercase ${getStatusStyle(shift.ShiftStatus)}`}>
                          {shift.ShiftStatus || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold italic">
                      No shift schedules found in database for your profile.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }

      case 'Assigned Ward': {
        const { ward, rooms } = data || { ward: null, rooms: [] };
        if (!ward) {
          return (
            <div className="p-8 text-center text-slate-400 font-semibold italic">
              No assigned ward registry details found.
            </div>
          );
        }
        return (
          <div className="space-y-8 p-8">
            {/* Ward Meta Card */}
            <div className="bg-[#F4FAF8] border border-[#CCE7E1] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-800">{ward.WardName}</h4>
                <p className="text-[10px] text-[#008564] font-black mt-1 uppercase tracking-wider">
                  WARD ID: WRD-{ward.WardID} • Total Bed Capacity: {ward.Capacity}
                </p>
              </div>
              <div className="inline-flex px-3 py-1 bg-white border border-[#E2EFEB] rounded-full text-[10px] font-black text-slate-500 uppercase tracking-wide">
                DEPT ID: {ward.DeptID}
              </div>
            </div>

            {/* Room List grid */}
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Hotel className="w-4 h-4 text-[#008564]" />
                  Ward Rooms Directory
                </h5>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{rooms.length} Rooms registered</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <th className="py-3 px-6">Room ID</th>
                      <th className="py-3 px-6">Room Number</th>
                      <th className="py-3 px-6">Room Type</th>
                      <th className="py-3 px-6">Max Capacity</th>
                      <th className="py-3 px-6 text-right">Occupancy Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                    {rooms.length > 0 ? (
                      rooms.map(room => (
                        <tr key={room.RoomID} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-[#008564]">
                            RM-{String(room.RoomID).padStart(3, '0')}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-800 font-mono">
                            {room.RoomNumber}
                          </td>
                          <td className="py-4 px-6 uppercase tracking-wider text-[10px] text-slate-500">
                            {room.RoomType}
                          </td>
                          <td className="py-4 px-6 font-mono">
                            {room.MaxCapacity} patients max
                          </td>
                          <td className="py-4 px-6 text-right">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black border uppercase ${getOccupancyStyle(room.CurrentOccupancy)}`}>
                              {room.CurrentOccupancy || 'AVAILABLE'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                          No rooms found in ward.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }

      case 'Ward Patients': {
        const patients = data || [];
        return (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-4">Patient ID</th>
                  <th className="pb-4 px-4">Name</th>
                  <th className="pb-4 px-4">Gender</th>
                  <th className="pb-4 px-4">DOB</th>
                  <th className="pb-4 px-4">Room No</th>
                  <th className="pb-4 px-4">Admit Date</th>
                  <th className="pb-4 px-4 text-right">Primary Diagnosis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {patients.length > 0 ? (
                  patients.map(p => (
                    <tr key={p.PatientID} className="hover:bg-[#F4FAF8]/30 transition-colors">
                      <td className="py-5 px-4 font-mono font-bold text-[#008564]">
                        PAT-{String(p.PatientID).padStart(3, '0')}
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-800">
                        {p.PatientName}
                      </td>
                      <td className="py-5 px-4 text-slate-500">
                        {p.Gender === 'F' ? 'Female' : 'Male'}
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-500">
                        {new Date(p.DOB_DATE).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-805 font-bold">
                        Rm {p.RoomNumber}
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-550">
                        {new Date(p.AdmissionDate).toLocaleDateString()}
                      </td>
                      <td className="py-5 px-4 text-right">
                        <span className="inline-flex px-2 py-0.5 bg-rose-50 border border-rose-100/50 text-rose-650 font-bold rounded text-[9px] uppercase tracking-wide">
                          {p.PrimaryDiagnosis || 'Monitoring'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-405 font-semibold italic">
                      No active patients admitted to your assigned ward rooms.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }

      case 'Prescriptions': {
        const rxItems = data || [];
        return (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-4">Item ID</th>
                  <th className="pb-4 px-4">Prescription ID</th>
                  <th className="pb-4 px-4">Patient Name</th>
                  <th className="pb-4 px-4">Medication</th>
                  <th className="pb-4 px-4">Dosage</th>
                  <th className="pb-4 px-4">Frequency</th>
                  <th className="pb-4 px-4 text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {rxItems.length > 0 ? (
                  rxItems.map(item => (
                    <tr key={item.ItemID} className="hover:bg-[#F4FAF8]/30 transition-colors">
                      <td className="py-5 px-4 font-mono font-bold text-[#008564]">
                        ITM-{String(item.ItemID).padStart(3, '0')}
                      </td>
                      <td className="py-5 px-4 font-mono font-bold text-slate-500">
                        RX-{String(item.PrescriptionID).padStart(3, '0')}
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-805">
                        {item.PatientName}
                      </td>
                      <td className="py-5 px-4">
                        <span className="font-bold text-slate-800 block">{item.MedicationName}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-mono block mt-0.5">{item.MedicationType}</span>
                      </td>
                      <td className="py-5 px-4 font-mono text-slate-650">
                        {item.Dosage}
                      </td>
                      <td className="py-5 px-4 text-slate-650">
                        {item.Frequency}
                      </td>
                      <td className="py-5 px-4 text-right text-[#008564] font-bold">
                        {item.Duration}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold italic">
                      No prescription logs found matching ward patients.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }

      case 'My Payroll': {
        const payroll = data || [];
        return (
          <div className="p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-4 px-4">Salary ID</th>
                  <th className="pb-4 px-4">Pay Date</th>
                  <th className="pb-4 px-4">Base Salary</th>
                  <th className="pb-4 px-4">Bonus</th>
                  <th className="pb-4 px-4">Deductions</th>
                  <th className="pb-4 px-4 text-right">Net Amount Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {payroll.length > 0 ? (
                  payroll.map(pay => {
                    const base = parseFloat(pay.BaseAmount) || 0;
                    const bonus = parseFloat(pay.Bonus) || 0;
                    const ded = parseFloat(pay.Deductions) || 0;
                    const net = base + bonus - ded;
                    return (
                      <tr key={pay.SalaryID} className="hover:bg-[#F4FAF8]/30 transition-colors">
                        <td className="py-5 px-4 font-mono font-bold text-[#008564]">
                          PAY-{String(pay.SalaryID).padStart(3, '0')}
                        </td>
                        <td className="py-5 px-4 font-bold text-slate-800">
                          {new Date(pay.PayDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-5 px-4 font-mono text-slate-600">
                          {base.toLocaleString()} ETB
                        </td>
                        <td className="py-5 px-4 font-mono text-emerald-600">
                          +{bonus.toLocaleString()} ETB
                        </td>
                        <td className="py-5 px-4 font-mono text-rose-600">
                          -{ded.toLocaleString()} ETB
                        </td>
                        <td className="py-5 px-4 text-right font-mono font-black text-slate-900 text-sm">
                          {net.toLocaleString()} ETB
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-semibold italic">
                      No payroll records processed in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }

      default:
        return (
          <div className="p-8 text-center text-slate-400 italic">
            Unknown Tab
          </div>
        );
    }
  };

  const getHeaderIcon = () => {
    switch (activeTab) {
      case 'My Shift': return <Clock className="w-5 h-5 text-[#008564]" />;
      case 'Assigned Ward': return <Layers className="w-5 h-5 text-[#008564]" />;
      case 'Ward Patients': return <Users className="w-5 h-5 text-[#008564]" />;
      case 'Prescriptions': return <Pill className="w-5 h-5 text-[#008564]" />;
      case 'My Payroll': return <DollarSign className="w-5 h-5 text-[#008564]" />;
      default: return <CalendarCheck className="w-5 h-5 text-[#008564]" />;
    }
  };

  return (
    <div className="bg-white rounded-[2.2rem] border border-slate-150 shadow-sm overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      <div className="px-10 py-7 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-white to-[#F4FAF8]/20">
        <div>
          <h3 className="text-lg font-black text-slate-905 tracking-tight flex items-center gap-2">
            {getHeaderIcon()}
            {activeTab} Directory
          </h3>
          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest italic">Hospital Relational Database Ledger</p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default DataTable;
