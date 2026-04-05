import { motion } from 'framer-motion';
import { Inbox, RefreshCw } from 'lucide-react';

// Empty State — when user has no tasks today
export const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mb-6">
      <Inbox size={36} className="text-gray-600" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">You're clear.</h2>
    <p className="text-gray-500 max-w-sm text-base leading-relaxed">
      No tasks for today. Either you're ahead of the game…<br />
      <span className="text-gray-600 italic">or something's wrong.</span>
    </p>
  </motion.div>
);

// Error State — when API fails
export const ErrorState = ({ onRetry }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
      <span className="text-4xl">⚠️</span>
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">Failed to load today's plan</h2>
    <p className="text-gray-500 mb-6 max-w-sm">
      Something went sideways. Give it another shot.
    </p>
    <button
      onClick={onRetry}
      className="flex items-center gap-2 px-5 py-2.5 bg-dark-card border border-dark-border hover:border-brand-500/40 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
    >
      <RefreshCw size={15} />
      Retry
    </button>
  </motion.div>
);
