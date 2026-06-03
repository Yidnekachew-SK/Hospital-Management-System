import React, { useState } from "react";
import { PlusCircle, Edit3, DollarSign, Check, FileText, Landmark } from "lucide-react";

export default function PaymentManager({ 
  bills, 
  payments, 
  patients, 
  onAddBill, 
  onUpdateBill, 
  onRecordPayment 
}) {
  const [subTab, setSubTab] = useState("bills"); // 'bills' | 'payments'

  // --- BILL FORM STATE ---
  const [billForm, setBillForm] = useState({
    BillID: "",
    PatientID: "",
    TotalAmount: "",
    InsuranceCoverageAmount: "",
    BillDate: new Date().toISOString().split("T")[0],
    Status: "Pending"
  });
  const [isEditingBill, setIsEditingBill] = useState(false);

  // --- PAYMENT FORM STATE ---
  const [paymentForm, setPaymentForm] = useState({
    PaymentID: "",
    BillID: "",
    PaymentDate: new Date().toISOString().split("T")[0],
    AmountPaid: "",
    PaymentMethod: "Cash"
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Handle Edit/Update Bill click
  const handleEditBillClick = (bill) => {
    setBillForm({
      BillID: bill.BillID || "",
      PatientID: bill.PatientID || "",
      TotalAmount: bill.TotalAmount || "",
      InsuranceCoverageAmount: bill.InsuranceCoverageAmount || "",
      BillDate: bill.BillDate || new Date().toISOString().split("T")[0],
      Status: bill.Status || "Pending"
    });
    setIsEditingBill(true);
    setSubTab("bills"); // ensure we are in bills view to see the form
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleResetBillForm = () => {
    setBillForm({
      BillID: "",
      PatientID: patients[0]?.PatientID || "",
      TotalAmount: "",
      InsuranceCoverageAmount: "",
      BillDate: new Date().toISOString().split("T")[0],
      Status: "Pending"
    });
    setIsEditingBill(false);
  };

  const handleBillSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!billForm.PatientID) {
      setErrorMessage("Please select a valid patient profile.");
      return;
    }
    if (Number(billForm.TotalAmount) <= 0) {
      setErrorMessage("Total bill amount must be greater than 0.");
      return;
    }

    try {
      if (isEditingBill) {
        await onUpdateBill(billForm.BillID, {
          ...billForm,
          TotalAmount: Number(billForm.TotalAmount),
          InsuranceCoverageAmount: Number(billForm.InsuranceCoverageAmount) || 0
        });
        setSuccessMessage(`Bill ${billForm.BillID} updated successfully!`);
      } else {
        const payload = { ...billForm };
        delete payload.BillID;
        await onAddBill({
          ...payload,
          TotalAmount: Number(payload.TotalAmount),
          InsuranceCoverageAmount: Number(payload.InsuranceCoverageAmount) || 0
        });
        setSuccessMessage(`New billing invoice logged successfully!`);
      }
      handleResetBillForm();
    } catch (err) {
      setErrorMessage("Failed to submit bill invoice schema. Verify inputs.");
      console.error(err);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!paymentForm.BillID) {
      setErrorMessage("Please select a bill destination mapping.");
      return;
    }
    if (Number(paymentForm.AmountPaid) <= 0) {
      setErrorMessage("Payment entry amount must be greater than 0.");
      return;
    }

    // Verify payment does not exceed outstanding balance
    const parentBill = bills.find(b => b.BillID === paymentForm.BillID);
    if (parentBill) {
      const paymentsForBill = payments.filter(p => p.BillID === parentBill.BillID);
      const totalPaid = paymentsForBill.reduce((sum, p) => sum + (Number(p.AmountPaid) || 0), 0);
      const outstandingLimit = parentBill.TotalAmount - parentBill.InsuranceCoverageAmount - totalPaid;
      
      // Let's print feedback if outstanding is zero but still allow check process
      if (outstandingLimit <= 0) {
        if (!confirm("This bill is already fully paid. Do you still wish to submit an overpayment?")) {
          return;
        }
      }
    }

    try {
      const payload = { ...paymentForm };
      delete payload.PaymentID;
      await onRecordPayment({
        ...payload,
        AmountPaid: Number(payload.AmountPaid)
      });
      setSuccessMessage(`Payment recorded successfully against Invoice ${paymentForm.BillID}!`);
      setPaymentForm({
        PaymentID: "",
        BillID: bills[0]?.BillID || "",
        PaymentDate: new Date().toISOString().split("T")[0],
        AmountPaid: "",
        PaymentMethod: "Cash"
      });
    } catch (err) {
      setErrorMessage("Payment record failed. Please retry.");
      console.error(err);
    }
  };

  return (
    <div id="payment-workspace-section" className="space-y-6">
      
      {/* Horizontal Sub-menus inside Payment module */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => { setSubTab("bills"); setSuccessMessage(""); setErrorMessage(""); }}
          className={`py-3 px-6 font-display font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "bills" 
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/20" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Invoices & Patient Bills ({bills.length})</span>
        </button>
        <button
          onClick={() => { setSubTab("payments"); setSuccessMessage(""); setErrorMessage(""); }}
          className={`py-3 px-6 font-display font-semibold text-sm border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            subTab === "payments" 
              ? "border-emerald-600 text-emerald-700 bg-emerald-50/20" 
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          <Landmark className="w-4 h-4" />
          <span>Received Payments Ledger ({payments.length})</span>
        </button>
      </div>

      {successMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-800 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* RENDER BILLS OPTION */}
      {subTab === "bills" && (
        <div id="bills-ledger-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Side */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
            <h4 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              <span>Registered Patient Invoices</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                    <th className="py-3 px-4 font-mono text-xs">BillID</th>
                    <th className="py-3 px-4">Patient Profile</th>
                    <th className="py-3 px-4 text-right">Invoice Sum</th>
                    <th className="py-3 px-4 text-right">Ins Covered</th>
                    <th className="py-3 px-4 text-right">Outstanding</th>
                    <th className="py-3 px-4 text-center">Date</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {bills.map((b) => {
                    const patient = patients.find(p => p.PatientID === b.PatientID);
                    
                    // Outstanding computation:
                    const billPayments = payments.filter(p => p.BillID === b.BillID);
                    const totalPaid = billPayments.reduce((s, p) => s + (Number(p.AmountPaid) || 0), 0);
                    const insCovered = Number(b.InsuranceCoverageAmount) || 0;
                    const outstanding = Math.max(0, b.TotalAmount - insCovered - totalPaid);

                    return (
                      <tr key={b.BillID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-800 font-bold">{b.BillID}</td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-700">{patient ? patient.PatientName : "Unknown Patient"}</div>
                          <div className="text-[10px] font-mono text-slate-400">{b.PatientID}</div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-slate-800 font-mono">${b.TotalAmount}</td>
                        <td className="py-3 px-4 text-right text-emerald-600 text-xs font-semibold font-mono">${insCovered}</td>
                        <td className="py-3 px-4 text-right font-bold text-slate-800 font-mono">
                          {outstanding === 0 ? (
                            <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded text-[11px]">$0.00</span>
                          ) : (
                            <span className="text-rose-700">${outstanding}</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-xs text-slate-400 font-mono">{b.BillDate || b.BillingDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            b.Status === "Paid" 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                          }`}>
                            {b.Status || "Pending"}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleEditBillClick(b)}
                            className="p-1 px-2.5 bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                            title="Edit row"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Update</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {bills.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                        No invoices logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-display font-bold text-slate-800 text-base mb-1">
              {isEditingBill ? "Update Invoice Details" : "Create New Billing Invoice"}
            </h4>
            <p className="text-slate-400 text-xs mb-4">
              File service fees, procedure costs, and mapped insurance portions.
            </p>

            <form onSubmit={handleBillSubmit} className="space-y-4">
              {isEditingBill && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                    Invoice ID
                  </label>
                  <input
                    type="text"
                    value={billForm.BillID}
                    disabled
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl cursor-not-allowed font-mono text-slate-550"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Recipient Patient
                </label>
                <select
                  value={billForm.PatientID}
                  onChange={(e) => setBillForm(prev => ({ ...prev, PatientID: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Choose Patient --</option>
                  {patients.map(p => (
                    <option key={p.PatientID} value={p.PatientID}>
                      {p.PatientName} ({p.PatientID})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Total Bill Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={billForm.TotalAmount}
                  onChange={(e) => setBillForm(prev => ({ ...prev, TotalAmount: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Insurance Covered Amount ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 300 (Put 0 for self-pay)"
                  value={billForm.InsuranceCoverageAmount}
                  onChange={(e) => setBillForm(prev => ({ ...prev, InsuranceCoverageAmount: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Billing Date
                </label>
                <input
                  type="date"
                  value={billForm.BillDate}
                  onChange={(e) => setBillForm(prev => ({ ...prev, BillDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Collection Status
                </label>
                <select
                  value={billForm.Status}
                  onChange={(e) => setBillForm(prev => ({ ...prev, Status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="Pending">Pending Collection</option>
                  <option value="Paid">Mark fully Paid</option>
                </select>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>{isEditingBill ? "Update Invoice Row" : "File Service Invoice"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetBillForm}
                  className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-medium border border-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENDER PAYMENTS OPTION */}
      {subTab === "payments" && (
        <div id="payments-ledger-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table Side */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 overflow-hidden">
            <h4 className="font-display font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-emerald-600" />
              <span>Received Payments ledger</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                    <th className="py-3 px-4 font-mono text-xs">PaymentID</th>
                    <th className="py-3 px-4">Invoice Target</th>
                    <th className="py-3 px-4 text-right">Amount Received</th>
                    <th className="py-3 px-4 text-center">Payment Method</th>
                    <th className="py-3 px-4 text-center">Submission Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {payments.map((p) => {
                    const bill = bills.find(b => b.BillID === p.BillID);
                    const patient = bill ? patients.find(pat => pat.PatientID === bill.PatientID) : null;

                    return (
                      <tr key={p.PaymentID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-xs text-slate-800 font-semibold">{p.PaymentID}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-slate-700">Invoice: <span className="font-mono font-bold text-slate-800">{p.BillID}</span></div>
                          {patient && (
                            <div className="text-[10px] text-slate-400">Payer: {patient.PatientName}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right font-bold text-emerald-700 font-mono">+${p.AmountPaid}</td>
                        <td className="py-3 px-4 text-center text-xs">
                          <span className="inline-block px-2.5 py-0.5 bg-slate-105 border border-slate-200 rounded text-slate-750 font-medium">
                            {p.PaymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-xs font-mono text-slate-450">{p.PaymentDate}</td>
                      </tr>
                    );
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                        No transactions found. Go to invoice tab or add below.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Side */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h4 className="font-display font-bold text-slate-800 text-base mb-1">
              Record Patient Payment
            </h4>
            <p className="text-slate-400 text-xs mb-4">
              Authorize cash, mobile baking, or POS transactions safely.
            </p>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Select Bill Invoice Target
                </label>
                <select
                  value={paymentForm.BillID}
                  onChange={(e) => {
                    const bId = e.target.value;
                    const bObj = bills.find(b => b.BillID === bId);
                    let outstandingVal = "";
                    if (bObj) {
                      const billPayments = payments.filter(p => p.BillID === bId);
                      const totalPaid = billPayments.reduce((s, p) => s + (Number(p.AmountPaid) || 0), 0);
                      const outstanding = Math.max(0, bObj.TotalAmount - (Number(bObj.InsuranceCoverageAmount) || 0) - totalPaid);
                      outstandingVal = outstanding > 0 ? String(outstanding) : "";
                    }
                    setPaymentForm(prev => ({ 
                      ...prev, 
                      BillID: bId,
                      AmountPaid: outstandingVal 
                    }));
                  }}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="">-- Choose Outstanding Invoice --</option>
                  {bills.map(b => {
                    const patObj = patients.find(p => p.PatientID === b.PatientID);
                    const billPayments = payments.filter(p => p.BillID === b.BillID);
                    const totalPaid = billPayments.reduce((s, p) => s + (Number(p.AmountPaid) || 0), 0);
                    const insCovered = Number(b.InsuranceCoverageAmount) || 0;
                    const outstanding = Math.max(0, b.TotalAmount - insCovered - totalPaid);

                    return (
                      <option key={b.BillID} value={b.BillID}>
                        {b.BillID} - {patObj ? patObj.PatientName : b.PatientID} (Outstanding: ${outstanding})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Amount Received ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={paymentForm.AmountPaid}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, AmountPaid: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentForm.PaymentMethod}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, PaymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                >
                  <option value="Cash">Cash Currency</option>
                  <option value="Card">Visa / MasterCard POS</option>
                  <option value="Mobile Transfer">Mobile Banking Transfer</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.PaymentDate}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, PaymentDate: e.target.value }))}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Log Verified Payment Transaction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
