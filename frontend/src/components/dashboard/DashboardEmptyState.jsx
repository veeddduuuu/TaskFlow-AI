import { motion } from 'framer-motion';
import { FolderPlus, Inbox } from 'lucide-react';

const DashboardEmptyState = ({ onCreateClick }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    className="flex flex-col items-center justify-center py-24 text-center col-span-full"
  >
    <div className="w-20 h-20 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mb-6">
      <Inbox size={36} className="text-gray-600" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">No projects yet.</h2>
    <p className="text-gray-500 mb-6 max-w-sm text-base leading-relaxed">
      Let's fix that. Create your first project and start shipping.
    </p>
    <button
      onClick={onCreateClick}
      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-primary-gradient shadow-lg shadow-brand-500/10 cursor-pointer"
    >
      <FolderPlus size={16} />
      Create Project
    </button>
  </motion.div>
);

export default DashboardEmptyState;
