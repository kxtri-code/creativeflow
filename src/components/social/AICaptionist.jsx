import React, { useState } from 'react';
import { useAI } from '../../context/AIContext';
import { generateJSON } from '../../lib/gemini';
import { Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

const AICaptionist = () => {
  const { apiKey } = useAI();
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Professional');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!apiKey || !topic) return;
    
    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const prompt = `
        Generate a social media caption for ${platform}.
        Topic: ${topic}
        Tone: ${tone}
        
        Return a JSON object with:
        - caption: The main caption text (include emojis if appropriate for platform).
        - hashtags: An array of 5-10 relevant hashtags.
      `;

      const schema = {
        type: "object",
        properties: {
          caption: { type: "string" },
          hashtags: { type: "array", items: { type: "string" } }
        }
      };

      const json = await generateJSON(prompt, schema);
      setResult(JSON.parse(json));
    } catch (error) {
      console.error("Caption generation failed", error);
      // Fallback
      setResult({
        caption: `Here is a drafted caption about ${topic}. (AI generation failed: ${error.message || "Unknown error"})`,
        hashtags: ["#error", "#fallback"]
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    const text = `${result.caption}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-white/60 to-indigo-50/30">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
          <Sparkles size={16} />
        </div>
        <h2 className="text-lg font-bold text-slate-800">AI Captionist</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">Topic / Context</label>
          <textarea 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Launching our new summer collection..."
            className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Platform</label>
            <select 
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
            >
              <option>Instagram</option>
              <option>LinkedIn</option>
              <option>Twitter</option>
              <option>Facebook</option>
              <option>TikTok</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Tone</label>
            <select 
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
            >
              <option>Professional</option>
              <option>Casual</option>
              <option>Excited</option>
              <option>Witty</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerate}
          disabled={loading || !topic}
          className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              Generate Caption <Sparkles size={16} />
            </>
          )}
        </button>

        {result && (
          <div className="mt-4 p-4 bg-white/60 border border-slate-200 rounded-xl animate-in fade-in slide-in-from-bottom-2">
            <p className="text-sm text-slate-700 whitespace-pre-wrap mb-3">{result.caption}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {result.hashtags.map(tag => (
                <span key={tag} className="text-xs text-indigo-600 font-medium">{tag}</span>
              ))}
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="w-full py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICaptionist;
