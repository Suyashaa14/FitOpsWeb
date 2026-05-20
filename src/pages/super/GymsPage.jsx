import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import {
  createGymOwner,
  deleteGymOwner,
  getGymOwners,
  updateGymOwner,
} from '../../lib/superAdminApi';

const initialForm = {
  company_name: '',
  company_url: '',
  company_address: '',
  company_phone_number: '',
  company_phone_number_two: '',
  company_package_start_at: '',
  company_package_end_at: '',
  name: '',
  email: '',
  password: '',
  logo: null,
};

const editableFields = [
  'company_name',
  'company_url',
  'company_address',
  'company_phone_number',
  'company_phone_number_two',
  'company_package_start_at',
  'company_package_end_at',
  'name',
  'email',
  'password',
];

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

function extractUpdateIds(payload, fallbackUserId, fallbackCompanyId) {
  const row =
    (payload?.data && !Array.isArray(payload.data) && typeof payload.data === 'object'
      ? payload.data
      : extractOwners(payload)[0]);
  if (!row || typeof row !== 'object') {
    return { userId: fallbackUserId, companyId: fallbackCompanyId };
  }

  const userId = row._id || row.id || row.user_id || row.userId || fallbackUserId;
  const rawCompany = row.company_id;
  const companyId =
    (rawCompany && typeof rawCompany === 'object' ? rawCompany._id || rawCompany.id : rawCompany)
    || row.companyId
    || row.company_id
    || fallbackCompanyId;

  return { userId, companyId };
}

function normalizeOwner(row = {}) {
  const companyRef = row.company_id;
  const company =
    (companyRef && typeof companyRef === 'object' ? companyRef : null)
    || row.company
    || row.company_data
    || row.companyData
    || row;

  const rowCompanyId =
    (companyRef && typeof companyRef === 'object' ? companyRef._id || companyRef.id : companyRef)
    || row.companyId;

  return {
    id: row.id || row._id || row.user_id || row.userId || company.user_id || company.userId,
    companyId: company.id || company._id || rowCompanyId,
    company_name: company.company_name || company.name || '-',
    company_url: company.company_url || company.url || '',
    company_address: company.company_address || company.address || '',
    company_phone_number: company.company_phone_number || company.phone_number || company.phone || '',
    company_phone_number_two: company.company_phone_number_two || company.phone_number_two || '',
    company_package_start_at: toDateInput(company.company_package_start_at || company.start_at || company.package_start_at),
    company_package_end_at: toDateInput(company.company_package_end_at || company.expire_at || company.package_end_at),
    logoUrl: company.company_logo || company.logo || row.company_logo || row.logo || '',
    name: row.name || row.owner_name || row.full_name || '-',
    email: row.email || '-',
    status: row.status || row.account_status || company.status || 'active',
  };
}

