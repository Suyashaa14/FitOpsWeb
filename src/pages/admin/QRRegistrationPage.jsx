import { useEffect, useState } from 'react';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import QRCodeImage from '../../components/ui/QRCodeImage.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createQrClient } from '../../lib/adminApi';

function getCompanyId(user) {
  const companyRef = user?.company_id || user?.company;
  if (user?.companyId) return user.companyId;
  if (companyRef && typeof companyRef === 'object') return companyRef.id || companyRef._id || '';
  return companyRef || '';
}

export default function QRRegistrationPage() {
  const { token, user } = useAuth();
  const toast = useToast();
  const companyId = getCompanyId(user);
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdClients, setCreatedClients] = useState([]);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    age: '',
    sex: 'M',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState('');

  const qrUrl = `${window.location.origin}/admin/qr-register?companyId=${companyId || 'missing-company-id'}`;

  useEffect(() => {
    if (!(form.photo instanceof File)) {
      setPhotoPreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(form.photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.photo]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submitClient(e) {
    e.preventDefault();
    if (!companyId) {
      toast('Missing company id for QR client creation', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        phone_number: form.phone_number,
        age: Number(form.age || 0),
        sex: form.sex,
        photo: form.photo || undefined,
      };
      const response = await createQrClient(companyId, payload, token || undefined);
      const savedClient = response?.client || response?.data || response || payload;
      setCreatedClients((prev) => [{ ...savedClient, id: savedClient.id || savedClient._id || Date.now() }, ...prev].slice(0, 8));
      setForm({ name: '', address: '', phone_number: '', age: '', sex: 'M', photo: null });
      toast('QR client created', 'success');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Client Create</h1>
            <p className="page-sub">Create clients through the company-specific QR endpoint.</p>
          </div>
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
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: 18 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36, textAlign: 'center' }}>
            <span className="h-eyebrow"><span className="dot" /> COMPANY ID</span>
            <div style={{ margin: '24px 0' }}>
              <QRCodeImage value={qrUrl} alt="QR client create URL" />
            </div>
            <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, wordBreak: 'break-all' }}>
              {companyId || 'Missing company id in logged-in user'}
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12, wordBreak: 'break-all' }}>
              POST /api/client/create/{companyId || ':companyId'}
            </div>
          </div>

          <div className="card">
            <div className="section-title"><h3>Create QR client</h3><span className="meta">live API</span></div>
            <form onSubmit={submitClient} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Full name</label>
                <input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
              </div>
              <div className="field">
                <label>Phone</label>
                <input className="input mono" value={form.phone_number} onChange={(e) => setField('phone_number', e.target.value)} required />
              </div>
              <div className="field">
                <label>Sex</label>
                <select className="select" value={form.sex} onChange={(e) => setField('sex', e.target.value)}>
                  <option value="M">M</option>
                  <option value="F">F</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="field">
                <label>Age</label>
                <input className="input mono" type="number" value={form.age} onChange={(e) => setField('age', e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Address</label>
                <input className="input" value={form.address} onChange={(e) => setField('address', e.target.value)} />
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Photo</label>
                <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 14, background: 'var(--surface-2)' }}>
                  <input
                    id="qr-client-photo-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => setField('photo', e.target.files?.[0] || null)}
                  />
                  {!photoPreview ? (
                    <label htmlFor="qr-client-photo-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', padding: '14px 8px' }}>
                      {I.plus}<span>Upload client photo</span>
                    </label>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <img src={photoPreview} alt="Client photo preview" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{form.photo?.name || 'Selected photo'}</div>
                        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                          <label htmlFor="qr-client-photo-upload" className="btn btn-sm" style={{ cursor: 'pointer' }}>Replace</label>
                          <button className="btn btn-ghost btn-sm" type="button" onClick={() => setField('photo', null)}>Clear file</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-accent" type="submit" disabled={saving || !companyId}>{saving ? 'Creating...' : 'Create Client'}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="card card-flush" style={{ overflow: 'hidden', marginTop: 18 }}>
          <div className="section-title" style={{ padding: '16px 16px 0' }}><h3>Created in this session</h3><span className="meta">{createdClients.length}</span></div>
          <table className="table">
            <thead><tr><th>Name</th><th>Phone</th><th>Sex</th><th>Age</th></tr></thead>
            <tbody>
              {createdClients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name || '-'}</td>
                  <td className="mono">{client.phone_number || '-'}</td>
                  <td>{client.sex || '-'}</td>
                  <td className="mono">{client.age ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!createdClients.length && <div style={{ padding: 16, color: 'var(--muted)' }}>No QR clients created in this session.</div>}
        </div>
      </div>
    </Shell>
  );
}
