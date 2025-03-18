'use client';

import { motion } from 'framer-motion';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Main Content */}
      <div className="w-full">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Wealth Visualizer</h1>
          <div className="flex items-center gap-4">
            <motion.button 
              className="p-2 rounded-full hover:bg-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </motion.button>
            <motion.div 
              className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              U
            </motion.div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 