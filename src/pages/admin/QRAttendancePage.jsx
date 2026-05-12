import Shell from '../../components/layout/Shell';
import { Avatar, StatusBadge, I } from '../../components/ui/index.jsx';
import { MOCK_MEMBERS } from '../../data/mockData';

function QRPattern() {
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
    <div className="qr-placeholder">
      {Array.from({ length: 21 }, (_, y) => Array.from({ length: 21 }, (_, x) => {
        let on = cells[y * 21 + x];
        for (const f of finders) { const r = f(x, y); if (r !== null) on = r; }
        return <span key={`${x}-${y}`} className={on ? '' : 'off'} />;
      }))}
    </div>
  );
}

export default function QRAttendancePage() {
  const recent = MOCK_MEMBERS.filter(m => m.status === 'active').slice(0, 10);
  const times = ['06:42','06:45','06:51','07:02','07:11','07:18','07:24','07:32','07:39','07:45'];

  return (
    <Shell role="admin">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">QR Attendance</h1>
            <p className="page-sub">Members tap this QR at the door to check in</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn">{I.download} Download</button>
            <button className="btn btn-accent">Preview check-in</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 18 }}>
          {/* QR card */}
          <div className="card" style={{ background: 'var(--ink)', color: 'var(--bg)', padding: 32, textAlign: 'center', borderColor: 'var(--ink)', position: 'relative', overflow: 'hidden' }}>
            <div className="dot-bg" style={{ position: 'absolute', inset: 0, opacity: .05 }} />
            <span className="h-eyebrow" style={{ background: 'rgba(255,255,255,.04)', color: 'var(--lime)', borderColor: 'rgba(255,255,255,.1)' }}>
              <span className="dot" /> CHECK-IN MODE
            </span>
            <div style={{ background: 'white', padding: 20, borderRadius: 16, display: 'inline-flex', margin: '20px 0', position: 'relative' }}>
              <div className="pulse-ring" style={{ borderRadius: 16 }} />
              <QRPattern />
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'rgba(255,255,255,.6)' }}>fitops.app/c/iron-forge</div>
            <div style={{ marginTop: 18, fontSize: 13, opacity: .7 }}>Today · <span style={{ color: 'var(--lime)' }}>68 check-ins</span></div>
          </div>

          {/* Live check-ins */}
          <div className="card">
            <div className="section-title"><h3>Live check-ins</h3><span className="meta">last 30 min</span></div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recent.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ position: 'relative' }}>
                    <Avatar name={m.name} />
                    <span style={{ position: 'absolute', bottom: -2, right: -2, width: 12, height: 12, borderRadius: 999, background: 'var(--accent)', border: '2px solid var(--surface)' }} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.name}</div>
                    <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{m.package} · {m.phone}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>{times[i]} AM</span>
                  <StatusBadge status={m.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          {[
            { t: 'Validates membership', d: 'Expired members get a renewal nudge instead of attendance.', c: 'var(--accent)' },
            { t: 'Prevents duplicates', d: "Same member can't double check-in on the same day.", c: 'var(--info)' },
            { t: 'Offline-tolerant', d: 'Queues check-ins locally if internet drops at the door.', c: '#b45309' },
          ].map(x => (
            <div key={x.t} className="card" style={{ borderLeft: `3px solid ${x.c}` }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>{x.t}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{x.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
