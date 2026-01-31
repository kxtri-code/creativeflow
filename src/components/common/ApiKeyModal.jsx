import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { Key, Check, X, ShieldCheck } from 'lucide-react';

const ApiKeyModal = ({ isOpen, onClose }) => {
  const { apiKey, manualAuthorize } = useAI();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [status, setStatus] = useState('idle'); // idle, validating, success, error

  if (!isOpen) return null;

  const handleSave = () => {
    if (!inputKey.trim()) {
      setStatus('error');
      return;
    }

    const success = manualAuthorize(inputKey.trim());
    if (success) {
      setStatus('success');
      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 1500);
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4">
            <Key size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold">Configure AI Access</h2>
          <p className="text-indigo-100 text-sm mt-1">Enter your Gemini API Key to enable real AI features.</p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input 
                type="password" 
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setStatus('idle');
                }}
                placeholder="AIzaSy..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono text-sm dark:text-white"
              />
              <ShieldCheck className="absolute left-3 top-3 text-slate-400" size={18} />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Your key is stored locally in your browser and never sent to our servers.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className={`flex-1 py-2.5 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${
                status === 'success' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700'
              }`}
            >
              {status === 'success' ? (
                <>
                  <Check size={18} /> Saved!
                </>
              ) : (
                'Save Key'
              )}
            </button>
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
             <a 
               href="https://platform.openai.com/api-keys" 
               target="_blank" 
               rel="noreferrer"
               className="text-xs text-indigo-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1"
             >
               Get your API Key from OpenAI
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
