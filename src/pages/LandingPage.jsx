import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Logo, I } from '../components/ui/index.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function HeatmapPreview() {
  return (
    <div className="heatmap" style={{ gridTemplateColumns: 'repeat(30, 1fr)' }}>
      {Array.from({ length: 30 }).map((_, i) => {
        const l = [0,1,2,3,4][Math.floor((Math.sin(i * 1.7) + 1) * 2.4)];
        return <span key={i} className={`cell ${l ? 'l' + l : ''}`} />;
      })}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing" data-theme="light">
      {/* NAV */}
      <nav className="landing-nav" style={{ borderBottomColor: scrolled ? 'var(--border)' : 'transparent' }}>
        <Logo />
        <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {['Features', 'How it works', 'Pricing', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`}
              style={{ color: 'var(--ink-soft)', fontSize: 14, fontWeight: 500 }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn btn-accent" onClick={() => navigate('/login')}>Start free trial {I.arrow}</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="landing-hero">
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 60, alignItems: 'center' }}>
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.span variants={fadeUp} className="h-eyebrow"><span className="dot" /> v2.6 · Now with QR auto-renewal</motion.span>
            <motion.h1 variants={fadeUp} className="display">
              Run a tighter gym.<br />
              <span className="strike">Less paperwork.</span><br />
              <span className="accent-text">More reps.</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="lead">
              FitOpsWeb is the operating system for modern fitness studios. Members, packages,
              attendance, SMS — one connected platform that scales with every barbell you add.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button className="btn btn-accent btn-lg" onClick={() => navigate('/login')}>Start 30-day trial {I.arrow}</button>
              <button className="btn btn-lg">Book a demo</button>
            </motion.div>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 24, marginTop: 40, flexWrap: 'wrap' }}>
              {[{ k: '640+', v: 'Gyms running daily' }, { k: '84K', v: 'Active members' }, { k: '99.97%', v: 'Uptime SLA' }].map(s => (
                <div key={s.v}>
                  <div className="big-stat" style={{ fontSize: 32 }}>{s.k}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.06em' }}>{s.v}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero dashboard card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ position: 'relative' }}
          >
            <div className="dot-bg" style={{ position: 'absolute', inset: -40, opacity: .5, zIndex: 0 }} />
            <div className="card" style={{ position: 'relative', padding: 18, boxShadow: 'var(--shadow-lg)', borderRadius: 22 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <span className="dot" style={{ background: '#ff5f56' }} />
                <span className="dot" style={{ background: '#ffbd2e' }} />
                <span className="dot" style={{ background: '#27c93f' }} />
                <span style={{ marginLeft: 12, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>iron-forge.fitops.app</span>
              </div>
              <div className="kpi-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                <div className="kpi accent">
                  <div className="kpi-label">Today check-ins</div>
                  <div className="kpi-value">68</div>
                  <div className="kpi-delta up">↑ 12% vs yesterday</div>
                  <div className="kpi-glyph">{I.zap}</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Expiring this week</div>
                  <div className="kpi-value">9</div>
                  <div className="kpi-delta">{I.clock}<span>3 today</span></div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">Active members</div>
                  <div className="kpi-value">248</div>
                  <div className="kpi-delta up">↑ 6</div>
                </div>
                <div className="kpi">
                  <div className="kpi-label">SMS sent</div>
                  <div className="kpi-value">142</div>
                  <div className="kpi-delta">this month</div>
                </div>
              </div>
              <div style={{ marginTop: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 12 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>30-day attendance</div>
                <HeatmapPreview />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Logo strip */}
      <section style={{ padding: '40px 48px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.1em', fontFamily: 'var(--font-mono)' }}>Trusted by 640+ gyms ↓</span>
          {['IRON FORGE', 'PULSE CLUB', 'APEX·STR', 'VERTEX', 'CORE/PERF', 'TITAN LIFT'].map(n => (
            <span key={n} style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: 'var(--muted)', letterSpacing: '.02em' }}>{n}</span>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing-section" id="features">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, gap: 24 }}>
          <div>
            <span className="h-eyebrow">FEATURES</span>
            <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-.03em', margin: '18px 0 0', lineHeight: 1 }}>
              Built for the floor.<br />Not the spreadsheet.
            </h2>
          </div>
          <p style={{ color: 'var(--muted)', maxWidth: 360, fontSize: 15 }}>
            Every module is designed for the front-desk reality: messy, fast, mobile-first. Drop the binders.
          </p>
        </div>

        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}
        >
          {[
            { ic: I.users,   t: 'Member CRUD',   d: 'Add, edit, freeze, renew. Pending → Active workflow with payment verification built in.', tag: '01' },
            { ic: I.qr,      t: 'QR Attendance', d: 'Each member gets a phone-scan check-in. Membership status validated in real time at the door.', tag: '02' },
            { ic: I.package, t: 'Smart Packages', d: 'Basic, Standard, Premium — or your own. Expiry dates calculated automatically.', tag: '03' },
            { ic: I.message, t: 'SMS Engine',     d: 'Auto-reminders before expiry, payment nudges, holiday notices. Templates with merge tags.', tag: '04' },
            { ic: I.chart,   t: 'Reports',        d: 'Today / week / month attendance, per-member history, churn signals. CSV export anywhere.', tag: '05' },
            { ic: I.shield,  t: 'Multi-tenant',   d: 'Each gym is its own world. Super Admin oversight across the whole platform.', tag: '06' },
          ].map(f => (
            <motion.div key={f.t} variants={fadeUp} className="card card-hover" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  {f.ic}
                </div>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{f.tag}</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, letterSpacing: '-.01em' }}>{f.t}</h3>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14, lineHeight: 1.5 }}>{f.d}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ background: 'var(--ink)', color: 'var(--bg)', maxWidth: 'none', padding: '80px 0' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px' }}>
          <span className="h-eyebrow" style={{ background: 'transparent', color: 'rgba(255,255,255,.6)', borderColor: 'rgba(255,255,255,.2)' }}>
            <span className="dot" /> THE FLOW
          </span>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-.03em', margin: '18px 0 40px', lineHeight: 1, maxWidth: 800 }}>
            From <span style={{ color: 'var(--lime)' }}>cold lead</span> to checked-in member in under <span style={{ color: 'var(--lime)' }}>90 seconds</span>.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginTop: 40 }}>
            {[
              { n: '01', t: 'Member scans QR', d: 'Walk-in scans the gym\'s registration QR. No app install needed.' },
              { n: '02', t: 'Fills form on phone', d: 'Name, phone, package. Submits — status set to Pending.' },
              { n: '03', t: 'Admin verifies', d: 'Front desk confirms payment, flips status to Active. Welcome SMS goes out.' },
              { n: '04', t: 'Check-in by QR', d: 'Member taps the door QR daily. System validates and logs attendance.' },
            ].map(s => (
              <div key={s.n} style={{ border: '1px solid rgba(255,255,255,.12)', borderRadius: 16, padding: 22, background: 'rgba(255,255,255,.02)' }}>
                <div className="mono" style={{ fontSize: 14, color: 'var(--lime)', marginBottom: 18, fontWeight: 600 }}>{s.n}</div>
                <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700 }}>{s.t}</h3>
                <p style={{ margin: 0, fontSize: 13.5, color: 'rgba(255,255,255,.6)', lineHeight: 1.5 }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="landing-section" id="pricing">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="h-eyebrow">PRICING</span>
          <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, letterSpacing: '-.03em', margin: '18px 0 8px', lineHeight: 1 }}>
            Pay per gym. Not per member.
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Cancel anytime. Trial doesn't ask for a card.</p>
        </div>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, maxWidth: 1100, margin: '0 auto' }}
        >
          {[
            { name: 'Starter', price: 'Free', note: '30 days', feats: ['Up to 50 members', 'QR attendance', 'Basic SMS (100/mo)', '1 admin'] },
            { name: 'Pro', price: 'Rs 2,499', note: '/month', feats: ['Unlimited members', 'QR + auto-renew', 'SMS (2,000/mo)', '5 admins', 'Custom templates', 'Priority support'], featured: true },
            { name: 'Scale', price: 'Rs 6,999', note: '/month', feats: ['Everything in Pro', 'SMS (10,000/mo)', 'Multi-branch', 'API access', 'Custom integrations'] },
          ].map(p => (
            <motion.div key={p.name} variants={fadeUp} className="card" style={{
              padding: 32, position: 'relative',
              borderColor: p.featured ? 'var(--ink)' : 'var(--border)',
              background: p.featured ? 'var(--ink)' : 'var(--surface)',
              color: p.featured ? 'var(--bg)' : 'var(--ink)',
            }}>
              {p.featured && <span style={{ position: 'absolute', top: -10, left: 24, background: 'var(--accent)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, letterSpacing: '.06em' }}>MOST POPULAR</span>}
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, opacity: .7, textTransform: 'uppercase', letterSpacing: '.08em' }}>{p.name}</div>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span className="big-stat" style={{ fontSize: 40 }}>{p.price}</span>
                <span style={{ fontSize: 14, opacity: .6 }}>{p.note}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '28px 0' }}>
                {p.feats.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 14 }}>
                    <span style={{ color: p.featured ? 'var(--lime)' : 'var(--accent)' }}>{I.check}</span>{f}
                  </div>
                ))}
              </div>
              <button className={p.featured ? 'btn btn-accent btn-lg' : 'btn btn-lg'} style={{ width: '100%' }} onClick={() => navigate('/login')}>
                {p.featured ? 'Start free trial' : 'Choose plan'}
              </button>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="landing-section" id="contact" style={{ paddingTop: 40 }}>
        <div className="card" style={{ padding: '56px 48px', background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap', borderRadius: 22 }}>
          <div>
            <h2 style={{ fontSize: 'clamp(28px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-.03em', margin: 0, lineHeight: 1.05, maxWidth: 600 }}>
              Stop chasing renewals. <span style={{ color: 'var(--accent)' }}>Start training them.</span>
            </h2>
            <p style={{ color: 'var(--muted)', margin: '12px 0 0', fontSize: 16 }}>30-day trial. No card. No setup fee.</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-accent btn-lg" onClick={() => navigate('/login')}>Start trial {I.arrow}</button>
            <button className="btn btn-lg">Book demo</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 48px', marginTop: 40 }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <Logo />
          <span style={{ color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font-mono)' }}>© 2026 FitOpsWeb · Built for sweat</span>
          <div style={{ display: 'flex', gap: 18 }}>
            {['Privacy', 'Terms', 'Status'].map(l => (
              <a key={l} style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}>{l}</a>
            ))}
            <a
              onClick={() => navigate('/super-admin/login')}
              style={{ fontSize: 13, color: 'var(--muted)', cursor: 'pointer' }}
            >
              Admin Login
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
