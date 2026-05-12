import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { MOCK_GYMS } from '../../data/mockData';

export default function SuperSMS() {
  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div><h1 className="page-title">SMS Usage</h1><p className="page-sub">Platform SMS pool — monitor and bill</p></div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 18 }}>
          <div className="kpi accent"><div className="kpi-label">SMS this month</div><div className="kpi-value">3,416</div><div className="kpi-delta up">68% of pool</div><div className="kpi-glyph">{I.message}</div></div>
          <div className="kpi"><div className="kpi-label">Delivered</div><div className="kpi-value" style={{ color: 'var(--accent)' }}>98.7%</div></div>
          <div className="kpi"><div className="kpi-label">Failed</div><div className="kpi-value" style={{ color: 'var(--danger)' }}>44</div></div>
          <div className="kpi"><div className="kpi-label">Cost / SMS</div><div className="kpi-value">Rs 0.85</div></div>
        </div>

        <div className="card">
          <div className="section-title"><h3>Usage by gym</h3><span className="meta">May 2026</span></div>
          {MOCK_GYMS.map(g => {
            const pct = Math.round((g.sms / 1500) * 100);
            return (
              <div key={g.id} style={{ padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                  <strong>{g.name}</strong>
                  <span className="mono" style={{ color: 'var(--muted)' }}>{g.sms} / 1,500 · {pct}%</span>
                </div>
                <div className="bar"><span style={{ width: Math.min(pct, 100) + '%', background: pct > 80 ? '#b45309' : 'var(--accent)' }} /></div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
