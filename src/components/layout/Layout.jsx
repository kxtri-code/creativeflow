import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ProductivityBar from './ProductivityBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex-1 w-full lg:w-auto lg:ml-64 flex flex-col min-w-0 transition-all duration-300">
        <ProductivityBar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 lg:p-10 overflow-x-hidden animate-in fade-in zoom-in-95 duration-500 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
