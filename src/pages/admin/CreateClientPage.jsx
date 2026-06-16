import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { createClient } from '../../lib/adminApi';

const initialState = {
  name: '',
  phone_number: '',
  sex: 'M',
  address: '',
  age: '',
  status: 'pending',
  photo: null,
};

export default function CreateClientPage() {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuth();

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  useEffect(() => {
    if (!(form.photo instanceof File)) {
      setPhotoPreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(form.photo);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.photo]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return toast('Name is required', 'error');
    if (!form.phone_number.trim()) return toast('Phone is required', 'error');

    setSaving(true);
    try {
      await createClient({
        name: form.name.trim(),
        phone_number: form.phone_number.trim(),
        sex: form.sex,
        address: form.address.trim(),
        age: Number(form.age || 0),
        status: form.status,
        photo: form.photo || undefined,
      }, token || undefined);

      toast('Client created successfully', 'success');
      navigate('/admin/members');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Shell role="admin">
      <div className="page" style={{ maxWidth: 760 }}>
        <div className="page-header">
          <div>
            <h1 className="page-title">Create Client</h1>
            <p className="page-sub">Add a new member profile</p>
          </div>
          <button className="btn" onClick={() => navigate('/admin/members')}>{I.back} Back</button>
        </div>

        <form className="card" onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Full name</label>
              <input className="input" value={form.name} onChange={(e) => setField('name', e.target.value)} />
            </div>
            <div className="field">
              <label>Phone</label>
              <input className="input mono" value={form.phone_number} onChange={(e) => setField('phone_number', e.target.value)} />
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
            <div className="field">
              <label>Status</label>
              <select className="select" value={form.status} onChange={(e) => setField('status', e.target.value)}>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Address</label>
              <input className="input" value={form.address} onChange={(e) => setField('address', e.target.value)} />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Photo</label>
              <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 14, background: 'var(--surface-2)' }}>
                <input
                  id="create-client-photo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setField('photo', e.target.files?.[0] || null)}
                />

                {!photoPreview && (
                  <label
                    htmlFor="create-client-photo-upload"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '18px 8px' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', background: 'var(--surface)' }}>
                      {I.plus}
                    </div>
                    <div style={{ fontWeight: 600 }}>Upload client photo</div>
                    <div className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>PNG, JPG, WEBP</div>
                  </label>
                )}

                {photoPreview && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={photoPreview}
                      alt="Client photo preview"
                      style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', background: 'white' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{form.photo?.name || 'Selected photo'}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <label htmlFor="create-client-photo-upload" className="btn btn-sm" style={{ cursor: 'pointer' }}>Replace</label>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => setField('photo', null)}>
                          Clear file
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
            <button type="button" className="btn" onClick={() => navigate('/admin/members')}>Cancel</button>
            <button type="submit" className="btn btn-accent" disabled={saving}>{saving ? 'Creating...' : 'Create Client'}</button>
          </div>
        </form>
      </div>
    </Shell>
  );
}
