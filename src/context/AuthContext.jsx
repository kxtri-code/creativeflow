import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [orgName, setOrgName] = useState('CreativeFlow');
  const { addToast } = useToast();

  const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
  ];

  useEffect(() => {
    // Always load companies from localStorage to ensure persistence (works for both Demo and "Offline" modes)
    try {
      const storedCompanies = localStorage.getItem('demo_companies');
      const storedCurrentCompanyId = localStorage.getItem('demo_current_company_id');
      
      if (storedCompanies) {
        const parsedCompanies = JSON.parse(storedCompanies);
        setCompanies(parsedCompanies);
        
        if (storedCurrentCompanyId) {
          const current = parsedCompanies.find(c => c.id === storedCurrentCompanyId);
          setCurrentCompany(current || parsedCompanies[0]);
        } else if (parsedCompanies.length > 0) {
          setCurrentCompany(parsedCompanies[0]);
        }
      }
    } catch (e) {
      console.error("Error loading local company data", e);
    }

    if (isDemoMode) {
      // DEMO MODE: Load User/Profile from localStorage
      try {
        const storedUser = localStorage.getItem('demo_user');
        const storedProfile = localStorage.getItem('demo_profile');
        const storedOrgName = localStorage.getItem('demo_org_name');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
          if (storedProfile) setProfile(JSON.parse(storedProfile));
          if (storedOrgName) setOrgName(storedOrgName);
        }
      } catch (error) {
        console.error("Error loading demo data:", error);
        localStorage.clear(); // Clear corrupted data
      }
      setLoading(false);
      return;
    }

    // REAL MODE: Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
        // Even in real mode, we might want to check local storage for company context if not synced yet
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setCompanies([]);
        setCurrentCompany(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const createCompany = async (name, currencyCode, isGST = false, gstNumber = '', address = '') => {
    const newCompany = {
      id: crypto.randomUUID(),
      name,
      currency: currencyCode,
      isGST,
      gstNumber,
      address,
      createdAt: new Date().toISOString()
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    setCurrentCompany(newCompany);

    // Always save to localStorage for persistence
    localStorage.setItem('demo_companies', JSON.stringify(updatedCompanies));
    localStorage.setItem('demo_current_company_id', newCompany.id);

    return newCompany;
  };

  const switchCompany = (companyId) => {
    const company = companies.find(c => c.id === companyId);
    if (company) {
      setCurrentCompany(company);
      localStorage.setItem('demo_current_company_id', company.id);
      addToast(`Switched to ${company.name}`, 'success');
    }
  };

  const formatCurrency = (amount) => {
    if (!currentCompany) return amount;
    const currency = currencies.find(c => c.code === currentCompany.currency) || currencies[1];
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currentCompany.currency,
    }).format(amount);
  };


  const fetchProfile = async (userId) => {
    if (isDemoMode) return; // handled in login for demo

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile({
        role: 'admin',
        full_name: 'Demo Admin',
        department: 'ops'
      });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    if (isDemoMode) {
      // Simulate login
      const mockUser = { id: 'demo-user-123', email };
      // Determine role based on email for testing
      let role = 'user';
      let department = 'general';
      
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('hr')) role = 'hr';
      else if (email.includes('hod')) role = 'hod';

      const mockProfile = { 
        id: 'demo-user-123', 
        role, 
        full_name: email.split('@')[0], 
        department: 'ops' // default
      };

      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
      
      addToast(`Logged in as ${role.toUpperCase()} (Demo Mode)`, 'success');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    addToast('Logged in successfully', 'success');
  };

  const signup = async (email, password, metaData) => {
    if (isDemoMode) {
      const mockUser = { id: 'demo-user-' + Date.now(), email };
      const mockProfile = { 
        id: mockUser.id, 
        role: metaData.role || 'user', 
        full_name: metaData.full_name, 
        department: metaData.department 
      };

      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_profile', JSON.stringify(mockProfile));

      addToast('Account created! (Demo Mode)', 'success');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metaData, // { full_name, role, department }
        emailRedirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error('Signup error details:', error);
      throw error;
    }

    if (data?.user && !data.session) {
      addToast('Account created! Please check your email to confirm.', 'info');
      return;
    }

    addToast('Account created! Logging you in...', 'success');
  };

  const logout = async () => {
    if (isDemoMode) {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('demo_user');
      localStorage.removeItem('demo_profile');
      addToast('Logged out (Demo Mode)', 'info');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setProfile(null);
    setUser(null);
    addToast('Logged out', 'info');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      loading, 
      login, 
      logout, 
      signup,
      companies,
      currentCompany,
      createCompany,
      updateCompany,
      deleteCompany,
      switchCompany,
      formatCurrency,
      currencies,
      orgName,
      setOrgName
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
