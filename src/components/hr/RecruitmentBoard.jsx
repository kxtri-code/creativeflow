import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FileText, Upload, Filter, Search, Download, Trash2, Plus, Briefcase, User } from 'lucide-react';
import Modal from '../shared/Modal';

const RecruitmentBoard = () => {
  const { currentCompany } = useAuth();
  const { addToast } = useToast();
  const [candidates, setCandidates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: '',
    category: 'General', // Engineering, Design, Marketing, Sales, General
    status: 'New', // New, Screening, Interview, Offer, Hired, Rejected, Future Reference
    notes: ''
  });
  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (currentCompany) {
      const stored = JSON.parse(localStorage.getItem('recruitment_candidates') || '[]');
      setCandidates(stored);
    }
  }, [currentCompany]);

  const companyCandidates = useMemo(() => {
    if (!currentCompany) return [];
    return candidates.filter(c => c.companyId === currentCompany.id);
  }, [candidates, currentCompany]);

  const filteredCandidates = useMemo(() => {
    return companyCandidates.filter(c => {
      const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [companyCandidates, filterCategory, searchQuery]);

  const categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'General'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.role) {
      addToast('Please fill required fields', 'error');
      return;
    }

    const newCandidate = {
      id: crypto.randomUUID(),
      companyId: currentCompany.id,
      ...form,
      resumeName: resumeFile ? resumeFile.name : null,
      dateAdded: new Date().toISOString(),
    };

    const updated = [newCandidate, ...candidates];
    setCandidates(updated);
    localStorage.setItem('recruitment_candidates', JSON.stringify(updated));
    addToast('Candidate profile saved successfully', 'success');
    setIsModalOpen(false);
    setForm({ name: '', email: '', role: '', category: 'General', status: 'New', notes: '' });
    setResumeFile(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this candidate record?')) return;
    const updated = candidates.filter(c => c.id !== id);
    setCandidates(updated);
    localStorage.setItem('recruitment_candidates', JSON.stringify(updated));
    addToast('Candidate deleted', 'info');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hired': return 'bg-emerald-100 text-emerald-700';
      case 'Rejected': return 'bg-rose-100 text-rose-700';
      case 'Future Reference': return 'bg-amber-100 text-amber-700';
      case 'Interview': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Briefcase size={20} className="text-indigo-600" />
            Recruitment & Resumes
          </h2>
          <p className="text-sm text-slate-500">Manage job applications and talent pool.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search candidates..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none"
        >
          <option value="All">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Candidates List */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {filteredCandidates.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <User size={48} className="mx-auto mb-3 opacity-20" />
            <p>No candidates found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredCandidates.map(candidate => (
              <div key={candidate.id} className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-500 shrink-0">
                  {candidate.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800 truncate">{candidate.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={12} /> {candidate.role}</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">{candidate.category}</span>
                    <span>Added: {new Date(candidate.dateAdded).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 mt-2 md:mt-0">
                  {candidate.resumeName && (
                    <button className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 bg-indigo-50 rounded-lg">
                      <FileText size={14} /> {candidate.resumeName}
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(candidate.id)}
                    className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Candidate Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Candidate">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name *</label>
              <input 
                required
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input 
                type="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Role Applied For *</label>
              <input 
                required
                value={form.role}
                onChange={(e) => setForm({...form, role: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
              <select 
                value={form.category}
                onChange={(e) => setForm({...form, category: e.target.value})}
                className="w-full p-2 border border-slate-200 rounded-lg text-sm"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
            <select 
              value={form.status}
              onChange={(e) => setForm({...form, status: e.target.value})}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="New">New Application</option>
              <option value="Screening">Screening</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer Sent</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
              <option value="Future Reference">Save for Future Reference</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Resume / CV</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors">
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                onChange={(e) => setResumeFile(e.target.files[0])}
                accept=".pdf,.doc,.docx"
              />
              <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload size={20} className="text-slate-400" />
                <span className="text-sm text-slate-600">
                  {resumeFile ? resumeFile.name : 'Click to upload resume'}
                </span>
                <span className="text-xs text-slate-400">PDF, DOC up to 5MB</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <textarea 
              value={form.notes}
              onChange={(e) => setForm({...form, notes: e.target.value})}
              className="w-full p-2 border border-slate-200 rounded-lg text-sm h-20"
              placeholder="Interviewer notes, key skills, etc."
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">Save Candidate</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecruitmentBoard;
