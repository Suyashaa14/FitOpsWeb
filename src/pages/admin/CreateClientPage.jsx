import { useState } from 'react';
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
};

export default function CreateClientPage() {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { token } = useAuth();

  function setField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

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
