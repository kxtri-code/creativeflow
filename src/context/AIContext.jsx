import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeGemini } from '../lib/gemini';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  // Hardcoded key as fallback to ensure it works immediately
  const PROVIDED_KEY = 'AIzaSyDZM-aBy-SuR1E6_cj2IrqFhRLVdVUpy90';
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || PROVIDED_KEY;
  
  const [apiKey, setApiKey] = useState(envKey || localStorage.getItem('gemini_api_key') || '');
  const [isAuthorized, setIsAuthorized] = useState(!!(envKey || localStorage.getItem('gemini_api_key')));

  useEffect(() => {
    if (envKey) {
      setApiKey(envKey);
      initializeGemini(envKey);
      setIsAuthorized(true);
    } else if (apiKey) {
      initializeGemini(apiKey);
      localStorage.setItem('gemini_api_key', apiKey);
      setIsAuthorized(true);
    }
  }, [apiKey, envKey]);

  const authorize = async () => {
    try {
      if (window.aistudio && window.aistudio.openSelectKey) {
        const key = await window.aistudio.openSelectKey();
        if (key) {
          setApiKey(key);
          return true;
        }
      } else {
        console.warn('window.aistudio not available');
        return false;
      }
    } catch (error) {
      console.error('Authorization failed:', error);
      return false;
    }
    return false;
  };

  const manualAuthorize = (key) => {
    if (key) {
      setApiKey(key);
      return true;
    }
    return false;
  };

  const logout = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    setIsAuthorized(false);
  };

  return (
    <AIContext.Provider value={{ apiKey, isAuthorized, authorize, manualAuthorize, logout }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
