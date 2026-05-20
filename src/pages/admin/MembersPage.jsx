import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createClient, deleteClient, getClients, updateClient } from '../../lib/adminApi';

function normalizeStatus(value) {
  const v = (value || '').toLowerCase();
  if (['active', 'pending', 'expired', 'deactivated'].includes(v)) return v;
  return 'pending';
}

function ClientFormModal({ initial, onClose, onSave, saving }) {
  const [f, setF] = useState(initial || {
    name: '',
    phone: '',
    sex: 'M',
    address: '',
    age: '',
    status: 'pending',
  });

  function set(key, value) {
    setF((s) => ({ ...s, [key]: value }));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal modal-lg" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit client' : 'Create client'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Full name</label>
              <input className="input" value={f.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input mono" value={f.phone} onChange={(e) => set('phone', e.target.value)} />
            </div>
            <div className="field">
              <label>Sex</label>
              <select className="select" value={f.sex} onChange={(e) => set('sex', e.target.value)}>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Age</label>
              <input className="input mono" type="number" value={f.age} onChange={(e) => set('age', e.target.value)} />
            </div>
            <div className="field">
              <label>Status</label>
              <select className="select" value={f.status} onChange={(e) => set('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <input className="input" value={f.address} onChange={(e) => set('address', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)} disabled={saving}>{saving ? 'Saving...' : (initial ? 'Save changes' : 'Create client')}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function MembersPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState(null);
  const { token, user } = useAuth();
  const toast = useToast();

  async function loadData() {
    setLoading(true);
    try {
      const ownerId = user?.id || user?._id;
      const clientRes = await getClients({ token: token || undefined, id: ownerId });
      const clientList = Array.isArray(clientRes) ? clientRes : (clientRes?.clients || clientRes?.data || []);
      setClients(clientList.map((c) => ({ ...c, id: c.id || c._id, status: normalizeStatus(c.status) })));
    } catch (err) {
      toast(err.message, 'error');
      setClients([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => clients.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (q && !(`${c.name || ''} ${c.phone_number || ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [clients, q, filter]);

  const counts = useMemo(() => ({
    all: clients.length,
    active: clients.filter((m) => m.status === 'active').length,
    pending: clients.filter((m) => m.status === 'pending').length,
    expired: clients.filter((m) => m.status === 'expired').length,
    deactivated: clients.filter((m) => m.status === 'deactivated').length,
  }), [clients]);

  async function saveClient(data) {
    setSaving(true);
    try {
      const body = {
        name: data.name,
        address: data.address,
        phone_number: data.phone,
        age: Number(data.age || 0),
        sex: data.sex,
        status: data.status,
      };

      if (data.id || data._id) {
        await updateClient(data.id || data._id, body, token || undefined);
        toast('Client updated', 'success');
      } else {
        await createClient(body, token || undefined);
        toast('Client created', 'success');
      }

      setEditing(null);
      await loadData();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function delClient(id) {
    try {
      await deleteClient(id, token || undefined);
      toast('Client deleted', 'success');
      await loadData();
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Client Onboarding</h1>
            <p className="page-sub">Manage your {clients.length} clients</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEditing('new')}>{I.plus} Create Client</button>
        </div>

        <div className="tabs">
          {[['all', 'All'], ['active', 'Active'], ['pending', 'Pending'], ['expired', 'Expired'], ['deactivated', 'Deactivated']].map(([id, l]) => (
            <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>
              {l} <span className="mono" style={{ fontSize: 11, marginLeft: 4, color: 'var(--muted)' }}>{counts[id]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search" style={{ minWidth: 320, flex: 1, maxWidth: 460 }}>
            {I.search}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or phone" />
          </div>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{filtered.length} of {clients.length}</span>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 16 }}>Loading clients...</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th><th>Phone</th><th>Sex</th><th>Age</th><th>Status</th><th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setView(c)}>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Avatar name={c.name || '-'} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{c.name || '-'}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>#{c.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{c.phone_number || '-'}</td>
                    <td>{c.sex || '-'}</td>
                    <td className="mono">{c.age ?? '-'}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm btn-icon" onClick={() => setEditing({
                          id: c.id,
                          name: c.name || '',
                          phone: c.phone_number || '',
                          sex: c.sex || 'M',
                          address: c.address || '',
                          age: c.age || '',
                          status: c.status,
                        })}>{I.edit}</button>
                        <button className="btn btn-sm btn-icon btn-danger" onClick={() => delClient(c.id)}>{I.trash}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editing && <ClientFormModal initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveClient} saving={saving} />}
        {view && (
          <div className="modal-backdrop" onClick={() => setView(null)}>
            <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <div className="modal-header">
                <h2 className="modal-title">{view.name || '-'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}>{I.x}</button>
              </div>
              <div className="modal-body">
                <div className="mono">Phone: {view.phone_number || '-'}</div>
                <div className="mono">Address: {view.address || '-'}</div>
                <div className="mono">Sex: {view.sex || '-'}</div>
                <div className="mono">Age: {view.age ?? '-'}</div>
                <div className="mono">Status: {view.status || '-'}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
