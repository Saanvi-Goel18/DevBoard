import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Jobs from './pages/Jobs';
import Candidates from './pages/Candidates';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-on-background">Nexus Intelligence Hub</h1>
      <p className="text-on-surface-variant mt-2 mb-8">Welcome back, {user?.name}. Here is your operational overview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6">
          <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Active Signals</h3>
          <p className="text-4xl font-mono font-bold text-primary mt-2">24</p>
        </div>
        <div className="glass-panel p-6">
          <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Clearance Status</h3>
          <p className="text-xl font-mono font-bold text-tertiary mt-4 uppercase inline-block">{user?.role}</p>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              {/* HR Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'HR']} />}>
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/candidates" element={<Candidates />} />
              </Route>
              {/* Applicant Routes */}
              <Route element={<ProtectedRoute allowedRoles={['APPLICANT']} />}>
                <Route path="/my-status" element={<div>Application Status</div>} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
