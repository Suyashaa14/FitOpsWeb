import { useState } from 'react';
import Shell from '../../components/layout/Shell';
import { Avatar, I } from '../../components/ui/index.jsx';
import { MOCK_MEMBERS } from '../../data/mockData';

function HourBars() {
  const hours = [2,1,1,2,8,18,32,28,22,12,8,6,5,4,6,9,12,16,22,28,22,14,8,4];
  const max = Math.max(...hours);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 200 }}>
      {hours.map((h, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{h}</span>
          <div style={{ width: '100%', height: `${(h / max) * 100}%`, background: h >= 20 ? 'var(--accent)' : 'var(--ink)', borderRadius: 3, opacity: h >= 20 ? 1 : 0.85 }} />
          {i % 3 === 0 && <span className="mono" style={{ fontSize: 10, color: 'var(--muted)' }}>{i.toString().padStart(2,'0')}h</span>}
        </div>
      ))}
    </div>
  );
}

export default function ReportsPage() {
  const [range, setRange] = useState('week');

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Attendance Reports</h1>
            <p className="page-sub">Check-in patterns, member history, churn signals</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select className="select" style={{ width: 160, height: 38 }} value={range} onChange={e => setRange(e.target.value)}>
              <option value="today">Today</option>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="all">All time</option>
            </select>
            <button className="btn">{I.download} CSV</button>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 22 }}>
          <div className="kpi"><div className="kpi-label">Total check-ins</div><div className="kpi-value">1,482</div><div className="kpi-delta up">↑ 18%</div></div>
          <div className="kpi"><div className="kpi-label">Unique visitors</div><div className="kpi-value">221</div><div className="kpi-delta">avg 6.7 visits</div></div>
          <div className="kpi"><div className="kpi-label">Peak hour</div><div className="kpi-value" style={{ fontSize: 26 }}>06–08</div><div className="kpi-delta">42% of traffic</div></div>
          <div className="kpi"><div className="kpi-label">Avg duration</div><div className="kpi-value">1h 18m</div><div className="kpi-delta up">↑ 4m</div></div>
        </div>

        <div className="card" style={{ marginBottom: 18 }}>
          <div className="section-title"><h3>Activity heatmap</h3><span className="meta">last 26 weeks</span></div>
          <div className="heatmap" style={{ gridTemplateColumns: 'repeat(26, 1fr)' }}>
            {Array.from({ length: 26 * 7 }).map((_, i) => {
              const l = [0,0,1,1,2,3,2,4,3,1,0][Math.floor((Math.sin(i * 0.6) + 1.2) * 4) % 11];
              return <span key={i} className={`cell ${l ? 'l' + l : ''}`} />;
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            <span>26 weeks ago</span>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              less
              {[0,1,2,3,4].map(l => (
                <span key={l} className={`cell ${l ? 'l'+l : ''}`} style={{ width: 10, height: 10, borderRadius: 2, display: 'inline-block', background: l ? undefined : 'var(--surface-2)' }} />
              ))}
              more
            </div>
            <span>today</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
          <div className="card">
            <div className="section-title"><h3>Hourly traffic</h3><span className="meta">average weekday</span></div>
            <HourBars />
          </div>
          <div className="card">
            <div className="section-title"><h3>Top attendees</h3><span className="meta">this month</span></div>
            {MOCK_MEMBERS.slice(0, 6).map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid var(--border)' : 'none' }}>
                <span className="mono" style={{ fontSize: 13, color: 'var(--muted)', minWidth: 20 }}>#{i + 1}</span>
                <Avatar name={m.name} size="sm" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{m.name}</div>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.package}</div>
                </div>
                <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>{24 - i * 2} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
