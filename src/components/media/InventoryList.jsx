import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Search, Filter, Battery, Wifi, AlertTriangle } from 'lucide-react';

const mockInventory = [
  { id: 1, name: 'Sony A7S III', category: 'Camera', status: 'Available', battery: 100 },
  { id: 2, name: 'Canon R5', category: 'Camera', status: 'Checked Out', checkedOutTo: 'JD', returnDate: '2026-02-01', battery: 85 },
  { id: 3, name: 'DJI Ronin RS3', category: 'Gimbal', status: 'Maintenance', battery: 0 },
  { id: 4, name: 'Aputure 600d', category: 'Lighting', status: 'Available', battery: null },
  { id: 5, name: 'Sennheiser MKH 416', category: 'Audio', status: 'Available', battery: null },
];

const InventoryList = () => {
  const { addToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = mockInventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Equipment Inventory</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search gear..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500 w-48"
            />
          </div>
          <button onClick={() => addToast('Filter coming soon', 'info')} className="p-2 text-slate-400 hover:text-indigo-600 border border-slate-200 rounded-lg">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-xs font-semibold text-slate-500 border-b border-slate-100">
              <th className="pb-3 pl-2">Item Name</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                <td className="py-3 pl-2">
                  <div className="font-medium text-slate-800">{item.name}</div>
                  <div className="text-xs text-slate-400">{item.category}</div>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
                    ${item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                      item.status === 'Checked Out' ? 'bg-indigo-50 text-indigo-600' :
                      'bg-rose-50 text-rose-600'}
                  `}>
                    <span className={`w-1.5 h-1.5 rounded-full 
                      ${item.status === 'Available' ? 'bg-emerald-500' :
                        item.status === 'Checked Out' ? 'bg-indigo-500' :
                        'bg-rose-500'}
                    `}></span>
                    {item.status}
                  </span>
                  {item.status === 'Checked Out' && (
                    <div className="text-[10px] text-slate-400 mt-1 pl-1">
                      Ret: {item.returnDate}
                    </div>
                  )}
                </td>
                <td className="py-3 text-right pr-2">
                  <button onClick={() => addToast(`Viewing ${item.name}`, 'info')} className="text-slate-400 hover:text-indigo-600 text-xs font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Battery size={14} /> Power Levels OK</span>
          <span className="flex items-center gap-1"><Wifi size={14} /> Trackers Active</span>
        </div>
        <span className="flex items-center gap-1 text-amber-500"><AlertTriangle size={14} /> 1 Maintenance</span>
      </div>
    </div>
  );
};

export default InventoryList;
