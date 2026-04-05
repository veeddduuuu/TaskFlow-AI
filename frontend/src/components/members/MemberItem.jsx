import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ShieldAlert, User, Trash2, ChevronDown, MoreVertical } from 'lucide-react';

const ROLE_ICONS = {
  admin: <ShieldAlert size={14} className="text-red-400" />,
  project_admin: <Shield size={14} className="text-brand-400" />,
  member: <User size={14} className="text-gray-400" />
};

const ROLE_LABELS = {
  admin: 'Admin',
  project_admin: 'Project Admin',
  member: 'Member'
};

const MemberItem = ({ member, isAdmin, onUpdateRole, onRemoveMember, currentUserId }) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Extract user details (handles both populated and unpopulated cases, though backend now populates it)
  const user = member.user || {};
  const userId = user._id || user;
  const name = user.name || 'Unknown User';
  const email = user.email || 'No email provided';
  const role = member.role;

  const isSelf = currentUserId === userId;

  const handleRoleChange = (newRole) => {
    setIsRoleDropdownOpen(false);
    if (newRole !== role) {
      onUpdateRole(userId, newRole);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="flex items-center justify-between p-4 bg-dark-card border border-dark-border rounded-xl transition-colors hover:border-dark-border/80">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-dark-bg border border-dark-border flex items-center justify-center text-sm font-bold text-gray-300">
          {getInitials(name)}
        </div>
        
        {/* User Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">{name} {isSelf && <span className="text-xs text-gray-500 font-normal">(You)</span>}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded border border-dark-border bg-dark-bg text-[10px] uppercase font-bold tracking-wider text-gray-400">
              {ROLE_ICONS[role]}
              {ROLE_LABELS[role]}
            </span>
          </div>
          <span className="text-xs text-gray-500">{email}</span>
        </div>
      </div>

      {/* Actions (Admin Only) */}
      {isAdmin && !isSelf && (
        <div className="flex items-center gap-2 relative">
          
          {/* Role Changer */}
          <div className="relative">
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-dark-bg border border-dark-border hover:border-gray-600 rounded-lg transition-colors"
            >
              Change Role <ChevronDown size={14} />
            </button>
            
            <AnimatePresence>
              {isRoleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-dark-card border border-dark-border rounded-xl shadow-xl overflow-hidden z-20"
                  >
                    {Object.keys(ROLE_LABELS).map(r => (
                      <button
                        key={r}
                        onClick={() => handleRoleChange(r)}
                        disabled={role === r}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                          role === r ? 'bg-dark-bg text-brand-400 cursor-default' : 'text-gray-300 hover:bg-dark-bg hover:text-white'
                        }`}
                      >
                        {ROLE_ICONS[r]}
                        {ROLE_LABELS[r]}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Remove Button */}
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to remove ${name} from the project?`)) {
                onRemoveMember(userId);
              }
            }}
            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-dark-bg border border-transparent hover:border-dark-border rounded-lg transition-colors"
            title="Remove Member"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default MemberItem;
