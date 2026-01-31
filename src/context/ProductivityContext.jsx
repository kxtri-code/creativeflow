import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { format, differenceInSeconds } from 'date-fns';
import { useAuth } from './AuthContext';

const ProductivityContext = createContext(null);

export const ProductivityProvider = ({ children }) => {
  // Persistent State
  const [status, setStatus] = useState('offline'); // offline, active, break
  const [dailyGoalHours, setDailyGoalHours] = useState(8);
  const [startTime, setStartTime] = useState(null);
  const [breaks, setBreaks] = useState([]); // Array of {start, end}
  
  // Computed/Transient State
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const timerRef = useRef(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('productivity_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setStatus(parsed.status || 'offline');
        setDailyGoalHours(parsed.dailyGoalHours || 8);
        setStartTime(parsed.startTime || null);
        setBreaks(parsed.breaks || []);
        
        // Recalculate elapsed time based on saved timestamps
        if (parsed.status === 'active' && parsed.startTime) {
          const now = Date.now();
          const totalBreakTime = (parsed.breaks || []).reduce((acc, b) => {
            return acc + (b.end ? b.end - b.start : 0);
          }, 0);
          
          // Current elapsed = Now - Start - Total Breaks
          // This assumes "Clocked In" means wall-clock time is ticking even if tab is closed
          const currentElapsed = Math.floor((now - parsed.startTime - totalBreakTime) / 1000);
          setElapsedTime(Math.max(0, currentElapsed));
        } else if (parsed.status === 'break' && parsed.startTime) {
           // If on break, elapsed is time until break started
           const lastBreak = parsed.breaks[parsed.breaks.length - 1];
           if (lastBreak) {
             const totalPrevBreaks = (parsed.breaks.slice(0, -1) || []).reduce((acc, b) => acc + (b.end - b.start), 0);
             const currentElapsed = Math.floor((lastBreak.start - parsed.startTime - totalPrevBreaks) / 1000);
             setElapsedTime(Math.max(0, currentElapsed));
           }
        }
      } catch (e) {
        console.error("Failed to load productivity state", e);
      }
    }
  }, []);

  // Save state to localStorage whenever key props change
  useEffect(() => {
    const stateToSave = {
      status,
      dailyGoalHours,
      startTime,
      breaks
    };
    localStorage.setItem('productivity_state', JSON.stringify(stateToSave));
  }, [status, dailyGoalHours, startTime, breaks]);

  // Timer Tick
  useEffect(() => {
    if (status === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const clockIn = () => {
    const now = Date.now();
    setStatus('active');
    setStartTime(now);
    setBreaks([]);
    setElapsedTime(0);
  };

  const takeBreak = () => {
    if (status !== 'active') return;
    const now = Date.now();
    setStatus('break');
    // Add new break with start time, end time null
    setBreaks(prev => [...prev, { start: now, end: null }]);
  };

  const resumeFromBreak = () => {
    if (status !== 'break') return;
    const now = Date.now();
    setStatus('active');
    // Close the last break
    setBreaks(prev => {
      const newBreaks = [...prev];
      if (newBreaks.length > 0) {
        newBreaks[newBreaks.length - 1].end = now;
      }
      return newBreaks;
    });
  };

  const clockOut = () => {
    const now = Date.now();
    
    // Calculate final stats before resetting
    const totalDuration = startTime ? Math.floor((now - startTime) / 1000) : 0;
    // Calculate total break time
    let totalBreakTime = breaks.reduce((acc, b) => acc + ((b.end || now) - b.start), 0);
    
    // If currently on break, the last break is ongoing, so add that duration
    // (Already handled by (b.end || now) above if we assume break ends at clock out)
    
    const actualWorkTime = Math.max(0, Math.floor((totalDuration * 1000 - totalBreakTime) / 1000));

    const summary = {
      startTime,
      endTime: now,
      totalDuration: actualWorkTime, // seconds
      totalBreakTime: Math.floor(totalBreakTime / 1000), // seconds
      breaksTaken: breaks.length
    };

    setStatus('offline');
    setStartTime(null);
    setBreaks([]);
    setElapsedTime(0);
    localStorage.removeItem('productivity_state');
    
    return summary;
  };

  const progress = Math.min((elapsedTime / (dailyGoalHours * 3600)) * 100, 100);

  return (
    <ProductivityContext.Provider value={{
      status,
      dailyGoalHours,
      elapsedTime,
      progress,
      clockIn,
      takeBreak,
      resumeFromBreak,
      clockOut,
      setDailyGoalHours
    }}>
      {children}
    </ProductivityContext.Provider>
  );
};


export const useProductivity = () => useContext(ProductivityContext);
