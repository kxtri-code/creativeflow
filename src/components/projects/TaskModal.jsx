import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, MessageSquare, Send, Clock, Flag, CheckCircle, AtSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const TaskModal = ({ isOpen, onClose, task, onSave, users }) => {
  const { profile } = useAuth();
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: '',
    assignees: [],
    tags: [],
    comments: []
  });

  const [newComment, setNewComment] = useState('');
  const [isTagInputOpen, setIsTagInputOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [showMentionList, setShowMentionList] = useState(false);

  const insertMention = (userName) => {
    setNewComment(prev => prev + `@${userName} `);
    setShowMentionList(false);
    // Focus back on input would be ideal here but skipping for simplicity
  };

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData(task);
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'To Do',
          priority: 'Medium',
          dueDate: new Date().toISOString().split('T')[0],
          assignees: [],
          tags: [],
          comments: []
        });
      }
    }
  }, [isOpen, task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: task ? task.id : Date.now(),
      updatedAt: new Date().toISOString()
    });
    addToast(task ? 'Task updated successfully' : 'Task created successfully', 'success');
    onClose();
  };

  const toggleAssignee = (userId) => {
    setFormData(prev => {
      const isAssigned = prev.assignees.includes(userId);
      return {
        ...prev,
        assignees: isAssigned 
          ? prev.assignees.filter(id => id !== userId)
          : [...prev.assignees, userId]
      };
    });
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    
    const comment = {
      id: Date.now(),
      text: newComment,
      user: profile?.full_name || 'Unknown User',
      userId: profile?.id,
      timestamp: new Date().toISOString()
    };

    setFormData(prev => ({
      ...prev,
      comments: [...prev.comments, comment]
    }));
    
    setNewComment('');
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
      setIsTagInputOpen(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              formData.status === 'Done' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {formData.status === 'Done' ? <CheckCircle size={20} /> : <Clock size={20} />}
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {task ? 'Edit Task' : 'New Task'}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Task Title"
                  className="w-full text-2xl font-bold text-slate-900 placeholder:text-slate-300 border-none outline-none bg-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 mb-2">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Add a more detailed description..."
                  className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm leading-relaxed"
                />
              </div>

              {/* Comments Section */}
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare size={16} /> Comments
                </h3>
                
                <div className="space-y-4 mb-4">
                  {formData.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                        {comment.user.charAt(0)}
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-slate-700">{comment.user}</span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {profile?.full_name?.charAt(0) || 'Me'}
                  </div>
                  <div className="flex-1 relative">
                    {showMentionList && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50 w-48 max-h-48 overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">MENTION USER</div>
                        {users.map(user => (
                          <button
                            key={user.id}
                            onClick={() => insertMention(user.name)}
                            className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors text-left"
                          >
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {user.name.charAt(0)}
                            </div>
                            <span className="truncate">{user.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    <input 
                      type="text" 
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment()}
                      placeholder="Write a comment..."
                      className="w-full pl-4 pr-20 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                    <div className="absolute right-2 top-1.5 flex items-center gap-1">
                      <button 
                        onClick={() => setShowMentionList(!showMentionList)}
                        className={`p-1.5 rounded-lg transition-colors ${showMentionList ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}
                        title="Mention someone"
                      >
                        <AtSign size={16} />
                      </button>
                      <button 
                        onClick={addComment}
                        className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Status & Priority */}
              <div className="p-4 bg-slate-50 rounded-xl space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Review</option>
                    <option>Done</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate}
                    onChange={e => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
                  />
                </div>
              </div>

              {/* Assignees */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Assignees</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.assignees.map(userId => {
                    const user = users.find(u => u.id === userId);
                    return (
                      <div key={userId} className="flex items-center gap-1 pl-1 pr-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                        <div className="w-4 h-4 rounded-full bg-indigo-200 flex items-center justify-center text-[10px]">
                          {user?.name.charAt(0)}
                        </div>
                        {user?.name}
                        <button onClick={() => toggleAssignee(userId)} className="hover:text-indigo-900"><X size={12} /></button>
                      </div>
                    );
                  })}
                  <button className="w-6 h-6 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                
                {/* User Dropdown (Simplified) */}
                <div className="bg-white border border-slate-200 rounded-xl p-2 max-h-32 overflow-y-auto">
                  {users.map(user => (
                    <div 
                      key={user.id} 
                      onClick={() => toggleAssignee(user.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer text-sm ${
                        formData.assignees.includes(user.id) ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                        {user.name.charAt(0)}
                      </div>
                      {user.name}
                      {formData.assignees.includes(user.id) && <CheckCircle size={14} className="ml-auto" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag(tag)} className="hover:text-rose-500"><X size={12} /></button>
                    </span>
                  ))}
                  {isTagInputOpen ? (
                    <input 
                      autoFocus
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      onBlur={() => setIsTagInputOpen(false)}
                      className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="Type..."
                    />
                  ) : (
                    <button 
                      onClick={() => setIsTagInputOpen(true)}
                      className="px-2 py-1 border border-dashed border-slate-300 text-slate-400 rounded-lg text-xs font-medium hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                    >
                      + Tag
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-white transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">
            Save Task
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskModal;