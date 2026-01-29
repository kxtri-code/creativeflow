import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const AddCompanyModal = ({ isOpen, onClose }) => {
  const { createCompany, currencies } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    currency: 'INR'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    setLoading(true);
    try {
      await createCompany(form.name, form.currency);
      addToast('New company workspace created', 'success');
      setForm({ name: '', currency: 'INR' });
      onClose();
    } catch (error) {
      addToast('Failed to create company', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Company">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
            placeholder="e.g. Acme Subsidiary"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Default Currency</label>
          <select 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={form.currency}
            onChange={e => setForm({...form, currency: e.target.value})}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code} - {c.name} ({c.symbol})</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Company'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCompanyModal;
