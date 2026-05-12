import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { MOCK_PACKAGES } from '../../data/mockData';

function PackageModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || { name: '', duration: '1 Month', price: 1500, features: ['Gym access'], color: 'var(--accent)' });
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal" onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit package' : 'New package'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Name</label><input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="field"><label>Duration</label>
              <select className="select" value={f.duration} onChange={e => setF({ ...f, duration: e.target.value })}>
                <option>1 Month</option><option>3 Months</option><option>6 Months</option><option>1 Year</option>
              </select>
            </div>
            <div className="field"><label>Price (Rs)</label>
              <input className="input mono" type="number" value={f.price} onChange={e => setF({ ...f, price: +e.target.value })} />
            </div>
          </div>
          <div className="field"><label>Features (comma-separated)</label>
            <input className="input" value={f.features.join(', ')} onChange={e => setF({ ...f, features: e.target.value.split(',').map(s => s.trim()) })} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)}>Save package</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState(MOCK_PACKAGES);
  const [edit, setEdit] = useState(null);
  const toast = useToast();

  function save(p) {
    if (p.id) setPkgs(ps => ps.map(x => x.id === p.id ? p : x));
    else setPkgs(ps => [...ps, { ...p, id: Date.now(), members: 0 }]);
    toast('Package saved', 'success');
    setEdit(null);
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Packages</h1>
            <p className="page-sub">{pkgs.length} packages · {pkgs.reduce((a, p) => a + p.members, 0)} members enrolled</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEdit('new')}>{I.plus} New package</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 18 }}>
          {pkgs.map(p => (
            <div key={p.id} className="card card-hover" style={{ position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <span className="chip" style={{ color: p.color }}>{p.duration}</span>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEdit(p)}>{I.edit}</button>
              </div>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>{p.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '10px 0 20px' }}>
                <span className="big-stat" style={{ fontSize: 38 }}>Rs {p.price.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {p.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--accent)' }}>{I.check}</span>{f}
                  </div>
                ))}
              </div>
              <div style={{ paddingTop: 18, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>ENROLLED</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{p.members}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>REVENUE</div>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>Rs {(p.members * p.price / 1000).toFixed(1)}k</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title"><h3>Pricing logic</h3><span className="meta">auto-calculated</span></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5, background: 'var(--surface-2)', padding: 16, borderRadius: 10, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
            <span style={{ color: 'var(--muted)' }}>{'// when admin assigns package to a member:'}</span><br />
            {'member.expiryDate = member.startDate + package.duration;'}<br />
            {'member.status = payment === "paid" ? '}<span style={{ color: 'var(--accent)' }}>"active"</span>{' : '}<span style={{ color: '#b45309' }}>"pending"</span>;<br />
            <span style={{ color: 'var(--muted)' }}>{'// 3 days before expiry → auto-SMS via reminder template'}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {edit && <PackageModal initial={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSave={save} />}
      </AnimatePresence>
    </Shell>
  );
}
