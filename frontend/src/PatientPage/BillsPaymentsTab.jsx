import React from "react";
import { Receipt, CheckCircle, Clock, CreditCard, ShieldCheck } from "lucide-react";

export default function BillsPaymentsTab({ bills }) {
  // Aggregate stats across bills on-the-fly
  const totals = bills.reduce(
    (acc, b) => {
      acc.total += b.TotalAmount;
      acc.paid += b.PaidAmount;
      acc.outstanding += b.TotalAmount - b.PaidAmount;
      return acc;
    },
    { total: 0, paid: 0, outstanding: 0 }
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* LEDGER HEADER ACCENTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider">Accumulated Care Charges</span>
          <p className="text-xl font-black text-slate-800">{totals.total.toLocaleString()} ETB</p>
          <span className="text-[10px] text-slate-400 block font-semibold">Gross medical dues generated</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-450 font-extrabold block uppercase tracking-wider text-emerald-600">Settled Payments</span>
          <p className="text-xl font-black text-emerald-750">{totals.paid.toLocaleString()} ETB</p>
          <span className="text-[10px] text-emerald-500 block font-bold">Successfully cleared & closed</span>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 font-extrabold block uppercase tracking-wider text-rose-600">Awaiting Settlement</span>
          <p className="text-xl font-black text-rose-700">{totals.outstanding.toLocaleString()} ETB</p>
          <span className="text-[10px] text-rose-500 block font-bold">Outstanding balance invoice due</span>
        </div>
      </div>

      {/* DETAILED BILLING LEDGER */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-800 tracking-tight">Active Invoices & billing items</h3>
            <p className="text-xs text-slate-400 font-medium">Verify actual diagnostic, clinical session, and operating room invoice charges on file.</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
            <Receipt size={18} />
          </div>
        </div>

        <div className="p-6">
          {bills.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">No Billing Invoices Logged</p>
              <p className="text-[11px] text-slate-405">All clinic fees are settled or there are no historical charges indexed.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bills.map((bill) => {
                const outstanding = bill.TotalAmount - bill.PaidAmount;
                const isPaid = bill.Status === "Paid";
                return (
                  <div key={bill.BillID} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xs transition-all">
                    
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="py-0.5 px-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold font-mono">
                          {bill.BillID}
                        </span>
                        <h4 className="font-black text-slate-850 text-sm">{bill.Description}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold font-mono">Invoice Issued Date: {bill.BillingDate}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 border-t md:border-t-0 border-slate-200/60 pt-3 md:pt-0">
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-xs font-semibold">
                        <p className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">Charge Total</span>
                          <span className="text-slate-800 text-xs font-black">{bill.TotalAmount.toLocaleString()} ETB</span>
                        </p>
                        <p className="space-y-0.5">
                          <span className="text-[9px] text-slate-450 uppercase font-black block tracking-wider text-emerald-600">Paid Amount</span>
                          <span className="text-emerald-700 text-xs font-black">{bill.PaidAmount.toLocaleString()} ETB</span>
                        </p>
                        <p className="space-y-0.5">
                          <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider text-rose-500">Outstanding</span>
                          <span className="text-rose-700 text-xs font-black">{outstanding.toLocaleString()} ETB</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 pl-2">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          isPaid 
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                            : bill.Status === "Partially Paid"
                              ? "bg-amber-50 border-amber-100 text-amber-700 font-bold"
                              : "bg-rose-50 border-rose-100 text-rose-700"
                        }`}>
                          {bill.Status}
                        </span>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* TRANSACTION CLEARANCE RECEIPTS */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-6">
          <h3 className="font-bold text-base text-slate-800 tracking-tight">Financial Receipt & Payment Registry</h3>
          <p className="text-xs text-slate-400 font-medium">Verify authenticated Transaction References, payment date stamps, and banking gateway networks.</p>
        </div>

        <div className="p-6">
          {bills.every(b => b.payments.length === 0) ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No cleared transaction receipts on file for this account.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs font-medium">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4 font-mono">Receipt ID</th>
                    <th className="py-3 px-4">Invoice Match ID</th>
                    <th className="py-3 px-4">Cleared On</th>
                    <th className="py-3 px-4">Banking Channel</th>
                    <th className="py-3 px-4 font-mono">Audit Transaction Ref</th>
                    <th className="py-3 px-4 text-right">Cleared Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700">
                  {bills.flatMap(b => b.payments).map((pay) => (
                    <tr key={pay.PaymentID} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-slate-500 text-[11px]">{pay.PaymentID}</td>
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400 font-semibold">{pay.BillID}</td>
                      <td className="py-4 px-4 text-slate-650 font-bold">{pay.PaymentDate}</td>
                      <td className="py-4 px-4 flex items-center gap-2 mt-1">
                        <CreditCard size={12} className="text-slate-400" />
                        <span className="font-bold">{pay.PaymentMethod}</span>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-teal-700 text-[10.5px]">{pay.TransactionRef}</td>
                      <td className="py-4 px-4 text-right font-black text-slate-800">{pay.AmountPaid.toLocaleString()} ETB</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
