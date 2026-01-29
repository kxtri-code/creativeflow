import React from 'react';
import { GitPullRequest, AlertCircle, CheckCircle2, Circle } from 'lucide-react';

const tasks = [
  { id: 1, title: 'API Authentication Flow', status: 'In Progress', type: 'Feature', assignee: 'Dev1' },
  { id: 2, title: 'Fix Login Crash on iOS', status: 'In Progress', type: 'Bug', assignee: 'Dev2' },
  { id: 3, title: 'Database Schema Migration', status: 'Done', type: 'Task', assignee: 'Dev1' },
  { id: 4, title: 'Update Dependencies', status: 'To Do', type: 'Task', assignee: 'Dev3' },
  { id: 5, title: 'Refactor User Context', status: 'Review', type: 'Feature', assignee: 'Dev2' },
];

const SprintBoard = () => {
  const columns = {
    'To Do': tasks.filter(t => t.status === 'To Do'),
    'In Progress': tasks.filter(t => t.status === 'In Progress'),
    'Review': tasks.filter(t => t.status === 'Review'),
    'Done': tasks.filter(t => t.status === 'Done'),
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <GitPullRequest className="text-indigo-600" /> Sprint 42 Board
      </h2>

      <div className="grid grid-cols-4 gap-4 flex-1 overflow-hidden">
        {Object.entries(columns).map(([status, items]) => (
          <div key={status} className="flex flex-col h-full bg-slate-50/50 rounded-xl p-3 border border-slate-100">
            <h3 className="text-sm font-bold text-slate-600 mb-3 px-1">{status} <span className="text-slate-400 font-normal">({items.length})</span></h3>
            <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
              {items.map(task => (
                <div key={task.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-300 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase
                      ${task.type === 'Bug' ? 'bg-rose-100 text-rose-600' :
                        task.type === 'Feature' ? 'bg-indigo-100 text-indigo-600' :
                        'bg-slate-100 text-slate-600'}
                    `}>
                      {task.type}
                    </span>
                    <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {task.assignee.charAt(0)}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-800">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SprintBoard;
