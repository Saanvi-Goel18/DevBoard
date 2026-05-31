
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Loader2, CheckCircle2, Circle, Clock } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

interface Application {
  id: string;
  status: string;
  job: { title: string };
  createdAt: string;
}

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'OFFERED', 'HIRED', 'REJECTED'];

const MyStatus = () => {

  
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ['my-applications'],
    queryFn: async () => {
      const res = await api.get('/applications');
      return res.data;
    }
  });

  if (isLoading) return <div className="text-primary font-mono animate-pulse flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Authenticating signal...</div>;

  return (
    <PageWrapper className="max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-on-background mb-2">My Applications</h1>
      <p className="text-on-surface-variant mb-8">Track your clearance process for Nexus positions.</p>
      
      <div className="space-y-6">
        {applications?.map(app => {
          const currentStageIndex = STAGES.indexOf(app.status);
          
          return (
            <div key={app.id} className="glass-panel p-6 border border-primary/20 hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-6 border-b border-glass-border pb-4">
                <div>
                  <h3 className="text-xl font-bold text-on-background">{app.job.title}</h3>
                  <p className="text-xs font-mono text-on-surface-variant mt-1">Application ID: {app.id}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-mono uppercase px-3 py-1 rounded-full border shadow-[0_0_10px_rgba(173,198,255,0.2)] ${app.status === 'REJECTED' ? 'bg-error/10 text-error border-error/30' : 'bg-primary/10 text-primary border-primary/30'}`}>
                    {app.status}
                  </span>
                </div>
              </div>

              <div className="relative pt-4">
                <div className="absolute top-6 left-0 w-full h-0.5 bg-surface-container-high -z-10" />
                <div className="flex justify-between">
                  {STAGES.slice(0, 5).map((stage, idx) => {
                    const isCompleted = idx < currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const isRejected = app.status === 'REJECTED';
                    
                    return (
                      <div key={stage} className="flex flex-col items-center bg-surface px-2">
                        {isCompleted && !isRejected ? (
                          <CheckCircle2 className="w-5 h-5 text-tertiary bg-surface" />
                        ) : isCurrent && !isRejected ? (
                          <Clock className="w-5 h-5 text-primary animate-pulse bg-surface" />
                        ) : isRejected && isCurrent ? (
                          <Circle className="w-5 h-5 text-error bg-surface" />
                        ) : (
                          <Circle className="w-5 h-5 text-outline-variant bg-surface" />
                        )}
                        <span className={`text-[10px] font-mono mt-2 uppercase ${isCurrent && !isRejected ? 'text-primary font-bold shadow-[0_0_5px_rgba(173,198,255,0.4)]' : 'text-on-surface-variant'}`}>
                          {stage}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {applications?.length === 0 && (
          <div className="text-center py-12 border border-dashed border-glass-border rounded-lg">
            <p className="text-on-surface-variant font-mono text-sm">No active applications detected in the Nexus.</p>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default MyStatus;
