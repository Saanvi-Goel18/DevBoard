import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Users, Briefcase, Activity, Target } from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

const data = [
  { name: 'Mon', applicants: 400, interviews: 240 },
  { name: 'Tue', applicants: 300, interviews: 139 },
  { name: 'Wed', applicants: 200, interviews: 980 },
  { name: 'Thu', applicants: 278, interviews: 390 },
  { name: 'Fri', applicants: 189, interviews: 480 },
  { name: 'Sat', applicants: 239, interviews: 380 },
  { name: 'Sun', applicants: 349, interviews: 430 },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <PageWrapper className="max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold tracking-tight text-on-background">Nexus Intelligence Hub</h1>
      <p className="text-on-surface-variant mt-2 mb-8">Welcome back, {user?.name}. Here is your operational overview.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="glass-panel p-6 hover:border-primary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Active Signals</h3>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <p className="text-4xl font-mono font-bold text-primary mt-2 shadow-[0_0_15px_rgba(173,198,255,0.4)] inline-block px-1 rounded">24</p>
        </div>
        
        <div className="glass-panel p-6 hover:border-tertiary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Talent Pool</h3>
            <Users className="w-4 h-4 text-tertiary" />
          </div>
          <p className="text-4xl font-mono font-bold text-tertiary mt-2">1,204</p>
        </div>

        <div className="glass-panel p-6 hover:border-secondary/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Open Roles</h3>
            <Briefcase className="w-4 h-4 text-secondary" />
          </div>
          <p className="text-4xl font-mono font-bold text-secondary mt-2">12</p>
        </div>

        <div className="glass-panel p-6 hover:border-error/50 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xs font-mono text-on-surface-variant uppercase tracking-wider">Clearance</h3>
            <Target className="w-4 h-4 text-error" />
          </div>
          <p className="text-xl font-mono font-bold text-error mt-4 uppercase inline-block bg-error/10 px-2 py-0.5 rounded border border-error/30">{user?.role}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border border-glass-border">
          <h3 className="text-sm font-bold text-on-background mb-6 flex items-center">
            <div className="w-2 h-2 rounded-full bg-primary mr-2 shadow-[0_0_8px_#adc6ff]"></div>
            Applicant Velocity (7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApplicants" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#adc6ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#adc6ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#8c909f" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8c909f" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1c', border: '1px solid #424754', borderRadius: '8px' }}
                  itemStyle={{ color: '#adc6ff' }}
                />
                <Area type="monotone" dataKey="applicants" stroke="#adc6ff" fillOpacity={1} fill="url(#colorApplicants)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 border border-glass-border">
          <h3 className="text-sm font-bold text-on-background mb-6 flex items-center">
            <div className="w-2 h-2 rounded-full bg-tertiary mr-2 shadow-[0_0_8px_#4edea3]"></div>
            Interview Conversion
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#8c909f" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8c909f" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2b" vertical={false} />
                <Tooltip 
                  cursor={{fill: '#2a2a2b'}}
                  contentStyle={{ backgroundColor: '#1c1b1c', border: '1px solid #424754', borderRadius: '8px' }}
                />
                <Bar dataKey="interviews" fill="#4edea3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;
