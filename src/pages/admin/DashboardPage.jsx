import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_MEMBERS, MOCK_PACKAGES } from '../../data/mockData';

function BarChart() {
  const days = Array.from({ length: 30 }, (_, i) => Math.round(35 + Math.sin(i * 0.7) * 18 + (i % 7 === 6 || i % 7 === 5 ? -10 : 6) + i * 0.4));
  const max = Math.max(...days);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, padding: '8px 0' }}>
      {days.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} title={`${d} check-ins`}>
          <div style={{ width: '100%', height: `${(d / max) * 100}%`, background: i === days.length - 1 ? 'var(--accent)' : 'var(--ink)', borderRadius: 3, opacity: i === days.length - 1 ? 1 : 0.85 }} />
          {i % 5 === 0 && <span style={{ fontSize: 9.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{i + 1}</span>}
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const total = MOCK_MEMBERS.length;
    const active = MOCK_MEMBERS.filter(m => m.status === 'active').length;
    const pending = MOCK_MEMBERS.filter(m => m.status === 'pending').length;
    const expired = MOCK_MEMBERS.filter(m => m.status === 'expired').length;
    const expiring = MOCK_MEMBERS.filter(m => m.daysLeft >= 0 && m.daysLeft <= 7 && m.status === 'active').length;
    return { total, active, pending, expired, expiring, todayCheckIns: 68 };
  }, []);

  const expiringList = useMemo(() =>
    MOCK_MEMBERS.filter(m => m.daysLeft >= 0 && m.daysLeft <= 14 && m.status === 'active')
      .sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 8), []);
  const pendingList = useMemo(() => MOCK_MEMBERS.filter(m => m.status === 'pending').slice(0, 4), []);
  const recentCheckins = useMemo(() => MOCK_MEMBERS.filter(m => m.status === 'active').slice(0, 6), []);

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <span className="h-eyebrow"><span className="dot" /> TUESDAY · MAY 12, 2026</span>
            <h1 className="page-title" style={{ marginTop: 10 }}>Good morning, Suman.</h1>
            <p className="page-sub">68 check-ins so far, 9 members renewing this week. Let's hit the floor.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">{I.download} Export</button>
            <button className="btn btn-accent" onClick={() => navigate('/admin/clients/onboarding')}>{I.plus} Add Client</button>
          </div>
        </div>

        {/* KPIs */}
        <div className="kpi-grid" style={{ marginBottom: 22 }}>
          <div className="kpi accent">
            <div className="kpi-label">Today check-ins</div>
            <div className="kpi-value">{stats.todayCheckIns}</div>
            <div className="kpi-delta up">↑ 12% vs yesterday</div>
            <div className="kpi-glyph">{I.zap}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Total members</div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-delta up">↑ 6 this week</div>
            <div className="kpi-glyph">{I.users}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Active</div>
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>{stats.active}</div>
            <div className="kpi-delta">{Math.round(stats.active / stats.total * 100)}% of total</div>
            <div className="kpi-glyph">{I.check}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Pending</div>
            <div className="kpi-value" style={{ color: '#b45309' }}>{stats.pending}</div>
            <div className="kpi-delta">awaiting approval</div>
            <div className="kpi-glyph">{I.clock}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Expired</div>
            <div className="kpi-value" style={{ color: 'var(--danger)' }}>{stats.expired}</div>
            <div className="kpi-delta">{I.bell}<span>nudge them</span></div>
            <div className="kpi-glyph">{I.x}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Expiring 7d</div>
            <div className="kpi-value">{stats.expiring}</div>
            <div className="kpi-delta">3 today</div>
            <div className="kpi-glyph">{I.calendar}</div>
          </div>
        </div>

        {/* Body grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Upcoming expiry */}
            <div className="card">
              <div className="section-title">
                <h3>Upcoming membership expiry</h3>
                <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/clients/onboarding')}>View all →</a>
              </div>
              {expiringList.map(m => (
                <div key={m.id} className="member-row">
                  <Avatar name={m.name} />
                  <div>
                    <div className="member-name">{m.name}</div>
                    <div className="member-meta">{m.phone} · {m.package}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{m.expiry}</span>
                  <span className="badge" style={{ background: m.daysLeft <= 3 ? '#fee2e2' : m.daysLeft <= 7 ? '#fef3c7' : 'var(--surface-2)', color: m.daysLeft <= 3 ? 'var(--danger)' : m.daysLeft <= 7 ? '#b45309' : 'var(--muted)', border: 'none' }}>
                    {m.daysLeft} day{m.daysLeft === 1 ? '' : 's'}
                  </span>
                  <button className="btn btn-sm">{I.send} Remind</button>
                </div>
              ))}
            </div>

            {/* Attendance chart */}
            <div className="card">
              <div className="section-title">
                <h3>Attendance · last 30 days</h3>
                <span className="meta">avg 54 / day</span>
              </div>
              <BarChart />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Pending approvals */}
            <div className="card">
              <div className="section-title">
                <h3>Pending approvals · {pendingList.length}</h3>
                <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/clients/onboarding')}>Review →</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pendingList.map(m => (
                  <div key={m.id} style={{ padding: 12, border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'center' }}>
                    <Avatar name={m.name} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{m.phone} · {m.package}</div>
                    </div>
                    <button className="btn btn-sm btn-accent">{I.check}</button>
                    <button className="btn btn-sm btn-icon btn-danger">{I.x}</button>
                  </div>
                ))}
                {!pendingList.length && <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 18 }}>All caught up 🎉</div>}
              </div>
            </div>

            {/* Recent check-ins */}
            <div className="card">
              <div className="section-title"><h3>Recent check-ins</h3><span className="meta">live</span></div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentCheckins.map((m, i) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < recentCheckins.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <Avatar name={m.name} size="sm" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 13.5 }}>{m.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{m.package} · {i === 0 ? '06:42 AM' : `0${6 + i}:${10 + i * 7} AM`}</div>
                    </div>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--accent)' }}>✓ in</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Package mix */}
            <div className="card">
              <div className="section-title">
                <h3>Package mix</h3>
                <span className="meta">{MOCK_PACKAGES.reduce((a, p) => a + p.members, 0)} members</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {MOCK_PACKAGES.map(p => {
                  const total = MOCK_PACKAGES.reduce((a, x) => a + x.members, 0);
                  const pct = Math.round(p.members / total * 100);
                  return (
                    <div key={p.id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{p.members} · {pct}%</span>
                      </div>
                      <div className="bar"><span style={{ width: pct + '%', background: p.color }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
