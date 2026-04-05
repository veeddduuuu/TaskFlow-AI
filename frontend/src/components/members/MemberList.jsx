import { motion } from 'framer-motion';
import MemberItem from './MemberItem';

const MemberList = ({ members, isAdmin, onUpdateRole, onRemoveMember, currentUserId }) => {
  if (!members || members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-dark-card border border-dark-border rounded-2xl">
        <h3 className="text-xl font-semibold text-white mb-2">No members yet</h3>
        <p className="text-gray-500">This project has no members. Add someone to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {members.map((member, i) => (
        <motion.div
          key={member.user?._id || member.user}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <MemberItem 
            member={member} 
            isAdmin={isAdmin}
            onUpdateRole={onUpdateRole}
            onRemoveMember={onRemoveMember}
            currentUserId={currentUserId}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default MemberList;
