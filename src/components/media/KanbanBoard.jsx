import React, { useState } from 'react';
import { MoreHorizontal, Plus, Calendar, MapPin, Camera, Clock, AlertCircle, CheckSquare } from 'lucide-react';

const initialColumns = {
  concept: {
    id: 'concept',
    title: 'Concept & Scripting',
    color: 'border-t-4 border-slate-400',
    items: [
      { 
        id: '1', 
        title: 'Tech Documentary Series', 
        type: 'Documentary', 
        priority: 'Medium',
        assignees: ['JD', 'AL'],
        dueDate: '2024-03-15',
        tasks: 2,
        completedTasks: 0
      },
    ],
  },
  preprod: {
    id: 'preprod',
    title: 'Scheduling & Logistics',
    color: 'border-t-4 border-blue-500',
    items: [
      { 
        id: '2', 
        title: 'Summer Fashion Shoot', 
        type: 'Commercial', 
        priority: 'High',
        location: 'Downtown Studio A',
        shootDate: 'Feb 24',
        assignees: ['MK', 'JD'],
        dueDate: '2024-02-28',
        tasks: 5,
        completedTasks: 3
      },
    ],
  },
  production: {
    id: 'production',
    title: 'Production (Shoots)',
    color: 'border-t-4 border-rose-500',
    items: [
      { 
        id: '3', 
        title: 'Nike Social Reels', 
        type: 'Social Media', 
        priority: 'Urgent',
        location: 'City Park',
        shootDate: 'Today',
        assignees: ['AL'],
        dueDate: '2024-02-22',
        tasks: 8,
        completedTasks: 1
      },
    ],
  },
  postprod: {
    id: 'postprod',
    title: 'Post-Production',
    color: 'border-t-4 border-indigo-500',
    items: [
      { 
        id: '4', 
        title: 'Corporate Interview Edit', 
        type: 'Editing', 
        priority: 'Medium',
        assignees: ['JD'],
        dueDate: '2024-02-25',
        tasks: 1,
        completedTasks: 0
      },
    ],
  },
  review: {
    id: 'review',
    title: 'Review & Feedback',
    color: 'border-t-4 border-amber-500',
    items: [
      { 
        id: '5', 
        title: 'Podcast Ep 42', 
        type: 'Podcast', 
        priority: 'Low',
        assignees: ['MK'],
        dueDate: '2024-02-23',
        tasks: 3,
        completedTasks: 3
      },
    ],
  },
  delivery: {
    id: 'delivery',
    title: 'Final Delivery',
    color: 'border-t-4 border-emerald-500',
    items: [
      { 
        id: '6', 
        title: 'Wedding Highlights', 
        type: 'Event', 
        priority: 'High',
        assignees: ['JD', 'AL', 'MK'],
        dueDate: '2024-02-20',
        tasks: 12,
        completedTasks: 12
      },
    ],
  },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);

  const handleDragStart = (e, cardId, sourceColId) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourceColId', sourceColId);
  };

  const handleDrop = (e, destColId) => {
    const cardId = e.dataTransfer.getData('cardId');
    const sourceColId = e.dataTransfer.getData('sourceColId');
    
    if (sourceColId === destColId) return;

    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];
    const card = sourceCol.items.find(item => item.id === cardId);

    setColumns({
      ...columns,
      [sourceColId]: {
        ...sourceCol,
        items: sourceCol.items.filter(item => item.id !== cardId)
      },
      [destColId]: {
        ...destCol,
        items: [...destCol.items, card]
      }
    });
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Documentary': return 'text-purple-600 bg-purple-50';
      case 'Commercial': return 'text-blue-600 bg-blue-50';
      case 'Social Media': return 'text-pink-600 bg-pink-50';
      case 'Event': return 'text-emerald-600 bg-emerald-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="flex gap-6 overflow-x-auto h-full pb-4 items-start">
      {Object.values(columns).map((col) => (
        <div 
          key={col.id} 
          className="flex-shrink-0 w-80 flex flex-col max-h-full"
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={allowDrop}
        >
          <div className={`flex items-center justify-between mb-3 pb-2 border-b border-slate-200 ${col.color} pt-2 bg-slate-50/80 p-3 rounded-t-xl backdrop-blur-sm sticky top-0 z-10`}>
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{col.title}</h3>
            <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
              {col.items.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar px-1 pb-2">
            {col.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id, col.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-300 cursor-move transition-all active:cursor-grabbing group"
              >
                {/* Header Tags */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-2 flex-wrap">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md border ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${getTypeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <button className="text-slate-300 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Title */}
                <h4 className="font-bold text-slate-800 mb-3 leading-tight">{item.title}</h4>

                {/* Meta Details */}
                <div className="space-y-2 mb-4">
                  {item.shootDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Camera size={14} className="text-indigo-500" />
                      <span className="font-medium">Shoot: {item.shootDate}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin size={14} className="text-rose-500" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock size={14} />
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>

                {/* Footer: Assignees & Tasks */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    {item.assignees.map((a, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm">
                        {a}
                      </div>
                    ))}
                  </div>
                  
                  {item.tasks > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <CheckSquare size={14} className={item.completedTasks === item.tasks ? 'text-emerald-500' : 'text-slate-400'} />
                      <span>{item.completedTasks}/{item.tasks}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            <button className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:bg-slate-50 hover:border-slate-300 hover:text-slate-600 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;