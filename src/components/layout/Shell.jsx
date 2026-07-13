import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Logo, Avatar, I } from '../ui/index.jsx';

const ownerNav = [
  { id: 'dashboard', path: '/admin', label: 'Dashboard', icon: I.dash },
  { id: 'clients-title', label: 'Clients', section: true },
  { id: 'clients-onboarding', path: '/admin/clients/onboarding', label: 'Onboarding', icon: I.user, sub: true },
  { id: 'clients-payments', path: '/admin/clients/payments', label: 'Payments', icon: I.send, sub: true },
  { id: 'trainers', path: '/admin/trainers', label: 'Trainers', icon: I.users },
  { id: 'packages', path: '/admin/packages', label: 'Packages', icon: I.package },
  { id: 'qr-reg', path: '/admin/qr-register', label: 'QR Client Create', icon: I.qr },
  { id: 'qr-att', path: '/admin/qr-attendance', label: 'Attendance', icon: I.qr },
];

const superNav = [
  { id: 'dashboard', path: '/super', label: 'Overview', icon: I.dash },
  { id: 'gyms', path: '/super/gyms', label: 'All Gyms', icon: I.building },
];

export default function Shell({ role = 'admin', children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = role === 'super' ? superNav : ownerNav;
  const orgName = role === 'super' ? 'Platform HQ' : (user?.gym || user?.company_name || 'Workspace');
  const userName = role === 'super' ? 'Super Admin' : (user?.name || user?.email || 'Owner');
  const userPhoto = user?.photo
    || user?.profile_photo
    || user?.profilePhoto
    || user?.avatar
    || user?.logo
    || user?.company_logo
    || user?.company?.company_logo
    || user?.company?.logo
    || user?.company_id?.company_logo
    || user?.company_id?.logo
    || '';
  const orgInitials = orgName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const isActive = (path) => {
    if (path === '/admin' || path === '/super') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-shell">
      {mobileOpen && <button className="sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <div style={{ padding: '4px 8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <button className="mobile-sidebar-close" type="button" onClick={() => setMobileOpen(false)}>
            {I.close}
          </button>
        </div>

        <div style={{ padding: '6px 8px 14px' }}>
          <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--ink)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {role === 'super' ? 'SA' : orgInitials}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{orgName}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{role === 'super' ? 'platform' : 'workspace'}</div>
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-section">{role === 'super' ? 'Platform' : 'Workspace'}</div>
          {nav.map((n) => {
            if (n.section) {
              return <div key={n.id} className="sidebar-section" style={{ marginTop: 8 }}>{n.label}</div>;
            }
            return (
              <a
                key={n.id}
                className={`nav-item ${isActive(n.path) ? 'active' : ''}`}
                onClick={() => navigate(n.path)}
                style={{ cursor: 'pointer', marginLeft: n.sub ? 10 : 0 }}
              >
                {n.icon}<span>{n.label}</span>
              </a>
            );
          })}
          <div className="sidebar-section" style={{ marginTop: 18 }}>Account</div>
          <a className="nav-item" style={{ cursor: 'pointer' }}>{I.cog}<span>Settings</span></a>
          <a className="nav-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>{I.logout}<span>Sign out</span></a>
        </nav>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="btn btn-ghost btn-icon mobile-nav-toggle" type="button" onClick={() => setMobileOpen(true)}>
            {I.menu}
          </button>
          <div className="mobile-topbar-brand">
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.02em' }}>{role === 'super' ? 'Platform HQ' : orgName}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{role === 'super' ? 'Super Admin' : 'Owner Workspace'}</div>
          </div>
          <div className="topbar-actions" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div className="topbar-user" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <Avatar name={userName} src={userPhoto} size="sm" />
              <div className="topbar-user-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{userName}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{role === 'super' ? 'Super Admin' : 'Owner'}</span>
              </div>
            </div>
          </div>
        </header>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