function GymOwnerModal({
  open,
  title,
  submitLabel,
  form,
  saving,
  onClose,
  onSubmit,
  updateField,
  existingLogoUrl,
}) {
  if (!open) return null;

  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    if (!(form.logo instanceof File)) {
      setLogoPreview('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(form.logo);
    setLogoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [form.logo]);

  return (
    <div className="modal-backdrop">
      <motion.div
        className="modal"
        style={{ width: 'min(900px, 92vw)', maxHeight: '88vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button className="btn btn-ghost btn-icon" type="button" onClick={onClose}>{I.x}</button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {editableFields.map((key) => (
              <div className="field" key={key} style={{ gridColumn: key === 'company_address' ? '1 / -1' : 'auto' }}>
                <label>{key.replaceAll('_', ' ')}</label>
                <input
                  className="input"
                  type={key === 'password' ? 'password' : key.includes('start_at') || key.includes('end_at') ? 'date' : 'text'}
                  value={form[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  required={['company_name', 'name', 'email'].includes(key)}
                />
              </div>
            ))}

            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>company logo</label>
              <div style={{ border: '1px dashed var(--border)', borderRadius: 12, padding: 14, background: 'var(--surface-2)' }}>
                <input
                  id="company-logo-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => updateField('logo', e.target.files?.[0] || null)}
                />

                {!logoPreview && !existingLogoUrl && (
                  <label
                    htmlFor="company-logo-upload"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '18px 8px' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 10, border: '1px solid var(--border)', display: 'grid', placeItems: 'center', background: 'var(--surface)' }}>
                      {I.plus}
                    </div>
                    <div style={{ fontWeight: 600 }}>Upload company logo</div>
                    <div className="mono" style={{ color: 'var(--muted)', fontSize: 12 }}>PNG, JPG, WEBP</div>
                  </label>
                )}

                {(logoPreview || existingLogoUrl) && (
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img
                      src={logoPreview || existingLogoUrl}
                      alt="Company logo preview"
                      style={{ width: 84, height: 84, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)', background: 'white' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{form.logo?.name || 'Current logo'}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                        <label htmlFor="company-logo-upload" className="btn btn-sm" style={{ cursor: 'pointer' }}>Replace</label>
                        <button className="btn btn-ghost btn-sm" type="button" onClick={() => updateField('logo', null)}>
                          Clear new file
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn" type="button" disabled>Cancel</button>
            <button className="btn btn-accent" type="submit" disabled={saving}>
              {saving ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function SuperGyms() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState(initialForm);
  const [editForm, setEditForm] = useState(initialForm);
  const [selectedOwner, setSelectedOwner] = useState(null);

  const { token } = useAuth();
  const toast = useToast();

  const hasOwners = useMemo(() => owners.length > 0, [owners.length]);

  async function loadOwners() {
    setLoading(true);
    try {
      const response = await getGymOwners({ token: token || undefined, page: 1, limit: 100 });
      const list = extractOwners(response).map(normalizeOwner).filter((o) => o.id);
      setOwners(list);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOwners();
  }, []);

  function resetCreateForm() {
    setCreateForm(initialForm);
  }

  function updateCreateField(key, value) {
    setCreateForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditField(key, value) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  function requestCloseModal(type) {
    const allowed = window.confirm('Are you sure you want to close this form? Unsaved changes may be lost.');
    if (!allowed) return;

    if (type === 'create') {
      setIsCreateOpen(false);
      resetCreateForm();
      return;
    }

    setIsEditOpen(false);
    setSelectedOwner(null);
  }

  async function submitCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await createGymOwner(createForm, token || undefined);
      toast('Gym owner created successfully', 'success');
      setIsCreateOpen(false);
      resetCreateForm();
      await loadOwners();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  function openEdit(owner) {
    setSelectedOwner(owner);
    setEditForm({
      company_name: owner.company_name || '',
      company_url: owner.company_url || '',
      company_address: owner.company_address || '',
      company_phone_number: owner.company_phone_number || '',
      company_phone_number_two: owner.company_phone_number_two || '',
      company_package_start_at: owner.company_package_start_at || '',
      company_package_end_at: owner.company_package_end_at || '',
      name: owner.name || '',
      email: owner.email || '',
      password: '',
      logo: null,
    });
    setIsEditOpen(true);
  }

  async function submitEdit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      // Always fetch single user to get authoritative user and company ids for update endpoint.
      const singleResponse = await getGymOwners({ token: token || undefined, id: selectedOwner?.id });
      const { userId, companyId } = extractUpdateIds(
        singleResponse,
        selectedOwner?.id,
        selectedOwner?.companyId,
      );

      if (!userId || !companyId) {
        throw new Error('Missing owner id or company id for update');
      }

      await updateGymOwner({
        id: userId,
        companyId,
        payload: editForm,
        token: token || undefined,
      });
      toast('Gym owner updated successfully', 'success');
      setIsEditOpen(false);
      setSelectedOwner(null);
      await loadOwners();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(owner) {
    if (!owner?.id) return;
    const allowed = window.confirm(`Delete gym owner "${owner.name}"?`);
    if (!allowed) return;

    setDeletingId(owner.id);
    try {
      await deleteGymOwner(owner.id, token || undefined);
      toast('Gym owner deleted successfully', 'success');
      setOwners((prev) => prev.filter((row) => row.id !== owner.id));
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">All Gyms</h1>
            <p className="page-sub">Gym owners table</p>
          </div>
          <button className="btn btn-accent" type="button" onClick={() => setIsCreateOpen(true)}>
            {I.plus} Create Gym Owner
          </button>
        </div>

        <div className="card">
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Gym Owners</h3>
            <button className="btn btn-sm" type="button" onClick={loadOwners} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Gym</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Owner</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Phone</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Package</th>
                  <th style={{ textAlign: 'left', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Status</th>
                  <th style={{ textAlign: 'right', padding: '10px 8px', fontSize: 12, color: 'var(--muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {!loading && !hasOwners && (
                  <tr>
                    <td colSpan={7} style={{ padding: '16px 8px', color: 'var(--muted)' }}>
                      No gym owners found.
                    </td>
                  </tr>
                )}

                {loading && (
                  <tr>
                    <td colSpan={7} style={{ padding: '16px 8px', color: 'var(--muted)' }}>
                      Loading gym owners...
                    </td>
                  </tr>
                )}

                {!loading && owners.map((owner) => (
                  <tr key={owner.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 8px' }}>{owner.company_name}</td>
                    <td style={{ padding: '10px 8px' }}>{owner.name}</td>
                    <td style={{ padding: '10px 8px' }}>{owner.email}</td>
                    <td style={{ padding: '10px 8px' }}>{owner.company_phone_number || '-'}</td>
                    <td style={{ padding: '10px 8px' }} className="mono">
                      {owner.company_package_start_at || '-'} to {owner.company_package_end_at || '-'}
                    </td>
                    <td style={{ padding: '10px 8px', textTransform: 'capitalize' }}>{owner.status}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                        <button className="btn btn-sm" type="button" onClick={() => openEdit(owner)}>
                          {I.edit} Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          type="button"
                          onClick={() => handleDelete(owner)}
                          disabled={deletingId === owner.id}
                        >
                          {I.trash} {deletingId === owner.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AnimatePresence>
        <GymOwnerModal
          open={isCreateOpen}
          title="Create Gym Owner"
          submitLabel="Create Gym Owner"
          form={createForm}
          saving={saving}
          updateField={updateCreateField}
          onClose={() => requestCloseModal('create')}
          onSubmit={submitCreate}
          existingLogoUrl=""
        />
      </AnimatePresence>

      <AnimatePresence>
        <GymOwnerModal
          open={isEditOpen}
          title="Update Gym Owner"
          submitLabel="Save Changes"
          form={editForm}
          saving={saving}
          updateField={updateEditField}
          onClose={() => requestCloseModal('edit')}
          onSubmit={submitEdit}
          existingLogoUrl={selectedOwner?.logoUrl || ''}
        />
      </AnimatePresence>
    </Shell>
  );
}
