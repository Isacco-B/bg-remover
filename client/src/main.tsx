import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { IconStack } from "@tabler/icons-react";
import { Toaster } from "@/components/ui/toaster";

import App from './App.tsx'
import './index.css'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="flex items-center justify-center min-h-[100vh] max-w-7xl mx-auto p-6 mt-14 md:mt-0">
      <nav className="bg-white bg-opacity-95 fixed w-full z-50 top-4 left-4">
        <div className="flex flex-row space-x-2 items-center">
          <IconStack size={48} color="#404040" />
          <h1 className="font-poppins font-bold text-2xl text-neutral-700">
            Remove
            <span className="font-poppins font-bold text-neutral-400 ml-2">
              Bg
            </span>
          </h1>
        </div>
      </nav>
      <App />
      <Toaster />
    </main>
  </StrictMode>
);
