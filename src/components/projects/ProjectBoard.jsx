import React, { useState, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, Clock, User } from 'lucide-react';
import TaskModal from './TaskModal';

const COLUMNS = [
  { id: 'To Do', title: 'To Do', color: 'bg-slate-100' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-indigo-50' },
  { id: 'Review', title: 'Review', color: 'bg-amber-50' },
  { id: 'Done', title: 'Done', color: 'bg-emerald-50' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'Alex Johnson', role: 'Designer' },
  { id: 'u2', name: 'Sarah Miller', role: 'Developer' },
  { id: 'u3', name: 'Mike Ross', role: 'Manager' },
  { id: 'u4', name: 'Jessica Pearson', role: 'Director' }
];

const ProjectBoard = ({ viewMode = 'board' }) => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const savedTasks = localStorage.getItem('project_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Mock Data
      const mockTasks = [
        { id: 1, title: 'Design System Update', description: 'Update color palette and typography.', status: 'To Do', priority: 'High', startDate: '2024-03-15', dueDate: '2024-03-20', assignees: ['u1'], tags: ['Design', 'UI'], comments: [] },
        { id: 2, title: 'API Integration', description: 'Connect frontend to backend endpoints.', status: 'In Progress', priority: 'Urgent', startDate: '2024-03-16', dueDate: '2024-03-18', assignees: ['u2'], tags: ['Dev', 'Backend'], comments: [] },
        { id: 3, title: 'Client Presentation', description: 'Prepare slides for Q1 review.', status: 'Review', priority: 'Medium', startDate: '2024-03-24', dueDate: '2024-03-25', assignees: ['u3', 'u4'], tags: ['Meeting'], comments: [] },
      ];
      setTasks(mockTasks);
      localStorage.setItem('project_tasks', JSON.stringify(mockTasks));
    }
  }, []);

  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem('project_tasks', JSON.stringify(newTasks));
  };

  const handleSaveTask = (task) => {
    if (editingTask) {
      const updatedTasks = tasks.map(t => t.id === task.id ? task : t);
      saveTasks(updatedTasks);
    } else {
      saveTasks([...tasks, task]);
    }
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleNewTask = (status) => {
    setEditingTask(null); // Ensure clean state
    setIsModalOpen(true);
    // You could pre-fill status here if TaskModal supported it via initial props override
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, status) => {
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id.toString() === taskId);
    if (task && task.status !== status) {
      const updatedTasks = tasks.map(t => 
        t.id.toString() === taskId ? { ...t, status } : t
      );
      saveTasks(updatedTasks);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {viewMode === 'board' ? (
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="h-full flex gap-6 min-w-[1200px] pb-4">
            {COLUMNS.map(column => (
              <div 
                key={column.id}
                className="flex-1 flex flex-col h-full max-w-xs bg-slate-50/50 rounded-2xl border border-slate-200/60"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      column.id === 'To Do' ? 'bg-slate-400' :
                      column.id === 'In Progress' ? 'bg-indigo-500' :
                      column.id === 'Review' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`} />
                    <h3 className="font-bold text-slate-700 text-sm">{column.title}</h3>
                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                      {tasks.filter(t => t.status === column.id).length}
                    </span>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal size={16} />
                  </button>
                </div>

                {/* Tasks List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {tasks.filter(t => t.status === column.id).map(task => (
                    <div 
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => handleEditTask(task)}
                      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {task.dueDate && (
                          <div className={`flex items-center gap-1 text-[10px] font-medium ${
                            new Date(task.dueDate) < new Date() ? 'text-rose-500' : 'text-slate-400'
                          }`}>
                            <Clock size={12} />
                            {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1 mb-3">
                        {task.tags.map(tag => (
                          <span key={tag} className="text-[10px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex -space-x-2">
                          {task.assignees.map(userId => {
                            const user = MOCK_USERS.find(u => u.id === userId);
                            return (
                              <div key={userId} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700" title={user?.name}>
                                {user?.name.charAt(0)}
                              </div>
                            );
                          })}
                          {task.assignees.length === 0 && (
                            <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-400">
                              <User size={12} />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-slate-400">
                          {task.comments?.length > 0 && (
                            <div className="flex items-center gap-1 text-xs">
                              <MessageSquare size={12} /> {task.comments.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => handleNewTask(column.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-500 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Task
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-4">Task</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Assignees</div>
              <div className="col-span-2">Timeline</div>
              <div className="col-span-2">Priority</div>
            </div>
            <div className="divide-y divide-slate-100">
              {[...tasks].sort((a, b) => new Date(a.startDate || a.dueDate) - new Date(b.startDate || b.dueDate)).map(task => (
                <div 
                  key={task.id} 
                  onClick={() => handleEditTask(task)}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className="col-span-4">
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                    <p className="text-xs text-slate-500 truncate">{task.description}</p>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      task.status === 'To Do' ? 'bg-slate-100 text-slate-600' :
                      task.status === 'In Progress' ? 'bg-indigo-100 text-indigo-600' :
                      task.status === 'Review' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex -space-x-2">
                      {task.assignees.map(userId => {
                        const user = MOCK_USERS.find(u => u.id === userId);
                        return (
                          <div key={userId} className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-indigo-700" title={user?.name}>
                            {user?.name.charAt(0)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="col-span-2 text-xs text-slate-500">
                    <div className="flex flex-col">
                      <span>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</span>
                      <span className="text-[10px] text-slate-400">to {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        users={MOCK_USERS}
      />
    </div>
  );
};

export default ProjectBoard;