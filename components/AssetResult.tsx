'use client';

import React from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { GeneratedAsset } from '../types';

interface AssetResultProps {
  asset: GeneratedAsset;
}

const AssetResult: React.FC<AssetResultProps> = ({ asset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = asset.imageUrl;
    link.download = `product-vision-${asset.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="group relative w-full aspect-square rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-xl hover:shadow-2xl transition-all hover:scale-[1.01]">
      <img 
        src={asset.imageUrl} 
        alt={asset.prompt} 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 backdrop-blur-[2px]">
        <div className="flex justify-between items-start">
            <span className="inline-block px-2 py-1 bg-blue-600/90 rounded text-xs font-semibold text-white">
                Generated
            </span>
            <div className="flex gap-2">
                <button 
                    onClick={handleDownload}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                    title="Download"
                >
                    <Download size={18} />
                </button>
            </div>
        </div>
        
        <div className="space-y-2">
            <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
                "{asset.prompt}"
            </p>
        </div>
      </div>
    </div>
  );
};

export default AssetResult;