import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Plus, Sparkles, Loader2, X, Users, ArrowRight, AlertCircle } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  status: string;
  createdAt: string;
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

const STATUS_COLORS: Record<string, string> = {
  APPLIED:     'bg-primary/10 text-primary border-primary/30',
  SHORTLISTED: 'bg-secondary/10 text-secondary border-secondary/30',
  INTERVIEWED: 'bg-tertiary/10 text-tertiary border-tertiary/30',
  OFFERED:     'bg-yellow-400/10 text-yellow-400 border-yellow-400/30',
  HIRED:       'bg-green-400/10 text-green-400 border-green-400/30',
  REJECTED:    'bg-error/10 text-error border-error/30',
};

const Jobs = () => {
  const [isModalOpen, setIsModalOpen]             = useState(false);
  const [newJobTitle, setNewJobTitle]             = useState('');
  const [techStack, setTechStack]                 = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [aiError, setAiError]                     = useState('');
  const [selectedJob, setSelectedJob]             = useState<Job | null>(null);

  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await api.get('/jobs');
      return res.data;
    }
  });

  // Fetch applications for the selected job (pipeline view)
  const { data: pipelineApps, isLoading: pipelineLoading } = useQuery<Application[]>({
    queryKey: ['pipeline', selectedJob?.id],
    queryFn: async () => {
      const res = await api.get('/applications');
      // filter to this job only
      return res.data.filter((a: Application & { jobId: string }) => a.jobId === selectedJob?.id);
    },
    enabled: !!selectedJob,
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/jobs/generate', { title: newJobTitle, stack: techStack });
      return res.data;
    },
    onSuccess: (data) => {
      setGeneratedDescription(data.description);
      setAiError('');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'AI generation failed. Check your Gemini API key in the backend .env file.';
      setAiError(msg);
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/jobs', {
        title: newJobTitle,
        description: generatedDescription,
        requirements: techStack,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsModalOpen(false);
      setNewJobTitle('');
      setTechStack('');
      setGeneratedDescription('');
      setAiError('');
    }
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setNewJobTitle('');
    setTechStack('');
    setGeneratedDescription('');
    setAiError('');
  };

  return (
    <PageWrapper className="max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-on-background">Job Listings</h1>
          <p className="text-on-surface-variant mt-2 text-base">Manage active recruitment pipelines</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="primary-button flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Posting
        </button>
      </div>

      {/* Job Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="glass-panel h-44 animate-pulse bg-surface-variant/20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs?.map((job) => (
            <div
              key={job.id}
              className="glass-panel p-6 flex flex-col justify-between group cursor-pointer hover:border-primary/40 transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg text-on-background truncate w-4/5">{job.title}</h3>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${job.status === 'OPEN' ? 'border-tertiary text-tertiary bg-tertiary/10' : 'border-outline text-on-surface-variant'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
                  {job.description || 'No description provided.'}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(job)}
                className="flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all duration-200"
              >
                <Users className="w-4 h-4" />
                View Pipeline
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
          {jobs?.length === 0 && (
            <div className="col-span-full py-16 text-center text-on-surface-variant border border-dashed border-white/10 rounded-2xl">
              <p className="text-lg font-medium">No active postings yet.</p>
              <p className="text-sm mt-1">Click "New Posting" to create your first job listing.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Pipeline Drawer ── */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="relative w-full max-w-lg h-full bg-surface border-l border-white/5 flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-6 border-b border-white/5 flex items-start justify-between">
              <div>
                <p className="text-xs font-mono text-on-surface-variant uppercase tracking-widest mb-1">Pipeline</p>
                <h2 className="text-2xl font-bold text-on-background">{selectedJob.title}</h2>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-on-surface-variant hover:text-on-background p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {pipelineLoading ? (
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading applicants...</span>
                </div>
              ) : pipelineApps && pipelineApps.length > 0 ? (
                pipelineApps.map(app => (
                  <div key={app.id} className="glass-panel p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-on-background">{app.user.name}</p>
                      <p className="text-sm text-on-surface-variant">{app.user.email}</p>
                      <p className="text-xs text-on-surface-variant mt-1 font-mono">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${STATUS_COLORS[app.status] || ''}`}>
                      {app.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
                  <Users className="w-10 h-10 text-on-surface-variant mx-auto mb-3" />
                  <p className="text-on-surface-variant font-medium">No applicants yet</p>
                  <p className="text-sm text-on-surface-variant/60 mt-1">Applications will appear here once candidates apply.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── New Job Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col border border-primary/20 shadow-[0_0_60px_rgba(0,0,0,0.8)]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-2xl font-bold">New Job Posting</h2>
              <button onClick={closeModal} className="text-on-surface-variant hover:text-on-background p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Role Title</label>
                  <input
                    type="text"
                    value={newJobTitle}
                    onChange={e => setNewJobTitle(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">Tech Stack / Skills</label>
                  <input
                    type="text"
                    value={techStack}
                    onChange={e => setTechStack(e.target.value)}
                    className="input-field"
                    placeholder="e.g. React, TypeScript, Node.js"
                  />
                </div>
              </div>

              {/* AI Generate Button */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => { setAiError(''); generateMutation.mutate(); }}
                  disabled={generateMutation.isPending || !newJobTitle || !techStack}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary/20 border border-secondary/30 text-secondary font-semibold text-sm hover:bg-secondary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {generateMutation.isPending
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <Sparkles className="w-4 h-4" />
                  }
                  {generateMutation.isPending ? 'Generating...' : 'Generate AI Description'}
                </button>
                <p className="text-xs text-on-surface-variant">Fill both fields above first</p>
              </div>

              {/* AI Error */}
              {aiError && (
                <div className="flex items-start gap-3 bg-error/10 border border-error/30 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-error">AI Generation Failed</p>
                    <p className="text-sm text-error/80 mt-0.5">{aiError}</p>
                    <p className="text-xs text-on-surface-variant mt-2">
                      Check your <code className="bg-surface-variant px-1 rounded">GEMINI_API_KEY</code> in <code className="bg-surface-variant px-1 rounded">backend/.env</code>.
                      Keys must start with <code className="bg-surface-variant px-1 rounded">AIza</code>.
                    </p>
                  </div>
                </div>
              )}

              {/* AI Output */}
              {generatedDescription && (
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-secondary mb-2">
                    <Sparkles className="w-4 h-4" /> AI Generated Description
                  </label>
                  <textarea
                    value={generatedDescription}
                    onChange={e => setGeneratedDescription(e.target.value)}
                    rows={10}
                    className="w-full bg-black/40 border border-secondary/30 rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-secondary transition-all font-mono leading-relaxed resize-none"
                  />
                </div>
              )}

              {/* Manual description fallback */}
              {!generatedDescription && (
                <div>
                  <label className="block text-sm font-semibold text-on-surface-variant mb-2">
                    Job Description <span className="text-on-surface-variant/50 font-normal">(or write manually)</span>
                  </label>
                  <textarea
                    rows={6}
                    className="w-full bg-black/40 border border-outline-variant rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-all resize-none"
                    placeholder="Describe the role, responsibilities and requirements..."
                    onChange={e => setGeneratedDescription(e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-white/5 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors">
                Cancel
              </button>
              <button
                onClick={() => createJobMutation.mutate()}
                disabled={!generatedDescription || createJobMutation.isPending}
                className="primary-button disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createJobMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
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
