import { motion } from 'framer-motion';
import { Check, Trash2, Square } from 'lucide-react';

const SubtaskItem = ({ subtask, onToggle, onDelete, canEdit }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="group flex items-center gap-3 p-3 bg-dark-card/50 border border-dark-border/40 rounded-xl hover:bg-dark-card transition-all mb-2"
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(subtask._id)}
        disabled={!canEdit}
        className={`w-6 h-6 rounded-md flex items-center justify-center border-2 transition-all shrink-0
          ${subtask.isCompleted 
            ? 'bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/20' 
            : 'border-dark-border bg-dark-bg hover:border-brand-500/50'}`}
      >
        {subtask.isCompleted && <Check size={14} strokeWidth={3} />}
      </button>

      {/* Title */}
      <span className={`flex-1 text-sm transition-all truncate
        ${subtask.isCompleted ? 'text-gray-500 line-through opacity-50' : 'text-gray-300'}`}>
        {subtask.title}
      </span>

      {/* Delete button (only for admins/creators) */}
      {canEdit && (
        <button
          onClick={() => onDelete(subtask._id)}
          className="p-1 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded"
        >
          <Trash2 size={14} />
        </button>
      )}
    </motion.div>
  );
};

export default SubtaskItem;
