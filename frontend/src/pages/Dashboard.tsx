import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Briefcase, Activity, Target } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const data = [
  { name: 'Mon', applicants: 40, interviews: 24 },
  { name: 'Tue', applicants: 30, interviews: 14 },
  { name: 'Wed', applicants: 55, interviews: 38 },
  { name: 'Thu', applicants: 27, interviews: 19 },
  { name: 'Fri', applicants: 48, interviews: 32 },
  { name: 'Sat', applicants: 23, interviews: 18 },
  { name: 'Sun', applicants: 35, interviews: 28 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageWrapper className="max-w-6xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-on-background">
          Welcome back, <span className="text-primary">{user?.name}</span>
        </h1>
        <p className="text-on-surface-variant mt-2 text-lg">Here is your operational overview for today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-6 hover:border-primary/40 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Active Signals</h3>
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Activity className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-5xl font-bold text-primary">24</p>
          <p className="text-sm text-on-surface-variant mt-2">Applications this week</p>
        </div>

        <div className="glass-panel p-6 hover:border-tertiary/40 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Talent Pool</h3>
            <div className="p-2 rounded-xl bg-tertiary/10 group-hover:bg-tertiary/20 transition-colors">
              <Users className="w-5 h-5 text-tertiary" />
            </div>
          </div>
          <p className="text-5xl font-bold text-tertiary">1,204</p>
          <p className="text-sm text-on-surface-variant mt-2">Total candidates</p>
        </div>

        <div className="glass-panel p-6 hover:border-secondary/40 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Open Roles</h3>
            <div className="p-2 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
              <Briefcase className="w-5 h-5 text-secondary" />
            </div>
          </div>
          <p className="text-5xl font-bold text-secondary">12</p>
          <p className="text-sm text-on-surface-variant mt-2">Active job listings</p>
        </div>

        <div className="glass-panel p-6 hover:border-error/40 transition-all duration-300 group">
          <div className="flex justify-between items-start mb-5">
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Access Level</h3>
            <div className="p-2 rounded-xl bg-error/10 group-hover:bg-error/20 transition-colors">
              <Target className="w-5 h-5 text-error" />
            </div>
          </div>
          <p className="text-2xl font-bold text-error uppercase mt-2 bg-error/10 px-3 py-1 rounded-lg border border-error/30 inline-block">{user?.role}</p>
          <p className="text-sm text-on-surface-variant mt-3">Your clearance</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_#adc6ff]"></div>
            <h3 className="text-base font-semibold text-on-background">Applicant Velocity (7 Days)</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#adc6ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#adc6ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1c1b1c', border: '1px solid #334155', borderRadius: '12px', fontSize: '14px' }} itemStyle={{ color: '#adc6ff' }} />
                <Area type="monotone" dataKey="applicants" stroke="#adc6ff" strokeWidth={2} fillOpacity={1} fill="url(#colorApplicants)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-tertiary shadow-[0_0_8px_#4edea3]"></div>
            <h3 className="text-base font-semibold text-on-background">Interview Conversion</h3>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={13} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <Tooltip cursor={{ fill: '#1e293b' }} contentStyle={{ backgroundColor: '#1c1b1c', border: '1px solid #334155', borderRadius: '12px', fontSize: '14px' }} />
                <Bar dataKey="interviews" fill="#4edea3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
