import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import KanbanBoard from '../components/media/KanbanBoard';
import InventoryList from '../components/media/InventoryList';
import NewProjectModal from '../components/media/NewProjectModal';

const MediaHub = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Kanban Board - Main Area */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
          <KanbanBoard />
        </div>

        {/* Inventory Sidebar - fixed overlapping by ensuring proper overflow handling */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-[500px] overflow-hidden">
          <InventoryList />
        </div>
      </div>

      <NewProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MediaHub;
