import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Trash2, Calendar, User, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Navbar from '../../components/shared/Navbar';
import TaskProgressBar from '../../components/subtasks/TaskProgressBar';
import SubtaskList from '../../components/subtasks/SubtaskList';
import AddSubtaskInput from '../../components/subtasks/AddSubtaskInput';

const TaskDetail = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addingSubtask, setAddingSubtask] = useState(false);

  const fetchTaskData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await api.get(`/tasks/${taskId}`);
      const taskData = res.data?.data;
      setTask(taskData);
      
      // Fetch project context to check permissions
      const projectRes = await api.get(`/projects/${taskData.project}`);
      setProject(projectRes.data?.data);
    } catch (err) {
      console.error('Failed to fetch task details:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    fetchTaskData();
  }, [fetchTaskData]);

  const handleAddSubtask = async (title) => {
    setAddingSubtask(true);
    try {
      const res = await api.post(`/tasks/${taskId}/subtasks`, { title });
      // Backend returns the updated task object
      setTask(res.data?.data);
    } catch (err) {
      console.error('Failed to add subtask:', err);
      alert('Failed to add subtask');
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId) => {
    const subtask = task.subTasks.find((s) => s._id === subtaskId);
    if (!subtask) return;

    const newCompletedState = !subtask.isCompleted;

    // Optimistic update
    const prevTask = { ...task };
    setTask((prev) => ({
      ...prev,
      subTasks: prev.subTasks.map((s) =>
        s._id === subtaskId ? { ...s, isCompleted: newCompletedState } : s
      ),
    }));

    try {
      await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, { isCompleted: newCompletedState });
    } catch (err) {
      console.error('Failed to toggle subtask:', err);
      setTask(prevTask); // Rollback
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    // Optimistic delete
    const prevTask = { ...task };
    setTask((prev) => ({
      ...prev,
      subTasks: prev.subTasks.filter((s) => s._id !== subtaskId),
    }));

    try {
      await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    } catch (err) {
      console.error('Failed to delete subtask:', err);
      setTask(prevTask); // Rollback
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      navigate(`/dashboard`);
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center gap-4 text-center">
          <AlertCircle size={48} className="text-red-500 opacity-50" />
          <h2 className="text-2xl font-bold text-white">Task not found.</h2>
          <p className="text-gray-500">The task may have been deleted or you don't have permission to view it.</p>
          <button onClick={() => navigate(-1)} className="px-6 py-2 bg-dark-card border border-dark-border rounded-xl text-sm font-bold text-white">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completedCount = task.subTasks.filter((s) => s.isCompleted).length;
  const totalCount = task.subTasks.length;
  const isAdminOrCreator =
    project?.createdBy === user?._id ||
    task.createdBy?._id === user?._id ||
    project?.members?.some((m) => (m.user?._id || m.user) === user?._id && m.role === 'admin');

  return (
    <div className="min-h-screen bg-dark-bg text-white font-sans selection:bg-brand-500/20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-dark-card/30 border border-dark-border/50 rounded-3xl p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col gap-6 mb-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-brand-400 transition-colors w-fit group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                  {task.title}
                </h1>
                <p className="inline-flex items-center gap-2 text-xs font-bold text-brand-400 uppercase tracking-widest bg-brand-500/5 px-3 py-1 rounded-full border border-brand-500/10">
                   <Clock size={12} />
                   {task.status.replace('-', ' ')}
                </p>
              </div>

              {isAdminOrCreator && (
                <button
                  onClick={handleDeleteTask}
                  className="p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  title="Delete Entire Task"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            {task.description && (
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl bg-dark-bg/30 p-4 rounded-2xl border border-dark-border/30">
                {task.description}
              </p>
            )}

            {/* Metadata Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-xl text-xs text-gray-400">
                <User size={14} className="text-gray-500" />
                <span>Assigned to: {task.assignedTo?.username || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-xl text-xs text-gray-400">
                <CheckCircle size={14} className="text-gray-500" />
                <span className="capitalize">{task.priority} Priority</span>
              </div>
              {task.deadline && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-bg border border-dark-border rounded-xl text-xs text-gray-400">
                  <Calendar size={14} className="text-gray-500" />
                  <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="pt-6 border-t border-dark-border/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Task Breakdown
              </h2>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                {completedCount} / {totalCount} Done
              </span>
            </div>

            <TaskProgressBar completed={completedCount} total={totalCount} />

            <div className="mt-6">
              {isAdminOrCreator && (
                <AddSubtaskInput onAdd={handleAddSubtask} loading={addingSubtask} />
              )}
              
              <SubtaskList
                subtasks={task.subTasks}
                onToggle={handleToggleSubtask}
                onDelete={handleDeleteSubtask}
                canEdit={isAdminOrCreator}
              />
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TaskDetail;
