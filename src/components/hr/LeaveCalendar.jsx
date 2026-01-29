import React from 'react';
import { Calendar as CalendarIcon, PieChart as PieChartIcon, CheckCircle } from 'lucide-react';

const LeaveCalendar = () => {
  return (
    <div className="h-full flex flex-col gap-6">
      {/* Leave Balance */}
      <div className="glass-card p-6 bg-gradient-to-br from-indigo-50/50 to-white/50">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <CalendarIcon size={16} className="text-indigo-600" /> My Leave Balance
        </h3>
        <div className="flex gap-4">
          <div className="flex-1 bg-white p-3 rounded-xl border border-indigo-100 text-center">
            <span className="block text-2xl font-bold text-indigo-600">12</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Annual</span>
          </div>
          <div className="flex-1 bg-white p-3 rounded-xl border border-indigo-100 text-center">
            <span className="block text-2xl font-bold text-emerald-600">5</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Sick</span>
          </div>
          <div className="flex-1 bg-white p-3 rounded-xl border border-indigo-100 text-center">
            <span className="block text-2xl font-bold text-amber-600">2</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">Personal</span>
          </div>
        </div>
        <button className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-all">
          Request Time Off
        </button>
      </div>

      {/* Goal Governance */}
      <div className="glass-card p-6 flex-1 bg-gradient-to-br from-emerald-50/50 to-white/50">
        <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-emerald-600" /> Quarterly Goals
        </h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Complete Leadership Training</span>
              <span>75%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-3/4 rounded-full"></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Hire 2 Senior Devs</span>
              <span>30%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[30%] rounded-full"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
              <span>Reduce Cloud Costs</span>
              <span>100%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-full rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
