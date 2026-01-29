import React, { useState } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';
import { Upload } from 'lucide-react';

const UploadAssetModal = ({ isOpen, onClose, isScan = false }) => {
  const { addToast } = useToast();
  const [form, setForm] = useState({
    name: '',
    category: 'Social Media',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addToast(isScan ? 'Asset uploaded for Brand Scan' : 'Asset added to Gallery', 'success');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isScan ? "Upload for Brand Scan" : "Upload New Asset"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer">
          <Upload size={32} className="mb-2 text-slate-400" />
          <span className="text-sm font-medium">Click to select or drag file here</span>
          <span className="text-xs text-slate-400 mt-1">PNG, JPG, SVG up to 10MB</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
          <input 
            type="text" 
            required
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
            value={form.name}
            onChange={e => setForm({...form, name: e.target.value})}
          />
        </div>
        
        {!isScan && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select 
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option>Social Media</option>
                <option>Print</option>
                <option>Web Design</option>
                <option>Logo/Branding</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
              <input 
                type="text" 
                placeholder="Comma separated"
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-pink-500/20 outline-none"
                value={form.tags}
                onChange={e => setForm({...form, tags: e.target.value})}
              />
            </div>
          </div>
        )}

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
            className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
          >
            {isScan ? 'Upload & Scan' : 'Upload Asset'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UploadAssetModal;
