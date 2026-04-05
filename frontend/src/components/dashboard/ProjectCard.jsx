import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ListChecks, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ProjectCard = ({ project, taskStats, isAdmin, onDelete, onEdit }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const handleCardClick = () => {
    navigate(`/projects/${project._id}/tasks`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onDelete(project._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onEdit(project);
  };

  const memberCount = project.members?.length || 0;
  const totalTasks = taskStats?.total ?? '—';
  const doneTasks = taskStats?.done ?? '—';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      onClick={handleCardClick}
      className="group relative bg-dark-card border border-dark-border border-l-4 border-l-brand-500 rounded-2xl p-5 cursor-pointer
        hover:bg-[#131d30] hover:shadow-lg hover:shadow-brand-500/5 hover:border-dark-border
        transition-all duration-200"
    >
      {/* Top row — Name + Kebab */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-lg font-semibold text-white truncate leading-snug">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}
        </div>

        {/* Admin kebab menu */}
        {isAdmin && (
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1.5 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-dark-border/50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            >
              <MoreVertical size={16} />
            </button>

            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-full mt-1 w-36 bg-dark-bg border border-dark-border rounded-xl shadow-xl shadow-black/30 py-1 z-20"
              >
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-dark-card transition-colors cursor-pointer"
                >
                  <Pencil size={13} />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Bottom row — Stats */}
      <div className="flex items-center gap-3 mt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-300">
          <Users size={12} />
          {memberCount} member{memberCount !== 1 ? 's' : ''}
        </span>

        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-gray-800 text-gray-400">
          <ListChecks size={12} />
          {doneTasks}/{totalTasks} tasks
        </span>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
