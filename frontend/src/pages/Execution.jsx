import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, CheckCircle2, Clock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Execution = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/30">
      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-gradient flex items-center justify-center">
              <LayoutDashboard size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold">TaskFlow <span className="text-brand-400">AI</span></span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400 hidden sm:block">
              Welcome back, <span className="text-white font-medium">{user?.username || 'User'}</span>
            </div>
            <button 
              onClick={logout}
              className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold mb-2">Daily Execution</h1>
          <p className="text-gray-400 text-lg">Your AI-recommended focus for today.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Stats */}
          <div className="space-y-6">
            <div className="bg-dark-card border border-dark-border p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Zap size={14} className="text-yellow-500" />
                Focus Meter
              </h3>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  className="h-full bg-primary-gradient"
                ></motion.div>
              </div>
              <p className="text-2xl font-bold">High Potential</p>
            </div>

            <div className="bg-dark-card border border-dark-border p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Clock size={14} className="text-blue-500" />
                Time Remaining
              </h3>
              <p className="text-3xl font-bold">06:42:00</p>
            </div>
          </div>

          {/* Center/Right: Task List */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { title: 'Refactor Auth Services', priority: 'High', time: '45m' },
              { title: 'Define TaskFlow Schema', priority: 'Medium', time: '30m' },
              { title: 'Design Execution View UI', priority: 'High', time: '1h' },
            ].map((task, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex items-center justify-between p-5 bg-dark-card border border-dark-border hover:border-brand-500/30 rounded-2xl transition-all"
              >
                <div className="flex items-center gap-4">
                  <button className="w-6 h-6 rounded-lg border-2 border-gray-700 hover:border-brand-500 transition-colors flex items-center justify-center cursor-pointer">
                    <CheckCircle2 size={14} className="text-white opacity-0 group-hover:opacity-20" />
                  </button>
                  <div>
                    <h4 className="font-semibold text-lg">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={10} />
                        {task.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-600 hover:text-white transition-colors cursor-pointer">
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Execution;
