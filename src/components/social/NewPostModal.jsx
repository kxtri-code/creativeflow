import React, { useState } from 'react';
import { X, Calendar, Hash, Image as ImageIcon, Wand2, Instagram, Linkedin, Twitter, Facebook } from 'lucide-react';
import { useAI } from '../../context/AIContext';
import { generateJSON } from '../../lib/gemini';
import { useToast } from '../../context/ToastContext';

const platforms = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-600' },
  { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-sky-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
];

const projects = ['Nike Summer Campaign', 'Tech Rebrand', 'Q3 Financials', 'Internal Culture'];

const NewPostModal = ({ isOpen, onClose, onSchedule }) => {
  const { apiKey } = useAI();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    project: projects[0],
    platforms: [],
    date: '',
    time: '',
    content: '',
  });

  if (!isOpen) return null;

  const togglePlatform = (id) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(id) 
        ? prev.platforms.filter(p => p !== id)
        : [...prev.platforms, id]
    }));
  };

  const handleAIWrite = async () => {
    if (!apiKey) {
      addToast('Please enter your Gemini API Key in settings first.', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const prompt = `
        Write a social media post for:
        Project: ${formData.project}
        Platforms: ${formData.platforms.join(', ') || 'General'}
        Tone: Professional yet engaging
        
        Provide just the content text with hashtags.
      `;

      const schema = {
        type: "object",
        properties: {
          content: { type: "string" }
        }
      };

      const result = await generateJSON(prompt, schema);
      const parsed = JSON.parse(result);
      setFormData(prev => ({ ...prev, content: parsed.content }));
      addToast('AI generated content!', 'success');
    } catch (error) {
      console.error(error);
      addToast('Failed to generate content', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.platforms.length === 0) {
      addToast('Select at least one platform', 'error');
      return;
    }
    if (!formData.date || !formData.time) {
      addToast('Please select date and time', 'error');
      return;
    }

    onSchedule({
      ...formData,
      status: 'scheduled',
      id: Date.now()
    });
    addToast('Post scheduled successfully!', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create New Post</h2>
            <p className="text-sm text-slate-500">Schedule content across multiple channels</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Project Selection */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Campaign / Project</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={formData.project}
              onChange={(e) => setFormData({...formData, project: e.target.value})}
            >
              {projects.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Select Platforms</label>
            <div className="flex gap-3 flex-wrap">
              {platforms.map(platform => {
                const isSelected = formData.platforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200
                      ${isSelected 
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                  >
                    <platform.icon size={18} className={isSelected ? 'text-indigo-600' : platform.color} />
                    <span className="font-medium">{platform.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="date" 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Time</label>
              <div className="relative">
                <ClockIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="time" 
                  className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Post Content</label>
              <button 
                onClick={handleAIWrite}
                disabled={loading}
                className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Wand2 size={12} className={loading ? "animate-spin" : ""} />
                {loading ? 'Magic writing...' : 'AI Write'}
              </button>
            </div>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 resize-none font-sans"
              placeholder="What's on your mind? Type here or use AI to generate..."
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            ></textarea>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex gap-4">
                <button className="flex items-center gap-1 hover:text-slate-600"><ImageIcon size={14} /> Add Media</button>
                <button className="flex items-center gap-1 hover:text-slate-600"><Hash size={14} /> Hashtags</button>
              </div>
              <span>{formData.content.length} chars</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all"
          >
            Schedule Post
          </button>
        </div>

      </div>
    </div>
  );
};

// Helper icon component since Clock is not imported from lucide-react in the top import
const ClockIcon = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export default NewPostModal;