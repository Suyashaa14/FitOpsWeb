import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createTrainer, deleteTrainer, getTrainers, updateTrainer } from '../../lib/adminApi';

function normalizeStatus(value) {
  const v = (value || '').toLowerCase();
  if (['active', 'pending', 'expired', 'deactivated'].includes(v)) return v;
  return 'pending';
}

function TrainerFormModal({ initial, onClose, onSave, saving }) {
  const [f, setF] = useState(initial || {
    name: '',
    phone: '',
    experience: '',
    sex: 'M',
    address: '',
    age: '',
    status: 'pending',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState('');

  function set(key, value) {
    setF((s) => ({ ...s, [key]: value }));
  }

  useEffect(() => {
    if (!(f.photo instanceof File)) {
      setPhotoPreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(f.photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [f.photo]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal modal-lg" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit trainer' : 'Create trainer'}</h2>
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
              <label>Experience</label>
              <input className="input" value={f.experience} onChange={(e) => set('experience', e.target.value)} />
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
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Photo</label>
              <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 14, background: 'var(--surface-2)' }}>
                <input
                  id="trainer-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => set('photo', e.target.files?.[0] || null)}
                />

                {!photoPreview && (
                  <label
                    htmlFor="trainer-photo-upload"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '18px 8px' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', background: 'var(--surface)' }}>
                      {I.plus}
                    </div>
                    <div style={{ fontWeight: 600 }}>Upload trainer photo</div>
                    <div className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>PNG, JPG, WEBP</div>
                  </label>
                )}

                {photoPreview && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={photoPreview}
                      alt="Trainer photo preview"
                      style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', background: 'white' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{f.photo?.name || 'Selected photo'}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <label htmlFor="trainer-photo-upload" className="btn btn-sm" style={{ cursor: 'pointer' }}>Replace</label>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => set('photo', null)}>
                          Clear file
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)} disabled={saving}>{saving ? 'Saving...' : (initial ? 'Save changes' : 'Create trainer')}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function TrainersPage() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState(null);
  const { token } = useAuth();
  const toast = useToast();

  async function loadData() {
    setLoading(true);
    try {
      const trainerRes = await getTrainers({ token: token || undefined });
      const trainerList = Array.isArray(trainerRes) ? trainerRes : (trainerRes?.trainers || trainerRes?.data || []);
      setTrainers(trainerList.map((t) => ({ ...t, id: t.id || t._id, status: normalizeStatus(t.status) })));
    } catch (err) {
      toast(err.message, 'error');
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => trainers.filter((trainer) => {
    if (filter !== 'all' && trainer.status !== filter) return false;
    if (q && !(`${trainer.name || ''} ${trainer.phone_number || ''} ${trainer.experience || ''}`.toLowerCase().includes(q.toLowerCase()))) return false;
    return true;
  }), [trainers, q, filter]);

  const counts = useMemo(() => ({
    all: trainers.length,
    active: trainers.filter((trainer) => trainer.status === 'active').length,
    pending: trainers.filter((trainer) => trainer.status === 'pending').length,
    expired: trainers.filter((trainer) => trainer.status === 'expired').length,
    deactivated: trainers.filter((trainer) => trainer.status === 'deactivated').length,
  }), [trainers]);

  async function saveTrainer(data) {
    setSaving(true);
    try {
      const body = {
        name: data.name,
        address: data.address,
        experience: data.experience,
        phone_number: data.phone,
        age: Number(data.age || 0),
        sex: data.sex,
        status: data.status,
        photo: data.photo || undefined,
      };

      if (data.id || data._id) {
        await updateTrainer(data.id || data._id, body, token || undefined);
        toast('Trainer updated', 'success');
      } else {
        await createTrainer(body, token || undefined);
        toast('Trainer created', 'success');
      }

      setEditing(null);
      await loadData();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function delTrainer(id) {
    try {
      await deleteTrainer(id, token || undefined);
      toast('Trainer deleted', 'success');
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
            <h1 className="page-title">Trainers</h1>
            <p className="page-sub">Manage your {trainers.length} trainers</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEditing('new')}>{I.plus} Create Trainer</button>
        </div>

        <div className="tabs">
          {[['all', 'All'], ['active', 'Active'], ['pending', 'Pending'], ['expired', 'Expired'], ['deactivated', 'Deactivated']].map(([id, label]) => (
            <div key={id} className={`tab ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>
              {label} <span className="mono" style={{ fontSize: 11, marginLeft: 4, color: 'var(--muted)' }}>{counts[id]}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search" style={{ minWidth: 320, flex: 1, maxWidth: 460 }}>
            {I.search}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, or experience" />
          </div>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{filtered.length} of {trainers.length}</span>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 16 }}>Loading trainers...</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Trainer</th><th>Phone</th><th>Experience</th><th>Sex</th><th>Age</th><th>Status</th><th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((trainer) => (
                  <tr key={trainer.id} style={{ cursor: 'pointer' }} onClick={() => setView(trainer)}>
                    <td>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                        <Avatar name={trainer.name || '-'} size="sm" />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{trainer.name || '-'}</div>
                          <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>#{trainer.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">{trainer.phone_number || '-'}</td>
                    <td>{trainer.experience || '-'}</td>
                    <td>{trainer.sex || '-'}</td>
                    <td className="mono">{trainer.age ?? '-'}</td>
                    <td><StatusBadge status={trainer.status} /></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm btn-icon" onClick={() => setEditing({
                          id: trainer.id,
                          name: trainer.name || '',
                          phone: trainer.phone_number || '',
                          experience: trainer.experience || '',
                          sex: trainer.sex || 'M',
                          address: trainer.address || '',
                          age: trainer.age || '',
                          status: trainer.status,
                          photo: null,
                        })}>{I.edit}</button>
                        <button className="btn btn-sm btn-icon btn-danger" onClick={() => delTrainer(trainer.id)}>{I.trash}</button>
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
        {editing && <TrainerFormModal initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={saveTrainer} saving={saving} />}
        {view && (
          <div className="modal-backdrop" onClick={() => setView(null)}>
            <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <div className="modal-header">
                <h2 className="modal-title">{view.name || '-'}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}>{I.x}</button>
              </div>
              <div className="modal-body">
                <div className="mono">Phone: {view.phone_number || '-'}</div>
                <div className="mono">Experience: {view.experience || '-'}</div>
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
