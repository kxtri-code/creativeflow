import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import SprintBoard from '../components/tech/SprintBoard';
import TechMetrics from '../components/tech/TechMetrics';
import NewIssueModal from '../components/tech/NewIssueModal';

const TechHub = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tech Team Hub</h1>
          <p className="text-slate-500">Agile workflows and engineering metrics.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.open('https://github.com', '_blank')}
            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium hover:bg-slate-50 transition-all"
          >
            View Repository
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
          >
            + New Issue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Sprint Board - Main Area */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
          <SprintBoard />
        </div>

        {/* Metrics - Sidebar */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-[500px]">
          <TechMetrics />
        </div>
      </div>

      <NewIssueModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default TechHub;
