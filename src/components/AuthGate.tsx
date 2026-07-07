import { ReactNode, useEffect, useMemo, useState } from 'react';
import { fetchCurrentUser } from '../services/apiClient';
import { AUTH_LOGOUT_EVENT, getAuthService } from '../services/auth';
import { getRuntimeMode } from '../services/runtime';
import { ensureSandbox, pauseSimulation } from '../services/sandboxApi';
import type { AuthUser } from '../services/types';
import { getWebSocketService } from '../services/webSocket';
import { LoginPanel } from './LoginPanel';
import { PublicLandingPage } from './PublicLandingPage';

export type AuthGateState = {
  backendConfigured: boolean;
  user: AuthUser | null;
  onLogout: () => void;
};

type Props = {
  children: (state: AuthGateState) => ReactNode;
  ensureWorkspace?: boolean;
};

type BootstrapState = 'checking' | 'authenticated' | 'unauthenticated' | 'offline';
type UnauthenticatedView = 'landing' | 'login';

export function AuthGate({ children, ensureWorkspace = true }: Props) {
  const runtime = useMemo(() => getRuntimeMode(), []);
  const authService = useMemo(() => getAuthService(), []);
  const [state, setState] = useState<BootstrapState>(runtime.configured ? 'checking' : 'offline');
  const [user, setUser] = useState<AuthUser | null>(authService.getCurrentUser());
  const [unauthenticatedView, setUnauthenticatedView] = useState<UnauthenticatedView>('landing');

  async function bootstrapAuthenticatedSession(): Promise<void> {
    if (!runtime.configured) {
      setState('offline');
      return;
    }

    const restored = authService.restoreSession();
    if (!restored) {
      setUser(null);
      setState('unauthenticated');
      return;
    }

    try {
      await fetchCurrentUser();
      setUser(authService.getCurrentUser());
      setState('authenticated');
      if (ensureWorkspace) {
        try {
          await ensureSandbox();
        } catch (err) {
          console.warn('Failed to ensure sandbox after authentication:', err);
        }
      }
    } catch {
      authService.logout();
      setUser(null);
      setState('unauthenticated');
    }
  }

  async function handleLogout(): Promise<void> {
    try {
      getWebSocketService().send({ type: 'client_logout' });
      await pauseSimulation();
    } catch (err) {
      console.warn('Failed to pause sandbox before logout:', err);
    }
    authService.logout();
    setUser(null);
    setUnauthenticatedView('landing');
    setState(runtime.configured ? 'unauthenticated' : 'offline');
  }

  useEffect(() => {
    void bootstrapAuthenticatedSession();
    const handleAuthLogout = () => {
      setUser(null);
      setUnauthenticatedView('landing');
      setState(runtime.configured ? 'unauthenticated' : 'offline');
    };
    window.addEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout);
    // Runtime config is read once at app boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensureWorkspace]);

  if (state === 'checking') {
    return (
      <main className="auth-shell">
        <section className="auth-loading">
          <div className="panel-kicker">Legal World</div>
          <h1>正在恢复案件工作区</h1>
          <p>正在校验登录状态并连接案件工作区。</p>
        </section>
      </main>
    );
  }

  const showWorkspace =
    state === 'authenticated' || (state === 'offline' && unauthenticatedView === 'login');

  if (showWorkspace) {
    return (
      <>
        {children({
          backendConfigured: runtime.configured,
          user,
          onLogout: handleLogout,
        })}
      </>
    );
  }

  if (unauthenticatedView === 'landing') {
    return <PublicLandingPage onStartExperience={() => setUnauthenticatedView('login')} />;
  }

  return <LoginPanel onAuthenticated={bootstrapAuthenticatedSession} />;
}
