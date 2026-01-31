import React, { useEffect, useState } from 'react';
import { generateJSON } from '../lib/openai';
import { useAI } from '../context/AIContext';
import { useToast } from '../context/ToastContext';
import { Sparkles, AlertCircle, Trophy, TrendingUp, DollarSign, Clock, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockFinancialData = [
  { name: 'Mon', income: 4000, expense: 2400 },
  { name: 'Tue', income: 3000, expense: 1398 },
  { name: 'Wed', income: 2000, expense: 9800 },
  { name: 'Thu', income: 2780, expense: 3908 },
  { name: 'Fri', income: 1890, expense: 4800 },
  { name: 'Sat', income: 2390, expense: 3800 },
  { name: 'Sun', income: 3490, expense: 4300 },
];

const mockBacklog = [
  "Social Media: Nike Campaign requires approval by 5 PM",
  "Tech: Server migration pending",
  "Finance: Q3 Report overdue",
  "HR: 3 interviews scheduled"
];

const Dashboard = () => {
  const { apiKey } = useAI();
  const { addToast } = useToast();
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBriefing = async () => {
    setLoading(true);
    if (!apiKey) {
       // Fallback immediately if no key
       setBriefing({
        summary: "Agency performance is stable with a slight dip in mid-week revenue. Operational backlog is manageable but requires attention on key client deliverables.",
        criticalAction: "Finalize Nike Campaign approval by 5 PM today.",
        winToCelebrate: "Successful completion of 3 client interviews scheduled for today."
      });
      setLoading(false);
      return;
    }
    
    try {
      const prompt = `
        Analyze the following agency data:
        Financials (Last 7 days): ${JSON.stringify(mockFinancialData)}
        Task Backlog: ${JSON.stringify(mockBacklog)}
        
        Provide:
        1. A 2-sentence executive summary.
        2. The most "Critical Action" required today.
        3. A "Win to Celebrate" found in the data (or invent a reasonable one based on trends).
      `;

      const schema = {
        type: "object",
        properties: {
          summary: { type: "string" },
          criticalAction: { type: "string" },
          winToCelebrate: { type: "string" }
        }
      };

      const result = await generateJSON(prompt, schema);
      setBriefing(JSON.parse(result));
      addToast('AI Briefing updated', 'success');
    } catch (error) {
      console.error("AI Briefing failed", error);
      // Fallback for demo if API fails or quota exceeded
      setBriefing({
        summary: "Agency performance is stable with a slight dip in mid-week revenue. Operational backlog is manageable but requires attention on key client deliverables.",
        criticalAction: "Finalize Nike Campaign approval by 5 PM today.",
        winToCelebrate: "Successful completion of 3 client interviews scheduled for today."
      });
      addToast('AI Briefing loaded (Offline Mode)', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefing();
  }, [apiKey]);

  const handleRefresh = () => {
    fetchBriefing();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back, Admin.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-3 md:py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm w-full md:w-auto justify-center"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {/* AI Strategic Briefing */}
      <div className="glass-card p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Sparkles size={120} />
        </div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">AI Strategic Briefing</h2>
              <p className="text-xs text-slate-500">Real-time agency insights powered by Gemini</p>
            </div>
          </div>
          {briefing && !loading && (
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full border border-indigo-100">
               {apiKey ? 'Live Analysis' : 'Demo Mode'}
             </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="h-24 bg-rose-50 rounded-xl border border-rose-100"></div>
              <div className="h-24 bg-emerald-50 rounded-xl border border-emerald-100"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10">
            {/* Executive Summary */}
            <div className="bg-white/50 rounded-xl p-4 border border-white/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Executive Summary
              </h3>
              <p className="text-slate-700 leading-relaxed font-medium">
                {briefing?.summary}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critical Action */}
              <div className="bg-rose-50/80 border border-rose-100 rounded-xl p-5 hover:shadow-md transition-shadow cursor-default">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-rose-500">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-800 mb-1">Critical Action</h3>
                    <p className="text-sm text-rose-700 leading-snug">{briefing?.criticalAction}</p>
                  </div>
                </div>
              </div>

              {/* Win to Celebrate */}
              <div className="bg-emerald-50/80 border border-emerald-100 rounded-xl p-5 hover:shadow-md transition-shadow cursor-default">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-500">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-800 mb-1">Win to Celebrate</h3>
                    <p className="text-sm text-emerald-700 leading-snug">{briefing?.winToCelebrate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Financial Overview (Placeholder Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-slate-400" />
              Financial Overview
            </h3>
            <select className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1 text-slate-600 outline-none">
              <option>Last 7 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockFinancialData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800">$124,500</p>
            </div>
          </div>
          
          <div className="glass p-6 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Billable Hours</p>
              <p className="text-2xl font-bold text-slate-800">1,204h</p>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl">
             <h3 className="font-bold text-slate-800 mb-4 text-sm">Active Projects</h3>
             <div className="space-y-3">
                {['Nike Summer', 'Tech Rebrand', 'Q3 Audit'].map(project => (
                  <div key={project} className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{project}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
