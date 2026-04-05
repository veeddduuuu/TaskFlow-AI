import { AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import DashboardEmptyState from './DashboardEmptyState';

const ProjectGrid = ({ projects, taskStatsMap, userId, onDelete, onEdit, onCreateClick }) => {
  if (projects.length === 0) {
    return <DashboardEmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <AnimatePresence>
        {projects.map((project, idx) => {
          // Check if user is admin (creator or member with admin role)
          const isAdmin =
            project.createdBy === userId ||
            project.createdBy?._id === userId ||
            project.members?.some(
              (m) =>
                (m.user === userId || m.user?._id === userId) && m.role === 'admin'
            );

          return (
            <ProjectCard
              key={project._id}
              project={project}
              taskStats={taskStatsMap[project._id]}
              isAdmin={isAdmin}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGrid;
