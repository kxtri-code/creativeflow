import React from 'react';
import { Shield, FileText, Lock, MoreVertical, File, Download } from 'lucide-react';

const files = [
  { id: 1, name: 'Q1_Financial_Report_Confidential.pdf', size: '2.4 MB', type: 'pdf', modified: '2 hours ago', access: 'Restricted' },
  { id: 2, name: 'Employee_Contracts_2026.zip', size: '156 MB', type: 'zip', modified: 'Yesterday', access: 'Admin Only' },
  { id: 3, name: 'Client_List_Encrypted.xlsx', size: '45 KB', type: 'xlsx', modified: '3 days ago', access: 'Restricted' },
  { id: 4, name: 'Agency_Bank_Details.pdf', size: '1.2 MB', type: 'pdf', modified: '1 week ago', access: 'Top Secret' },
  { id: 5, name: 'Tax_Returns_2025.pdf', size: '8.5 MB', type: 'pdf', modified: '2 weeks ago', access: 'Admin Only' },
];

const SecureVault = () => {
  return (
    <div className="glass-card h-full flex flex-col relative overflow-hidden">
      {/* Decorative background element for "Security" feel */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="p-6 border-b border-slate-100 flex items-center justify-between relative z-10">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="text-indigo-600" size={24} /> Secure Vault
          </h2>
          <p className="text-slate-500 text-sm">Encrypted storage for sensitive agency documents.</p>
        </div>
        <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2">
          <Lock size={16} /> Access Logs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 relative z-10">
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${file.type === 'pdf' ? 'bg-rose-50 text-rose-600' : 
                    file.type === 'zip' ? 'bg-amber-50 text-amber-600' : 
                    'bg-emerald-50 text-emerald-600'}
                `}>
                  <File size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{file.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.modified}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider
                  ${file.access === 'Top Secret' ? 'bg-rose-100 text-rose-700' :
                    file.access === 'Admin Only' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'}
                `}>
                  {file.access}
                </span>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-indigo-600">
                    <Download size={18} />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
        <Lock size={12} className="inline mr-1" /> End-to-end encryption enabled. Last audit: Today 09:00 AM
      </div>
    </div>
  );
};

export default SecureVault;
