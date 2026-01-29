import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Filter, Search, MoreVertical, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';

const PlatformIcon = ({ platform }) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram size={16} className="text-pink-600" />;
    case 'linkedin': return <Linkedin size={16} className="text-blue-700" />;
    case 'facebook': return <Facebook size={16} className="text-blue-600" />;
    case 'twitter': return <Twitter size={16} className="text-sky-500" />;
    default: return null;
  }
};

const PostList = ({ posts }) => {
  const { addToast } = useToast();
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredPosts = posts.filter(post => {
    if (filterPlatform !== 'all' && post.platform.toLowerCase() !== filterPlatform) return false;
    if (filterStatus !== 'all' && post.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">Scheduled Posts</h2>
        <div className="flex gap-2">
          <button onClick={() => addToast('Search coming soon', 'info')} className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Search size={18} />
          </button>
          <button onClick={() => addToast('Filter panel coming soon', 'info')} className="p-2 text-slate-400 hover:text-primary transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Instagram', 'LinkedIn', 'Twitter', 'Facebook'].map(p => (
          <button
            key={p}
            onClick={() => setFilterPlatform(p.toLowerCase())}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors
              ${filterPlatform === p.toLowerCase() 
                ? 'bg-slate-800 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
            `}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            No posts found matching filters.
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className="group p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <PlatformIcon platform={post.platform} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-1">{post.title}</h3>
                    <p className="text-[10px] text-slate-500">{new Date(post.date).toLocaleDateString()} • {new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-medium capitalize
                  ${post.status === 'scheduled' ? 'bg-indigo-50 text-indigo-600' :
                    post.status === 'published' ? 'bg-emerald-50 text-emerald-600' :
                    'bg-amber-50 text-amber-600'}
                `}>
                  {post.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2 mb-2 pl-10">
                {post.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostList;
