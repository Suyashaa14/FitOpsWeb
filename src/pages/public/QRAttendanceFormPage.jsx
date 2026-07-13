import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { checkInClientAttendance, checkOutClientAttendance } from '../../lib/adminApi';
import { useToast } from '../../context/ToastContext';

function nowForInput() {
  const now = new Date();
  const offsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - offsetMs).toISOString().slice(0, 16);
}

function readAttendanceId(payload) {
  const data = payload?.attendance || payload?.data || payload;
  return data?.id || data?._id || data?.attendance_id || data?.attendanceId || '';
}

function PublicFrame({ children }) {
  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

function attendanceStorageKey(companyId, phoneNumber) {
  return `fitops_attendance_${companyId}_${phoneNumber}`;
}

export default function QRAttendanceFormPage() {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId') || '';
  const [phoneNumber, setPhoneNumber] = useState('');
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const normalizedPhone = phoneNumber.trim();
  const storedAttendanceId = useMemo(() => {
    if (!companyId || !normalizedPhone) return '';
    return localStorage.getItem(attendanceStorageKey(companyId, normalizedPhone)) || '';
  }, [companyId, normalizedPhone]);
  const mode = storedAttendanceId ? 'checkout' : 'checkin';

  async function handleCheckIn(e) {
    e.preventDefault();
    if (!companyId) {
      toast('This QR link is missing the company id', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        phone_number: normalizedPhone,
        check_in: nowForInput(),
      };
      const response = await checkInClientAttendance(companyId, payload);
      const attendanceId = readAttendanceId(response);
      if (attendanceId) {
        localStorage.setItem(attendanceStorageKey(companyId, normalizedPhone), attendanceId);
      }
      setStatusMessage('Check-in successful. Scan again later with the same phone number to check out.');
      toast('Client checked in', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleCheckOut(e) {
    e.preventDefault();
    if (!storedAttendanceId) {
      toast('No active attendance record found for this phone number', 'error');
      return;
    }

    setSaving(true);
    try {
      await checkOutClientAttendance(storedAttendanceId, { check_out: nowForInput() });
      localStorage.removeItem(attendanceStorageKey(companyId, normalizedPhone));
      setStatusMessage('Check-out successful. Thank you.');
      setPhoneNumber('');
      toast('Client checked out', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <PublicFrame>
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Attendance</h1>
            <p className="page-sub">Enter your phone number to check in or check out.</p>
          </div>
        </div>

        <div className="card" style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-title">
            <h3>{mode === 'checkout' ? 'Check out' : 'Check in'}</h3>
            <span className="meta">live API</span>
          </div>
          {!companyId && (
            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: '#fff4e5', color: '#9a5b00', border: '1px solid #ffd08a', fontSize: 13 }}>
              This QR link is missing the company id. Please scan the correct QR provided by the gym owner.
            </div>
          )}
          {!!statusMessage && (
            <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#eefbf1', color: '#176534', border: '1px solid #b7e4c7', fontSize: 13 }}>
              {statusMessage}
            </div>
          )}
          <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: 'var(--surface-2)', color: 'var(--muted)', fontSize: 13 }}>
            Use the same phone number each time. If an active attendance record is found on this device, the check-out form will open automatically.
          </div>

          <form className="responsive-form-grid" onSubmit={mode === 'checkout' ? handleCheckOut : handleCheckIn} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label>Phone number</label>
              <input
                className="input mono"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label>{mode === 'checkout' ? 'Check-out time' : 'Check-in time'}</label>
              <input
                className="input mono"
                type="datetime-local"
                value={nowForInput()}
                disabled
              />
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>Date and time are set automatically.</span>
            </div>
            {mode === 'checkout' && (
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Active attendance ID</label>
                <input className="input mono" value={storedAttendanceId} readOnly />
              </div>
            )}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-accent" type="submit" disabled={saving || !companyId}>
                {saving ? (mode === 'checkout' ? 'Checking out...' : 'Checking in...') : (mode === 'checkout' ? 'Check Out' : 'Check In')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PublicFrame>
  );
}
