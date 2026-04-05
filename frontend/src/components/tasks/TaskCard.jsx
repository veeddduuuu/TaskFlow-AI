import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Trash2, Clock, CheckCircle, Play } from 'lucide-react';

const formatDate = (dateString) => {
  if (!dateString) return 'No date';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(d);
  } catch (e) {
    return 'Invalid date';
  }
};

const priorityColors = {
  high: 'border-l-red-500',
  medium: 'border-l-amber-500',
  low: 'border-l-emerald-500',
};

const statusConfig = {
  todo: { icon: Clock, color: 'text-gray-400', bg: 'bg-gray-400/10' },
  'in-progress': { icon: Play, color: 'text-brand-400', bg: 'bg-brand-400/10' },
  done: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
};

const TaskCard = ({ task, onStatusUpdate, onDelete, isAdmin }) => {
  const navigate = useNavigate();
  const config = statusConfig[task?.status] || statusConfig.todo;
  const { icon: StatusIcon, color: statusColor, bg: statusBg } = config;

    const handleStatusChange = (e, newStatus) => {
        e.stopPropagation();
        onStatusUpdate(task._id, newStatus);
    };

    const handleCardClick = () => {
        navigate(`/tasks/${task._id}`);
    };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      onClick={handleCardClick}
      className={`bg-dark-card border border-dark-border border-l-4 ${priorityColors[task.priority] || 'border-l-gray-500'} rounded-2xl p-5 mb-4 group transition-all hover:bg-[#131d30] cursor-pointer`}
    >
      <div className="flex flex-col gap-4">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-bold text-white truncate ${task.status === 'done' ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider h-fit shrink-0 flex items-center gap-1.5 ${statusBg} ${statusColor}`}>
            <StatusIcon size={12} />
            {task.status.replace('-', ' ')}
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg border border-dark-border rounded-lg">
            <User size={14} className="text-gray-500" />
            <span>{task.assignedTo?.username || 'Unassigned'}</span>
          </div>
          {task.deadline && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg border border-dark-border rounded-lg">
              <Calendar size={14} className="text-gray-500" />
              <span>{formatDate(task.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-dark-bg border border-dark-border rounded-lg uppercase text-[10px] font-bold">
            <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            {task.priority}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-dark-border/50">
          <div className="flex items-center gap-2">
            {task.status === 'todo' && (
              <button
                onClick={(e) => handleStatusChange(e, 'in-progress')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-brand-600/10 hover:bg-brand-600/20 text-brand-400 rounded-lg text-xs font-bold transition-all"
              >
                Start
              </button>
            )}
            {task.status === 'in-progress' && (
              <button
                onClick={(e) => handleStatusChange(e, 'done')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-lg text-xs font-bold transition-all"
              >
                Complete
              </button>
            )}
            {task.status === 'done' && (
              <button
                onClick={(e) => handleStatusChange(e, 'todo')}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-gray-600/10 hover:bg-gray-600/20 text-gray-400 rounded-lg text-xs font-bold transition-all"
              >
                Reopen
              </button>
            )}
          </div>

          {isAdmin && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task._id);
              }}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
              title="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
