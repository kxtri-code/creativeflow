import React from 'react';
import { useToast } from '../context/ToastContext';
import FinanceOverview from '../components/ops/FinanceOverview';
import SecureVault from '../components/ops/SecureVault';
import { MessageSquare, Package, Settings, Users } from 'lucide-react';

const OperationsHub = () => {
  const { addToast } = useToast();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Enterprise Operations</h1>
          <p className="text-slate-500">Financials, security, and global administration.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => addToast('Opening Settings Panel...', 'info')}
            className="px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <Settings size={18} /> Settings
          </button>
          <button 
            onClick={() => addToast('Generating Global Report...', 'success')}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
          >
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Top Row: Finance & Quick Stats */}
        <div className="col-span-12 lg:col-span-8 h-[500px]">
          <FinanceOverview />
        </div>

        {/* Sidebar: Chat & Actions */}
        <div className="col-span-12 lg:col-span-4 h-[500px] flex flex-col gap-6">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => addToast('Opening Global Inventory...', 'info')}
              className="glass-card p-4 hover:bg-indigo-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Package size={20} />
              </div>
              <div className="font-bold text-slate-800">Global Inventory</div>
              <div className="text-xs text-slate-500">Manage assets</div>
            </button>
            <button 
              onClick={() => addToast('Team Chat opened', 'info')}
              className="glass-card p-4 hover:bg-indigo-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare size={20} />
              </div>
              <div className="font-bold text-slate-800">Team Chat</div>
              <div className="text-xs text-slate-500">5 unread</div>
            </button>
             <button 
              onClick={() => addToast('Opening Vendor Portal...', 'info')}
              className="glass-card p-4 hover:bg-indigo-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div className="font-bold text-slate-800">Vendor Portal</div>
              <div className="text-xs text-slate-500">Manage partners</div>
            </button>
            <button 
              onClick={() => addToast('Opening System Config...', 'error')}
              className="glass-card p-4 hover:bg-indigo-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Settings size={20} />
              </div>
              <div className="font-bold text-slate-800">System Config</div>
              <div className="text-xs text-slate-500">Admin only</div>
            </button>
          </div>

          {/* Chat Preview (Placeholder) */}
          <div className="glass-card flex-1 p-4 bg-gradient-to-br from-white to-indigo-50/30">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-600" /> Recent Messages
            </h3>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-700">Sarah Jenkins</div>
                  <div className="text-xs text-slate-500 line-clamp-2">Can you approve the budget for the Q2 campaign?</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0"></div>
                <div>
                  <div className="text-xs font-bold text-slate-700">Mike Thompson</div>
                  <div className="text-xs text-slate-500 line-clamp-2">Server maintenance scheduled for tonight at 2 AM.</div>
                </div>
              </div>
            </div>
            <button 
              onClick={() => addToast('Opening Team Chat Application...', 'info')}
              className="w-full mt-auto py-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-4"
            >
              Open Team Chat
            </button>
          </div>
        </div>

        {/* Bottom Row: Vault */}
        <div className="col-span-12 h-[400px]">
          <SecureVault /></div>
        </div>
      </div>
      <InventoryModal isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} />
    </div>
  );
};

export default OperationsHub;
