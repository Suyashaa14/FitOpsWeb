import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Shell from '../../components/layout/Shell';
import { I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { MOCK_MEMBERS, MOCK_SMS_TEMPLATES } from '../../data/mockData';

export default function SendSMSPage() {
  const [template, setTemplate] = useState(MOCK_SMS_TEMPLATES[0]);
  const [body, setBody] = useState(MOCK_SMS_TEMPLATES[0].body);
  const [selected] = useState(new Set([MOCK_MEMBERS[0].id, MOCK_MEMBERS[1].id, MOCK_MEMBERS[2].id]));
  const [audience, setAudience] = useState('expiring');
  const navigate = useNavigate();
  const toast = useToast();

  const audienceMembers = MOCK_MEMBERS.filter(m => {
    if (audience === 'all') return true;
    if (audience === 'expiring') return m.daysLeft >= 0 && m.daysLeft <= 7 && m.status === 'active';
    if (audience === 'expired') return m.status === 'expired';
    if (audience === 'custom') return selected.has(m.id);
    return false;
  });
  const count = audienceMembers.length;
  const segments = Math.ceil(body.length / 160) || 1;

  function chooseTemplate(t) { setTemplate(t); setBody(t.body); }

  const preview = body
    .replace('{name}', audienceMembers[0]?.name?.split(' ')[0] || 'Ram')
    .replace('{expiry_date}', audienceMembers[0]?.expiry || '2026-05-19')
    .replace('{package}', audienceMembers[0]?.package || 'Premium')
    .replace('{days_left}', audienceMembers[0]?.daysLeft ?? '3');

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Send SMS</h1>
            <p className="page-sub">Reach members with reminders, nudges, and announcements</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/sms-templates')}>{I.message} Manage templates</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Audience */}
            <div className="card">
              <div className="section-title"><h3>1 · Audience</h3><span className="meta">{count} recipients</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {[
                  { id: 'all', l: 'All members', n: MOCK_MEMBERS.length },
                  { id: 'expiring', l: 'Expiring 7d', n: MOCK_MEMBERS.filter(m => m.daysLeft >= 0 && m.daysLeft <= 7 && m.status === 'active').length },
                  { id: 'expired', l: 'Expired', n: MOCK_MEMBERS.filter(m => m.status === 'expired').length },
                  { id: 'custom', l: 'Custom', n: selected.size },
                ].map(a => (
                  <button key={a.id} onClick={() => setAudience(a.id)} className="card" style={{
                    background: audience === a.id ? 'var(--ink)' : 'var(--surface)',
                    color: audience === a.id ? 'var(--bg)' : 'var(--ink)',
                    borderColor: audience === a.id ? 'var(--ink)' : 'var(--border)',
                    cursor: 'pointer', padding: 16, textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 12, opacity: .6, fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>{a.l}</div>
                    <div style={{ fontSize: 22, fontWeight: 700, marginTop: 6 }}>{a.n}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Template */}
            <div className="card">
              <div className="section-title"><h3>2 · Pick a template</h3><span className="meta">optional</span></div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {MOCK_SMS_TEMPLATES.map(t => (
                  <button key={t.id} onClick={() => chooseTemplate(t)} className="chip" style={{
                    background: template.id === t.id ? 'var(--ink)' : 'var(--surface-2)',
                    color: template.id === t.id ? 'var(--bg)' : 'var(--ink)',
                    borderColor: template.id === t.id ? 'var(--ink)' : 'var(--border)',
                    height: 32, padding: '0 14px', cursor: 'pointer',
                  }}>{t.name}</button>
                ))}
              </div>
            </div>

            {/* Compose */}
            <div className="card">
              <div className="section-title">
                <h3>3 · Compose</h3>
                <span className="meta">{body.length} chars · {segments} SMS</span>
              </div>
              <textarea className="textarea mono" rows={5} value={body} onChange={e => setBody(e.target.value)} />
              <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: 'var(--muted)', marginRight: 6 }}>Merge tags:</span>
                {['{name}', '{expiry_date}', '{package}', '{days_left}'].map(t => (
                  <button key={t} className="chip" style={{ cursor: 'pointer', fontFamily: 'var(--font-mono)' }}
                    onClick={() => setBody(b => b + ' ' + t)}>{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Right col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card">
              <div className="section-title"><h3>Preview</h3><span className="meta">for {audienceMembers[0]?.name || '—'}</span></div>
              <div style={{ background: 'var(--ink)', borderRadius: 18, padding: 20, color: 'var(--bg)' }}>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>FROM: IRON FORGE · NOW</div>
                <div style={{ fontSize: 14.5, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{preview}</div>
              </div>
            </div>

            <div className="card">
              <div className="section-title"><h3>Summary</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Recipients', count], ['SMS per recipient', segments], ['Total SMS', count * segments], ['Credits used', `${count * segments} / 2,000`]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                    <span style={{ color: 'var(--muted)' }}>{k}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-accent btn-lg" style={{ width: '100%', marginTop: 18 }}
                onClick={() => toast(`SMS queued to ${count} recipients`, 'success')}>
                {I.send} Send to {count} members
              </button>
              <button className="btn" style={{ width: '100%', marginTop: 8 }}>Schedule for later</button>
            </div>

            <div className="card">
              <div className="section-title"><h3>Recent campaigns</h3><span className="meta">7 days</span></div>
              {[
                { t: 'Expiry reminder · 12 sent', k: '100% delivered', c: 'var(--accent)' },
                { t: 'Payment nudge · 4 sent', k: '75% delivered', c: '#b45309' },
                { t: 'Welcome batch · 8 sent', k: '100% delivered', c: 'var(--accent)' },
              ].map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                  <span>{r.t}</span><span className="mono" style={{ color: r.c, fontSize: 12 }}>{r.k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
