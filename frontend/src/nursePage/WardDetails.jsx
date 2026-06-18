import React from "react";
import { Layers, Hotel, ShieldAlert } from "lucide-react";

export default function WardDetails({ ward, rooms }) {
  if (!ward) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center text-slate-400 italic font-medium font-sans shadow-xs">
        No assigned ward found for this nurse profile.
      </div>
    );
  }

  const getOccupancyBadge = (occupancy) => {
    const val = String(occupancy || '').toUpperCase();
    if (val === 'AVAILABLE') return 'bg-blue-50 text-blue-700 border-blue-100/30';
    if (val === 'OCCUPIED') return 'bg-emerald-50 text-emerald-700 border-emerald-100/30';
    return 'bg-amber-50 text-amber-700 border-amber-100/30';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      {/* Ward Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center justify-center border border-emerald-100/50 shadow-inner">
            <Layers size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">{ward.WardName}</h3>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mt-1">
              Assigned Ward ID: WRD-{ward.WardID} • Capacity: {ward.Capacity} patients
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-emerald-800 bg-emerald-50 border border-emerald-100/30 rounded-full px-3 py-1 uppercase">
            Dept ID: {ward.DeptID}
          </span>
          <span className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-200/50 rounded-full px-3 py-1 uppercase">
            Active Status
          </span>
        </div>
      </div>

      {/* Rooms List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/20">
          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Hotel size={18} className="text-emerald-700" />
            Ward Rooms Directory
          </h4>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono">
            {rooms.length} Rooms Total
          </span>
        </div>

        <div className="p-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <th className="pb-4 px-4">Room ID</th>
                <th className="pb-4 px-4">Room Number</th>
                <th className="pb-4 px-4">Room Type</th>
                <th className="pb-4 px-4">Max Capacity</th>
                <th className="pb-4 px-4 text-right">Occupancy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.RoomID} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-5 px-4 font-mono font-bold text-emerald-800">
                      RM-{String(room.RoomID).padStart(3, '0')}
                    </td>
                    <td className="py-5 px-4 font-bold text-slate-700 font-mono">
                      {room.RoomNumber}
                    </td>
                    <td className="py-5 px-4 font-bold text-slate-500 uppercase tracking-wide">
                      {room.RoomType}
                    </td>
                    <td className="py-5 px-4 text-slate-600 font-semibold font-mono">
                      {room.MaxCapacity} Patients
                    </td>
                    <td className="py-5 px-4 text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase ${getOccupancyBadge(room.CurrentOccupancy)}`}>
                        {room.CurrentOccupancy || 'AVAILABLE'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-semibold italic">
                    No rooms found registered to this ward in database.
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
