import { useEffect, useState } from 'react';
import Shell from '../../components/layout/Shell';
import QRCodeImage from '../../components/ui/QRCodeImage.jsx';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { downloadQrImage } from '../../lib/qr';
import { getAttendance } from '../../lib/adminApi';

const PAGE_SIZE = 10;

function readAttendance(response) {
  if (Array.isArray(response)) return response;
  const source = response?.data ?? response ?? {};
  for (const key of ['attendance', 'attendances', 'records', 'results', 'items']) {
    if (Array.isArray(source?.[key])) return source[key];
  }
  return Array.isArray(source) ? source : [];
}

function readPagination(response, list, page) {
  const source = response?.data ?? response ?? {};
  const meta = source.pagination || source.meta || response?.pagination || response?.meta || {};
  const total = Number(meta.total ?? meta.totalRecords ?? source.total ?? response?.total);
  const pages = Number(meta.totalPages ?? meta.total_pages ?? source.totalPages ?? response?.totalPages);
  return {
    total: Number.isFinite(total) ? total : null,
    totalPages: Number.isFinite(pages) ? pages : null,
    hasNext: typeof meta.hasNextPage === 'boolean'
      ? meta.hasNextPage
      : Number.isFinite(pages) ? page < pages : list.length === PAGE_SIZE,
  };
}

function clientFrom(record) {
  return record?.user_id || record?.userId || record?.client || record?.client_id || record?.clientId || record?.member || record?.user || {};
}

function displayDateTime(value) {
  if (!value) return '-';
  const raw = String(value);
  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return raw;
}

function getCompanyId(user) {
  const companyRef = user?.company_id || user?.company;
  return (
    user?.companyId
    || user?.companyID
    || user?.company_id
    || user?.company?._id
    || user?.company?.id
    || (companyRef && typeof companyRef === 'object' ? companyRef.id || companyRef._id : companyRef)
    || user?.company_id?._id
    || user?.company_id?.id
    || user?._id
    || user?.id
    || ''
  );
}

export default function QRAttendancePage() {
  const { user, token } = useAuth();
  const toast = useToast();
  const companyId = getCompanyId(user);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: null, totalPages: null, hasNext: false });
  const [loading, setLoading] = useState(true);

  const qrUrl = `${window.location.origin}/qr-attendance?companyId=${companyId || 'missing-company-id'}`;

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await getAttendance({ date, search: search.trim(), page, limit: PAGE_SIZE, token: token || undefined });
        const list = readAttendance(response);
        setAttendance(list);
        setPagination(readPagination(response, list, page));
      } catch (err) {
        setAttendance([]);
        setPagination({ total: null, totalPages: null, hasNext: false });
        toast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [date, search, page, toast, token]);

  async function handleDownload() {
    setDownloading(true);
    try {
      await downloadQrImage({
        value: qrUrl,
        filename: `fitops-attendance-${companyId || 'company'}.png`,
      });
      toast('QR downloaded', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Attendance</h1>
            <p className="page-sub">Review all attendance records and manage the check-in QR.</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              className="btn"
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(qrUrl);
                setCopied(true);
                toast('QR URL copied', 'success');
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? 'Copied' : 'Copy QR URL'}
            </button>
            <button className="btn btn-accent" type="button" onClick={handleDownload} disabled={downloading}>
              {downloading ? 'Downloading...' : 'Download QR'}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 22, marginBottom: 18 }}>
          <div className="attendance-qr-card" style={{ display: 'grid', gridTemplateColumns: '170px minmax(0, 1fr)', gap: 24, alignItems: 'center' }}>
            <QRCodeImage value={qrUrl} size={160} alt="QR attendance URL" />
            <div>
              <span className="h-eyebrow"><span className="dot" /> ATTENDANCE QR</span>
              <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, wordBreak: 'break-all', marginBottom: 12 }}>
                {companyId || 'Missing company id in logged-in user token'}
              </div>
              <p style={{ margin: '0 0 14px', color: 'var(--muted)' }}>
                Put this QR at the gym entrance or reception. Clients scan it to open the attendance form and either check in or check out.
              </p>
              <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>
                POST /api/client/attendance/check-in/{companyId || ':companyId'}
              </div>
            </div>
          </div>
        </div>

        <div className="section-title" style={{ marginBottom: 14 }}>
          <div>
            <h3>Attendance list</h3>
            <div className="meta" style={{ marginTop: 4 }}>{pagination.total === null ? `${attendance.length} records on this page` : `${pagination.total} total records`}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search" style={{ minWidth: 280, flex: 1, maxWidth: 440 }}>
            {I.search}<input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search member" />
          </div>
          <input
            className="input mono"
            aria-label="Filter attendance by date"
            type="date"
            value={date}
            onChange={(e) => { setDate(e.target.value); setPage(1); }}
            style={{ width: 170 }}
          />
          {date && <button className="btn btn-sm" type="button" onClick={() => { setDate(''); setPage(1); }}>Clear date</button>}
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden' }}>
          {loading ? <div style={{ padding: 18 }}>Loading attendance...</div> : (
            <table className="table">
              <thead><tr><th>Member</th><th>Check in</th><th>Check out</th><th>Status</th></tr></thead>
              <tbody>
                {attendance.map((record, index) => {
                  const client = clientFrom(record);
                  const checkIn = record.check_in_at || record.checkInAt || record.checkin_at || record.check_in || record.checkIn || record.checked_in_at || record.createdAt;
                  const checkOut = record.check_out_at || record.checkOutAt || record.checkout_at || record.check_out || record.checkOut || record.checked_out_at;
                  return (
                    <tr key={record.id || record._id || `${client.id || client._id || 'attendance'}-${index}`}>
                      <td>{client.name || record.client_name || record.name || '-'}</td>
                      <td className="mono">{displayDateTime(checkIn)}</td>
                      <td className="mono">{displayDateTime(checkOut)}</td>
                      <td><span className="chip"><span className="dot" style={{ color: checkOut ? 'var(--muted)' : 'var(--accent)' }} />{checkOut ? 'Checked out' : 'Checked in'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          {!loading && !attendance.length && <div style={{ padding: 18, color: 'var(--muted)' }}>No attendance records found.</div>}
          {!loading && (page > 1 || pagination.hasNext) && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, padding: 14, borderTop: '1px solid var(--border)' }}>
              <button className="btn btn-sm" type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
              <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>Page {page}{pagination.totalPages ? ` of ${pagination.totalPages}` : ''}</span>
              <button className="btn btn-sm" type="button" disabled={!pagination.hasNext} onClick={() => setPage((value) => value + 1)}>Next</button>
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
}
