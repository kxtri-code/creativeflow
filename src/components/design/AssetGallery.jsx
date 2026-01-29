import React from 'react';
import { Image, MoreVertical, Clock } from 'lucide-react';

const mockAssets = [
  { id: 1, name: 'Summer Campaign Banner', version: 'v2.1', date: '2 hrs ago', thumbnail: 'bg-gradient-to-br from-orange-200 to-rose-200' },
  { id: 2, name: 'Logo Vertical Lockup', version: 'v1.0', date: 'Yesterday', thumbnail: 'bg-slate-200' },
  { id: 3, name: 'Social Stories Template', version: 'v3.5', date: '3 days ago', thumbnail: 'bg-gradient-to-tr from-blue-200 to-cyan-200' },
  { id: 4, name: 'Website Hero', version: 'v2.0', date: '1 week ago', thumbnail: 'bg-gradient-to-bl from-violet-200 to-fuchsia-200' },
  { id: 5, name: 'Icon Set', version: 'v1.2', date: '2 weeks ago', thumbnail: 'bg-slate-100' },
  { id: 6, name: 'Brochure Cover', version: 'v1.0', date: '1 month ago', thumbnail: 'bg-emerald-100' },
];

const AssetGallery = () => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Asset Gallery</h2>
        <div className="flex gap-2 text-sm text-slate-500">
          <span className="font-semibold text-slate-800">All</span>
          <span>Recent</span>
          <span>Archived</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 custom-scrollbar">
        {mockAssets.map((asset) => (
          <div key={asset.id} className="group relative bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer">
            {/* Thumbnail */}
            <div className={`aspect-square w-full ${asset.thumbnail} flex items-center justify-center`}>
              <Image className="text-slate-400/50 w-12 h-12" />
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-slate-800 truncate pr-2">{asset.name}</h3>
                <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical size={14} />
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono">{asset.version}</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {asset.date}</span>
              </div>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
        
        {/* Add New Placeholder */}
        <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all cursor-pointer">
           <span className="text-4xl mb-2 font-light">+</span>
           <span className="text-xs font-medium">Upload New</span>
        </div>
      </div>
    </div>
  );
};

export default AssetGallery;
