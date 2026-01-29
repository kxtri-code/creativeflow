import React, { useMemo, useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Banknote, Plus, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const FinanceHub = () => {
  const { addToast } = useToast();
  const { currentCompany, formatCurrency } = useAuth();
  const [txns, setTxns] = useState([]);
  const [form, setForm] = useState({ date: '', type: 'income', category: '', amount: '', notes: '' });

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('finance_txns');
    if (stored) {
      setTxns(JSON.parse(stored));
    } else {
      // Seed with some dummy data if empty, assigning to current company if exists
      if (currentCompany) {
         const dummy = [
           { id: 't1', companyId: currentCompany.id, date: '2026-01-01', type: 'income', category: 'Retainer', amount: 4500, notes: 'January Retainer' },
           { id: 't2', companyId: currentCompany.id, date: '2026-01-05', type: 'expense', category: 'Software', amount: 230, notes: 'Licenses' },
         ];
         setTxns(dummy);
         localStorage.setItem('finance_txns', JSON.stringify(dummy));
      }
    }
  }, [currentCompany]); // Re-run if company changes (though we load all and filter)

  // Filter transactions for current company
  const companyTxns = useMemo(() => {
    if (!currentCompany) return [];
    return txns.filter(t => t.companyId === currentCompany.id);
  }, [txns, currentCompany]);

  const totals = useMemo(() => {
    const income = companyTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = companyTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const profit = income - expense;
    return { income, expense, profit };
  }, [companyTxns]);

  const addTxn = (e) => {
    e.preventDefault();
    if (!form.date || !form.category || !form.amount) {
      addToast('Please fill required fields', 'error');
      return;
    }
    
    if (!currentCompany) {
      addToast('No active company found', 'error');
      return;
    }

    const newTxn = {
      id: Date.now().toString(),
      companyId: currentCompany.id,
      date: form.date,
      type: form.type,
      category: form.category,
      amount: Number(form.amount),
      notes: form.notes,
    };
    
    const updated = [newTxn, ...txns];
    setTxns(updated);
    localStorage.setItem('finance_txns', JSON.stringify(updated));
    
    setForm({ date: '', type: 'income', category: '', amount: '', notes: '' });
    addToast('Transaction added', 'success');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Banknote size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Finance</h1>
            <p className="text-slate-500">Revenue, expenses, and profit overview.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-4">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Transaction</h2>
            <form className="space-y-4" onSubmit={addTxn}>
              <div className="grid grid-cols-2 gap-3">
                <select
                  className="glass-input px-3 py-2"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
                <input
                  type="date"
                  className="glass-input px-3 py-2"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <input
                placeholder="Category"
                className="glass-input px-3 py-2 w-full"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <input
                type="number"
                placeholder="Amount"
                className="glass-input px-3 py-2 w-full"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
              <textarea
                placeholder="Notes (optional)"
                className="glass-input px-3 py-2 w-full"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
              <button className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-medium flex items-center justify-center gap-2">
                <Plus size={18} /> Add
              </button>
            </form>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Income</p>
                <ArrowUpCircle className="text-emerald-500" size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totals.income)}</p>
            </div>
            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">Expenses</p>
                <ArrowDownCircle className="text-rose-500" size={18} />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totals.expense)}</p>
            </div>
            <div className="glass-card p-5">
              <p className="text-sm text-slate-500">Profit</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(totals.profit)}</p>
            </div>
          </div>

          <div className="glass-card p-6 h-full min-h-[300px] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Transactions</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {companyTxns.map(t => (
                <div key={t.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    {t.type === 'income' ? (
                      <ArrowUpCircle className="text-emerald-500" size={18} />
                    ) : (
                      <ArrowDownCircle className="text-rose-500" size={18} />
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{t.category}</p>
                      <p className="text-xs text-slate-500">{t.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                    </p>
                    <p className="text-xs text-slate-500">{t.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceHub;
