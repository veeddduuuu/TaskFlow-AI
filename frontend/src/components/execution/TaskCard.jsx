import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Play, CheckCheck, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

// Priority config — maps priority string to visual accent
const PRIORITY = {
  high: {
    label: 'High',
    borderColor: 'border-l-red-500',
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-400',
    dot: 'bg-red-500',
  },
  medium: {
    label: 'Medium',
    borderColor: 'border-l-yellow-500',
    badgeBg: 'bg-yellow-500/10',
    badgeText: 'text-yellow-400',
    dot: 'bg-yellow-500',
  },
  low: {
    label: 'Low',
    borderColor: 'border-l-green-500',
    badgeBg: 'bg-green-500/10',
    badgeText: 'text-green-400',
    dot: 'bg-green-500',
  },
};

const STATUS_LABELS = {
  todo: 'To Do',
  'in-progress': 'In Progress',
  done: 'Done',
};

const formatDeadline = (dateStr) => {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  const today = new Date();
  const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

  const formatted = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (diffDays < 0) return { text: `Overdue · ${formatted}`, overdue: true };
  if (diffDays === 0) return { text: 'Due Today', overdue: true };
  if (diffDays === 1) return { text: 'Due Tomorrow', overdue: false };
  return { text: `Due ${formatted}`, overdue: false };
};

const TaskCard = ({ task, onStatusUpdate }) => {
  const [loading, setLoading] = useState(null); // 'in-progress' | 'done' | null
  const navigate = useNavigate();

  const priority = PRIORITY[task.priority] || PRIORITY.medium;
  const deadline = formatDeadline(task.deadline);
  const isDone = task.status === 'done';

  const handleStatusUpdate = async (e, newStatus) => {
    e.stopPropagation(); // Don't navigate when clicking action btn
    if (task.status === newStatus || loading) return;

    setLoading(newStatus);
    // Optimistic update
    onStatusUpdate(task._id, newStatus);

    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      onStatusUpdate(task._id, task.status);
      console.error('Status update failed:', err);
    } finally {
      setLoading(null);
    }
  };

  const handleCardClick = () => {
    navigate(`/tasks/${task._id}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      onClick={handleCardClick}
      className={`
        group relative bg-dark-card border border-dark-border border-l-4 ${priority.borderColor}
        rounded-2xl p-5 cursor-pointer
        hover:border-dark-border hover:bg-[#131d30] hover:shadow-lg hover:shadow-brand-500/5
        transition-all duration-200
        ${isDone ? 'opacity-55' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className={`text-lg font-semibold text-white leading-snug mb-1 ${isDone ? 'line-through' : ''}`}>
            {task.title}
          </h3>

          {/* Project name */}
          <p className="text-sm text-gray-500 mb-3 truncate">
            {task.projectName || 'Unknown Project'}
          </p>

          {/* Badges row */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Priority */}
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${priority.badgeBg} ${priority.badgeText}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
              {priority.label}
            </span>

            {/* Deadline */}
            {deadline && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                deadline.overdue
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                <Calendar size={11} />
                {deadline.text}
              </span>
            )}

            {/* Status */}
            <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800 text-gray-400">
              {STATUS_LABELS[task.status] || task.status}
            </span>
          </div>
        </div>

        {/* Right: Action buttons */}
        {!isDone && (
          <div className="flex items-center gap-2 shrink-0">
            {task.status === 'todo' && (
              <button
                onClick={(e) => handleStatusUpdate(e, 'in-progress')}
                disabled={!!loading}
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
                  bg-brand-600/20 text-brand-300 border border-brand-500/30
                  hover:bg-brand-600 hover:text-white hover:border-brand-600
                  transition-all duration-200 disabled:opacity-50 cursor-pointer"
              >
                {loading === 'in-progress' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Play size={14} />
                )}
                Start
              </button>
            )}

            <button
              onClick={(e) => handleStatusUpdate(e, 'done')}
              disabled={!!loading}
              className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl
                bg-green-500/10 text-green-400 border border-green-500/20
                hover:bg-green-500 hover:text-white hover:border-green-500
                transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading === 'done' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CheckCheck size={14} />
              )}
              Done
            </button>
          </div>
        )}

        {/* Done checkmark */}
        {isDone && (
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
            <CheckCheck size={16} className="text-green-400" />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
