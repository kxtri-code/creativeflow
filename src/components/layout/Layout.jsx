import React from 'react';
import Sidebar from './Sidebar';
import ProductivityBar from './ProductivityBar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 ml-20 lg:ml-64 flex flex-col min-w-0">
        <ProductivityBar />
        <main className="flex-1 p-6 lg:p-10 overflow-x-hidden animate-in fade-in zoom-in-95 duration-500">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
