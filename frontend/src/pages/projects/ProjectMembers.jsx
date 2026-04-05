import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import MemberList from '../../components/members/MemberList';
import AddMemberModal from '../../components/members/AddMemberModal';

const ProjectMembers = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const fetchProjectData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data?.data);
    } catch (err) {
      console.error('Failed to fetch project members:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  // Determine if current user is admin based on project owner or admin role
  const isAdmin =
    project?.createdBy === user?._id ||
    project?.createdBy?._id === user?._id ||
    project?.members?.some((m) => (m.user?._id || m.user) === user?._id && m.role === 'admin');

  const handleAddMember = async (email, role) => {
    // API call to add member
    const res = await api.post(`/projects/${projectId}/members`, { email, role });
    if (res.data?.data) {
      setProject(res.data.data); // Backend returns updated project
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await api.put(`/projects/${projectId}/members/${userId}`, { role: newRole });
      if (res.data?.data) {
        setProject(res.data.data);
      }
    } catch (err) {
      console.error('Failed to update member role:', err);
      alert(err.response?.data?.message || 'Failed to update member role. Make sure the project has at least one admin.');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const res = await api.delete(`/projects/${projectId}/members/${userId}`);
      if (res.data?.data) {
        setProject(res.data.data);
      }
    } catch (err) {
      console.error('Failed to remove member:', err);
      alert(err.response?.data?.message || 'Failed to remove member. Make sure the project has at least one admin.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-12">
            <div className="h-24 w-full bg-dark-card animate-pulse rounded-2xl" />
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 w-full bg-dark-card animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
            <h3 className="text-xl font-semibold text-red-400 mb-2">Something went wrong.</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              We couldn't load the members for this project. Please check your connection and try again.
            </p>
            <button
              onClick={fetchProjectData}
              className="px-6 py-2 bg-dark-card border border-dark-border text-white rounded-xl text-sm font-bold hover:bg-dark-border transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6 mb-8">
              {/* Back Link */}
              <Link
                to={`/projects/${projectId}/tasks`}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors w-fit group"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Tasks
              </Link>

              {/* Main Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                      {project?.name || 'Project'}
                    </h1>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Manage team members, roles, and project access.
                  </p>
                </div>

                {isAdmin && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-dark-card border border-dark-border hover:border-gray-600 text-white rounded-xl font-bold transition-all"
                  >
                    <UserPlus size={18} />
                    Add Member
                  </motion.button>
                )}
              </div>
            </div>

            <div className="mt-8">
              <MemberList 
                members={project?.members} 
                isAdmin={isAdmin} 
                onUpdateRole={handleUpdateRole}
                onRemoveMember={handleRemoveMember}
                currentUserId={user?._id}
              />
            </div>
          </>
        )}
      </main>

      <AddMemberModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddMember={handleAddMember} 
      />
    </div>
  );
};

export default ProjectMembers;
