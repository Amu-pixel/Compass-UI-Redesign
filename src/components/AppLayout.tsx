import { BarChart3, BookOpen, Brain, ClipboardCheck, Database, Home, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { unit } from '../data/mockData';
import { cn } from '../utils/classNames';

const studentNav = [
  { label: 'Courses', to: '/courses', icon: Home },
  { label: 'Unit', to: '/demo', icon: BookOpen, end: true },
  { label: 'Learning', to: '/demo/learn', icon: Brain },
  { label: 'Assessment', to: '/demo/assessment', icon: ClipboardCheck },
  { label: 'Trust', to: '/demo/trust', icon: ShieldCheck },
];

const lecturerNav = [
  { label: 'Dashboard', to: '/lecturer', icon: BarChart3, end: true },
  { label: 'Assignments', to: '/lecturer/assignments', icon: ClipboardCheck },
  { label: 'Review Queue', to: '/lecturer/review', icon: ClipboardCheck },
  { label: 'Knowledge', to: '/lecturer/knowledge', icon: Database },
  { label: 'Trust', to: '/lecturer/trust', icon: ShieldCheck },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isLecturer = user?.role === 'lecturer';
  const nav = isLecturer ? lecturerNav : studentNav;

  function signOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-[#0B0D12] px-4 py-5 text-white lg:block">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ai-cyan/30 bg-ai-cyan/10 text-ai-cyan shadow-[0_0_26px_rgba(109,231,242,0.12)]">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="font-display text-sm font-bold">Compass AI LMS</p>
            <p className="text-xs text-white/55">{isLecturer ? 'Lecturer workspace' : 'Student workspace'}</p>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition',
                  isActive ? 'bg-white text-ink' : 'text-white/66 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={signOut} className="absolute bottom-5 left-4 right-4 flex items-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-white/66 hover:bg-white/10">
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-white/92 px-5 py-4 backdrop-blur lg:ml-72 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-soft">
              {isLecturer ? 'Lecturer / AI validation / Cohort insight' : `Courses / ${unit.name} / ${unit.week}`}
            </p>
            <h1 className="font-display text-xl font-bold sm:text-2xl">{isLecturer ? `Hi ${user?.name || 'Lecturer'}, teaching workspace` : unit.name}</h1>
          </div>
          <div className="hidden rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-slate-copy sm:block">
            {isLecturer ? 'Lecturer only' : unit.code}
          </div>
        </div>
      </header>

      <main className="pb-24 lg:ml-72 lg:pb-10">
        <Outlet />
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 z-40 grid border-t border-line bg-white px-1 py-2 lg:hidden ${isLecturer ? 'grid-cols-5' : 'grid-cols-5'}`}>
        {nav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold', isActive ? 'text-companion' : 'text-slate-soft')
            }
          >
            <item.icon size={17} />
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
