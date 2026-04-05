import { motion } from 'framer-motion';
import { ClipboardList, Plus } from 'lucide-react';

const EmptyState = ({ onCreateClick, isAdmin }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center bg-dark-card/30 border border-dashed border-dark-border rounded-2xl"
    >
      <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
        <ClipboardList className="text-brand-400" size={32} />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No tasks yet.</h3>
      <p className="text-gray-500 max-w-sm mb-6 leading-relaxed">
        This project is empty. Start by creating your first task and assigning it to a team member.
      </p>
      {isAdmin && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-500/20"
        >
          <Plus size={18} />
          Create Task
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
