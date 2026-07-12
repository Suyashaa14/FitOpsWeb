import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Logo, I } from '../components/ui/index.jsx';

export default function LoginPage({ fixedRole = 'admin' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role] = useState(fixedRole);
  const { login, isAuthenticated, role: authRole } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;
    navigate(authRole === 'super' ? '/super' : '/admin', { replace: true });
  }, [authRole, isAuthenticated, navigate]);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      toast(role === 'super' ? 'Welcome back, Super Admin' : 'Welcome back, Gym Owner', 'success');
      setTimeout(() => navigate(role === 'super' ? '/super' : '/admin'), 400);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 56px', background: '#f6f3ee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}><Logo light /></a>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 500, color: '#6b7280', background: 'none', border: '1px solid #d4cfc8', borderRadius: 7, padding: '6px 14px', cursor: 'pointer' }}>{I.back} Back to site</button>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <span className="h-eyebrow" style={{ background: 'rgba(132,204,22,.12)', color: '#4a7c00', borderColor: 'rgba(132,204,22,.3)' }}>SIGN IN</span>
            <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', margin: '16px 0 8px', lineHeight: 1.1, color: '#0a0a09' }}>
              Run the floor.
            </h1>
            <p style={{ color: '#6b7280', margin: '0 0 28px', fontSize: 15 }}>
              Sign in to your FitOpsWeb workspace.
            </p>

            <div style={{ marginBottom: 22, padding: 10, borderRadius: 10, background: '#edeae4', border: '1px solid #d4cfc8', fontSize: 13, color: '#374151' }}>
              {role === 'super' ? 'Super Admin secure sign-in' : 'Gym Owner sign-in'}
            </div>

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em' }}>Email</label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  style={{ height: 42, padding: '0 14px', borderRadius: 8, border: '1.5px solid #d4cfc8', background: '#fff', color: '#0a0a09', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', textTransform: 'uppercase', letterSpacing: '.06em' }}>Password</label>
                <input
                  type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  style={{ height: 42, padding: '0 14px', borderRadius: 8, border: '1.5px solid #d4cfc8', background: '#fff', color: '#0a0a09', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {error && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 12px', borderRadius: 8, fontSize: 13.5, fontWeight: 500 }}>
                  {error}
                </motion.div>
              )}

              <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: 6, background: '#84cc16', color: '#0a0a09', fontWeight: 700 }} disabled={loading}>
                {loading && <span className="spinner" />}
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && I.arrow}
              </button>
            </form>

            <div style={{ marginTop: 18, padding: 14, background: '#edeae4', border: '1px solid #d4cfc8', borderRadius: 10, fontSize: 12.5, color: '#6b7280', display: 'flex', gap: 10 }}>
              <span style={{ color: '#84cc16' }}>{I.shield}</span>
              <div>
                {role === 'super'
                  ? <>Authenticates against <span className="mono" style={{ color: '#374151', fontWeight: 600 }}>/api/superAdmin/login</span> and reads <span className="mono" style={{ color: '#374151', fontWeight: 600 }}>/api/superAdmin/me</span>.</>
                  : <>Authenticates against <span className="mono" style={{ color: '#374151', fontWeight: 600 }}>/api/user/Login</span>.</>}
              </div>
            </div>
          </motion.div>
        </div>

        <div style={{ color: '#9ca3af', fontSize: 12, fontFamily: 'var(--font-mono)' }}>Copyright 2026 FitOpsWeb</div>
      </div>

      <div style={{ background: '#0f0f0e', color: '#f0ede8', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: .07 }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', padding: '4px 10px', border: '1px solid rgba(255,255,255,.15)', borderRadius: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#bef264', display: 'inline-block' }} /> WORKSPACE
          </span>
          <h2 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.03em', margin: '20px 0 12px', lineHeight: 1.05, maxWidth: 460, color: '#f0ede8' }}>
            Every rep,<br />every renewal,<br /><span style={{ color: '#bef264' }}>in one place.</span>
          </h2>
        </div>
      </div>
    </div>
  );
}
