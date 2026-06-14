import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import PageWrapper from '../components/PageWrapper';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';

interface Application {
  id: string;
  status: string;
  job: { title: string };
  createdAt: string;
}

const Analytics = () => {
  const { data: applications, isLoading } = useQuery<Application[]>({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get('/applications');
      return res.data;
    }
  });

  if (isLoading) return (
    <PageWrapper className="h-full overflow-y-auto custom-scrollbar pr-4">
      <DashboardSkeleton />
    </PageWrapper>
  );

  const apps = applications || [];

  // Data processing for charts
  const statusCounts = apps.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const funnelData = [
    { name: 'Applied', value: statusCounts['APPLIED'] || 0 },
    { name: 'Shortlisted', value: statusCounts['SHORTLISTED'] || 0 },
    { name: 'Interviewed', value: statusCounts['INTERVIEWED'] || 0 },
    { name: 'Offered', value: statusCounts['OFFERED'] || 0 },
    { name: 'Hired', value: statusCounts['HIRED'] || 0 }
  ];

  const jobCounts = apps.reduce((acc, app) => {
    acc[app.job.title] = (acc[app.job.title] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const jobData = Object.entries(jobCounts).map(([name, value]) => ({ name, value }));

  const COLORS = ['#adc6ff', '#4edea3', '#1e293b', '#64748b', '#0f172a'];

  return (
    <PageWrapper className="h-full overflow-y-auto custom-scrollbar pr-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-on-background">Hiring Analytics</h1>
        <p className="text-on-surface-variant mt-1">Real-time insights into your talent pipeline.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Chart */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-mono text-tertiary uppercase tracking-widest mb-6">Pipeline Funnel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#adc6ff' }}
                />
                <Bar dataKey="value" fill="#adc6ff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Roles Distribution */}
        <div className="glass-panel p-6">
          <h3 className="text-sm font-mono text-tertiary uppercase tracking-widest mb-6">Applications by Role</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={jobData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {jobData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b' }}
                  itemStyle={{ color: '#adc6ff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Analytics;
