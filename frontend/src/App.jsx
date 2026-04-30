import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import TasksPage from './pages/TasksPage';
import AdminPage from './pages/AdminPage';

const { Content } = Layout;

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  const isAuthenticated = !!user;

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated && <Navbar />}
      <Content>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          
          <Route path="/projects" element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/projects/:id" element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          } />
          
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } />
          
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;