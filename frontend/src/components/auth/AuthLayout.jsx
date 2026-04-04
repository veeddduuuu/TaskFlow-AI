import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckCircle2 } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex text-white bg-dark-bg font-sans">
      {/* Left Branding Panel (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-dark-card border-r border-dark-border flex-col p-12 justify-center items-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 text-center max-w-md"
        >
          {/* Logo Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-gradient flex items-center justify-center shadow-lg shadow-brand-500/20">
              <LayoutDashboard size={28} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">TaskFlow <span className="text-brand-400">AI</span></h1>
          </div>

          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Stop planning.<br />
            <span className="text-gradient">Start executing.</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-10">
            We tell you what to work on every day. Our daily execution engine ensures you stay focused on what really matters.
          </p>

          {/* Simple Mock Card */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ delay: 0.3, duration: 0.5 }}
             className="bg-dark-bg/50 backdrop-blur-xl border border-dark-border p-6 rounded-2xl shadow-2xl text-left border-brand-500/20"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-brand-500"></div>
              <div className="w-20 h-2 bg-gray-700 rounded-full"></div>
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <CheckCircle2 size={18} className="text-brand-400" />
                  <div className={`h-2 bg-gray-600 rounded-full ${i === 1 ? 'w-full' : 'w-2/3'}`}></div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle Background Glow for Right Side */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md z-10"
        >
          <div className="mb-10 text-center lg:text-left">
            {/* Mobile Logo Only */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
                <LayoutDashboard size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">TaskFlow AI</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-400">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
