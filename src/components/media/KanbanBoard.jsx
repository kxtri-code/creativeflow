import React, { useState } from 'react';
import { MoreHorizontal, Plus } from 'lucide-react';

const initialColumns = {
  todo: {
    id: 'todo',
    title: 'To Do',
    color: 'border-t-4 border-slate-400',
    items: [
      { id: '1', title: 'Nike Commercial Shoot', tag: 'Shoot', assignees: ['JD', 'AL'] },
      { id: '2', title: 'Equipment Check', tag: 'Ops', assignees: ['MK'] },
    ],
  },
  inProgress: {
    id: 'inProgress',
    title: 'In Progress',
    color: 'border-t-4 border-indigo-500',
    items: [
      { id: '3', title: 'Summer Campaign Edit', tag: 'Edit', assignees: ['JD'] },
    ],
  },
  review: {
    id: 'review',
    title: 'Review',
    color: 'border-t-4 border-amber-500',
    items: [
      { id: '4', title: 'Social Teaser v1', tag: 'Review', assignees: ['AL'] },
    ],
  },
  done: {
    id: 'done',
    title: 'Done',
    color: 'border-t-4 border-emerald-500',
    items: [
      { id: '5', title: 'Corporate Headshots', tag: 'Shoot', assignees: ['MK', 'JD'] },
    ],
  },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);

  // Simplified drag and drop handler placeholder
  // In a real app, we'd use dnd-kit or react-beautiful-dnd
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

  return (
    <div className="flex gap-6 overflow-x-auto h-full pb-4">
      {Object.values(columns).map((col) => (
        <div 
          key={col.id} 
          className="flex-shrink-0 w-80 glass-card p-4 flex flex-col bg-slate-50/50"
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={allowDrop}
        >
          <div className={`flex items-center justify-between mb-4 pb-2 border-b border-slate-200 ${col.color} pt-2`}>
            <h3 className="font-bold text-slate-700">{col.title}</h3>
            <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
              {col.items.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar">
            {col.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id, col.id)}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 cursor-move transition-all active:cursor-grabbing"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                    {item.tag}
                  </span>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                <h4 className="font-semibold text-slate-800 mb-3">{item.title}</h4>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {item.assignees.map((a, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 font-medium">Due in 2d</div>
                </div>
              </div>
            ))}
            
            <button className="w-full py-2 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2">
              <Plus size={16} /> Add Card
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
