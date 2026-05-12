import { useState } from 'react';
import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_GYMS } from '../../data/mockData';

export default function SuperGyms() {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const list = MOCK_GYMS.filter(g =>
    (filter === 'all' || g.status === filter) &&
    (`${g.name} ${g.owner}`.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Gyms</h1>
            <p className="page-sub">{MOCK_GYMS.length} gyms on the platform</p>
          </div>
          <button className="btn btn-accent">{I.plus} Onboard gym</button>
        </div>

        <div className="tabs">
          {[['all','All'],['active','Active'],['trial','Trial'],['deactivated','Deactivated']].map(([id, l]) => (
            <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>{l}</div>
          ))}
        </div>

        <div className="search" style={{ maxWidth: 420, marginBottom: 14 }}>
          {I.search}<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search gym or owner…" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {list.map(g => (
            <div key={g.id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--ink)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 17 }}>
                  {g.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                </div>
                <StatusBadge status={g.status} />
              </div>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{g.name}</h3>
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>{g.owner} · {g.city}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, margin: '18px 0', padding: '14px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                <div><div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>MEMBERS</div><div style={{ fontWeight: 700, fontSize: 17 }}>{g.members}</div></div>
                <div><div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>PLAN</div><div style={{ fontWeight: 700, fontSize: 14, marginTop: 2 }}>{g.plan}</div></div>
                <div><div className="mono" style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase' }}>SMS · MO</div><div style={{ fontWeight: 700, fontSize: 17 }}>{g.sms}</div></div>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>Joined {g.joined}</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-sm">View</button>
                  <button className="btn btn-sm">{g.status === 'deactivated' ? 'Activate' : 'Deactivate'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
