import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import KanbanBoard from '../components/media/KanbanBoard';
import InventoryList from '../components/media/InventoryList';
import NewProjectModal from '../components/media/NewProjectModal';
import { Layout, Box } from 'lucide-react';

const MediaHub = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('board');

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Media & Production</h1>
          <p className="text-slate-500">Manage shoots, edits, and equipment inventory.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
          + New Project
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('board')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'board' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layout size={18} />
          Project Board
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'inventory' 
              ? 'border-indigo-500 text-indigo-600' 
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Box size={18} />
          Equipment Inventory
        </button>
      </div>

      <div className="flex-1 min-h-0 relative">
        {activeTab === 'board' ? (
          <div className="h-full">
            <KanbanBoard />
          </div>
        ) : (
          <div className="h-full overflow-hidden">
            <InventoryList />
          </div>
        )}
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MediaHub;
