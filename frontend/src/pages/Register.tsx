import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import axios from 'axios';
import { Activity, Loader2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('APPLICANT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  if (user) return <Navigate to="/dashboard" replace />;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const registeredUser = res.data.user;
      login(res.data.accessToken, registeredUser);
      if (registeredUser.role === 'APPLICANT') {
        navigate('/careers');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Access Denied.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-md p-8 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_15px_rgba(173,198,255,0.3)]">
            <Activity className="text-primary w-6 h-6" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-on-background mb-2 tracking-tight">Request Clearance</h2>
        <p className="text-center text-on-surface-variant text-sm mb-6 font-mono tracking-widest uppercase">Register New Identity</p>

        {error && <div className="bg-error/10 border border-error/50 text-error p-3 rounded mb-6 text-sm font-mono text-center">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Alias (Name)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Email Sequence</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Access Cipher</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Clearance Level</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field">
              <option value="APPLICANT">APPLICANT</option>
              <option value="HR">HR / RECRUITER</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading} className="primary-button w-full flex justify-center py-3 mt-4">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Identity'}
          </button>
        </form>

        <p className="text-center text-on-surface-variant mt-6 text-sm">
          Already cleared? <Link to="/login" className="text-primary hover:underline glow-primary">Initialize Login</Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default Register;
