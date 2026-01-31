import React, { useState } from 'react';
import { useProductivity } from '../../context/ProductivityContext';
import { useToast } from '../../context/ToastContext';
import { Play, Pause, Square, Coffee, Bell, Moon, Menu, CheckCircle, Clock, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Modal from '../shared/Modal';

const ProductivityBar = ({ onMenuClick }) => {
  const { status, progress, clockIn, takeBreak, resumeFromBreak, clockOut, elapsedTime } = useProductivity();
  const { addToast } = useToast();
  const [showSummary, setShowSummary] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeData, setWelcomeData] = useState(null);
  const [summaryData, setSummaryData] = useState(null);

  const handleClockIn = () => {
    clockIn();
    
    // Fetch a daily task to suggest
    try {
      const savedTasks = localStorage.getItem('project_tasks');
      let suggestedTask = "Review your dashboard";
      
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        // Find a high priority 'To Do' task
        const todoTask = tasks.find(t => t.status === 'To Do' && (t.priority === 'Urgent' || t.priority === 'High')) 
                      || tasks.find(t => t.status === 'To Do');
        
        if (todoTask) {
          suggestedTask = todoTask.title;
        }

        // Store initial done count for session tracking
        const doneCount = tasks.filter(t => t.status === 'Done').length;
        localStorage.setItem('session_start_done_count', doneCount.toString());
      } else {
        localStorage.setItem('session_start_done_count', '0');
      }
      
      setWelcomeData({ task: suggestedTask });
      setShowWelcome(true);
      // addToast(`Welcome! Today's focus: ${suggestedTask}`, 'success');
    } catch (e) {
      addToast('Productivity timer started!', 'success');
    }
  };

  const handleResume = () => {
    resumeFromBreak();
    addToast('Welcome back! Timer resumed.', 'success');
  };

  const handleBreak = () => {
    takeBreak();
    addToast('Enjoy your break!', 'info');
  };

  const handleClockOut = () => {
    const summary = clockOut();
    
    // Calculate tasks completed during session
    let tasksCompleted = 0;
    try {
      const savedTasks = localStorage.getItem('project_tasks');
      const startCount = parseInt(localStorage.getItem('session_start_done_count') || '0');
      
      if (savedTasks) {
        const tasks = JSON.parse(savedTasks);
        const currentDoneCount = tasks.filter(t => t.status === 'Done').length;
        tasksCompleted = Math.max(0, currentDoneCount - startCount);
      }
    } catch (e) {
      console.error("Error calculating tasks completed", e);
    }

    setSummaryData({ ...summary, tasksCompleted });
    setShowSummary(true);
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

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <>
      <div className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 transition-colors duration-300">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Mobile Menu Button */}
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-3 -ml-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Menu size={24} />
          </button>

          <h2 className="hidden lg:block text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Productivity</h2>
          
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
                <button onClick={handleClockOut} className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors">
                  <Square size={16} /> Out
                </button>
              </>
            )}

            {status === 'break' && (
              <button onClick={handleResume} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors">
                <Play size={16} /> Resume
              </button>
            )}
          </div>

          <div className="hidden lg:block font-mono text-xl font-bold text-slate-700 dark:text-slate-200 w-24">
            {formatTime(elapsedTime)}
          </div>
        </div>

        {/* Goal Tracking */}
        <div className="hidden md:block flex-1 max-w-xl mx-8">
          <div className="flex justify-between text-xs mb-1 font-medium text-slate-500 dark:text-slate-400">
            <span>Daily Goal</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
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
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" 
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

      <Modal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        title="Welcome to Work!"
        size="md"
      >
        <div className="text-center p-6 bg-indigo-50/50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 text-indigo-600 mb-6 shadow-sm">
            <Clock size={40} />
          </div>
          <h3 className="text-3xl font-bold text-slate-800 mb-2">Let's Get Started</h3>
          <p className="text-slate-500 mb-8 text-lg">Your productivity timer is now running.</p>
          
          <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm text-left">
            <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">Today's Priority</div>
            <div className="flex items-start gap-3">
              <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={24} />
              <div>
                <h4 className="text-xl font-bold text-slate-800">{welcomeData?.task}</h4>
                <p className="text-slate-500 text-sm mt-1">Focus on this task to start your day strong.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={() => setShowWelcome(false)}
            className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Let's Go!
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showSummary}
        onClose={() => setShowSummary(false)}
        title="Daily Productivity Summary"
        size="md"
      >
        {summaryData && (
          <div className="space-y-6">
            <div className="text-center p-6 bg-slate-50 rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Great Job!</h3>
              <p className="text-slate-500">You've completed your session for today.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <Clock size={18} />
                  <span className="font-semibold text-sm">Total Work Time</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatDuration(summaryData.totalDuration)}</p>
              </div>
              
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <Coffee size={18} />
                  <span className="font-semibold text-sm">Break Time</span>
                </div>
                <p className="text-2xl font-bold text-slate-800">{formatDuration(summaryData.totalBreakTime)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                <BarChart2 size={18} /> Performance Metrics
              </h4>
              
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                <span className="text-slate-600">Attendance Status</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">PRESENT</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                <span className="text-slate-600">Productivity Score</span>
                <span className="font-bold text-slate-800">
                  {Math.min(100, Math.round((summaryData.totalDuration / (8 * 3600)) * 100))}%
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                <span className="text-slate-600">Tasks Completed</span>
                <span className="font-bold text-slate-800">{summaryData.tasksCompleted}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                <span className="text-slate-600">Breaks Taken</span>
                <span className="font-bold text-slate-800">{summaryData.breaksTaken}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};


export default ProductivityBar;
