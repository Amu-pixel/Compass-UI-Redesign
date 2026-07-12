import { ArrowLeft, BookOpen, Home, LayoutDashboard } from 'lucide-react';
import { Button, Card } from '../components/ui';
import { useAuth } from '../context/AuthContext';

export default function NotFoundPage() {
  const { user } = useAuth();
  const isLecturer = user?.role === 'lecturer';
  const dashboardPath = isLecturer ? '/lecturer' : user ? '/courses' : '/';
  const dashboardLabel = isLecturer ? 'Go to Dashboard' : user ? 'Go to Dashboard' : 'Choose role';

  return (
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] w-full max-w-5xl place-items-center px-5 py-12 sm:px-8">
      <Card className="w-full max-w-2xl p-7 text-center sm:p-9">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-companion/35 bg-companion-tint text-companion">
          <BookOpen size={26} aria-hidden="true" />
        </div>
        <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[0.16em] text-companion">Route not found</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-ink sm:text-4xl">We could not find that Compass AI page.</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-copy sm:text-base">
          The route does not match a current student or lecturer workspace. Use the actions below to return to a verified learning or teaching area.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to={dashboardPath} variant="primary">
            <LayoutDashboard size={17} />
            {dashboardLabel}
          </Button>
          {isLecturer ? (
            <Button to="/lecturer/review" variant="secondary">
              <ArrowLeft size={17} />
              Back to Review Queue
            </Button>
          ) : (
            <Button to="/courses" variant="secondary">
              <ArrowLeft size={17} />
              Back to Courses
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
