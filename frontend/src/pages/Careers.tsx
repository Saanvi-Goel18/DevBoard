import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import api from '../utils/api';
import PageWrapper from '../components/PageWrapper';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight, Activity, LayoutDashboard, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Careers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [resumeText, setResumeText] = useState('');

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['public-jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async ({ jobId, resumeText }: { jobId: string, resumeText: string }) => {
      return api.post('/applications', { jobId, resumeText });
    },
    onSuccess: () => {
      setSelectedJob(null);
      setResumeText('');
      navigate('/my-status');
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || 'Failed to apply');
      } else {
        alert('Failed to apply');
      }
    }
  });

  const handleApplyClick = (job: Job) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedJob(job);
  };

  const submitApplication = () => {
    if (selectedJob && resumeText.trim()) {
      applyMutation.mutate({ jobId: selectedJob.id, resumeText });
    }
  };

  return (
    <PageWrapper className="min-h-screen bg-background text-on-background relative overflow-hidden">
      {/* Aurora blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-wide text-on-background">DEV<span className="text-primary">BOARD</span></span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-on-surface-variant hover:text-on-background transition-colors px-4 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-sm primary-button px-4 py-2"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto relative z-10 py-16 px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            <Briefcase className="w-12 h-12 text-primary" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-tertiary">
              Open Positions
            </span>
          </h1>
          <p className="text-on-surface-variant text-lg">Join the Nexus. Shape the future.</p>
        </div>


        {isLoading ? (
          <div className="flex justify-center p-12">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs?.filter(j => j.status === 'OPEN').map((job) => (
              <div key={job.id} className="glass-panel p-6 rounded-2xl border border-outline-variant/50 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-on-background mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Competitive</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                    </div>
                    <p className="text-on-surface line-clamp-2">{job.description}</p>
                  </div>
                  <button 
                    onClick={() => handleApplyClick(job)}
                    className="primary-button whitespace-nowrap flex items-center gap-2 group-hover:scale-105 transition-transform"
                  >
                    {user ? 'Apply Now' : 'Login to Apply'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {jobs?.filter(j => j.status === 'OPEN').length === 0 && (
               <div className="text-center p-12 text-on-surface-variant glass-panel rounded-2xl border border-outline-variant/50">
                No open positions at the moment. Check back later!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg shadow-2xl flex flex-col">
            <div className="p-6 border-b border-outline-variant/30 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-on-background">Apply for Role</h2>
                <p className="text-sm text-on-surface-variant mt-1">{selectedJob.title}</p>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-on-surface-variant hover:text-on-background p-2 rounded-lg hover:bg-surface-variant/50 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                Paste your Resume / Cover Letter
              </label>
              <textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                rows={8}
                placeholder="Paste your professional experience here..."
                className="input-field resize-none text-sm leading-relaxed"
              />
            </div>
            <div className="p-6 border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-dim/30 rounded-b-2xl">
              <button 
                onClick={() => setSelectedJob(null)} 
                className="px-5 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                disabled={!resumeText.trim() || applyMutation.isPending}
                className="primary-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {applyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Careers;
