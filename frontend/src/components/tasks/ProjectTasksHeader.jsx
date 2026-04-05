import { motion } from 'framer-motion';
import { ChevronLeft, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectTasksHeader = ({ projectName, taskCount, onCreateClick, isAdmin }) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Back Link */}
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors w-fit group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      {/* Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {projectName || 'Project Tasks'}
            </h1>
            <span className="px-2.5 py-0.5 bg-brand-500/10 text-brand-400 text-xs font-bold rounded-full border border-brand-500/20">
              {taskCount} {taskCount === 1 ? 'Task' : 'Tasks'}
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            Manage, assign, and track the progress of project deliverables.
          </p>
        </div>

        {isAdmin && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCreateClick}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-gradient text-white rounded-xl font-bold shadow-lg shadow-brand-600/20 transition-all"
          >
            <Plus size={20} />
            Create Task
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ProjectTasksHeader;
