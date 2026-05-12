import { useState } from 'react';
import Shell from '../../components/layout/Shell';
import { Avatar, I } from '../../components/ui/index.jsx';
import { useToast } from '../../context/ToastContext';
import { MOCK_MEMBERS } from '../../data/mockData';

function QRPattern({ style }) {
  const cells = Array.from({ length: 21 * 21 }, (_, i) => (((i * 7) ^ (i * 11)) & 3) > 0);
  const finder = (cx, cy) => (x, y) => {
    const dx = Math.abs(x - cx), dy = Math.abs(y - cy);
    if (dx <= 3 && dy <= 3) {
      if (dx === 3 || dy === 3) return true;
      if (dx <= 1 && dy <= 1) return true;
      if (dx === 2 || dy === 2) return false;
      return true;
    }
    return null;
  };
  const finders = [finder(3, 3), finder(17, 3), finder(3, 17)];
  return (
    <div className="qr-placeholder" style={style}>
      {Array.from({ length: 21 }, (_, y) => Array.from({ length: 21 }, (_, x) => {
        let on = cells[y * 21 + x];
        for (const f of finders) { const r = f(x, y); if (r !== null) on = r; }
        return <span key={`${x}-${y}`} className={on ? '' : 'off'} />;
      }))}
    </div>
  );
}

export default function QRRegistrationPage() {
  const [copied, setCopied] = useState(false);
  const url = 'https://fitops.app/r/iron-forge-xY8k';
  const toast = useToast();
  const pending = MOCK_MEMBERS.filter(m => m.status === 'pending').slice(0, 3);

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Registration</h1>
            <p className="page-sub">Print this QR. Members scan, self-register, you approve.</p>
          </div>
          <button className="btn">{I.download} Download PNG</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 36, textAlign: 'center' }}>
            <span className="h-eyebrow"><span className="dot" /> ACTIVE · IRON FORGE</span>
            <QRPattern style={{ margin: '24px 0' }} />
            <div className="mono" style={{ fontSize: 13, color: 'var(--muted)', padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{ wordBreak: 'break-all' }}>{url}</span>
              <button className="btn btn-sm" onClick={() => {
                navigator.clipboard?.writeText(url);
                setCopied(true); toast('Copied', 'success');
                setTimeout(() => setCopied(false), 1500);
              }}>{copied ? 'Copied ✓' : 'Copy'}</button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button className="btn">{I.zap} Regenerate</button>
              <button className="btn btn-accent">Preview form</button>
            </div>
          </div>

          <div className="card">
            <div className="section-title"><h3>How it works</h3><span className="meta">flow</span></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['01', 'Print or display the QR at reception'],
                ['02', 'Walk-in scans with their phone camera'],
                ['03', 'Form opens — name, phone, package selection'],
                ['04', 'Submission saved with status: Pending'],
                ['05', 'You verify payment and flip status to Active'],
                ['06', 'Welcome SMS goes out automatically'],
              ].map(([n, t]) => (
                <div key={n} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--accent)', minWidth: 24 }}>{n}</span>
                  <span style={{ fontSize: 14 }}>{t}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18, padding: 14, background: 'var(--surface-2)', borderRadius: 10 }}>
              <div className="section-title" style={{ marginBottom: 8 }}>
                <h3 style={{ fontSize: 13 }}>Pending from QR · {pending.length}</h3>
              </div>
              {pending.map(m => (
                <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                  <Avatar name={m.name} size="sm" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{m.phone}</div>
                  </div>
                  <button className="btn btn-sm btn-accent">Approve</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
