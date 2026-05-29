import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Activity } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.accessToken, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -z-10" />

      <div className="glass-panel w-full max-w-md p-8 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center border border-primary/30 mb-4 glow-primary">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">DevBoard Nexus</h1>
          <p className="text-on-surface-variant text-sm mt-1">Authenticate to access intelligence</p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error text-error px-4 py-3 rounded mb-6 text-sm font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-error mr-2 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">
              Email Sequence
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">
              Access Cipher
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" className="primary-button w-full py-3 mt-4 flex items-center justify-center space-x-2">
            <span>INITIALIZE SESSION</span>
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          No access clearance? <Link to="/register" className="text-primary hover:underline font-mono">Request Access</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
