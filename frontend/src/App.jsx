import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Execution from './pages/execution/Execution';
import Dashboard from './pages/dashboard/Dashboard';
import ProjectTasks from './pages/projects/ProjectTasks';
import TaskDetail from './pages/tasks/TaskDetail';
import ProjectMembers from './pages/projects/ProjectMembers';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin"></div>
    </div>
  );
  
  if (!user) return <Navigate to="/auth/login" />;
  
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route 
        path="/execution" 
        element={
          <ProtectedRoute>
            <Execution />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:projectId/tasks" 
        element={
          <ProtectedRoute>
            <ProjectTasks />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/projects/:projectId/members" 
        element={
          <ProtectedRoute>
            <ProjectMembers />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/tasks/:taskId" 
        element={
          <ProtectedRoute>
            <TaskDetail />
          </ProtectedRoute>
        } 
      />
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
