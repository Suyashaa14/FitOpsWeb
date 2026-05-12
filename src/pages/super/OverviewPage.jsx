import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_GYMS, MOCK_MEMBERS } from '../../data/mockData';

function RevenueChart() {
  const months = [240, 268, 295, 310, 288, 332, 362, 390, 412, 428, 462, 482];
  const max = Math.max(...months);
  const labels = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
  const w = 600, h = 180, pad = 20;
  const points = months.map((m, i) => [
    pad + (i / (months.length - 1)) * (w - pad * 2),
    h - pad - (m / max) * (h - pad * 2),
  ]);
  const path = points.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const area = `${path} L ${points[points.length-1][0]} ${h - pad} L ${points[0][0]} ${h - pad} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 200 }}>
        <path d={area} fill="var(--accent-soft)" />
        <path d={path} stroke="var(--accent)" strokeWidth="2.5" fill="none" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? 'var(--accent)' : 'var(--surface)'}
            stroke="var(--accent)" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export default function SuperOverview() {
  const navigate = useNavigate();
  const totalMembers = MOCK_GYMS.reduce((a, g) => a + g.members, 0);
  const totalSms = MOCK_GYMS.reduce((a, g) => a + g.sms, 0);
  const activeGyms = MOCK_GYMS.filter(g => g.status === 'active').length;

  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <span className="h-eyebrow"><span className="dot" /> PLATFORM HEALTH</span>
            <h1 className="page-title" style={{ marginTop: 10 }}>FitOpsWeb · Overview</h1>
            <p className="page-sub">{activeGyms} active gyms · {totalMembers.toLocaleString()} members · {totalSms.toLocaleString()} SMS this month</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">{I.download} Export</button>
            <button className="btn btn-accent">{I.plus} Onboard new gym</button>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 22 }}>
          <div className="kpi accent">
            <div className="kpi-label">Monthly revenue</div>
            <div className="kpi-value">Rs 482k</div>
            <div className="kpi-delta up">↑ 14% MoM</div>
            <div className="kpi-glyph">{I.trend}</div>
          </div>
          <div className="kpi"><div className="kpi-label">Active gyms</div><div className="kpi-value">{activeGyms}</div><div className="kpi-delta up">↑ 2 this month</div><div className="kpi-glyph">{I.building}</div></div>
          <div className="kpi"><div className="kpi-label">Total members</div><div className="kpi-value">{(totalMembers / 1000).toFixed(1)}k</div><div className="kpi-delta up">↑ 312</div><div className="kpi-glyph">{I.users}</div></div>
          <div className="kpi"><div className="kpi-label">SMS sent</div><div className="kpi-value">{(totalSms / 1000).toFixed(1)}k</div><div className="kpi-delta">68% of pool</div><div className="kpi-glyph">{I.message}</div></div>
          <div className="kpi"><div className="kpi-label">Churn rate</div><div className="kpi-value" style={{ color: 'var(--accent)' }}>1.8%</div><div className="kpi-delta down">↓ 0.4pp</div><div className="kpi-glyph">{I.heart}</div></div>
          <div className="kpi"><div className="kpi-label">Trials → paid</div><div className="kpi-value">62%</div><div className="kpi-delta up">↑ 8pp</div><div className="kpi-glyph">{I.shield}</div></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginBottom: 18 }}>
          <div className="card">
            <div className="section-title"><h3>Revenue · last 12 months</h3><span className="meta">Rs 4.8M YTD</span></div>
            <RevenueChart />
          </div>
          <div className="card">
            <div className="section-title"><h3>Top gyms by members</h3><span className="meta">live</span></div>
            {[...MOCK_GYMS].sort((a, b) => b.members - a.members).slice(0, 5).map((g, i) => (
              <div key={g.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none' }}>
                <span className="mono" style={{ fontSize: 13, color: 'var(--muted)', minWidth: 24 }}>#{i + 1}</span>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{I.building}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{g.name}</div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{g.city} · {g.plan}</div>
                </div>
                <span style={{ fontWeight: 700 }}>{g.members}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">
            <h3>Recent gym activity</h3>
            <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/super/gyms')}>View all gyms →</a>
          </div>
          <table className="table">
            <thead><tr><th>Gym</th><th>Owner</th><th>City</th><th>Plan</th><th>Members</th><th>SMS · mo</th><th>Joined</th><th>Status</th></tr></thead>
            <tbody>
              {MOCK_GYMS.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.name}</strong></td>
                  <td>{g.owner}</td>
                  <td style={{ color: 'var(--muted)' }}>{g.city}</td>
                  <td><span className="chip">{g.plan}</span></td>
                  <td className="mono">{g.members}</td>
                  <td className="mono">{g.sms}</td>
                  <td className="mono" style={{ color: 'var(--muted)' }}>{g.joined}</td>
                  <td><StatusBadge status={g.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  );
}
