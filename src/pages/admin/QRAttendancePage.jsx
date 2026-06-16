import { useState } from 'react';
import Shell from '../../components/layout/Shell';
import { StatusBadge, I } from '../../components/ui/index.jsx';
import QRCodeImage from '../../components/ui/QRCodeImage.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { checkInClientAttendance, checkOutClientAttendance } from '../../lib/adminApi';

function getCompanyId(user) {
  const companyRef = user?.company_id || user?.company;
  if (user?.companyId) return user.companyId;
  if (companyRef && typeof companyRef === 'object') return companyRef.id || companyRef._id || '';
  return companyRef || '';
}

function nowForInput() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

function readAttendanceId(payload) {
  const data = payload?.attendance || payload?.data || payload;
  return data?.id || data?._id || data?.attendance_id || data?.attendanceId || '';
}

export default function QRAttendancePage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const companyId = getCompanyId(user);
  const [checkInForm, setCheckInForm] = useState({ phone_number: '', check_in: nowForInput() });
  const [checkOutForm, setCheckOutForm] = useState({ attendance_id: '', check_out: nowForInput() });
  const [savingCheckIn, setSavingCheckIn] = useState(false);
  const [savingCheckOut, setSavingCheckOut] = useState(false);
  const [events, setEvents] = useState([]);
  const checkInUrl = `${window.location.origin}/admin/qr-attendance?companyId=${companyId || 'missing-company-id'}`;

  async function submitCheckIn(e) {
    e.preventDefault();
    if (!companyId) {
      toast('Missing company id for attendance check-in', 'error');
      return;
    }

    setSavingCheckIn(true);
    try {
      const payload = {
        phone_number: checkInForm.phone_number,
        check_in: checkInForm.check_in,
      };
      const response = await checkInClientAttendance(companyId, payload, token || undefined);
      const attendanceId = readAttendanceId(response);
      setEvents((prev) => [{
        id: attendanceId || Date.now(),
        type: 'check-in',
        phone_number: payload.phone_number,
        at: payload.check_in,
        attendance_id: attendanceId,
        status: 'active',
      }, ...prev].slice(0, 10));
      setCheckInForm({ phone_number: '', check_in: nowForInput() });
      if (attendanceId) setCheckOutForm((prev) => ({ ...prev, attendance_id: attendanceId }));
      toast('Client checked in', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingCheckIn(false);
    }
  }

  async function submitCheckOut(e) {
    e.preventDefault();
    if (!checkOutForm.attendance_id) {
      toast('Attendance id is required for check-out', 'error');
      return;
    }

    setSavingCheckOut(true);
    try {
      const payload = { check_out: checkOutForm.check_out };
      await checkOutClientAttendance(checkOutForm.attendance_id, payload, token || undefined);
      setEvents((prev) => [{
        id: `${checkOutForm.attendance_id}-${payload.check_out}`,
        type: 'check-out',
        phone_number: '-',
        at: payload.check_out,
        attendance_id: checkOutForm.attendance_id,
        status: 'deactivated',
      }, ...prev].slice(0, 10));
      setCheckOutForm({ attendance_id: '', check_out: nowForInput() });
      toast('Client checked out', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSavingCheckOut(false);
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Attendance</h1>
            <p className="page-sub">Run live check-ins and check-outs through the attendance APIs.</p>
          </div>
          <span className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>Company: {companyId || '-'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 18 }}>
          <div className="card" style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 32, textAlign: 'center', borderColor: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
            <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: .05 }} />
            <span className="h-eyebrow" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--lime)', borderColor: 'rgba(255,255,255,.1)' }}>
              <span className="dot" /> ATTENDANCE MODE
            </span>
            <div style={{ background: 'white', padding: 20, borderRadius: 16, display: 'inline-flex', margin: '20px 0', position: 'relative' }}>
              <div className="pulse-ring" style={{ borderRadius: 16 }} />
              <QRCodeImage value={checkInUrl} alt="QR attendance URL" />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,.6)', wordBreak: 'break-all' }}>
              POST /api/client/attendance/check-in/{companyId || ':companyId'}
            </div>
          </div>

          <div style={{ display: 'grid', gap: 18 }}>
            <div className="card">
              <div className="section-title"><h3>Check in</h3><span className="meta">company id</span></div>
              <form onSubmit={submitCheckIn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Phone number</label>
                  <input
                    className="input mono"
                    value={checkInForm.phone_number}
                    onChange={(e) => setCheckInForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label>Check-in time</label>
                  <input
                    className="input mono"
                    type="datetime-local"
                    value={checkInForm.check_in}
                    onChange={(e) => setCheckInForm((prev) => ({ ...prev, check_in: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-accent" type="submit" disabled={savingCheckIn || !companyId}>{savingCheckIn ? 'Checking in...' : 'Check In'}</button>
                </div>
              </form>
            </div>

            <div className="card">
              <div className="section-title"><h3>Check out</h3><span className="meta">attendance id</span></div>
              <form onSubmit={submitCheckOut} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="field">
                  <label>Attendance ID</label>
                  <input
                    className="input mono"
                    value={checkOutForm.attendance_id}
                    onChange={(e) => setCheckOutForm((prev) => ({ ...prev, attendance_id: e.target.value }))}
                    required
                  />
                </div>
                <div className="field">
                  <label>Check-out time</label>
                  <input
                    className="input mono"
                    type="datetime-local"
                    value={checkOutForm.check_out}
                    onChange={(e) => setCheckOutForm((prev) => ({ ...prev, check_out: e.target.value }))}
                    required
                  />
                </div>
                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn btn-accent" type="submit" disabled={savingCheckOut}>{savingCheckOut ? 'Checking out...' : 'Check Out'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden', marginTop: 18 }}>
          <div className="section-title" style={{ padding: '16px 16px 0' }}><h3>Attendance events this session</h3><span className="meta">{events.length}</span></div>
          <table className="table">
            <thead><tr><th>Event</th><th>Phone</th><th>Time</th><th>Attendance ID</th><th>Status</th></tr></thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td>{event.type}</td>
                  <td className="mono">{event.phone_number}</td>
                  <td className="mono">{event.at}</td>
                  <td className="mono">{event.attendance_id || '-'}</td>
                  <td><StatusBadge status={event.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!events.length && <div style={{ padding: 16, color: 'var(--muted)' }}>No attendance events in this session.</div>}
        </div>
      </div>
    </Shell>
  );
}
