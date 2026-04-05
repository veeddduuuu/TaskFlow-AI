import { AnimatePresence, motion } from 'framer-motion';
import TaskCard from './TaskCard';
import { EmptyState } from './EmptyState';

// Sort tasks: high priority first, then by deadline
const sortTasks = (tasks) => {
  const ORDER = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    // Done tasks go to the bottom
    if (a.status === 'done' && b.status !== 'done') return 1;
    if (b.status === 'done' && a.status !== 'done') return -1;

    // In-progress before todo
    if (a.status === 'in-progress' && b.status === 'todo') return -1;
    if (b.status === 'in-progress' && a.status === 'todo') return 1;

    // Then sort by priority
    const pDiff = (ORDER[a.priority] ?? 1) - (ORDER[b.priority] ?? 1);
    if (pDiff !== 0) return pDiff;

    // Then sort by deadline
    if (a.deadline && b.deadline) return new Date(a.deadline) - new Date(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return 0;
  });
};

const ExecutionList = ({ tasks, onStatusUpdate }) => {
  if (tasks.length === 0) return <EmptyState />;

  const sorted = sortTasks(tasks);
  const active = sorted.filter((t) => t.status !== 'done');
  const done = sorted.filter((t) => t.status === 'done');

  return (
    <div className="space-y-6">
      {/* Active tasks */}
      <div className="space-y-4">
        <AnimatePresence>
          {active.map((task, idx) => (
            <motion.div
              key={task._id}
              layout
              transition={{ type: 'spring', stiffness: 260, damping: 24, delay: idx * 0.04 }}
            >
              <TaskCard task={task} onStatusUpdate={onStatusUpdate} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Done tasks section */}
      {done.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-dark-border"></div>
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
              Completed ({done.length})
            </span>
            <div className="flex-1 h-px bg-dark-border"></div>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {done.map((task) => (
                <TaskCard key={task._id} task={task} onStatusUpdate={onStatusUpdate} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutionList;
