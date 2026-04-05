import { useState, useEffect, useCallback } from 'react';

import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import ExecutionHeader from '../../components/execution/ExecutionHeader';
import ExecutionList from '../../components/execution/ExecutionList';
import SkeletonList from '../../components/execution/SkeletonCard';
import { ErrorState } from '../../components/execution/EmptyState';

const ExecutionPage = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch all tasks assigned to the current user across all their projects
  const fetchDailyTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(false);

    try {
      // Step 1: Get all projects the user is part of
      const projectsRes = await api.get('/projects');
      const rawProjects = projectsRes.data?.data;
      const projects = Array.isArray(rawProjects) ? rawProjects : [];

      if (projects.length === 0) {
        setTasks([]);
        return;
      }

      // Step 2: For each project, fetch tasks assigned to the current user
      const taskFetches = projects.map((project) =>
        api
          .get(`/projects/${project._id}/tasks`, {
            params: { assignedTo: user._id },
          })
          .then((res) => {
            const rawTasks = res.data?.data;
            const tasks = Array.isArray(rawTasks) ? rawTasks : [];
            return tasks.map((task) => ({
              ...task,
              projectName: project.name,
              projectId: project._id,
            }));
          })
          .catch(() => []) // If one project fails, don't block others
      );

      const tasksByProject = await Promise.all(taskFetches);
      const allTasks = tasksByProject.flat();

      setTasks(allTasks);
    } catch (err) {
      console.error('Failed to fetch daily tasks:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDailyTasks();
  }, [fetchDailyTasks]);

  // Optimistic status update handler — updates local state immediately
  const handleStatusUpdate = useCallback((taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );
  }, []);


  const activeTasks = tasks.filter((t) => t.status !== 'done');

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/20">
      <Navbar />


      {/* ─── Main Content ─── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <ExecutionHeader taskCount={activeTasks.length} />

        {/* Content States */}
        {loading && <SkeletonList />}

        {!loading && error && <ErrorState onRetry={fetchDailyTasks} />}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <ExecutionList tasks={tasks} onStatusUpdate={handleStatusUpdate} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default ExecutionPage;
