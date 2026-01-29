import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import AssetGallery from '../components/design/AssetGallery';
import BrandGuardian from '../components/design/BrandGuardian';
import UploadAssetModal from '../components/design/UploadAssetModal';

const DesignHub = () => {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScanMode, setIsScanMode] = useState(false);

  const handleOpenUpload = (scan = false) => {
    setIsScanMode(scan);
    setIsModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Graphic Design Studio</h1>
          <p className="text-slate-500">Centralized asset management and brand compliance.</p>
        </div>
        <button 
          onClick={() => handleOpenUpload(false)}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all"
        >
          Upload Assets
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        {/* Gallery - Main Area */}
        <div className="col-span-12 lg:col-span-8 h-full min-h-[500px]">
          <AssetGallery />
        </div>

        {/* Brand Guardian - Sidebar */}
        <div className="col-span-12 lg:col-span-4 h-full min-h-[500px]">
          <BrandGuardian onUpload={() => handleOpenUpload(true)} />
        </div>
      </div>

      <UploadAssetModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        isScan={isScanMode}
      />
    </div>
  );
};

export default DesignHub;
