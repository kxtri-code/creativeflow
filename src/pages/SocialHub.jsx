import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import Calendar from '../components/social/Calendar';
import PostList from '../components/social/PostList';
import AICaptionist from '../components/social/AICaptionist';
import NewPostModal from '../components/social/NewPostModal';

const mockPosts = [
  { id: 1, title: 'Summer Launch Teaser', date: new Date().toISOString(), platform: 'Instagram', status: 'scheduled', content: 'Get ready for the heat! ☀️ #SummerVibes' },
  { id: 2, title: 'Q3 Financial Results', date: new Date(Date.now() + 86400000 * 2).toISOString(), platform: 'LinkedIn', status: 'draft', content: 'Proud to announce our Q3 growth...' },
  { id: 3, title: 'Flash Sale Alert', date: new Date(Date.now() - 86400000).toISOString(), platform: 'Twitter', status: 'published', content: '24 hours only! 50% off everything.' },
  { id: 4, title: 'Team Building Day', date: new Date(Date.now() + 86400000 * 5).toISOString(), platform: 'Instagram', status: 'scheduled', content: 'Best team ever! 🎳' },
  { id: 5, title: 'Industry Insights', date: new Date(Date.now() + 86400000 * 3).toISOString(), platform: 'LinkedIn', status: 'scheduled', content: '5 trends watching in 2026...' },
];

const SocialHub = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToast } = useToast();

  const handleSchedulePost = (newPost) => {
    // Combine date and time
    const dateTime = new Date(`${newPost.date}T${newPost.time}`);
    
    // Create a post entry for each selected platform
    const newPosts = newPost.platforms.map((platform, index) => ({
      id: newPost.id + index,
      title: newPost.project, // Using project as title for now
      date: dateTime.toISOString(),
      platform: platform.charAt(0).toUpperCase() + platform.slice(1),
      status: 'scheduled',
      content: newPost.content
    }));

    setPosts(prev => [...prev, ...newPosts]);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Social Media Hub</h1>
          <p className="text-slate-500">Manage content, schedule posts, and generate copy.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
          + New Post
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Calendar Column */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
          <Calendar posts={posts} />
        </div>

        {/* Sidebar Column */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pb-4">
          <div className="flex-1 min-h-[300px]">
            <PostList posts={posts} />
          </div>
          <div className="flex-shrink-0">
            <AICaptionist />
          </div>
        </div>
      </div>

      <NewPostModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSchedule={handleSchedulePost}
      />
    </div>
  );
};

export default SocialHub;
