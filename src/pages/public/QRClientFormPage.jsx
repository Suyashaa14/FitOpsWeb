import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createQrClient } from '../../lib/adminApi';

function PublicFrame({ children }) {
  return (
    <div style={{ minHeight: '100vh', padding: '32px 16px', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {children}
      </div>
    </div>
  );
}

export default function QRClientFormPage() {
  const { token } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get('companyId') || '';
  const [saving, setSaving] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    phone_number: '',
    age: '',
    sex: 'M',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState('');

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
      toast('This QR link is missing the company id', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim(),
        phone_number: form.phone_number.trim(),
        age: form.age === '' ? '' : Number(form.age),
        sex: form.sex,
        photo: form.photo || undefined,
      };
      await createQrClient(companyId, payload, token || undefined);
      setForm({ name: '', address: '', phone_number: '', age: '', sex: 'M', photo: null });
      setSubmitSuccess(true);
      toast('Client created successfully', 'success');
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
            <h1 className="page-title">Create Client</h1>
            <p className="page-sub">Fill out this form to register with the gym.</p>
          </div>
        </div>

        <div className="card">
          <div className="section-title"><h3>Client registration</h3><span className="meta">live API</span></div>
          {!companyId && (
            <div style={{ marginBottom: 14, padding: '10px 12px', borderRadius: 10, background: '#fff4e5', color: '#9a5b00', border: '1px solid #ffd08a', fontSize: 13 }}>
              This QR link is missing the company id. Please scan the correct QR provided by the gym owner.
            </div>
          )}
          {submitSuccess && (
            <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 10, background: '#eefbf1', color: '#176534', border: '1px solid #b7e4c7', fontSize: 13 }}>
              Your registration was submitted successfully.
            </div>
          )}
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
                  id="public-qr-client-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setField('photo', e.target.files?.[0] || null)}
                />
                {!photoPreview ? (
                  <label htmlFor="public-qr-client-photo-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', padding: '14px 8px' }}>
                    {I.plus}<span>Upload client photo</span>
                  </label>
                ) : (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={photoPreview} alt="Client photo preview" style={{ width: 70, height: 70, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{form.photo?.name || 'Selected photo'}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <label htmlFor="public-qr-client-photo-upload" className="btn btn-sm" style={{ cursor: 'pointer' }}>Replace</label>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setField('photo', null)}>Clear file</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-accent" type="submit" disabled={saving || !companyId}>
                {saving ? 'Creating...' : 'Create Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PublicFrame>
  );
}
