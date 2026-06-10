import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../utils/api';
import PageWrapper from '../components/PageWrapper';
import { Briefcase, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
}

const Careers = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['public-jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      return api.post('/applications', { jobId });
    },
    onSuccess: () => {
      navigate('/my-status');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Failed to apply');
    }
  });

  const handleApply = (jobId: string) => {
    if (!user) {
      navigate('/register');
      return;
    }
    applyMutation.mutate(jobId);
  };

  return (
    <PageWrapper className="min-h-screen bg-background text-on-background py-16 px-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
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
              <div key={job.id} className="surface-card p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant mb-4">
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> Competitive</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                    </div>
                    <p className="text-on-surface line-clamp-2">{job.description}</p>
                  </div>
                  <button 
                    onClick={() => handleApply(job.id)}
                    disabled={applyMutation.isPending}
                    className="primary-button whitespace-nowrap flex items-center gap-2 group-hover:scale-105 transition-transform"
                  >
                    {user ? 'Apply Now' : 'Login to Apply'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {jobs?.filter(j => j.status === 'OPEN').length === 0 && (
              <div className="text-center p-12 text-on-surface-variant surface-card rounded-2xl border border-white/5">
                No open positions at the moment. Check back later!
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Careers;
