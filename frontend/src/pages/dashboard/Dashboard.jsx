import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import ProjectGrid from '../../components/dashboard/ProjectGrid';
import ProjectSkeleton from '../../components/dashboard/ProjectSkeleton';
import CreateProjectModal from '../../components/dashboard/CreateProjectModal';

const DashboardPage = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [taskStatsMap, setTaskStatsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── Fetch Projects ───
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get('/projects');
      const raw = res.data?.data;
      const projectList = Array.isArray(raw) ? raw : [];
      setProjects(projectList);

      // Fetch task stats for each project in parallel
      if (projectList.length > 0) {
        const statsPromises = projectList.map((p) =>
          api
            .get(`/projects/${p._id}/tasks`)
            .then((taskRes) => {
              const tasks = Array.isArray(taskRes.data?.data) ? taskRes.data.data : [];
              return {
                id: p._id,
                total: tasks.length,
                done: tasks.filter((t) => t.status === 'done').length,
              };
            })
            .catch(() => ({ id: p._id, total: null, done: null }))
        );

        const stats = await Promise.all(statsPromises);
        const map = {};
        stats.forEach((s) => {
          map[s.id] = { total: s.total, done: s.done };
        });
        setTaskStatsMap(map);
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // ─── Create Project ───
  const handleCreateProject = async (data) => {
    const res = await api.post('/projects', data);
    const newProject = res.data?.data;
    if (newProject) {
      setProjects((prev) => [newProject, ...prev]);
      setTaskStatsMap((prev) => ({
        ...prev,
        [newProject._id]: { total: 0, done: 0 },
      }));
    }
  };

  // ─── Delete Project (Optimistic) ───
  const handleDeleteProject = async (projectId) => {
    const prev = projects;
    setProjects((p) => p.filter((proj) => proj._id !== projectId));
    try {
      await api.delete(`/projects/${projectId}`);
    } catch (err) {
      console.error('Delete failed:', err);
      setProjects(prev); // Revert
    }
  };

  // ─── Edit Project (placeholder — opens modal with data) ───
  const handleEditProject = (project) => {
    // For now, just log — full edit modal is a future feature
    console.log('Edit project:', project.name);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/20">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* ─── Header ─── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between gap-4 flex-wrap mb-10"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-gray-400 text-lg mt-2">All your projects in one place.</p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-xl bg-primary-gradient shadow-lg shadow-brand-500/10
              hover:shadow-brand-500/20 active:scale-[0.97] transition-all cursor-pointer"
          >
            <Plus size={17} />
            Create Project
          </button>
        </motion.div>

        {/* ─── States ─── */}
        {loading && <ProjectSkeleton />}

        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Failed to load projects</h2>
            <p className="text-gray-500 mb-6">Something went wrong. Give it another go.</p>
            <button
              onClick={fetchProjects}
              className="flex items-center gap-2 px-5 py-2.5 bg-dark-card border border-dark-border hover:border-brand-500/40 text-white rounded-xl text-sm font-medium transition-all cursor-pointer"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ProjectGrid
              projects={projects}
              taskStatsMap={taskStatsMap}
              userId={user?._id}
              onDelete={handleDeleteProject}
              onEdit={handleEditProject}
              onCreateClick={() => setModalOpen(true)}
            />
          </motion.div>
        )}
      </main>

      {/* ─── Create Project Modal ─── */}
      <CreateProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
};

export default DashboardPage;
