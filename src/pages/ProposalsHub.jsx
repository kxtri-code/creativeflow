import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { useAI } from '../context/AIContext';
import { generateText } from '../lib/openai';
import { FileSignature, Wand2, Plus } from 'lucide-react';

const ProposalsHub = () => {
  const { addToast } = useToast();
  const { apiKey } = useAI();
  const { currentCompany, formatCurrency } = useAuth();
  const [form, setForm] = useState({ title: '', client: '', overview: '', scope: '', timeline: '', pricing: '' });
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load proposals from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('proposals_data');
    if (stored) {
      setProposals(JSON.parse(stored));
    }
  }, []);

  // Filter by current company
  const companyProposals = useMemo(() => {
    if (!currentCompany) return [];
    return proposals.filter(p => p.companyId === currentCompany.id);
  }, [proposals, currentCompany]);

  const generateSection = async (section) => {
    if (!apiKey) {
      addToast('Enter Gemini API Key in settings first', 'error');
      return;
    }
    setLoading(true);
    try {
      const prompt = `Write a concise ${section} section for a creative agency proposal. 
      Client: ${form.client || "Generic Client"}
      Title: ${form.title || "Generic Project"}
      Currency: ${currentCompany?.currency || 'USD'}
      Tone: professional and persuasive. Output plain text.`;
      
      const response = await generateText(prompt);
      setForm(prev => ({ ...prev, [section]: response }));
      addToast('AI generated content', 'success');
    } catch (e) {
      console.error(e);
      addToast('Failed to generate content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createProposal = () => {
    if (!form.title || !form.client) {
      addToast('Please fill title and client', 'error');
      return;
    }

    if (!currentCompany) {
      addToast('No active company found', 'error');
      return;
    }

    const proposal = {
      id: 'PR-' + Date.now(),
      companyId: currentCompany.id,
      ...form,
      status: 'draft',
      created_at: new Date().toISOString(),
    };

    const updated = [proposal, ...proposals];
    setProposals(updated);
    localStorage.setItem('proposals_data', JSON.stringify(updated));
    
    setForm({ title: '', client: '', overview: '', scope: '', timeline: '', pricing: '' });
    addToast('Proposal created (draft)', 'success');
  };

  const setStatus = (id, status) => {
    const updated = proposals.map(p => p.id === id ? { ...p, status } : p);
    setProposals(updated);
    localStorage.setItem('proposals_data', JSON.stringify(updated));
    addToast(`Proposal ${status}`, 'info');
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <FileSignature size={20} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Proposals</h1>
            <p className="text-slate-500">Craft client-winning proposals with AI assistance.</p>
          </div>
        </div>
        <button onClick={createProposal} className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium flex items-center gap-2">
          <Plus size={18} /> Save Draft
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        <div className="col-span-12 lg:col-span-7">
          <div className="glass-card p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input className="glass-input px-3 py-2" placeholder="Proposal Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} />
              <input className="glass-input px-3 py-2" placeholder="Client Name" value={form.client} onChange={(e)=>setForm({...form, client:e.target.value})} />
            </div>

            {['overview','scope','timeline','pricing'].map((section)=>(
              <div key={section}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-slate-700 capitalize">{section}</p>
                  <button disabled={loading} onClick={()=>generateSection(section)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm flex items-center gap-1">
                    <Wand2 size={14} /> Generate
                  </button>
                </div>
                <textarea rows={4} className="glass-input w-full px-3 py-2" value={form[section]} onChange={(e)=>setForm({...form, [section]: e.target.value})} />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 min-h-0">
          <div className="glass-card p-6 h-full overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Proposals</h2>
            </div>
            <div className="space-y-3">
              {companyProposals.map(p => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-100 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-500">{p.client}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg ${p.status === 'won' ? 'bg-emerald-50 text-emerald-700' : p.status === 'sent' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {p.status === 'draft' && (
                      <button onClick={()=>setStatus(p.id,'sent')} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm">Send</button>
                    )}
                    {p.status !== 'won' && (
                      <button onClick={()=>setStatus(p.id,'won')} className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-sm">Mark Won</button>
                    )}
                    {p.status !== 'lost' && (
                      <button onClick={()=>setStatus(p.id,'lost')} className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-sm">Mark Lost</button>
                    )}
                  </div>
                </div>
              ))}
              {companyProposals.length === 0 && (
                <p className="text-sm text-slate-500">No proposals yet. Draft one on the left.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalsHub;
