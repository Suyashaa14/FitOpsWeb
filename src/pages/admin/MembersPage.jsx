import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { MOCK_MEMBERS, MOCK_PACKAGES } from '../../data/mockData';

function MemberFormModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || {
    name: '', phone: '', gender: 'M', address: '', package: 'Basic',
    start: '2026-05-12', expiry: '2026-06-12', status: 'active', payment: 'paid',
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal modal-lg" onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{initial ? 'Edit member' : 'Add new member'}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--muted)', fontSize: 13 }}>
              {initial ? `Member #${initial.id}` : 'Manually onboard a new member'}
            </p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Full name</label>
              <input className="input" value={f.name} onChange={e => set('name', e.target.value)} placeholder="Ram Sharma" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input mono" value={f.phone} onChange={e => set('phone', e.target.value)} placeholder="98XXXXXXXX" />
            </div>
            <div className="field">
              <label>Gender</label>
              <select className="select" value={f.gender} onChange={e => set('gender', e.target.value)}>
                <option>M</option><option>F</option><option>Other</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <input className="input" value={f.address} onChange={e => set('address', e.target.value)} placeholder="Kathmandu, Nepal" />
            </div>
            <div className="field">
              <label>Package</label>
              <select className="select" value={f.package} onChange={e => set('package', e.target.value)}>
                {MOCK_PACKAGES.map(p => <option key={p.id} value={p.name}>{p.name} · Rs {p.price.toLocaleString()}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Payment status</label>
              <select className="select" value={f.payment} onChange={e => set('payment', e.target.value)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="field">
              <label>Start date</label>
              <input className="input mono" type="date" value={f.start} onChange={e => set('start', e.target.value)} />
            </div>
            <div className="field">
              <label>Expiry date</label>
              <input className="input mono" type="date" value={f.expiry} onChange={e => set('expiry', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)}>{initial ? 'Save changes' : 'Create member'}</button>
        </div>
      </motion.div>
    </div>
  );
}

function MemberDrawer({ member, onClose, onEdit }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal modal-lg" onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }}>
        <div style={{ padding: '28px 28px 16px', display: 'flex', gap: 18, alignItems: 'center' }}>
          <Avatar name={member.name} size="lg" />
          <div style={{ flex: 1 }}>
            <h2 className="modal-title">{member.name}</h2>
            <div className="mono" style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 4 }}>#{member.id} · {member.phone}</div>
          </div>
          <StatusBadge status={member.status} />
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div style={{ padding: '0 28px 22px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 18 }}>
            {[
              { label: 'Package', value: member.package },
              { label: 'Expiry', value: member.expiry, mono: true },
              { label: 'Days left', value: `${member.daysLeft}d`, accent: member.daysLeft <= 7, mono: true },
              { label: 'Address', value: member.address },
              { label: 'Gender', value: member.gender },
              { label: 'Payment', value: member.payment },
            ].map(({ label, value, mono, accent }) => (
              <div key={label} style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>{label}</div>
                <div className={mono ? 'mono' : ''} style={{ fontSize: 14, fontWeight: 500, color: accent ? 'var(--danger)' : 'inherit' }}>{value}</div>
              </div>
            ))}
          </div>
          <div className="section-title"><h3>Recent activity</h3><span className="meta">{member.checkInsThisMonth} this month</span></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Today 06:42', 'Mon 06:15', 'Sun rest day', 'Sat 07:01', 'Fri 06:50'].map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, fontSize: 13 }}>
                <span className="mono" style={{ color: 'var(--muted)', minWidth: 100 }}>{t}</span>
                <span style={{ color: t.includes('rest') ? 'var(--muted)' : 'var(--accent)' }}>{t.includes('rest') ? '—' : '✓ checked in'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Close</button>
          <button className="btn">{I.send} Send SMS</button>
          <button className="btn btn-accent" onClick={onEdit}>{I.edit} Edit member</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState(MOCK_MEMBERS);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [pkg, setPkg] = useState('all');
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState(null);
  const toast = useToast();

  const filtered = useMemo(() => members.filter(m => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (pkg !== 'all' && m.package !== pkg) return false;
    if (q && !(`${m.name} ${m.phone}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [members, q, filter, pkg]);

  const counts = useMemo(() => ({
    all: members.length,
    active: members.filter(m => m.status === 'active').length,
    pending: members.filter(m => m.status === 'pending').length,
    expired: members.filter(m => m.status === 'expired').length,
    deactivated: members.filter(m => m.status === 'deactivated').length,
  }), [members]);

  function saveMember(data) {
    if (data.id) { setMembers(ms => ms.map(m => m.id === data.id ? { ...m, ...data } : m)); toast('Member updated', 'success'); }
    else { setMembers(ms => [{ ...data, id: Date.now(), checkInsThisMonth: 0, lastVisit: '—', daysLeft: 30 }, ...ms]); toast('Member created', 'success'); }
    setEditing(null);
  }

  function approveMember(id) { setMembers(ms => ms.map(m => m.id === id ? { ...m, status: 'active', payment: 'paid' } : m)); toast('Member approved → active', 'success'); }
  function delMember(id) { setMembers(ms => ms.filter(m => m.id !== id)); toast('Member deleted'); }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Members</h1>
            <p className="page-sub">Manage your {members.length} members · {counts.pending} awaiting approval</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">{I.download} Export CSV</button>
            <button className="btn btn-accent" onClick={() => setEditing('new')}>{I.plus} Add Member</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {[['all','All'],['active','Active'],['pending','Pending'],['expired','Expired'],['deactivated','Deactivated']].map(([id, l]) => (
            <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>
              {l} <span className="mono" style={{ fontSize: 11, marginLeft: 4, color: 'var(--muted)' }}>{counts[id]}</span>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search" style={{ minWidth: 320, flex: 1, maxWidth: 460 }}>
            {I.search}<input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name or phone…" />
          </div>
          <select className="select" style={{ width: 160, height: 38 }} value={pkg} onChange={e => setPkg(e.target.value)}>
            <option value="all">All packages</option>
            {MOCK_PACKAGES.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
          <button className="btn">{I.filter} More filters</button>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{filtered.length} of {members.length}</span>
        </div>

        {/* Table */}
        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" /></th>
                <th>Member</th><th>Phone</th><th>Package</th><th>Status</th>
                <th>Expiry</th><th>Payment</th><th>Last visit</th><th style={{ width: 80 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 30).map(m => (
                <tr key={m.id} style={{ cursor: 'pointer' }} onClick={() => setView(m)}>
                  <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                  <td>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Avatar name={m.name} size="sm" />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>#{m.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="mono">{m.phone}</td>
                  <td><span className="chip">{m.package}</span></td>
                  <td><StatusBadge status={m.status} /></td>
                  <td className="mono">
                    {m.expiry}
                    <div style={{ fontSize: 11, color: m.daysLeft < 0 ? 'var(--danger)' : m.daysLeft <= 7 ? '#b45309' : 'var(--muted)' }}>
                      {m.daysLeft < 0 ? `${-m.daysLeft}d overdue` : `${m.daysLeft}d left`}
                    </div>
                  </td>
                  <td><span className={`badge badge-${m.payment === 'paid' ? 'active' : 'pending'}`}>{m.payment}</span></td>
                  <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{m.lastVisit}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      {m.status === 'pending' && <button className="btn btn-sm btn-accent" onClick={() => approveMember(m.id)}>Approve</button>}
                      <button className="btn btn-sm btn-icon" onClick={() => setEditing(m)}>{I.edit}</button>
                      <button className="btn btn-sm btn-icon btn-danger" onClick={() => delMember(m.id)}>{I.trash}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)' }}>
            <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Showing 1–{Math.min(30, filtered.length)} of {filtered.length}</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-sm">← Prev</button>
              <button className="btn btn-sm btn-primary">1</button>
              <button className="btn btn-sm">Next →</button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editing && <MemberFormModal initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveMember} />}
        {view && <MemberDrawer member={view} onClose={() => setView(null)} onEdit={() => { setEditing(view); setView(null); }} />}
      </AnimatePresence>
    </Shell>
  );
}
