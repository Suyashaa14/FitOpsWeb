import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import {
  createClientPayment,
  deleteClientPayment,
  getClientPayments,
  getClients,
  updateClientPayment,
} from '../../lib/adminApi';

function PaymentFormModal({ initial, onClose, onSave, saving, clients, packages }) {
  const [f, setF] = useState(initial || {
    client_id: '',
    package_id: '',
    amount: '',
    payment_date: new Date().toISOString().slice(0, 10),
    start_at: '',
    end_at: '',
  });

  useEffect(() => {
    if (!f.client_id && clients.length) {
      setF((s) => ({ ...s, client_id: String(clients[0].id || clients[0]._id) }));
    }
    if (!f.package_id && packages.length) {
      setF((s) => ({ ...s, package_id: String(packages[0].id || packages[0]._id), amount: packages[0].amount ?? s.amount }));
    }
  }, [clients, packages]);

  function set(key, value) {
    setF((s) => ({ ...s, [key]: value }));
  }

  function onPackageChange(val) {
    const selected = packages.find((p) => String(p.id || p._id) === String(val));
    setF((s) => ({ ...s, package_id: val, amount: selected?.amount ?? s.amount }));
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal modal-lg" onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit payment' : 'Create payment'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Client</label>
              <select className="select" value={f.client_id} onChange={(e) => set('client_id', e.target.value)}>
                {clients.map((c) => (
                  <option key={c.id || c._id} value={String(c.id || c._id)}>{c.name || 'Unnamed'} - {c.phone_number || '-'}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Package</label>
              <select className="select" value={f.package_id} onChange={(e) => onPackageChange(e.target.value)}>
                {packages.map((p) => (
                  <option key={p.id || p._id} value={String(p.id || p._id)}>{p.name} - Rs {Number(p.amount || 0).toLocaleString()}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Amount</label>
              <input className="input mono" type="number" value={f.amount} onChange={(e) => set('amount', e.target.value)} />
            </div>
            <div className="field">
              <label>Payment date</label>
              <input className="input mono" type="date" value={f.payment_date} onChange={(e) => set('payment_date', e.target.value)} />
            </div>
            <div className="field">
              <label>Start date</label>
              <input className="input mono" type="date" value={f.start_at || ''} onChange={(e) => set('start_at', e.target.value)} />
            </div>
            <div className="field">
              <label>End date</label>
              <input className="input mono" type="date" value={f.end_at || ''} onChange={(e) => set('end_at', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)} disabled={saving}>{saving ? 'Saving...' : (initial ? 'Save changes' : 'Create payment')}</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClientPaymentPage() {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState(null);
  const { token, user } = useAuth();
  const toast = useToast();

  function dateOnly(v) {
    if (!v) return '-';
    const s = String(v);
    return s.includes('T') ? s.slice(0, 10) : s;
  }

  async function loadData() {
    setLoading(true);
    try {
      const ownerId = user?.id || user?._id;
      const [paymentRes, clientRes, pkgRes] = await Promise.all([
        getClientPayments(token || undefined).catch(() => []),
        getClients({ token: token || undefined, id: ownerId }),
        apiRequest('/api/package/get?page=1&limit=100', { token: token || undefined }).catch(() => []),
      ]);

      const paymentList = Array.isArray(paymentRes) ? paymentRes : (paymentRes?.payments || paymentRes?.data || []);
      const clientList = Array.isArray(clientRes) ? clientRes : (clientRes?.clients || clientRes?.data || []);
      const packageList = Array.isArray(pkgRes) ? pkgRes : (pkgRes?.packages || pkgRes?.data || []);

      setPayments(paymentList.map((p) => ({ ...p, id: p.id || p._id })));
      setClients(clientList);
      setPackages(packageList);
    } catch (err) {
      toast(err.message, 'error');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const joined = useMemo(() => payments.map((p) => {
    const rawClientId = p.client_id?._id || p.client_id?.id || p.client_id || p.clientId || p.client?.id || p.client?._id;
    const rawPackageId = p.package_id?._id || p.package_id?.id || p.package_id || p.packageId || p.package?.id || p.package?._id;
    const client = clients.find((c) => String(c.id || c._id) === String(rawClientId));
    const pkg = packages.find((x) => String(x.id || x._id) === String(rawPackageId));
    return {
      ...p,
      clientName: client?.name || p.client_id?.name || p.client?.name || '-',
      clientPhone: client?.phone_number || p.client_id?.phone_number || p.client?.phone_number || '-',
      packageName: pkg?.name || p.package_id?.name || p.package?.name || '-',
    };
  }), [payments, clients, packages]);

  const filtered = useMemo(() => joined.filter((p) => {
    if (!q) return true;
    const text = `${p.clientName} ${p.clientPhone} ${p.packageName}`.toLowerCase();
    return text.includes(q.toLowerCase());
  }), [joined, q]);

  async function savePayment(data) {
    setSaving(true);
    try {
      const body = {
        client_id: data.client_id,
        package_id: data.package_id,
        amount: Number(data.amount || 0),
        payment_date: data.payment_date || null,
        start_at: data.start_at || null,
        end_at: data.end_at || null,
      };

      if (data.id || data._id) {
        await updateClientPayment(data.id || data._id, body, token || undefined);
        toast('Payment updated', 'success');
      } else {
        await createClientPayment(body, token || undefined);
        toast('Payment created', 'success');
      }

      setEditing(null);
      await loadData();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function delPayment(id) {
    try {
      await deleteClientPayment(id, token || undefined);
      toast('Payment deleted', 'success');
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
            <h1 className="page-title">Client Payments</h1>
            <p className="page-sub">Manage payment records and membership periods</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEditing('new')}>{I.plus} Create Payment</button>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search" style={{ minWidth: 320, flex: 1, maxWidth: 460 }}>
            {I.search}<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search client or package" />
          </div>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{filtered.length} of {joined.length}</span>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 16 }}>Loading payments...</div> : (
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th><th>Phone</th><th>Package</th><th>Amount</th><th>Payment Date</th><th>End Date</th><th style={{ width: 80 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => setView(p)}>
                    <td>{p.clientName}</td>
                    <td className="mono">{p.clientPhone}</td>
                    <td><span className="chip">{p.packageName}</span></td>
                    <td className="mono">Rs {Number(p.amount || 0).toLocaleString()}</td>
                    <td className="mono">{dateOnly(p.payment_date)}</td>
                    <td className="mono">{dateOnly(p.end_at)}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                        <button className="btn btn-sm btn-icon" onClick={() => setEditing({
                          id: p.id,
                          client_id: String(p.client_id?._id || p.client_id?.id || p.client_id || p.clientId || p.client?.id || p.client?._id || ''),
                          package_id: String(p.package_id?._id || p.package_id?.id || p.package_id || p.packageId || p.package?.id || p.package?._id || ''),
                          amount: p.amount || '',
                          payment_date: p.payment_date || new Date().toISOString().slice(0, 10),
                          start_at: p.start_at || '',
                          end_at: p.end_at || '',
                        })}>{I.edit}</button>
                        <button className="btn btn-sm btn-icon btn-danger" onClick={() => delPayment(p.id)}>{I.trash}</button>
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
        {editing && <PaymentFormModal initial={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSave={savePayment} saving={saving} clients={clients} packages={packages} />}
        {view && (
          <div className="modal-backdrop" onClick={() => setView(null)}>
            <motion.div className="modal" onClick={(e) => e.stopPropagation()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <div className="modal-header">
                <h2 className="modal-title">{view.clientName}</h2>
                <button className="btn btn-ghost btn-icon" onClick={() => setView(null)}>{I.x}</button>
              </div>
              <div className="modal-body">
                <div className="mono">Package: {view.packageName || '-'}</div>
                <div className="mono">Amount: Rs {Number(view.amount || 0).toLocaleString()}</div>
                <div className="mono">Payment: {view.payment_date || '-'}</div>
                <div className="mono">Start: {view.start_at || '-'}</div>
                <div className="mono">End: {view.end_at || '-'}</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Shell>
  );
}
