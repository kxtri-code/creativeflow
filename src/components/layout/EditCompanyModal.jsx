import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Trash2 } from 'lucide-react';

const SECTORS = [
  "IT Services & Software",
  "Marketing & Advertising",
  "Retail & E-commerce",
  "Manufacturing",
  "Consulting",
  "Education & EdTech",
  "Healthcare & Pharma",
  "Real Estate & Construction",
  "Logistics & Supply Chain",
  "Finance & Fintech",
  "Hospitality & Tourism",
  "Media & Entertainment",
  "Non-Profit",
  "Other"
];

const EditCompanyModal = ({ isOpen, onClose }) => {
  const { currentCompany, updateCompany, deleteCompany, currencies } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    currency: 'INR',
    isGST: false,
    gstNumber: '',
    address: '',
    sector: '',
    taxRate: 18
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentCompany && isOpen) {
      setForm({
        name: currentCompany.name || '',
        currency: currentCompany.currency || 'INR',
        isGST: currentCompany.isGST || false,
        gstNumber: currentCompany.gstNumber || '',
        address: currentCompany.address || '',
        sector: currentCompany.sector || '',
        taxRate: currentCompany.taxRate || 18
      });
    }
  }, [currentCompany, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return;

    setLoading(true);
    try {
      await updateCompany(currentCompany.id, {
        name: form.name,
        currency: form.currency,
        isGST: form.isGST,
        gstNumber: form.gstNumber,
        address: form.address,
        sector: form.sector,
        taxRate: form.isGST ? Number(form.taxRate) : 0
      });
      addToast('Company profile updated', 'success');
      onClose();
    } catch (error) {
      addToast('Failed to update company', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${currentCompany.name}? This cannot be undone.`)) {
      try {
        await deleteCompany(currentCompany.id);
        addToast('Company deleted', 'info');
        onClose();
      } catch (error) {
        addToast(error.message, 'error');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Company Profile">
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
        
        <div className="grid grid-cols-2 gap-4">
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Industry Sector</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={form.sector}
              onChange={e => setForm({...form, sector: e.target.value})}
            >
              <option value="">Select Sector...</option>
              {SECTORS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
          <input 
            type="checkbox" 
            id="edit_isGST"
            checked={form.isGST}
            onChange={e => setForm({...form, isGST: e.target.checked})}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
          <label htmlFor="edit_isGST" className="text-sm font-medium text-slate-700 cursor-pointer">
            This company is GST/VAT Compliant
          </label>
        </div>

        {form.isGST && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">GST/VAT Number</label>
                <input 
                  type="text" 
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none uppercase"
                  value={form.gstNumber}
                  onChange={e => setForm({...form, gstNumber: e.target.value.toUpperCase()})}
                  placeholder="e.g. 22AAAAA0000A1Z5"
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={form.taxRate}
                  onChange={e => setForm({...form, taxRate: e.target.value})}
                  placeholder="18"
                />
              </div>
            </div>
          </motion.div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address (For Invoices)</label>
          <textarea 
            rows="3"
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            value={form.address}
            onChange={e => setForm({...form, address: e.target.value})}
            placeholder="Registered office address..."
          />
        </div>

        <div className="flex justify-between gap-3 mt-6 pt-4 border-t border-slate-100">
           <button 
            type="button" 
            onClick={handleDelete}
            className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Company
          </button>

          <div className="flex gap-3">
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditCompanyModal;