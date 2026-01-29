import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Receipt, Plus, History, Tag, Calendar, DollarSign } from 'lucide-react';

const HRExpenseLogger = () => {
  const { currentCompany, formatCurrency } = useAuth();
  const { addToast } = useToast();
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [form, setForm] = useState({
    category: 'Tools & Software',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    notes: ''
  });

  const categories = [
    'Tools & Software',
    'Office Supplies',
    'Training & Development',
    'Employee Benefits',
    'Events & Team Building',
    'Utilities',
    'Travel',
    'Other'
  ];

  useEffect(() => {
    loadExpenses();
  }, [currentCompany]);

  const loadExpenses = () => {
    if (!currentCompany) return;
    const allTxns = JSON.parse(localStorage.getItem('finance_txns') || '[]');
    // Filter for this company, expenses only, and maybe try to guess if it's HR related?
    // For now, we just show all expenses for the company to keep it simple, 
    // or we could filter by specific categories if we wanted to be strict.
    // Let's show all expenses but highlight the ones added via this module if we tracked origin.
    // Simpler approach: Just show the last 5-10 expenses for context.
    const companyExpenses = allTxns
      .filter(t => t.companyId === currentCompany.id && t.type === 'expense')
      .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
      .slice(0, 10);
    
    setRecentExpenses(companyExpenses);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount || !form.date) {
      addToast('Please fill required fields', 'error');
      return;
    }

    const newExpense = {
      id: `hr-exp-${Date.now()}`,
      companyId: currentCompany.id,
      date: form.date,
      type: 'expense',
      category: form.category,
      amount: Number(form.amount),
      notes: form.notes,
      source: 'HR_MODULE' // Optional tag for tracking
    };

    const allTxns = JSON.parse(localStorage.getItem('finance_txns') || '[]');
    const updated = [newExpense, ...allTxns];
    localStorage.setItem('finance_txns', JSON.stringify(updated));
    
    addToast('Expense logged to Finance Hub', 'success');
    setForm({ ...form, amount: '', notes: '' }); // keep category/date
    loadExpenses();
  };

  if (!currentCompany) return <div className="p-6 text-center text-slate-500">Please select a company.</div>;

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Expense Form */}
      <div className="lg:col-span-5">
        <div className="glass-card p-6 h-full">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Receipt className="text-indigo-600" size={20} />
            Log HR Expense
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            Record purchases for software, tools, utilities, or team events. These will be synced to the Finance Hub.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                  value={form.category}
                  onChange={(e) => setForm({...form, category: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="number" 
                  value={form.amount}
                  onChange={(e) => setForm({...form, amount: e.target.value})}
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="date" 
                  value={form.date}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Description / Notes</label>
              <textarea 
                value={form.notes}
                onChange={(e) => setForm({...form, notes: e.target.value})}
                placeholder="Details about the purchase..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Log Expense
            </button>
          </form>
        </div>
      </div>

      {/* Recent History */}
      <div className="lg:col-span-7">
        <div className="glass-card p-6 h-full flex flex-col">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <History className="text-slate-400" size={18} />
            Recent Expenses
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {recentExpenses.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <p>No expenses recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentExpenses.map(txn => (
                  <div key={txn.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                        <Receipt size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{txn.category}</p>
                        <p className="text-xs text-slate-500">{txn.notes || 'No description'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">{formatCurrency(txn.amount)}</p>
                      <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRExpenseLogger;
