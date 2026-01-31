import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import AddCompanyModal from './AddCompanyModal';
import ApiKeyModal from '../common/ApiKeyModal';
import { 
  LayoutDashboard, 
  Share2, 
  Clapperboard, 
  Palette, 
  Code, 
  PenTool, 
  Users, 
  Briefcase,
  Banknote,
  FileText,
  FileSignature,
  LogOut,
  ChevronDown,
  Plus,
  Building,
  Check,
  X,
  CheckSquare,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'hod', 'hr', 'user'] },
  { to: '/social', icon: Share2, label: 'Social Media', roles: ['admin', 'hod', 'user'] },
  { to: '/media', icon: Clapperboard, label: 'Media & Prod', roles: ['admin', 'hod', 'user'] },
  { to: '/design', icon: Palette, label: 'Design Studio', roles: ['admin', 'hod', 'user'] },
  { to: '/tech', icon: Code, label: 'Tech Team', roles: ['admin', 'hod', 'user'] },
  { to: '/content', icon: PenTool, label: 'Content', roles: ['admin', 'hod', 'user'] },
  { to: '/hr', icon: Users, label: 'People & HR', roles: ['admin', 'hr', 'user'] },
  { to: '/finance', icon: Banknote, label: 'Finance', roles: ['admin', 'user'] },
  { to: '/invoices', icon: FileText, label: 'Invoices', roles: ['admin', 'hod', 'user'] },
  { to: '/proposals', icon: FileSignature, label: 'Proposals', roles: ['admin', 'hod', 'user'] },
  { to: '/ops', icon: Briefcase, label: 'Operations', roles: ['admin', 'user'] },
  { to: '/projects', icon: CheckSquare, label: 'Projects', roles: ['admin', 'hod', 'user'] },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, profile, companies, currentCompany, switchCompany, orgName } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/landing');
  };

  // Helper to check if user has access to a nav item
  const hasAccess = (allowedRoles) => {
    if (!profile?.role) return true;
    if (profile.role === 'admin') return true;
    return allowedRoles.includes(profile.role);
  };

  // Filter items based on RBAC
  const filteredNavItems = navItems.filter(item => hasAccess(item.roles));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed left-0 top-0 h-screen bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 z-50 flex flex-col transition-transform duration-300
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        
        {/* Company Switcher Header */}
        <div className="relative h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 select-none">
          <div 
            onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
            className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 -ml-2 rounded-xl transition-colors flex-1 min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 flex-shrink-0">
              {currentCompany ? currentCompany.name.substring(0, 2).toUpperCase() : 'CF'}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                {currentCompany ? currentCompany.name : 'CreativeFlow'}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {currentCompany ? orgName : 'Select Company'}
              </div>
            </div>

            <ChevronDown size={16} className={`text-slate-400 transition-transform ${isCompanyMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Mobile Close Button */}
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {isCompanyMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-4 right-4 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 w-56"
              >
                <div className="text-xs font-semibold text-slate-400 px-2 py-1 mb-1">SWITCH COMPANY</div>
                
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {companies.map(company => (
                    <button
                      key={company.id}
                      onClick={() => {
                        switchCompany(company.id);
                        setIsCompanyMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-sm transition-colors ${
                        currentCompany?.id === company.id 
                          ? 'bg-primary/5 text-primary font-medium' 
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Building size={14} />
                        <span className="truncate">{company.name}</span>
                      </div>
                      {currentCompany?.id === company.id && <Check size={14} />}
                    </button>
                  ))}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                <button
                  onClick={() => {
                    setIsAddCompanyModalOpen(true);
                    setIsCompanyMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg transition-colors"
                >
                  <Plus size={14} />
                  <span>Create New Company</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                // Close on mobile when clicked
                if (window.innerWidth < 1024) onClose();
              }}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-4 lg:py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary font-semibold shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'}
              `}
            >
              <item.icon className="w-6 h-6 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="font-medium text-base lg:text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 mb-2 ${
              theme === 'dark' ? 'bg-slate-800 text-yellow-400' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            <span className="whitespace-nowrap font-medium">
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </span>
          </button>

          <button 
            onClick={() => setIsApiKeyModalOpen(true)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors mb-2 group"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key"><path d="m21 2-2 2m-7.6 7.6a6 6 0 1 1-2.4-1.8l.8-.8m8.4-6.2a2 2 0 1 1-2.8 2.8c-.7.7-1.5 1.5-2.1 2.2l-1.4 1.4"/></svg>
            </div>
            <span className="font-medium">AI Settings</span>
          </button>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors mb-4 group"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Log Out</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              <img src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=random`} alt="User" />
            </div>
            <div>
              <div className="font-medium text-sm text-slate-900 dark:text-slate-100">{profile?.full_name || 'User'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{profile?.role || 'Guest'}</div>
            </div>
          </div>
        </div>
      </aside>

      <AddCompanyModal 
        isOpen={isAddCompanyModalOpen} 
        onClose={() => setIsAddCompanyModalOpen(false)} 
      />
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen} 
        onClose={() => setIsApiKeyModalOpen(false)} 
      />
    </>
  );
};

export default Sidebar;
