import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

interface Job {
  id: string;
  title: string;
  status: string;
  createdAt: string;
}

const Jobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [techStack, setTechStack] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/jobs/generate', { title: newJobTitle, stack: techStack });
      return res.data;
    },
    onSuccess: (data) => {
      setGeneratedDescription(data.description);
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/jobs', {
        title: newJobTitle,
        description: generatedDescription,
        requirements: techStack
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsModalOpen(false);
      setNewJobTitle('');
      setTechStack('');
      setGeneratedDescription('');
    }
  });

  return (
    <PageWrapper className="max-w-6xl w-full mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-on-background">Job Listings</h1>
          <p className="text-on-surface-variant mt-1">Manage active recruitment pipelines</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button px-4 py-2 flex items-center space-x-2 shadow-[0_0_10px_rgba(173,198,255,0.3)]">
          <Plus className="w-4 h-4" />
          <span>New Posting</span>
        </button>
      </div>

      {isLoading ? (
        <div className="text-primary font-mono animate-pulse flex items-center">
          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading intelligence...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <div key={job.id} className="glass-panel p-6 flex flex-col justify-between h-40 group cursor-pointer hover:border-primary/50 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg truncate w-4/5 text-on-background">{job.title}</h3>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${job.status === 'OPEN' ? 'border-tertiary text-tertiary glow-secondary bg-tertiary/10' : 'border-outline text-on-surface-variant'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-mono">ID: {job.id.substring(0,8)}</p>
              </div>
              <div className="text-xs font-mono text-primary group-hover:underline">
                View Pipeline &rarr;
              </div>
            </div>
          ))}
          {jobs?.length === 0 && (
            <div className="col-span-full py-12 text-center text-on-surface-variant font-mono text-sm border border-dashed border-glass-border rounded-lg">
              No active postings detected.
            </div>
          )}
        </div>
      )}

      {/* New Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col p-6 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-primary/20">
            <h2 className="text-xl font-bold mb-4">Initialize Job Posting</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant uppercase mb-2">Role Title</label>
                  <input type="text" value={newJobTitle} onChange={e => setNewJobTitle(e.target.value)} className="input-field bg-black/50" placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-on-surface-variant uppercase mb-2">Tech Stack</label>
                  <input type="text" value={techStack} onChange={e => setTechStack(e.target.value)} className="input-field bg-black/50" placeholder="e.g. React, TypeScript, Tailwind" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button 
                  onClick={() => generateMutation.mutate()} 
                  disabled={generateMutation.isPending || !newJobTitle || !techStack}
                  className="bg-secondary-container text-on-secondary-container hover:bg-secondary transition-colors px-4 py-2 rounded text-sm font-medium flex items-center space-x-2 disabled:opacity-50"
                >
                  {generateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Generate AI Description</span>
                </button>
              </div>

              {generatedDescription && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-mono text-secondary uppercase tracking-widest mb-2 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" /> AI Output Generated
                  </label>
                  <textarea 
                    value={generatedDescription}
                    onChange={(e) => setGeneratedDescription(e.target.value)}
                    className="w-full h-64 bg-black/40 border border-secondary/30 rounded px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-secondary focus:glow-secondary transition-all font-mono leading-relaxed"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-glass-border">
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-on-surface px-4 py-2 text-sm font-medium">Cancel</button>
              <button onClick={() => createJobMutation.mutate()} disabled={!generatedDescription || createJobMutation.isPending} className="primary-button px-6 py-2 text-sm disabled:opacity-50">
                Deploy Job Posting
              </button>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default Jobs;
