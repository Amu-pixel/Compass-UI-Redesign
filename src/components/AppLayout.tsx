import { BarChart3, BookOpen, Brain, ClipboardCheck, Database, Home, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  const location = useLocation();
  const isLecturer = user?.role === 'lecturer';
  const nav = isLecturer ? lecturerNav : studentNav;
  const currentNav = [...nav].sort((a, b) => b.to.length - a.to.length).find((item) => location.pathname === item.to || location.pathname.startsWith(`${item.to}/`));
  const contextLabel = isLecturer ? 'CIVL301 / Teaching operations' : `${unit.code} / ${unit.week} / ${unit.topic}`;
  const pageTitle = currentNav?.label ?? (isLecturer ? 'Lecturer workspace' : 'Student workspace');

  function signOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-72 border-r border-white/10 bg-night px-4 py-5 text-white lg:block">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-companion/40 bg-companion text-ink shadow-sm">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="font-display text-sm font-bold">Compass AI LMS</p>
            <p className="text-xs text-white/55">{isLecturer ? 'Lecturer workspace' : 'Student workspace'}</p>
          </div>
        </div>
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.045] p-3">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">Current context</p>
          <p className="mt-1 text-sm font-semibold leading-5 text-white">{contextLabel}</p>
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  'nav-active-motion flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-ai-cyan/70',
                  isActive ? 'bg-companion text-ink shadow-sm' : 'text-white/66 hover:bg-white/10 hover:text-white',
                )
              }
            >
              <item.icon size={18} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" onClick={signOut} className="absolute bottom-5 left-4 right-4 flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-white/66 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-ai-cyan/70">
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <header className="sticky top-0 z-20 border-b border-line bg-white/94 px-5 py-3 backdrop-blur lg:ml-72 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-slate-soft">
              {contextLabel}
            </p>
            <h1 className="font-display text-xl font-bold sm:text-2xl">{pageTitle}</h1>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <div className="rounded-full border border-line bg-paper px-4 py-2 text-sm font-semibold text-slate-copy">
              {isLecturer ? 'Lecturer only' : unit.code}
            </div>
            <div className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink">
              {user?.name}
            </div>
          </div>
        </div>
      </header>

      <main className="overflow-x-hidden pb-24 lg:ml-72 lg:pb-10">
        <Outlet />
      </main>

      <nav className={`fixed bottom-0 left-0 right-0 z-40 grid border-t border-line bg-white px-1 py-2 lg:hidden ${isLecturer ? 'grid-cols-5' : 'grid-cols-5'}`}>
        {nav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ai-cyan/70', isActive ? 'bg-companion-tint text-companion' : 'text-slate-soft')
            }
          >
            <item.icon size={17} aria-hidden="true" />
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
