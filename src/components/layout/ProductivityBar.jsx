import React from 'react';
import { useProductivity } from '../../context/ProductivityContext';
import { useToast } from '../../context/ToastContext';
import { Play, Pause, Square, Coffee, Bell, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductivityBar = () => {
  const { status, progress, clockIn, takeBreak, clockOut, elapsedTime } = useProductivity();
  const { addToast } = useToast();

  const handleClockIn = () => {
    clockIn();
    addToast('Productivity timer started!', 'success');
  };

  const handleBreak = () => {
    takeBreak();
    addToast('Enjoy your break!', 'info');
  };

  const handleClockOut = () => {
    clockOut();
    addToast('Clocked out. Great work today!', 'success');
  };

  const toggleFocus = () => {
    addToast('Focus Mode enabled: Notifications muted.', 'info');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu size={24} />
        </button>

        <h2 className="hidden lg:block text-sm font-semibold text-slate-500 uppercase tracking-wider">Productivity</h2>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          {status === 'offline' && (
            <button onClick={handleClockIn} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
              <Play size={16} /> Clock In
            </button>
          )}
          
          {status === 'active' && (
            <>
              <button onClick={handleBreak} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                <Coffee size={16} /> Break
              </button>
              <button onClick={handleClockOut} className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300 transition-colors">
                <Square size={16} /> Out
              </button>
            </>
          )}

          {status === 'break' && (
            <button onClick={handleClockIn} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
              <Play size={16} /> Resume
            </button>
          )}
        </div>

        <div className="hidden lg:block font-mono text-xl font-bold text-slate-700 w-24">
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* Goal Tracking */}
      <div className="hidden md:block flex-1 max-w-xl mx-8">
        <div className="flex justify-between text-xs mb-1 font-medium text-slate-500">
          <span>Daily Goal</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={toggleFocus}
          className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" 
          title="Focus Mode"
        >
          <Moon size={20} />
        </button>
        <button 
          onClick={() => addToast('No new notifications', 'info')}
          className="p-2 text-slate-400 hover:text-slate-600 relative"
        >
          <Bell size={20} />
          {/* Smart Alert Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
        </button>
      </div>
    </div>
  );
};

export default ProductivityBar;
