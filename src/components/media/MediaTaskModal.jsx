import React, { useState, useEffect } from 'react';
import Modal from '../shared/Modal';
import { useToast } from '../../context/ToastContext';
import { Calendar, MapPin, Camera, Clock, User, AlignLeft, Flag } from 'lucide-react';

const MediaTaskModal = ({ isOpen, onClose, task, columnId, onSave }) => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Commercial',
    priority: 'Medium',
    shootDate: '',
    location: '',
    dueDate: '',
    assignees: '',
    description: ''
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        type: task.type || 'Commercial',
        priority: task.priority || 'Medium',
        shootDate: task.shootDate || '',
        location: task.location || '',
        dueDate: task.dueDate || '',
        assignees: task.assignees ? task.assignees.join(', ') : '',
        description: task.description || ''
      });
    } else {
      setFormData({
        title: '',
        type: 'Commercial',
        priority: 'Medium',
        shootDate: '',
        location: '',
        dueDate: '',
        assignees: '',
        description: ''
      });
    }
  }, [task, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Process assignees from comma-separated string to array
    const assigneesArray = formData.assignees
      ? formData.assignees.split(',').map(s => s.trim()).filter(s => s)
      : [];

    const taskData = {
      ...formData,
      assignees: assigneesArray,
      id: task ? task.id : Date.now().toString(),
      tasks: task ? task.tasks : 0,
      completedTasks: task ? task.completedTasks : 0
    };

    onSave(taskData, columnId);
    addToast(task ? 'Task updated successfully' : 'Task created successfully', 'success');
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={task ? "Edit Production Task" : "New Production Task"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
          <input 
            type="text" 
            name="title"
            required
            className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-medium"
            placeholder="e.g. Summer Campaign Shoot"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column - Meta */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type</label>
              <select 
                name="type"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Commercial</option>
                <option>Documentary</option>
                <option>Social Media</option>
                <option>Event</option>
                <option>Podcast</option>
                <option>Photography</option>
                <option>Music Video</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Priority</label>
              <div className="flex gap-2">
                {['Low', 'Medium', 'High', 'Urgent'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setFormData({...formData, priority: p})}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      formData.priority === p 
                        ? 'bg-slate-800 text-white border-slate-800' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Assignees</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  name="assignees"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  placeholder="Initials separated by comma (e.g. JD, AL)"
                  value={formData.assignees}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Logistics */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Shoot Date</label>
              <div className="relative">
                <Camera className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  name="shootDate"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  placeholder="e.g. Feb 24 or TBD"
                  value={formData.shootDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  name="location"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  placeholder="Studio A, City Park..."
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="date" 
                  name="dueDate"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm"
                  value={formData.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description & Notes</label>
          <textarea 
            name="description"
            rows="4"
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm resize-none"
            placeholder="Add shoot details, script notes, or equipment requirements..."
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
          >
            {task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MediaTaskModal;