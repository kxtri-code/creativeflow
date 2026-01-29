import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Bug, Clock, TrendingUp } from 'lucide-react';

const burnDownData = [
  { day: 'Mon', remaining: 40 },
  { day: 'Tue', remaining: 35 },
  { day: 'Wed', remaining: 28 },
  { day: 'Thu', remaining: 20 },
  { day: 'Fri', remaining: 12 },
  { day: 'Sat', remaining: 8 },
  { day: 'Sun', remaining: 5 },
];

const bugData = [
  { severity: 'Critical', count: 2 },
  { severity: 'High', count: 5 },
  { severity: 'Medium', count: 12 },
  { severity: 'Low', count: 8 },
];

const TechMetrics = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col justify-between bg-indigo-50/50">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <Clock size={18} />
            <span className="text-xs font-bold uppercase">Cycle Time</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">2.4 <span className="text-sm font-normal text-slate-500">days</span></p>
        </div>
        <div className="glass-card p-4 flex flex-col justify-between bg-rose-50/50">
          <div className="flex items-center gap-2 text-rose-600 mb-2">
            <Bug size={18} />
            <span className="text-xs font-bold uppercase">Open Bugs</span>
          </div>
          <p className="text-2xl font-bold text-slate-800">7 <span className="text-sm font-normal text-slate-500">active</span></p>
        </div>
      </div>

      {/* Burn Down Chart */}
      <div className="glass-card p-5 flex-1 min-h-[200px]">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <TrendingUp size={16} /> Sprint Burndown
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={burnDownData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8'}} />
            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
            <Line type="monotone" dataKey="remaining" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bugs by Severity */}
      <div className="glass-card p-5 flex-1 min-h-[200px]">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <Bug size={16} /> Bugs by Severity
        </h3>
        <ResponsiveContainer width="100%" height="80%">
          <BarChart data={bugData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis type="number" hide />
            <YAxis dataKey="severity" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} width={50} />
            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
            <Bar dataKey="count" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TechMetrics;
