import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, LayoutDashboard, Briefcase, Users, CheckSquare, LogOut } from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Nexus Hub', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR', 'APPLICANT', 'EMPLOYEE'] },
    { name: 'Job Listings', path: '/jobs', icon: Briefcase, roles: ['ADMIN', 'HR'] },
    { name: 'Talent Pool', path: '/candidates', icon: Users, roles: ['ADMIN', 'HR'] },
    { name: 'My Status', path: '/my-status', icon: Activity, roles: ['APPLICANT'] },
    { name: 'Onboarding', path: '/tasks', icon: CheckSquare, roles: ['APPLICANT', 'EMPLOYEE'] },
  ];

  const allowedNavs = navItems.filter(item => item.roles.includes(user?.role || ''));

  return (
    <aside className="w-64 border-r border-glass-border bg-surface flex flex-col z-20">
      <div className="h-16 flex items-center px-6 border-b border-glass-border">
        <Activity className="w-5 h-5 text-primary mr-2" />
        <span className="font-bold text-on-background tracking-wide">DEV<span className="text-primary">BOARD</span></span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {allowedNavs.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded transition-all duration-200 ${
                isActive 
                  ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border-l-2 border-transparent'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'glow-primary' : ''}`} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-glass-border">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-mono text-on-background truncate w-32">{user?.name}</span>
            <span className="text-[10px] font-mono text-tertiary uppercase tracking-widest">{user?.role}</span>
          </div>
          <button onClick={logout} className="text-on-surface-variant hover:text-error transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

const Header = () => {
  return (
    <header className="h-16 border-b border-glass-border bg-surface-dim/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center">
        <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse mr-3 shadow-[0_0_8px_rgba(78,222,163,0.6)]" />
        <span className="text-xs font-mono text-on-surface-variant tracking-widest uppercase">System Online</span>
      </div>
    </header>
  );
};

const Layout = () => {
  return (
    <div className="h-screen w-full flex overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] -z-10 pointer-events-none" />
        <Header />
        <div className="flex-1 overflow-auto p-8 z-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
