import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getGymOwners } from '../../lib/superAdminApi';

function toDateInput(value) {
  if (!value) return '';
  const stringValue = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) return stringValue;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
}

function extractOwners(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  if (payload.data && !Array.isArray(payload.data) && typeof payload.data === 'object') {
    return [payload.data];
  }

  const likelyKeys = ['users', 'data', 'result', 'items', 'rows', 'gymOwners'];
  for (const key of likelyKeys) {
    if (Array.isArray(payload[key])) return payload[key];
  }

  const firstArray = Object.values(payload).find(Array.isArray);
  if (firstArray) return firstArray;

  if (payload.id || payload._id) return [payload];
  return [];
}

function normalizeOwner(row = {}) {
  const companyRef = row.company_id;
  const company =
    (companyRef && typeof companyRef === 'object' ? companyRef : null)
    || row.company
    || row.company_data
    || row.companyData
    || row;

  return {
    id: row.id || row._id || row.user_id || row.userId || company.user_id || company.userId,
    company_name: company.company_name || company.name || '-',
    company_url: company.company_url || company.url || '',
    company_address: company.company_address || company.address || '',
    company_phone_number: company.company_phone_number || company.phone_number || company.phone || '',
    company_package_start_at: toDateInput(company.company_package_start_at || company.start_at || company.package_start_at),
    company_package_end_at: toDateInput(company.company_package_end_at || company.expire_at || company.package_end_at),
    name: row.name || row.owner_name || row.full_name || '-',
    email: row.email || '-',
    status: (row.status || row.account_status || company.status || 'active').toLowerCase(),
  };
}

export default function SuperOverview() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const toast = useToast();
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOwners() {
    setLoading(true);
    try {
      const response = await getGymOwners({ token: token || undefined, page: 1, limit: 100 });
      const list = extractOwners(response).map(normalizeOwner).filter((owner) => owner.id);
      setOwners(list);
    } catch (err) {
      toast(err.message, 'error');
      setOwners([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOwners();
  }, []);

  const stats = useMemo(() => {
    const active = owners.filter((owner) => owner.status === 'active').length;
    const inactive = owners.filter((owner) => owner.status !== 'active').length;
    const withActivePackage = owners.filter((owner) => owner.company_package_start_at || owner.company_package_end_at).length;
    return {
      total: owners.length,
      active,
      inactive,
      withActivePackage,
    };
  }, [owners]);

  const recentOwners = useMemo(() => owners.slice(0, 8), [owners]);

  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Super Admin Overview</h1>
            <p className="page-sub">{loading ? 'Loading live platform data...' : 'Live gym owner summary from the super admin API'}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn" type="button" onClick={loadOwners} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="btn btn-accent" type="button" onClick={() => navigate('/super/gyms')}>
              {I.plus} Create Gym Owner
            </button>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 22 }}>
          <div className="kpi accent">
            <div className="kpi-label">Total gyms</div>
            <div className="kpi-value">{stats.total}</div>
            <div className="kpi-delta">from gym owner API</div>
            <div className="kpi-glyph">{I.building}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Active gyms</div>
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>{stats.active}</div>
            <div className="kpi-delta">status active</div>
            <div className="kpi-glyph">{I.check}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Inactive gyms</div>
            <div className="kpi-value" style={{ color: stats.inactive ? 'var(--danger)' : 'var(--ink)' }}>{stats.inactive}</div>
            <div className="kpi-delta">non-active statuses</div>
            <div className="kpi-glyph">{I.clock}</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Package dates</div>
            <div className="kpi-value">{stats.withActivePackage}</div>
            <div className="kpi-delta">gyms with package data</div>
            <div className="kpi-glyph">{I.calendar}</div>
          </div>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          <div className="section-title" style={{ padding: '16px 16px 0' }}>
            <h3>Recent gym owners</h3>
            <a style={{ fontSize: 12.5, color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }} onClick={() => navigate('/super/gyms')}>View all gyms</a>
          </div>
          <table className="table">
            <thead>
              <tr><th>Gym</th><th>Owner</th><th>Email</th><th>Phone</th><th>Package</th><th>Status</th></tr>
            </thead>
            <tbody>
              {recentOwners.map((owner) => (
                <tr key={owner.id}>
                  <td><strong>{owner.company_name}</strong></td>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td className="mono">{owner.company_phone_number || '-'}</td>
                  <td className="mono">{owner.company_package_start_at || '-'} to {owner.company_package_end_at || '-'}</td>
                  <td><StatusBadge status={owner.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !recentOwners.length && <div style={{ padding: 16, color: 'var(--muted)' }}>No gym owners found.</div>}
        </div>
      </div>
    </Shell>
  );
}
