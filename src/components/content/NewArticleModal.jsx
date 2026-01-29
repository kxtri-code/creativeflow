import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';

const NewArticleModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    title: '',
    client: '',
    project: '',
    task: '',
    deadline: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to DB
    addToast('Article draft created successfully', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Article Draft">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Article Title</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
            value={form.title}
            onChange={e => setForm({...form, title: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Client</label>
            <input 
              type="text" 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              value={form.client}
              onChange={e => setForm({...form, client: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
            <input 
              type="date" 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              value={form.deadline}
              onChange={e => setForm({...form, deadline: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign to Project</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              value={form.project}
              onChange={e => setForm({...form, project: e.target.value})}
            >
              <option value="">Select Project...</option>
              <option value="p1">Q1 Marketing Campaign</option>
              <option value="p2">Website Redesign</option>
              <option value="p3">Brand Refresh</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Link to Task</label>
            <select 
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 outline-none"
              value={form.task}
              onChange={e => setForm({...form, task: e.target.value})}
            >
              <option value="">Select Task...</option>
              <option value="t1">Blog Post Series</option>
              <option value="t2">Landing Page Copy</option>
              <option value="t3">Newsletter</option>
            </select>
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
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Draft
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewArticleModal;
