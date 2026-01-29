import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';

const NewProjectModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    client: '',
    type: 'Video Production',
    deadline: '',
    budget: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Project initialized successfully', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Start New Production Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={form.client}
              onChange={e => setForm({...form, client: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
            >
              <option>Video Production</option>
              <option>Photography</option>
              <option>Podcast</option>
              <option>Live Stream</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
            <input 
              type="number" 
              placeholder="$"
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={form.budget}
              onChange={e => setForm({...form, budget: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
            <input 
              type="date" 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
            />
          </div>
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
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
