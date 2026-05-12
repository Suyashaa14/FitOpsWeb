import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { MOCK_SMS_TEMPLATES } from '../../data/mockData';

function TemplateModal({ initial, onClose, onSave }) {
  const [f, setF] = useState(initial || { name: '', body: '' });
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div className="modal" onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
        <div className="modal-header">
          <h2 className="modal-title">{initial ? 'Edit template' : 'New template'}</h2>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>{I.x}</button>
        </div>
        <div className="modal-body">
          <div className="field"><label>Name</label>
            <input className="input" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="e.g. Renewal Discount" />
          </div>
          <div className="field"><label>Message</label>
            <textarea className="textarea mono" rows={5} value={f.body} onChange={e => setF({ ...f, body: e.target.value })} placeholder="Hello {name}, …" />
            <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              <span>Tags:</span>
              {['{name}', '{expiry_date}', '{package}', '{days_left}'].map(t => (
                <button key={t} className="chip" style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                  onClick={() => setF(s => ({ ...s, body: s.body + ' ' + t }))}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" onClick={() => onSave(f)}>Save</button>
        </div>
      </motion.div>
    </div>
  );
}

export default function SMSTemplatesPage() {
  const [list, setList] = useState(MOCK_SMS_TEMPLATES);
  const [edit, setEdit] = useState(null);
  const toast = useToast();

  function save(t) {
    if (t.id) setList(l => l.map(x => x.id === t.id ? t : x));
    else setList(l => [...l, { ...t, id: Date.now(), usedCount: 0 }]);
    toast('Template saved', 'success');
    setEdit(null);
  }
  function del(id) { setList(l => l.filter(x => x.id !== id)); toast('Template deleted'); }

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">SMS Templates</h1>
            <p className="page-sub">Reusable messages with merge tags like {'{name}'}, {'{expiry_date}'}</p>
          </div>
          <button className="btn btn-accent" onClick={() => setEdit('new')}>{I.plus} New template</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18 }}>
          {list.map(t => (
            <div key={t.id} className="card card-hover">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>{t.name}</h3>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className="btn btn-sm btn-icon" onClick={() => setEdit(t)}>{I.edit}</button>
                  <button className="btn btn-sm btn-icon btn-danger" onClick={() => del(t.id)}>{I.trash}</button>
                </div>
              </div>
              <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, fontFamily: 'var(--font-mono)', fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink-soft)', minHeight: 90 }}>
                {t.body.split(/(\{[^}]+\})/g).map((p, i) => p.startsWith('{')
                  ? <span key={i} style={{ color: 'var(--accent)', fontWeight: 600 }}>{p}</span> : p)}
              </div>
              <div style={{ marginTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)' }}>
                <span>Used <strong style={{ color: 'var(--ink)' }}>{t.usedCount}</strong> times</span>
                <span className="mono">{t.body.length} chars · {Math.ceil(t.body.length / 160)} SMS</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {edit && <TemplateModal initial={edit === 'new' ? null : edit} onClose={() => setEdit(null)} onSave={save} />}
      </AnimatePresence>
    </Shell>
  );
}
