import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, CreditCard, BarChart3,
  MessageSquare, Settings, LogOut, Dumbbell, ChevronLeft, ChevronRight,
  Bell, Search, Menu, X
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Building2, label: 'Gyms', path: '/dashboard/gyms' },
  { icon: Users, label: 'Members', path: '/dashboard/members' },
  { icon: CreditCard, label: 'Subscriptions', path: '/dashboard/subscriptions' },
  { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
  { icon: MessageSquare, label: 'SMS Usage', path: '/dashboard/sms' },
  { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
];

function SidebarLink({ item, collapsed }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/dashboard'}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : '0.75rem',
        padding: collapsed ? '0.7rem' : '0.65rem 1rem',
        borderRadius: '0.5rem',
        fontFamily: 'Rajdhani',
        fontWeight: 600,
        fontSize: '0.85rem',
        letterSpacing: '0.05em',
        color: isActive ? '#f97316' : '#9090a8',
        background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
        borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
        textDecoration: 'none',
        transition: 'all 0.2s',
        justifyContent: collapsed ? 'center' : 'flex-start',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.background = 'rgba(249,115,22,0.06)';
          e.currentTarget.style.color = '#f0f0f5';
        }
      }}
      onMouseLeave={e => {
        const isActive = e.currentTarget.getAttribute('aria-current') === 'page';
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#9090a8';
        }
      }}
    >
      <item.icon size={18} style={{ flexShrink: 0 }} />
      {!collapsed && <span>{item.label}</span>}
    </NavLink>
  );
}

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarWidth = collapsed ? '68px' : '220px';

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          width: sidebarWidth,
          height: '100vh',
          background: '#111118',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          overflow: 'hidden',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Logo */}
        <div style={{ padding: collapsed ? '1.2rem 0' : '1.2rem 1rem', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f97316, #ea580c)', flexShrink: 0, boxShadow: '0 0 15px rgba(249,115,22,0.3)' }}>
              <Dumbbell size={16} color="white" />
            </div>
            {!collapsed && (
              <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.4rem', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                Fit<span style={{ color: '#f97316' }}>Ops</span>
              </span>
            )}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a6e', display: 'flex', padding: '4px' }}>
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} style={{ margin: '0.5rem auto', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', color: '#5a5a6e', display: 'flex', padding: '5px', width: '32px', height: '32px', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={14} />
          </button>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto', overflowX: 'hidden' }}>
          {!collapsed && <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.14em', color: '#3a3a4a', padding: '0.5rem 0.75rem 0.25rem' }}>MAIN MENU</div>}
          {navItems.map(item => (
            <SidebarLink key={item.path} item={item} collapsed={collapsed} />
          ))}
        </nav>

        {/* User / Logout */}
        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.6rem 0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>SA</span>
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.04em', color: '#f0f0f5', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Super Admin'}
                </div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: '#5a5a6e', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || 'admin@gmail.com'}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: collapsed ? 0 : '0.6rem', justifyContent: collapsed ? 'center' : 'flex-start',
              width: '100%', padding: collapsed ? '0.7rem' : '0.6rem 0.75rem',
              background: 'none', border: 'none', borderRadius: '0.4rem',
              fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '0.05em',
              color: '#5a5a6e', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#5a5a6e'; e.currentTarget.style.background = 'none'; }}
          >
            <LogOut size={16} />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#0a0a0f' }}>
        {/* Topbar */}
        <header style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#111118', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
            <div style={{ position: 'relative', maxWidth: '320px', width: '100%' }}>
              <Search size={14} color="#5a5a6e" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                placeholder="Search gyms, members..."
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#9090a8', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'rgba(249,115,22,0.3)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
              />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={{ position: 'relative', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem', padding: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#9090a8' }}>
              <Bell size={16} />
              <div style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#f97316' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.3rem 0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.5rem' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg, #f97316, #ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', color: 'white' }}>SA</span>
              </div>
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 600, fontSize: '0.8rem', color: '#9090a8' }}>Super Admin</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
