import React, { useState } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Instagram, Linkedin, Facebook, Twitter } from 'lucide-react';

const PlatformIcon = ({ platform }) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return <Instagram size={14} className="text-pink-600" />;
    case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
    case 'facebook': return <Facebook size={14} className="text-blue-600" />;
    case 'twitter': return <Twitter size={14} className="text-sky-500" />;
    default: return null;
  }
};

const Calendar = ({ posts }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const getPostsForDay = (day) => {
    return posts.filter(post => isSameDay(new Date(post.date), day));
  };

  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-800">Content Calendar</h2>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <span className="text-slate-700 font-semibold w-32 text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden flex-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
            {day}
          </div>
        ))}
        
        {days.map((day, idx) => {
          const dayPosts = getPostsForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          
          return (
            <div 
              key={day.toString()} 
              className={`bg-white min-h-[100px] p-2 transition-colors hover:bg-slate-50
                ${!isCurrentMonth ? 'text-slate-300 bg-slate-50/50' : 'text-slate-700'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center' : ''}`}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="space-y-1">
                {dayPosts.map(post => (
                  <div 
                    key={post.id} 
                    className={`text-[10px] p-1.5 rounded-md border truncate flex items-center gap-1
                      ${post.status === 'scheduled' ? 'bg-indigo-50 border-indigo-100 text-indigo-700' : 
                        post.status === 'published' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                        'bg-amber-50 border-amber-100 text-amber-700'}
                    `}
                  >
                    <PlatformIcon platform={post.platform} />
                    {post.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
