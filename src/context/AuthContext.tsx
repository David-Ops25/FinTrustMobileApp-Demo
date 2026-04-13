import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { authenticateDemoUser } from '../services/authService';
import { secureStorage } from '../services/secureStorage';

type SessionPayload = {
  token: string;
  expiresAt: number;
  user: { name: string; email: string };
};

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: SessionPayload['user'] | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearSessionTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const logout = useCallback(async () => {
    clearSessionTimeout();
    setSession(null);
    await secureStorage.clearSession();
  }, [clearSessionTimeout]);

  const scheduleAutoLogout = useCallback((expiresAt: number) => {
    clearSessionTimeout();
    const ttl = Math.max(expiresAt - Date.now(), 2000);
    timeoutRef.current = setTimeout(() => {
      void logout();
    }, ttl);
  }, [clearSessionTimeout, logout]);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const persisted = await secureStorage.getSession();
        if (persisted) {
          const parsed = JSON.parse(persisted) as SessionPayload;
          if (parsed.expiresAt > Date.now()) {
            setSession(parsed);
            scheduleAutoLogout(parsed.expiresAt);
          } else {
            await secureStorage.clearSession();
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    void bootstrap();

    return () => clearSessionTimeout();
  }, [clearSessionTimeout, scheduleAutoLogout]);

  const login = useCallback(async (username: string, password: string) => {
    const authResponse = await authenticateDemoUser(username, password);
    const nextSession: SessionPayload = {
      token: authResponse.token,
      expiresAt: authResponse.expiresAt,
      user: authResponse.user,
    };
    setSession(nextSession);
    await secureStorage.setSession(JSON.stringify(nextSession));
    scheduleAutoLogout(nextSession.expiresAt);
  }, [scheduleAutoLogout]);

  const value = useMemo(
    () => ({
      isLoading,
      isAuthenticated: Boolean(session),
      user: session?.user ?? null,
      login,
      logout,
    }),
    [isLoading, login, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
