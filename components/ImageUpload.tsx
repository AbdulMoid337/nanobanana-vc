'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  onClear: () => void;
  selectedImage: string | null;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, onClear, selectedImage }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onImageSelected(result, file.type);
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  if (selectedImage) {
    return (
      <div className="relative group w-full h-64 md:h-80 rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-900 shadow-lg transition-all hover:border-blue-500/50">
        <img 
          src={selectedImage} 
          alt="Source" 
          className="w-full h-full object-contain p-4" 
        />
        <div className="absolute top-2 right-2">
            <button 
                onClick={onClear}
                className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-colors shadow-lg"
                title="Remove image"
            >
                <X size={18} />
            </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium text-white">Original Source Image</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleBrowseClick}
      className={`
        w-full h-64 md:h-80 rounded-2xl border-2 border-dashed transition-all cursor-pointer
        flex flex-col items-center justify-center gap-4 p-6
        ${isDragging 
          ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' 
          : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
        }
      `}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleInputChange} 
        accept="image/*" 
        className="hidden" 
      />
      <div className={`p-4 rounded-full ${isDragging ? 'bg-blue-500/20' : 'bg-slate-700'}`}>
        <Upload size={32} className={isDragging ? 'text-blue-400' : 'text-slate-400'} />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-medium text-slate-200">
          {isDragging ? 'Drop image here' : 'Upload Source Image'}
        </p>
        <p className="text-sm text-slate-400">
          Drag & drop or click to browse
        </p>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
        <ImageIcon size={14} />
        <span>Supports JPG, PNG, WEBP</span>
      </div>
    </div>
  );
};

export default ImageUpload;