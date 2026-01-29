import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

const data = [
  { name: 'Jan', revenue: 4000, expenses: 2400 },
  { name: 'Feb', revenue: 3000, expenses: 1398 },
  { name: 'Mar', revenue: 2000, expenses: 9800 },
  { name: 'Apr', revenue: 2780, expenses: 3908 },
  { name: 'May', revenue: 1890, expenses: 4800 },
  { name: 'Jun', revenue: 2390, expenses: 3800 },
  { name: 'Jul', revenue: 3490, expenses: 4300 },
];

const FinanceOverview = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 bg-gradient-to-br from-indigo-50/50 to-white/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <DollarSign size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">$124,500</div>
          <div className="text-xs font-medium text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp size={12} /> +12.5% vs last month
          </div>
        </div>

        <div className="glass-card p-4 bg-gradient-to-br from-rose-50/50 to-white/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <CreditCard size={20} />
            </div>
            <span className="text-sm font-medium text-slate-500">Expenses</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">$42,300</div>
          <div className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
            <TrendingDown size={12} /> +2.4% vs last month
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6 flex-1 min-h-[300px] flex flex-col">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Financial Performance</h3>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ fontSize: '12px', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default FinanceOverview;
