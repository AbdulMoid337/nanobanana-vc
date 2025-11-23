'use client';

import React, { useState, useRef } from 'react';
import { Sparkles, Loader2, AlertCircle, Plus } from 'lucide-react';
import { useAuth } from '@clerk/nextjs';
import ImageUpload from '../components/ImageUpload';
import ScenarioSelector from '../components/ScenarioSelector';
import AssetResult from '../components/AssetResult';
import { generateMarketingAssetAction } from './actions';
import { GenerationStatus, GeneratedAsset, Scenario } from '../types';

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceMimeType, setSourceMimeType] = useState<string>('image/png');
  const [customPrompt, setCustomPrompt] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAsset[]>([]);
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleImageSelected = (base64: string, mimeType: string) => {
    setSourceImage(base64);
    setSourceMimeType(mimeType);
    setError(null);
  };

  const handleClearImage = () => {
    setSourceImage(null);
    setCustomPrompt('');
    setError(null);
  };

  const handleGenerate = async (prompt: string) => {
    if (!sourceImage) return;
    
    if (!userId) {
        setError("You must be signed in to generate assets.");
        return;
    }

    setStatus(GenerationStatus.LOADING);
    setError(null);

    try {
      // Call Server Action
      const resultBase64 = await generateMarketingAssetAction(sourceImage, sourceMimeType, prompt);
      
      const newAsset: GeneratedAsset = {
        id: crypto.randomUUID(),
        imageUrl: `data:image/png;base64,${resultBase64}`,
        prompt: prompt,
        timestamp: Date.now(),
      };

      setGeneratedAssets(prev => [newAsset, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
      
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setStatus(GenerationStatus.ERROR);
      setError(err.message || 'Something went wrong during generation.');
    }
  };

  const handleScenarioSelect = (scenario: Scenario) => {
    handleGenerate(scenario.promptTemplate);
  };

  const handleCustomGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    handleGenerate(customPrompt);
  };

  if (!isLoaded) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a]">
            <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 space-y-12">
      
      {/* Intro Section */}
      <section className="text-center max-w-2xl mx-auto space-y-4 mb-12">
          <h2 className="text-4xl font-bold text-white tracking-tight">
              Turn Products into <br/>
              <span className="text-blue-500">Marketing Masterpieces</span>
          </h2>
          <p className="text-slate-400 text-lg">
              Upload your product image and instantly visualize it in real-world scenarios using generative AI. 
              Consistency powered by Gemini.
          </p>
          {!userId && (
            <div className="mt-4 inline-block px-4 py-2 bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-300 text-sm">
                Sign in above to start generating images
            </div>
          )}
      </section>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">1. Upload Source</h3>
            </div>
            <ImageUpload 
              selectedImage={sourceImage}
              onImageSelected={handleImageSelected}
              onClear={handleClearImage}
            />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">2. Choose Scenario</h3>
            </div>
            
            <ScenarioSelector 
              onSelect={handleScenarioSelect} 
              disabled={!sourceImage || status === GenerationStatus.LOADING || !userId}
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f172a] px-2 text-slate-500">Or Custom Prompt</span>
              </div>
            </div>

            <form onSubmit={handleCustomGenerate} className="space-y-3">
              <div className="relative">
                  <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="E.g., Add a retro filter, or place this on a futuristic desk..."
                      disabled={!sourceImage || status === GenerationStatus.LOADING || !userId}
                      className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                  />
                  <div className="absolute bottom-3 right-3">
                      <button
                          type="submit"
                          disabled={!sourceImage || !customPrompt.trim() || status === GenerationStatus.LOADING || !userId}
                          className={`
                              p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium
                              ${!sourceImage || !customPrompt.trim() || status === GenerationStatus.LOADING || !userId
                                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20'
                              }
                          `}
                      >
                          {status === GenerationStatus.LOADING ? (
                              <Loader2 size={16} className="animate-spin" />
                          ) : (
                              <Sparkles size={16} />
                          )}
                          Generate
                      </button>
                  </div>
              </div>
              {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
                      <AlertCircle size={16} />
                      {error}
                  </div>
              )}
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: Results */}
        <div className="lg:col-span-7 space-y-6" ref={resultsRef}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
               <h3 className="text-lg font-semibold text-white">Generated Assets</h3>
               <span className="text-sm text-slate-500">{generatedAssets.length} Results</span>
          </div>

          {generatedAssets.length === 0 ? (
              <div className="h-[500px] border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 bg-slate-900/30">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-500">
                      <Plus size={24} />
                  </div>
                  <p className="text-lg font-medium">No assets generated yet</p>
                  <p className="text-sm max-w-xs text-center mt-2 text-slate-500">
                      Select a scenario or enter a custom prompt to visualize your product.
                  </p>
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {status === GenerationStatus.LOADING && (
                       <div className="aspect-square rounded-xl bg-slate-800/50 animate-pulse border border-slate-700 flex flex-col items-center justify-center">
                          <Loader2 size={40} className="text-blue-500 animate-spin mb-4" />
                          <p className="text-slate-400 text-sm font-medium">Thinking...</p>
                       </div>
                  )}
                  {generatedAssets.map((asset) => (
                      <AssetResult key={asset.id} asset={asset} />
                  ))}
              </div>
          )}
        </div>
      </div>
    </main>
  );
}