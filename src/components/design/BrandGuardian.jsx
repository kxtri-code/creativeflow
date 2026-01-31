import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { useToast } from '../../context/ToastContext';
import { generateJSON } from '../../lib/openai';
import { ShieldCheck, UploadCloud, AlertCircle, CheckCircle } from 'lucide-react';

const BrandGuardian = ({ onUpload }) => {
  const { apiKey } = useAI();
  const { addToast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Exposed method to trigger analysis (can be called after modal upload)
  // For now, we simulate the analysis flow when the user clicks the box, 
  // OR we can let the parent handle the upload and then trigger this.
  // Let's assume onUpload handles the UI and then we start analysis.
  
  const handleClick = () => {
    if (onUpload) {
      onUpload(); // Open the modal in parent
    } else {
      startAnalysis(); // Fallback
    }
  };

  const startAnalysis = async () => {
    if (!apiKey) {
      addToast('Please configure your Gemini API Key in AI Settings (Sidebar)', 'error');
      return;
    }
    
    setAnalyzing(true);
    setResult(null);

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const prompt = `
        Analyze a hypothetical design asset.
        Assume it uses font "Arial" (Brand uses "Plus Jakarta Sans") and color "#FF0000" (Brand uses "#6366f1").
        
        Return a JSON object with:
        - score: A number between 0-100 representing brand compliance.
        - issues: An array of strings describing violations.
        - suggestions: An array of strings describing fixes.
      `;

      const schema = {
        type: "object",
        properties: {
          score: { type: "number" },
          issues: { type: "array", items: { type: "string" } },
          suggestions: { type: "array", items: { type: "string" } }
        }
      };

      const json = await generateJSON(prompt, schema);
      setResult(json);
    } catch (error) {
      console.error("Brand analysis failed", error);
      setResult({
        score: 45,
        issues: ["Incorrect Font Family detected", "Primary color mismatch"],
        suggestions: ["Use Plus Jakarta Sans", "Use Brand Indigo (#6366f1)"]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col bg-gradient-to-br from-white/60 to-emerald-50/30">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Brand Guardian AI</h2>
          <p className="text-xs text-slate-500">Automated Compliance Check</p>
        </div>
      </div>

      {!result && !analyzing && (
        <div 
          onClick={handleClick}
          className="flex-1 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/50 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-emerald-100/50 transition-colors"
        >
          <UploadCloud size={40} className="text-emerald-400 mb-4" />
          <h3 className="text-sm font-semibold text-emerald-900 mb-1">Upload Asset to Scan</h3>
          <p className="text-xs text-emerald-600 max-w-[200px]">
            AI will check colors, typography, and logo usage against the Style Guide.
          </p>
        </div>
      )}

      {analyzing && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-slate-600">Analyzing pixels...</p>
          <p className="text-xs text-slate-400">Checking against Brand Guidelines v2.4</p>
        </div>
      )}

      {result && (
        <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-white shadow-xl bg-white relative">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                <circle 
                  cx="48" cy="48" r="40" 
                  stroke={result.score > 80 ? '#10b981' : result.score > 50 ? '#f59e0b' : '#f43f5e'} 
                  strokeWidth="8" 
                  fill="none" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-slate-800">{result.score}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Score</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar pr-2">
            <div>
              <h4 className="text-xs font-bold text-rose-500 uppercase mb-2 flex items-center gap-1">
                <AlertCircle size={12} /> Issues Found
              </h4>
              <ul className="space-y-1">
                {result.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-emerald-600 uppercase mb-2 flex items-center gap-1">
                <CheckCircle size={12} /> Suggested Fixes
              </h4>
              <ul className="space-y-1">
                {result.suggestions.map((fix, i) => (
                  <li key={i} className="text-sm text-slate-600 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                    {fix}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => setResult(null)}
            className="mt-4 w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Scan Another
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandGuardian;
