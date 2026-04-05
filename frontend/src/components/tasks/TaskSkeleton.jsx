import { motion } from 'framer-motion';

const TaskSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="h-5 w-1/3 bg-gray-800 rounded animate-pulse"></div>
            <div className="h-6 w-16 bg-gray-800 rounded-full animate-pulse"></div>
          </div>
          <div className="h-4 w-2/3 bg-gray-800 rounded animate-pulse"></div>
          <div className="flex items-center justify-between pt-2">
            <div className="h-6 w-24 bg-gray-800 rounded-full animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-800 rounded-lg animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskSkeleton;
