import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Logo, Avatar, I } from '../ui/index.jsx';

const ownerNav = [
  { id: 'dashboard',  path: '/admin',               label: 'Dashboard',       icon: I.dash },
  { id: 'members',    path: '/admin/members',         label: 'Members',         icon: I.users },
  { id: 'packages',   path: '/admin/packages',        label: 'Packages',        icon: I.package },
  { id: 'qr-reg',     path: '/admin/qr-register',     label: 'QR Registration', icon: I.qr },
  { id: 'qr-att',     path: '/admin/qr-attendance',   label: 'QR Attendance',   icon: I.qr },
  { id: 'reports',    path: '/admin/reports',          label: 'Reports',         icon: I.chart },
  { id: 'sms',        path: '/admin/sms',              label: 'Send SMS',        icon: I.send },
  { id: 'templates',  path: '/admin/sms-templates',    label: 'SMS Templates',   icon: I.message },
];

const superNav = [
  { id: 'dashboard', path: '/super',            label: 'Overview',      icon: I.dash },
  { id: 'gyms',      path: '/super/gyms',       label: 'All Gyms',      icon: I.building },
  { id: 'members',   path: '/super/members',    label: 'All Members',   icon: I.users },
  { id: 'subs',      path: '/super/subs',       label: 'Subscriptions', icon: I.shield },
  { id: 'sms',       path: '/super/sms',        label: 'SMS Usage',     icon: I.message },
  { id: 'analytics', path: '/super/analytics',  label: 'Analytics',     icon: I.chart },
];

export default function Shell({ role = 'admin', children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const nav = role === 'super' ? superNav : ownerNav;
  const orgName = role === 'super' ? 'Platform HQ' : (user?.gym || 'Iron Forge Fitness');
  const userName = role === 'super' ? 'Super Admin' : (user?.name || 'Suman Adhikari');

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
      {/* Sidebar */}
      <aside className="sidebar">
        <div style={{ padding: '4px 8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
        </div>

        {/* Org switcher */}
        <div style={{ padding: '6px 8px 14px' }}>
          <div style={{ padding: 10, border: '1px solid var(--border)', borderRadius: 10, background: 'var(--surface-2)', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--ink)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {role === 'super' ? '★' : 'IF'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{orgName}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{role === 'super' ? 'platform' : 'pro plan'}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, overflowY: 'auto' }}>
          <div className="sidebar-section">{role === 'super' ? 'Platform' : 'Workspace'}</div>
          {nav.map(n => (
            <a
              key={n.id}
              className={`nav-item ${isActive(n.path) ? 'active' : ''}`}
              onClick={() => navigate(n.path)}
              style={{ cursor: 'pointer' }}
            >
              {n.icon}<span>{n.label}</span>
            </a>
          ))}
          <div className="sidebar-section" style={{ marginTop: 18 }}>Account</div>
          <a className="nav-item" style={{ cursor: 'pointer' }}>{I.cog}<span>Settings</span></a>
          <a className="nav-item" style={{ cursor: 'pointer' }} onClick={handleLogout}>{I.logout}<span>Sign out</span></a>
        </nav>
      </aside>

      {/* Main */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          <div className="search" style={{ minWidth: 260, flex: 1, maxWidth: 360 }}>
            {I.search}
            <input placeholder={role === 'super' ? 'Search gyms, members, plans…' : 'Search members, packages…'} />
            <span className="kbd">⌘K</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="btn btn-ghost btn-sm">{I.bell}</button>
            <button className="btn btn-sm" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--accent)', flexShrink: 0 }} /> Live
            </button>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', paddingLeft: 12, borderLeft: '1px solid var(--border)' }}>
              <Avatar name={userName} size="sm" />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
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
