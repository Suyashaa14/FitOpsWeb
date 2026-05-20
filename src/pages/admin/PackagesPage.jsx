import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';

function PackageModal({ initial, onClose, onSave, saving }) {
  const [f, setF] = useState(initial || { name: '', amount: '' });

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
          <div className="field"><label>Amount</label><input className="input mono" type="number" value={f.amount} onChange={e => setF({ ...f, amount: e.target.value })} /></div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)} disabled={saving}>{saving ? 'Saving...' : 'Save package'}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState([]);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const { token, user } = useAuth();
  const toast = useToast();

  async function loadPackages(currentPage = page) {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: String(currentPage), limit: String(limit) });
      if (user?.id || user?._id) query.set('id', String(user.id || user._id));
      const data = await apiRequest(`/api/package/get?${query.toString()}`, { token: token || undefined });
      const list = Array.isArray(data) ? data : (data?.packages || data?.data || []);
      setPkgs(list);
    } catch (err) {
      toast(err.message, 'error');
      setPkgs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPackages(page);
  }, [page]);

  async function save(p) {
    setSaving(true);
    try {
      const payload = { name: p.name, amount: Number(p.amount) };
      if (p.id || p._id) {
        const id = p.id || p._id;
        await apiRequest(`/api/package/update/${id}`, { method: 'PATCH', body: payload, token: token || undefined });
        toast('Package updated', 'success');
      } else {
        await apiRequest('/api/package/create', { method: 'POST', body: payload, token: token || undefined });
        toast('Package created', 'success');
      }
      setEdit(null);
      await loadPackages(page);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function removePackage(pkg) {
    try {
      const id = pkg.id || pkg._id;
      await apiRequest(`/api/package/delete/${id}`, { method: 'DELETE', token: token || undefined });
      toast('Package deleted', 'success');
      await loadPackages(page);
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Packages</h1>
            <p className="page-sub">{pkgs.length} packages</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEdit('new')}>{I.plus} New package</button>
        </div>

        {loading ? (
          <div className="card">Loading packages...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18, marginBottom: 18 }}>
            {pkgs.map((p, idx) => (
              <div key={p.id || p._id || idx} className="card card-hover" style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <span className="chip">Package</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setEdit({ id: p.id || p._id, name: p.name || '', amount: p.amount ?? '' })}>{I.edit}</button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removePackage(p)}>{I.x}</button>
                  </div>
                </div>
                <h3 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-.01em' }}>{p.name || '-'}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, margin: '10px 0 20px' }}>
                  <span className="big-stat" style={{ fontSize: 38 }}>Rs {Number(p.amount || 0).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {!pkgs.length && <div className="card">No packages found.</div>}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Previous</button>
          <button className="btn" onClick={() => setPage(p => p + 1)}>Next</button>
          <span className="mono" style={{ alignSelf: 'center', fontSize: 12 }}>Page {page}</span>
        </div>
      </div>

      <AnimatePresence>
        {edit && <PackageModal initial={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSave={save} saving={saving} />}
      </AnimatePresence>
    </Shell>
  );
}
