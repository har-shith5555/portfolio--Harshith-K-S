import { createContext, useContext, useState } from 'react';

// ── Hardcoded credentials (as per assignment — replace with real auth in prod) ──
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_auth') === 'true';
  });
  const [error, setError] = useState('');

  const login = (username, password) => {
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
      return true;
    }
    setError('Invalid username or password.');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
