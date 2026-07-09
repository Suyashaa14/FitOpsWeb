import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../lib/api';
import { getClientPayments, getClients, getTrainers } from '../../lib/adminApi';

function normalizeStatus(value) {
  const v = (value || '').toLowerCase();
  if (['active', 'pending', 'expired', 'deactivated'].includes(v)) return v;
  return 'pending';
}

function readList(response, keys) {
  if (Array.isArray(response)) return response;
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
  }
  return Array.isArray(response?.data) ? response.data : [];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const query = new URLSearchParams({ page: '1', limit: '100' });

        const [clientRes, trainerRes, packageRes, paymentRes] = await Promise.all([
          getClients({ token: token || undefined }),
          getTrainers({ token: token || undefined }).catch(() => []),
          apiRequest(`/api/package/get?${query.toString()}`, { token: token || undefined }).catch(() => []),
          getClientPayments(token || undefined).catch(() => []),
        ]);

        setClients(readList(clientRes, ['clients']).map((client) => ({ ...client, id: client.id || client._id, status: normalizeStatus(client.status) })));
        setTrainers(readList(trainerRes, ['trainers']).map((trainer) => ({ ...trainer, id: trainer.id || trainer._id, status: normalizeStatus(trainer.status) })));
        setPackages(readList(packageRes, ['packages']));
        setPayments(readList(paymentRes, ['payments']).map((payment) => ({ ...payment, id: payment.id || payment._id })));
      } catch (err) {
        toast(err.message, 'error');
        setClients([]);
        setTrainers([]);
        setPackages([]);
        setPayments([]);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const activeClients = clients.filter((client) => client.status === 'active').length;
    const pendingClients = clients.filter((client) => client.status === 'pending').length;
    const activeTrainers = trainers.filter((trainer) => trainer.status === 'active').length;
    const paymentTotal = payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    return {
      clients: clients.length,
      activeClients,
      pendingClients,
      trainers: trainers.length,
      activeTrainers,
      packages: packages.length,
      payments: payments.length,
      paymentTotal,
    };
  }, [clients, trainers, packages, payments]);

  const recentClients = useMemo(() => clients.slice(0, 6), [clients]);
  const recentTrainers = useMemo(() => trainers.slice(0, 6), [trainers]);

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-sub">{loading ? 'Loading live workspace data...' : 'Live summary from your connected APIs'}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" onClick={() => navigate('/admin/trainers')}>{I.users} Trainers</button>
            <button className="btn btn-accent" onClick={() => navigate('/admin/clients/onboarding')}>{I.plus} Add Client</button>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 22 }}>
          <div className="kpi accent">
            <div className="kpi-label">Clients</div>
            <div className="kpi-value">{stats.clients}</div>
            <div className="kpi-delta">{stats.activeClients} active</div>
            <div className="kpi-glyph">{I.users}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Pending clients</div>
            <div className="kpi-value" style={{ color: '#b45309' }}>{stats.pendingClients}</div>
            <div className="kpi-delta">awaiting action</div>
            <div className="kpi-glyph">{I.clock}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Trainers</div>
            <div className="kpi-value">{stats.trainers}</div>
            <div className="kpi-delta">{stats.activeTrainers} active</div>
            <div className="kpi-glyph">{I.user}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Packages</div>
            <div className="kpi-value">{stats.packages}</div>
            <div className="kpi-delta">available plans</div>
            <div className="kpi-glyph">{I.package}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Payments</div>
            <div className="kpi-value">{stats.payments}</div>
            <div className="kpi-delta">records</div>
            <div className="kpi-glyph">{I.send}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Collected</div>
            <div className="kpi-value">Rs {stats.paymentTotal.toLocaleString()}</div>
            <div className="kpi-delta">from payment API</div>
            <div className="kpi-glyph">{I.trend}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card card-flush" style={{ overflow: 'hidden' }}>
            <div className="section-title" style={{ padding: '16px 16px 0' }}>
              <h3>Clients</h3>
              <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/clients/onboarding')}>View all</a>
            </div>
            <table className="table">
              <thead><tr><th>Name</th><th>Phone</th><th>Status</th></tr></thead>
              <tbody>
                {recentClients.map((client) => (
                  <tr key={client.id}>
                    <td>{client.name || '-'}</td>
                    <td className="mono">{client.phone_number || '-'}</td>
                    <td><StatusBadge status={client.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !recentClients.length && <div style={{ padding: 16, color: 'var(--muted)' }}>No clients found.</div>}
          </div>

          <div className="card card-flush" style={{ overflow: 'hidden' }}>
            <div className="section-title" style={{ padding: '16px 16px 0' }}>
              <h3>Trainers</h3>
              <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/admin/trainers')}>View all</a>
            </div>
            <table className="table">
              <thead><tr><th>Name</th><th>Experience</th><th>Status</th></tr></thead>
              <tbody>
                {recentTrainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td>{trainer.name || '-'}</td>
                    <td>{trainer.experience || '-'}</td>
                    <td><StatusBadge status={trainer.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !recentTrainers.length && <div style={{ padding: 16, color: 'var(--muted)' }}>No trainers found.</div>}
          </div>
        </div>
      </div>
    </Shell>
  );
}
