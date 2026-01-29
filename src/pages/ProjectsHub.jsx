import React, { useState } from 'react';
import ProjectBoard from '../components/projects/ProjectBoard';
import { Filter, Search, Plus, Users, Layout, List } from 'lucide-react';

const ProjectsHub = () => {
  const [viewMode, setViewMode] = useState('board'); // board | list

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects & Tasks</h1>
          <p className="text-slate-500">Manage deliverables, track progress, and collaborate.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('board')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'board' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layout size={18} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List size={18} />
            </button>
          </div>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">
            <Plus size={18} /> New Project
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {viewMode === 'board' ? (
          <ProjectBoard />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="text-center">
              <List size={48} className="mx-auto mb-4 opacity-20" />
              <p>List View Coming Soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsHub;