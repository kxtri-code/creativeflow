import React, { createContext, useContext, useState, useEffect } from 'react';
import { format, differenceInSeconds } from 'date-fns';

const ProductivityContext = createContext(null);

export const ProductivityProvider = ({ children }) => {
  const [status, setStatus] = useState('offline'); // offline, active, break
  const [dailyGoalHours, setDailyGoalHours] = useState(8);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // in seconds
  const [lastTick, setLastTick] = useState(null);

  useEffect(() => {
    let interval;
    if (status === 'active') {
      interval = setInterval(() => {
        const now = Date.now();
        if (lastTick) {
          const delta = differenceInSeconds(now, lastTick);
          setElapsedTime(prev => prev + delta);
        }
        setLastTick(now);
      }, 1000);
    } else {
      setLastTick(null);
    }
    return () => clearInterval(interval);
  }, [status, lastTick]);

  const clockIn = () => {
    setStatus('active');
    if (!startTime) setStartTime(Date.now());
    setLastTick(Date.now());
  };

  const takeBreak = () => {
    setStatus('break');
    setLastTick(null);
  };

  const clockOut = () => {
    setStatus('offline');
    setLastTick(null);
    // Could save session data here
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
      clockOut,
      setDailyGoalHours
    }}>
      {children}
    </ProductivityContext.Provider>
  );
};

export const useProductivity = () => useContext(ProductivityContext);
