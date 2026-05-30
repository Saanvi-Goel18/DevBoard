import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Activity } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('APPLICANT');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      login(response.data.accessToken, response.data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[120px] -z-10" />

      <div className="glass-panel w-full max-w-md p-8 relative">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center border border-primary/30 mb-4 glow-primary">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-on-background">Request Clearance</h1>
          <p className="text-on-surface-variant text-sm mt-1">Create an identity token</p>
        </div>

        {error && (
          <div className="bg-error-container/20 border border-error text-error px-4 py-3 rounded mb-6 text-sm font-mono flex items-center">
            <span className="w-2 h-2 rounded-full bg-error mr-2 animate-pulse" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">Alias (Name)</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">Email Sequence</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">Access Cipher</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
          </div>
          <div>
            <label className="block text-xs font-mono text-on-surface-variant uppercase tracking-wider mb-2">Clearance Level</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="input-field bg-surface-container text-on-surface [&>option]:bg-surface-container">
              <option value="APPLICANT">APPLICANT</option>
              <option value="HR">HR / RECRUITER</option>
              <option value="ADMIN">ADMINISTRATOR</option>
            </select>
          </div>
          <button type="submit" className="primary-button w-full py-3 mt-6 flex items-center justify-center space-x-2">
            <span>GENERATE TOKEN</span>
          </button>
        </form>

        <p className="text-center text-sm text-on-surface-variant mt-8">
          Already have clearance? <Link to="/login" className="text-primary hover:underline font-mono">Initialize Session</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
