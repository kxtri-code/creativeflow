import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeOpenAI } from '../lib/openai';

const AIContext = createContext(null);

export const AIProvider = ({ children }) => {
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  const [apiKey, setApiKey] = useState(envKey || localStorage.getItem('openai_api_key') || '');
  const [isAuthorized, setIsAuthorized] = useState(!!(envKey || localStorage.getItem('openai_api_key')));

  useEffect(() => {
    if (envKey) {
      setApiKey(envKey);
      initializeOpenAI(envKey);
      setIsAuthorized(true);
    } else if (apiKey) {
      initializeOpenAI(apiKey);
      localStorage.setItem('openai_api_key', apiKey);
      setIsAuthorized(true);
    }
  }, [apiKey, envKey]);

  // Removed Gemini-specific window.aistudio auth method

  const manualAuthorize = (key) => {
    if (key && key.startsWith('sk-')) {
      setApiKey(key);
      return true;
    }
    return false;
  };

  const logout = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    setIsAuthorized(false);
  };

  return (
    <AIContext.Provider value={{ apiKey, isAuthorized, manualAuthorize, logout }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => useContext(AIContext);
