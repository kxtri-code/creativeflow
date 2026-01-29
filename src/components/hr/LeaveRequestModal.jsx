import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const LeaveRequestModal = ({ isOpen, onClose, onRefresh }) => {
  const { addToast } = useToast();
  const { user, profile, currentCompany } = useAuth();
  const [form, setForm] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!currentCompany) {
      addToast('No active company found', 'error');
      return;
    }

    const newRequest = {
      id: crypto.randomUUID(),
      companyId: currentCompany.id,
      userId: user?.id || 'demo-user',
      userName: profile?.full_name || user?.email || 'Unknown User',
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
      status: 'Pending',
      submittedAt: new Date().toISOString()
    };

    // Store in localStorage for Demo Mode persistence
    const existing = JSON.parse(localStorage.getItem('leave_requests') || '[]');
    localStorage.setItem('leave_requests', JSON.stringify([newRequest, ...existing]));

    addToast('Leave request submitted for approval', 'success');
    if (onRefresh) onRefresh();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Apply for Leave">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Leave Type</label>
          <select 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
            value={form.type}
            onChange={e => setForm({...form, type: e.target.value})}
          >
            <option>Annual Leave</option>
            <option>Sick Leave</option>
            <option>Personal Leave</option>
            <option>Unpaid Leave</option>
          </select>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
            <input 
              type="date" 
              required
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={form.startDate}
              onChange={e => setForm({...form, startDate: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
            <input 
              type="date" 
              required
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none"
              value={form.endDate}
              onChange={e => setForm({...form, endDate: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Reason (Optional)</label>
          <textarea 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none h-24 resize-none"
            value={form.reason}
            onChange={e => setForm({...form, reason: e.target.value})}
            placeholder="Briefly describe why..."
          />
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LeaveRequestModal;
