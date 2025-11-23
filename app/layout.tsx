import React from 'react';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Wand2 } from 'lucide-react';

export const metadata = {
  title: 'ProductVision AI',
  description: 'Generate marketing assets and product mockups instantly using Gemini 2.5 Flash Image.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
           {/* Using CDN for Tailwind to match existing setup, in a real Next.js app use globals.css */}
           <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className="bg-[#0f172a] text-slate-200 antialiased selection:bg-blue-500/30 font-sans">
           <header className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
                  <Wand2 className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    ProductVision AI
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5 Flash Image</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:block">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20">
                    Nano Banana Model
                  </span>
                </div>
                <div className="border-l border-slate-700 pl-4 ml-2">
                    <SignedOut>
                        <SignInButton mode="modal">
                            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                                Sign In
                            </button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton 
                            appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-slate-700"
                                }
                            }}
                        />
                    </SignedIn>
                </div>
              </div>
            </div>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}