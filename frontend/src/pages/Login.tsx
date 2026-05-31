import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Activity, Loader2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.accessToken, res.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-md p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(173,198,255,0.3)]">
            <Activity className="text-primary w-6 h-6" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-on-background mb-2 tracking-tight">System Access</h2>
        <p className="text-center text-on-surface-variant text-sm mb-8 font-mono tracking-widest uppercase">Identify to proceed</p>

        {error && <div className="bg-error/10 border border-error/50 text-error p-3 rounded mb-6 text-sm font-mono text-center">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">Email Sequence</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-2">Access Cipher</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          
          <button type="submit" disabled={loading} className="primary-button w-full flex justify-center py-3 mt-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Initialize Connection'}
          </button>
        </form>

        <p className="text-center text-on-surface-variant mt-6 text-sm">
          No clearance? <Link to="/register" className="text-primary hover:underline glow-primary">Request Access</Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default Login;
