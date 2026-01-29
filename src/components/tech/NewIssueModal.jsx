import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';

const NewIssueModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    type: 'Bug',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast('Issue created successfully', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Issue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none"
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
            >
              <option>Bug</option>
              <option>Feature</option>
              <option>Task</option>
              <option>Improvement</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none"
              value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea 
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500/20 outline-none h-32 resize-none"
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
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
            className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            Create Issue
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewIssueModal;
