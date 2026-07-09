import { createContext, useContext, useState } from 'react';
import { apiRequest } from '../lib/api';

const AuthContext = createContext(null);

function normalizeAuthUser(payload, fallback = {}) {
  const base =
    payload?.user
    || payload?.admin
    || payload?.data?.user
    || payload?.data?.admin
    || payload?.data
    || payload;

  if (!base || typeof base !== 'object' || Array.isArray(base)) {
    return fallback;
  }

  const companyRef = base.company_id || base.company;
  const companyId =
    base.companyId
    || base.companyID
    || (companyRef && typeof companyRef === 'object' ? companyRef._id || companyRef.id : companyRef)
    || base.company_id?._id
    || base.company_id?.id
    || '';

  return {
    ...base,
    ...fallback,
    ...(companyId ? { companyId } : {}),
    id: base.id || base._id || fallback.id,
    _id: base._id || base.id || fallback._id,
    name: base.name || fallback.name,
    email: base.email || fallback.email,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('fitops_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [role, setRole] = useState(() => localStorage.getItem('fitops_role') || null);
  const [token, setToken] = useState(() => localStorage.getItem('fitops_token') || null);

  const login = async (email, password, selectedRole = 'admin') => {
    if (selectedRole === 'super') {
      const loginData = await apiRequest('/api/superAdmin/login', {
        method: 'POST',
        body: { email, password },
      });
      const authToken = loginData?.token || loginData?.accessToken || loginData?.jwt || null;
      const meData = await apiRequest('/api/superAdmin/me', { token: authToken || undefined }).catch(() => null);
      const u = normalizeAuthUser(meData || loginData, { email, name: 'Super Admin' });

      setUser(u); setRole('super'); setToken(authToken);
      localStorage.setItem('fitops_user', JSON.stringify(u));
      localStorage.setItem('fitops_role', 'super');
      if (authToken) localStorage.setItem('fitops_token', authToken);
      else localStorage.removeItem('fitops_token');
      return { role: 'super' };
    }

    const loginData = await apiRequest('/api/user/Login', {
      method: 'POST',
      body: { email, password },
    });
    const authToken = loginData?.token || loginData?.accessToken || loginData?.jwt || null;
    const u = normalizeAuthUser(loginData, { email, name: 'Gym Owner' });

    setUser(u); setRole('admin'); setToken(authToken);
    localStorage.setItem('fitops_user', JSON.stringify(u));
    localStorage.setItem('fitops_role', 'admin');
    if (authToken) localStorage.setItem('fitops_token', authToken);
    else localStorage.removeItem('fitops_token');
    return { role: 'admin' };
  };

  const logout = () => {
    setUser(null); setRole(null); setToken(null);
    localStorage.removeItem('fitops_user');
    localStorage.removeItem('fitops_role');
    localStorage.removeItem('fitops_token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
