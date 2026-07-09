import { BookOpen, CalendarDays, Filter, GraduationCap, LogOut, Search, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { courses } from '../data/mockData';
import { Button, Card, ConfidenceBadge } from '../components/ui';

export default function CoursesPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-paper text-ink">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 bg-[#101216] p-5 text-white lg:block">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cardinal">
            <BookOpen size={21} />
          </div>
          <div>
            <p className="font-display text-sm font-bold">bentley.lms</p>
            <p className="text-xs text-white/55">Blackboard Ultra 2030</p>
          </div>
        </div>
        <nav className="mt-10 space-y-2">
          {['Institution Page', 'Profile', 'Activity Stream', 'Courses', 'Organisations', 'Calendar', 'Messages', 'Grades', 'Tools'].map((item) => (
            <div key={item} className={`rounded-2xl px-4 py-3 text-sm font-semibold ${item === 'Courses' ? 'bg-white text-ink' : 'text-white/68 hover:bg-white/10'}`}>
              {item}
            </div>
          ))}
        </nav>
        <button onClick={logout} className="absolute bottom-5 left-5 right-5 flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/10">
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <main className="lg:ml-72">
        <header className="border-b border-line bg-white px-5 py-5 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-copy">Hi {user?.name || 'David'}, welcome back.</p>
              <h1 className="font-display text-4xl font-bold">Courses</h1>
            </div>
            <ConfidenceBadge />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
          <Card className="mb-6">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <label className="flex items-center gap-3 rounded-2xl border border-line bg-paper px-4 py-3">
                <Search size={18} className="text-slate-soft" />
                <input className="min-w-0 flex-1 bg-transparent text-sm" placeholder="Search your courses" />
              </label>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold hover:border-companion">
                <Filter size={17} />
                Current courses
              </button>
              <button className="flex items-center justify-center gap-2 rounded-2xl border border-line px-4 py-3 text-sm font-bold hover:border-companion">
                <CalendarDays size={17} />
                Semester 2, 2026
              </button>
            </div>
          </Card>

          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold">Semester 2, 2026</h2>
            <p className="font-mono text-xs font-semibold uppercase text-slate-soft">4 courses</p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <Link key={course.code} to="/demo" className="group rounded-[28px] focus:outline-2">
                <Card className="h-full overflow-hidden p-0 transition group-hover:-translate-y-1 group-hover:border-companion/40">
                  <div className="relative h-32" style={{ background: course.image }}>
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-bold text-ink">{course.code}</div>
                    <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur">
                      <GraduationCap size={22} />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-companion-tint px-3 py-1 text-xs font-bold text-companion">
                      <Sparkles size={13} />
                      AI Companion remembers progress
                    </div>
                    <h3 className="font-display text-xl font-bold">{course.title}</h3>
                    <p className="mt-2 text-sm text-slate-copy">{course.lecturer}</p>
                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-xs font-bold text-slate-copy">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-paper-dim">
                        <div className="h-2 rounded-full bg-companion" style={{ width: `${course.progress}%` }} />
                      </div>
                    </div>
                    <p className="mt-4 rounded-2xl bg-paper p-3 text-sm font-semibold leading-5">{course.nextAssessment}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <Button to="/demo">Continue Structural Analysis 301</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
