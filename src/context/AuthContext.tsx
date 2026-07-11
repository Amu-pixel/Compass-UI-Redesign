import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export type Role = 'student' | 'lecturer';

type User = {
  name: string;
  email: string;
  role: Role;
};

type AuthContextValue = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const storageKey = 'ai-learning-companion-user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      window.localStorage.removeItem(storageKey);
      return null;
    }
  });

  const value = useMemo(
    () => ({
      user,
      login(nextUser: User) {
        setUser(nextUser);
        window.localStorage.setItem(storageKey, JSON.stringify(nextUser));
      },
      logout() {
        setUser(null);
        window.localStorage.removeItem(storageKey);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (user.role !== role) {
    return <Navigate to={user.role === 'student' ? '/courses' : '/lecturer'} replace />;
  }

  return <>{children}</>;
}
