import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fitops_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('fitops_role') || null);

  const login = async (email, password, selectedRole = 'super') => {
    if (selectedRole === 'super') {
      try {
        const res = await fetch('https://sass-gym-backend.vercel.app/api/superAdmin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) {
          const data = await res.json();
          const u = data.admin || data.user || { email, name: 'Super Admin' };
          setUser(u); setRole('super');
          localStorage.setItem('fitops_user', JSON.stringify(u));
          localStorage.setItem('fitops_role', 'super');
          return { role: 'super' };
        }
        const j = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 400) throw new Error(j.message || 'Invalid credentials');
      } catch (err) {
        if (email === 'admin@gmail.com' && password === 'admin@2345') {
          const u = { email, name: 'Super Admin' };
          setUser(u); setRole('super');
          localStorage.setItem('fitops_user', JSON.stringify(u));
          localStorage.setItem('fitops_role', 'super');
          return { role: 'super', mock: true };
        }
        throw new Error('Could not reach server. Mock credentials: admin@gmail.com / admin@2345');
      }
    } else {
      const u = { email, name: 'Suman Adhikari', gym: 'Iron Forge Fitness' };
      setUser(u); setRole('admin');
      localStorage.setItem('fitops_user', JSON.stringify(u));
      localStorage.setItem('fitops_role', 'admin');
      return { role: 'admin' };
    }
  };

  const logout = () => {
    setUser(null); setRole(null);
    localStorage.removeItem('fitops_user');
    localStorage.removeItem('fitops_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
