import Shell from '../../components/layout/Shell';

function GrowthChart() {
  const months = [240, 268, 295, 310, 288, 332, 362, 390, 412, 428, 462, 482];
  const max = Math.max(...months);
  const labels = ['Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'];
  const w = 600, h = 180, pad = 20;
  const points = months.map((m, i) => [
    pad + (i / (months.length - 1)) * (w - pad * 2),
    h - pad - (m / max) * (h - pad * 2),
  ]);
  const path = points.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ');
  const area = `${path} L ${points[points.length-1][0]} ${h - pad} L ${points[0][0]} ${h - pad} Z`;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: 200 }}>
        <path d={area} fill="var(--accent-soft)" />
        <path d={path} stroke="var(--accent)" strokeWidth="2.5" fill="none" />
        {points.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i === points.length - 1 ? 5 : 3}
            fill={i === points.length - 1 ? 'var(--accent)' : 'var(--surface)'}
            stroke="var(--accent)" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', marginTop: 4 }}>
        {labels.map(l => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

export default function SuperAnalytics() {
  return (
    <Shell role="super">
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">Platform Analytics</h1>
            <p className="page-sub">Growth, engagement, retention</p>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginBottom: 18 }}>
          <div className="kpi accent">
            <div className="kpi-label">Net new gyms</div>
            <div className="kpi-value">+2</div>
            <div className="kpi-delta up">vs +1 last mo</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">DAU / MAU</div>
            <div className="kpi-value">0.62</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">Avg session</div>
            <div className="kpi-value">9m 12s</div>
          </div>
          <div className="kpi">
            <div className="kpi-label">NPS</div>
            <div className="kpi-value">+48</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card">
            <div className="section-title"><h3>Member growth</h3><span className="meta">cumulative</span></div>
            <GrowthChart />
          </div>
          <div className="card">
            <div className="section-title"><h3>Retention cohorts</h3><span className="meta">90-day</span></div>
            <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(12, 1fr)', gap: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              {Array.from({ length: 6 }).map((_, r) => (
                <div key={r} style={{ display: 'contents' }}>
                  <span style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>W{r * 2}</span>
                  {Array.from({ length: 12 }).map((_, c) => {
                    if (c < r) return <span key={c} />;
                    const pct = Math.max(20, 100 - (c - r) * 6 - r * 4);
                    return (
                      <span key={c} style={{
                        aspectRatio: 1,
                        background: `color-mix(in oklab, var(--accent) ${pct}%, var(--surface-2))`,
                        borderRadius: 4,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 9,
                        color: pct > 50 ? 'white' : 'var(--ink)',
                      }}>{pct}</span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
