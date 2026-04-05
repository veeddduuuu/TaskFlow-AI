import { motion } from 'framer-motion';

const ExecutionHeader = ({ taskCount }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-10"
    >
      <p className="text-sm font-medium text-brand-400 uppercase tracking-widest mb-2">
        {today}
      </p>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Today's Execution Plan
          </h1>
          <p className="text-gray-400 text-lg mt-2">Focus on what actually matters.</p>
        </div>

        {taskCount > 0 && (
          <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></span>
            <span className="text-brand-300 text-sm font-semibold">
              {taskCount} task{taskCount !== 1 ? 's' : ''} remaining
            </span>
          </div>
        )}
      </div>
    </motion.header>
  );
};

export default ExecutionHeader;
