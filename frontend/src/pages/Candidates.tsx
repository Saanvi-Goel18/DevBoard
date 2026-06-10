import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { io } from 'socket.io-client';
import api from '../utils/api';
import { Loader2 } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEWED', 'OFFERED', 'HIRED', 'REJECTED'];

interface Application {
  id: string;
  status: string;
  user: { name: string; email: string };
  job: { title: string };
}

const DraggableCard = ({ app }: { app: Application }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
    data: { app }
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`glass-panel p-4 mb-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all ${
        isDragging ? 'opacity-50 z-50 shadow-[0_0_20px_rgba(173,198,255,0.4)] ring-1 ring-primary' : ''
      }`}
    >
      <h4 className="font-bold text-sm text-on-background mb-1 truncate">{app.user.name}</h4>
      <p className="text-[10px] font-mono text-tertiary truncate mb-2">{app.job.title}</p>
      <div className="text-[9px] font-mono text-on-surface-variant uppercase bg-black/40 inline-block px-1.5 py-0.5 rounded">
        ID: {app.id.substring(0,6)}
      </div>
    </div>
  );
};

const DroppableColumn = ({ title, applications }: { title: string, applications: Application[] }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: title,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`bg-surface-container-highest border border-glass-border rounded-lg p-4 flex flex-col w-[280px] shrink-0 transition-colors duration-300 ${
        isOver ? 'bg-primary/5 border-primary/50 shadow-[inset_0_0_20px_rgba(173,198,255,0.1)]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">{title}</h3>
        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{applications.length}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-[200px]">
        {applications.map(app => (
          <DraggableCard key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

const Candidates = () => {
  const queryClient = useQueryClient();
  const [localApps, setLocalApps] = useState<Application[]>([]);

  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get('/applications');
      return res.data;
    }
  });

  useEffect(() => {
    if (applications) {
      setLocalApps(applications);
    }
  }, [applications]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('applicationStatusChanged', (updatedApp) => {
      setLocalApps(prev => 
        prev.map(app => app.id === updatedApp.id ? { ...app, status: updatedApp.status } : app)
      );
    });

    socket.on('newApplication', (newApp) => {
      setLocalApps(prev => [newApp, ...prev.filter(app => app.id !== newApp.id)]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const applicationId = active.id as string;
    const newStatus = over.id as string;

    const application = localApps.find(app => app.id === applicationId);
    
    if (application?.status === newStatus) return;

    setLocalApps(prev => 
      prev.map(app => app.id === applicationId ? { ...app, status: newStatus } : app)
    );

    updateStatusMutation.mutate({ id: applicationId, status: newStatus });
  };

  if (isLoading) return <div className="text-primary font-mono animate-pulse flex items-center"><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Syncing Talent Pool...</div>;

  return (
    <PageWrapper className="h-full flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold tracking-tight text-on-background">Talent Pool Pipeline</h1>
        <p className="text-on-surface-variant mt-1">Drag and drop candidates to update their stage.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex space-x-6 h-full items-start min-w-max">
          <DndContext onDragEnd={handleDragEnd}>
            {STAGES.map(stage => (
              <DroppableColumn 
                key={stage} 
                title={stage} 
                applications={localApps.filter(app => app.status === stage)} 
              />
            ))}
          </DndContext>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Candidates;
