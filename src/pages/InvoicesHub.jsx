import React, { useMemo, useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { FileText, Plus, Send, CheckCircle, Calendar } from 'lucide-react';

const InvoicesHub = () => {
  const { addToast } = useToast();
  const { currentCompany, formatCurrency } = useAuth();
  const [items, setItems] = useState([{ id: 'i1', description: '', qty: 1, rate: 0 }]);
  const [form, setForm] = useState({ client: '', project: '', due: '', tax: 0 });
  const [invoices, setInvoices] = useState([]);

  // Load invoices from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('invoices_data');
    if (stored) {
      setInvoices(JSON.parse(stored));
    }
  }, []);

  // Filter for current company
  const companyInvoices = useMemo(() => {
    if (!currentCompany) return [];
    return invoices.filter(inv => inv.companyId === currentCompany.id);
  }, [invoices, currentCompany]);

  const subtotal = useMemo(() => items.reduce((s, it) => s + (Number(it.qty) * Number(it.rate)), 0), [items]);
  const total = useMemo(() => subtotal + subtotal * (Number(form.tax) / 100), [subtotal, form.tax]);

  const addItem = () => {
    setItems(prev => [...prev, { id: Date.now().toString(), description: '', qty: 1, rate: 0 }]);
  };

  const updateItem = (id, key, val) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, [key]: val } : it));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const createInvoice = () => {
    if (!form.client || !form.project || items.length === 0) {
      addToast('Please fill client, project and add at least one item', 'error');
      return;
    }
    
    if (!currentCompany) {
      addToast('No active company found', 'error');
      return;
    }

    const inv = {
      id: 'INV-' + Date.now(),
      companyId: currentCompany.id,
      ...form,
      items,
      subtotal,
      total,
      status: 'draft',
      created_at: new Date().toISOString(),
    };
    
    const updated = [inv, ...invoices];
    setInvoices(updated);
    localStorage.setItem('invoices_data', JSON.stringify(updated));
    
    setForm({ client: '', project: '', due: '', tax: 0 });
    setItems([{ id: 'i1', description: '', qty: 1, rate: 0 }]);
    addToast('Invoice created (draft)', 'success');
  };

  const markStatus = (id, status) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, status } : inv);
    setInvoices(updated);
    localStorage.setItem('invoices_data', JSON.stringify(updated));
    addToast(`Invoice ${status}`, status === 'sent' ? 'info' : 'success');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-500">Create, send, and track payments.</p>
          </div>
        </div>
        <button onClick={createInvoice} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> Create Draft
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-7">
          <div className="glass-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Invoice Details</h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <input className="glass-input px-3 py-2" placeholder="Client" value={form.client} onChange={(e)=>setForm({...form, client:e.target.value})} />
              <input className="glass-input px-3 py-2" placeholder="Project" value={form.project} onChange={(e)=>setForm({...form, project:e.target.value})} />
              <div className="flex gap-2">
                <Calendar className="text-slate-400" size={18} />
                <input type="date" className="glass-input px-3 py-2 w-full" value={form.due} onChange={(e)=>setForm({...form, due:e.target.value})} />
              </div>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Rate</th>
                    <th className="text-right pb-2">Total</th>
                    <th className="pb-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map(it => (
                    <tr key={it.id}>
                      <td className="py-2">
                        <input className="glass-input px-3 py-2 w-full" placeholder="Item description" value={it.description} onChange={(e)=>updateItem(it.id,'description',e.target.value)} />
                      </td>
                      <td className="py-2 text-right">
                        <input type="number" className="glass-input px-3 py-2 w-24 text-right" value={it.qty} onChange={(e)=>updateItem(it.id,'qty',e.target.value)} />
                      </td>
                      <td className="py-2 text-right">
                        <input type="number" className="glass-input px-3 py-2 w-28 text-right" value={it.rate} onChange={(e)=>updateItem(it.id,'rate',e.target.value)} />
                      </td>
                      <td className="py-2 text-right">
                        {formatCurrency(Number(it.qty) * Number(it.rate))}
                      </td>
                      <td className="py-2 text-right">
                        <button onClick={()=>removeItem(it.id)} className="text-rose-600 hover:text-rose-700">Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <button onClick={addItem} className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium">Add Item</button>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">Subtotal</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(subtotal)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tax (%)</p>
                  <input type="number" className="glass-input px-3 py-2 w-20 text-right" value={form.tax} onChange={(e)=>setForm({...form, tax:e.target.value})} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(total)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 min-h-0">
          <div className="glass-card p-6 h-full overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Invoices</h2>
            </div>
            <div className="space-y-3">
              {companyInvoices.map(inv => (
                <div key={inv.id} className="p-4 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{inv.project}</p>
                      <p className="text-xs text-slate-500">{inv.client} • Due {inv.due || '—'}</p>
                    </div>
                    <p className="font-bold">{formatCurrency(inv.total)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-1 rounded-lg ${inv.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : inv.status === 'sent' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                      {inv.status.toUpperCase()}
                    </span>
                    <div className="flex gap-2">
                      {inv.status === 'draft' && (
                        <button onClick={()=>markStatus(inv.id,'sent')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm flex items-center gap-1">
                          <Send size={14} /> Send
                        </button>
                      )}
                      {inv.status !== 'paid' && (
                        <button onClick={()=>markStatus(inv.id,'paid')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm flex items-center gap-1">
                          <CheckCircle size={14} /> Mark Paid
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {invoices.length === 0 && (
                <p className="text-sm text-slate-500">No invoices yet. Create one on the left.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicesHub;
