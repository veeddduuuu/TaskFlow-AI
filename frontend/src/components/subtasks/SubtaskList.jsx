import { motion, AnimatePresence } from 'framer-motion';
import SubtaskItem from './SubtaskItem';

const SubtaskList = ({ subtasks, onToggle, onDelete, canEdit }) => {
  if (!subtasks || subtasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-dark-card/20 rounded-2xl border border-dashed border-dark-border/40">
        <p className="text-gray-500 text-sm">
          No subtasks yet. Break this task down into smaller, manageable steps.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence mode="popLayout">
        {subtasks.map((subtask) => (
          <SubtaskItem
            key={subtask._id}
            subtask={subtask}
            onToggle={onToggle}
            onDelete={onDelete}
            canEdit={canEdit}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default SubtaskList;
