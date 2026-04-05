import { motion } from 'framer-motion';

const TaskProgressBar = ({ completed, total }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  return (
    <div className="space-y-2 mb-8">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400 font-medium">Progress</span>
        <span className="text-brand-400 font-bold">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-dark-card rounded-full overflow-hidden border border-dark-border/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-primary-gradient rounded-full"
        />
      </div>
      <p className="text-xs text-gray-500">
        {completed} of {total} subtasks completed
      </p>
    </div>
  );
};

export default TaskProgressBar;
