import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { useToast } from '../../context/ToastContext';
import { generateJSON } from '../../lib/openai';
import { Wand2, RefreshCw, Check, ArrowRight } from 'lucide-react';

const MagicEditor = () => {
  const { apiKey } = useAI();
  const { addToast } = useToast();
  const [text, setText] = useState('');
  const [goal, setGoal] = useState('Improve Flow');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMagic = async () => {
    if (!text) return;
    
    if (!apiKey) {
      addToast('Please configure your Gemini API Key in AI Settings (Sidebar)', 'error');
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const prompt = `
        Refine the following text.
        Goal: ${goal}
        Original Text: "${text}"
        
        Return a JSON object with:
        - refinedText: The improved version of the text.
        - improvements: An array of strings listing specific changes made (e.g., "Fixed grammar", "Simplified sentence structure").
      `;

      const schema = {
        type: "object",
        properties: {
          refinedText: { type: "string" },
          improvements: { type: "array", items: { type: "string" } }
        }
      };

      const json = await generateJSON(prompt, schema);
      setResult(JSON.parse(json));
    } catch (error) {
      console.error("Magic Editor failed", error);
      setResult({
        refinedText: text + " (AI Refinement Failed)",
        improvements: [`Error: ${error.message || "Could not connect to AI service"}`]
      });
    } finally {
      setLoading(false);
    }
  };

  const applyChanges = () => {
    if (result) {
      setText(result.refinedText);
      setResult(null);
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col bg-gradient-to-br from-white/60 to-purple-50/30">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
          <Wand2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">AI Magic Editor</h2>
          <p className="text-xs text-slate-500">Grammar, Flow & SEO Optimizer</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex-1 relative">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your rough draft here..."
            className="w-full h-full p-4 bg-white/50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500/20 outline-none text-sm leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none"
          >
            <option>Improve Flow</option>
            <option>Fix Grammar</option>
            <option>Optimize for SEO</option>
            <option>Make More Professional</option>
            <option>Shorten</option>
          </select>

          <button 
            onClick={handleMagic}
            disabled={loading || !text}
            className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={16} className="animate-spin" /> : <Wand2 size={16} />}
            Magic Refine
          </button>
        </div>

        {result && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-xs font-bold text-purple-700 uppercase mb-2">Suggested Version</h3>
            <p className="text-sm text-slate-700 mb-4 bg-white p-3 rounded-lg border border-purple-100 shadow-sm">
              {result.refinedText}
            </p>
            
            <div className="mb-4">
              <h4 className="text-xs font-semibold text-slate-500 mb-1">Improvements:</h4>
              <div className="flex flex-wrap gap-1">
                {result.improvements.map((imp, i) => (
                  <span key={i} className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                    {imp}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setResult(null)}
                className="flex-1 py-2 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
              >
                Discard
              </button>
              <button 
                onClick={applyChanges}
                className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 flex items-center justify-center gap-1"
              >
                <Check size={14} /> Apply Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MagicEditor;
