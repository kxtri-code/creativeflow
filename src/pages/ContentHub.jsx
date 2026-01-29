import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import EditorialPipeline from '../components/content/EditorialPipeline';
import MagicEditor from '../components/content/MagicEditor';
import NewArticleModal from '../components/content/NewArticleModal';

const ContentHub = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Content Writing Hub</h1>
          <p className="text-slate-500">Editorial pipeline and AI-powered drafting.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
          + New Article
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Pipeline - Main Area */}
        <div className="col-span-12 lg:col-span-7 h-full min-h-[500px]">
          <EditorialPipeline />
        </div>

        {/* Magic Editor - Sidebar */}
        <div className="col-span-12 lg:col-span-5 h-full min-h-[500px]">
          <MagicEditor />
        </div>
      </div>

      <NewArticleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default ContentHub;
