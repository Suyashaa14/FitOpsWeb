import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_GYMS } from '../../data/mockData';

export default function SuperSubs() {
  const plans = [
    { name: 'Trial', price: 0, gyms: 1, color: 'var(--muted)' },
    { name: 'Basic', price: 1499, gyms: 2, color: 'var(--info)' },
    { name: 'Pro',   price: 2499, gyms: 3, color: 'var(--accent)' },
    { name: 'Scale', price: 6999, gyms: 0, color: '#b45309' },
  ];

  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div><h1 className="page-title">Subscriptions</h1><p className="page-sub">Plan distribution across all tenants</p></div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 18 }}>
          {plans.map(p => (
            <div key={p.name} className="kpi" style={{ borderTop: `3px solid ${p.color}` }}>
              <div className="kpi-label">{p.name}</div>
              <div className="kpi-value">{p.gyms}</div>
              <div className="kpi-delta">Rs {(p.price * p.gyms).toLocaleString()} MRR</div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title"><h3>Active subscriptions</h3><span className="meta">MRR Rs 12,997</span></div>
          <table className="table">
            <thead><tr><th>Gym</th><th>Plan</th><th>Price</th><th>Started</th><th>Renews</th><th>Status</th></tr></thead>
            <tbody>
              {MOCK_GYMS.map(g => (
                <tr key={g.id}>
                  <td><strong>{g.name}</strong></td>
                  <td><span className="chip">{g.plan}</span></td>
                  <td className="mono">Rs {g.plan === 'Pro' ? '2,499' : g.plan === 'Basic' ? '1,499' : '0'}</td>
                  <td className="mono">{g.joined}</td>
                  <td className="mono">2026-06-{(12 + g.id).toString().padStart(2, '0')}</td>
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
