import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Banknote, CheckCircle, AlertCircle, Calendar } from 'lucide-react';

const PayrollModule = () => {
  const { currentCompany, formatCurrency } = useAuth();
  const { addToast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [processing, setProcessing] = useState(false);

  // Load staff
  const staff = useMemo(() => {
    if (!currentCompany) return [];
    const allStaff = JSON.parse(localStorage.getItem('staff_directory') || '[]');
    return allStaff.filter(s => s.companyId === currentCompany.id && s.status === 'Active');
  }, [currentCompany]);

  // Load payroll history
  const history = useMemo(() => {
    if (!currentCompany) return [];
    const allHistory = JSON.parse(localStorage.getItem('payroll_history') || '[]');
    return allHistory.filter(h => h.companyId === currentCompany.id);
  }, [currentCompany, processing]); // re-calc after processing

  const isProcessed = history.some(h => h.month === selectedMonth);

  const totalPayroll = staff.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0);

  const handleRunPayroll = () => {
    if (isProcessed) {
      addToast('Payroll already processed for this month', 'error');
      return;
    }
    
    if (totalPayroll === 0) {
      addToast('No salary data found for active employees', 'warning');
      return;
    }

    if (!window.confirm(`Run payroll for ${selectedMonth}? Total: ${formatCurrency(totalPayroll)}`)) return;

    setProcessing(true);

    // 1. Record Payroll History
    const payrollRecord = {
      id: Date.now().toString(),
      companyId: currentCompany.id,
      month: selectedMonth,
      totalAmount: totalPayroll,
      employeeCount: staff.length,
      processedAt: new Date().toISOString(),
      details: staff.map(s => ({ id: s.id, name: s.name, salary: s.salary }))
    };

    const allHistory = JSON.parse(localStorage.getItem('payroll_history') || '[]');
    localStorage.setItem('payroll_history', JSON.stringify([payrollRecord, ...allHistory]));

    // 2. Add Finance Transaction
    const newTxn = {
      id: `payroll-${Date.now()}`,
      companyId: currentCompany.id,
      date: new Date().toISOString().slice(0, 10),
      type: 'expense',
      category: 'Payroll',
      amount: totalPayroll,
      notes: `Payroll for ${selectedMonth} (${staff.length} employees)`
    };

    const txns = JSON.parse(localStorage.getItem('finance_txns') || '[]');
    localStorage.setItem('finance_txns', JSON.stringify([newTxn, ...txns]));

    setTimeout(() => {
      setProcessing(false);
      addToast('Payroll processed and expenses logged successfully', 'success');
    }, 1000);
  };

  if (!currentCompany) return null;

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
            <Banknote size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Payroll Management</h2>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="month" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="glass-input px-3 py-1.5 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Monthly Salary</p>
          <p className="text-2xl font-bold text-slate-900">{formatCurrency(totalPayroll)}</p>
          <p className="text-xs text-slate-500 mt-1">{staff.length} Active Employees</p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
           <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Status</p>
           <div className={`flex items-center gap-2 mt-1 font-semibold ${isProcessed ? 'text-emerald-600' : 'text-amber-600'}`}>
             {isProcessed ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
             {isProcessed ? 'Processed' : 'Pending'}
           </div>
           {isProcessed && <p className="text-xs text-slate-500 mt-1">Check Finance Hub for details</p>}
        </div>

        <div className="flex items-center justify-center">
          <button 
            onClick={handleRunPayroll}
            disabled={isProcessed || processing || totalPayroll === 0}
            className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
              ${isProcessed 
                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30'
              }
            `}
          >
            {processing ? 'Processing...' : isProcessed ? 'Paid' : 'Run Payroll'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-[200px]">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Employee Salary Breakdown</h3>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-2 rounded-l-lg">Employee</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2 text-right rounded-r-lg">Salary</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {staff.map(emp => (
              <tr key={emp.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-3 font-medium text-slate-900">{emp.name}</td>
                <td className="px-4 py-3 text-slate-500">{emp.role}</td>
                <td className="px-4 py-3 text-right font-mono text-slate-700">
                  {emp.salary ? formatCurrency(emp.salary) : <span className="text-slate-300 italic">Not set</span>}
                </td>
              </tr>
            ))}
            {staff.length === 0 && (
              <tr>
                <td colSpan="3" className="px-4 py-8 text-center text-slate-400">
                  No active employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayrollModule;
