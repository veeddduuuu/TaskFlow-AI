import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import ProjectTasksHeader from '../../components/tasks/ProjectTasksHeader';
import TaskCard from '../../components/tasks/TaskCard';
import TaskSkeleton from '../../components/tasks/TaskSkeleton';
import EmptyState from '../../components/tasks/EmptyState';
import CreateTaskModal from '../../components/tasks/CreateTaskModal';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/tasks`),
      ]);

      setProject(projectRes.data?.data);
      setTasks(tasksRes.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch project data:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (taskData) => {
    const res = await api.post(`/projects/${projectId}/tasks`, taskData);
    if (res.data?.data) {
      setTasks((prev) => [res.data.data, ...prev]);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    // Optimistic update
    const prevTasks = [...tasks];
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));

    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus });
    } catch (err) {
      console.error('Failed to update task status:', err);
      setTasks(prevTasks); // Rollback
    }
  };

  const handleDeleteTask = async (taskId) => {
    // Optimistic delete
    const prevTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      console.error('Failed to delete task:', err);
      setTasks(prevTasks); // Rollback
    }
  };

  const isAdmin =
    project?.createdBy === user?._id ||
    project?.createdBy?._id === user?._id ||
    project?.members?.some((m) => (m.user?._id || m.user) === user?._id && m.role === 'admin');

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/20">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="space-y-12">
            <div className="h-24 w-full bg-dark-card animate-pulse rounded-2xl" />
            <TaskSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 border border-red-500/20 rounded-2xl">
            <h3 className="text-xl font-semibold text-red-400 mb-2">Something went wrong.</h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              We couldn't load the task list for this project. Please check your connection and try again.
            </p>
            <button
              onClick={fetchData}
              className="px-6 py-2 bg-dark-card border border-dark-border text-white rounded-xl text-sm font-bold hover:bg-dark-border transition-all"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <ProjectTasksHeader
              projectName={project?.name}
              taskCount={tasks.length}
              onCreateClick={() => setIsModalOpen(true)}
              isAdmin={isAdmin}
            />

            <div className="mt-8">
              {tasks.length === 0 ? (
                <EmptyState onCreateClick={() => setIsModalOpen(true)} isAdmin={isAdmin} />
              ) : (
                <AnimatePresence mode="popLayout">
                  {tasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onStatusUpdate={handleStatusUpdate}
                      onDelete={handleDeleteTask}
                      isAdmin={isAdmin}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </>
        )}
      </main>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        members={project?.members}
      />
    </div>
  );
};

export default ProjectTasks;
