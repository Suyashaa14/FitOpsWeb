import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, MessageSquare, Clock, CheckCircle, AlertTriangle, XCircle, BarChart2, Activity } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const statCards = [
  { label: 'Total Gyms', value: '48', change: '+6 this month', color: '#f97316', icon: Building2, bg: 'rgba(249,115,22,0.12)' },
  { label: 'Total Members', value: '12,840', change: '+1.2K this month', color: '#3b82f6', icon: Users, bg: 'rgba(59,130,246,0.12)' },
  { label: 'Active Subscriptions', value: '41', change: '85.4% of gyms', color: '#22c55e', icon: CheckCircle, bg: 'rgba(34,197,94,0.12)' },
  { label: 'SMS Sent Today', value: '2,140', change: '+340 vs yesterday', color: '#a855f7', icon: MessageSquare, bg: 'rgba(168,85,247,0.12)' },
];

const memberStatus = [
  { status: 'Active', count: 10540, color: '#22c55e', pct: 82 },
  { status: 'Pending', count: 980, color: '#f59e0b', pct: 8 },
  { status: 'Expired', count: 1120, color: '#ef4444', pct: 9 },
  { status: 'Deactivated', count: 200, color: '#5a5a6e', pct: 1 },
];

const recentGyms = [
  { name: 'Iron Paradise Gym', owner: 'Rajan Shrestha', members: 320, status: 'Active', city: 'Kathmandu' },
  { name: 'FitZone Fitness', owner: 'Sunita Tamang', members: 215, status: 'Active', city: 'Pokhara' },
  { name: 'PowerHouse Gym', owner: 'Bikash KC', members: 180, status: 'Inactive', city: 'Lalitpur' },
  { name: 'Peak Performance', owner: 'Anita Rai', members: 412, status: 'Active', city: 'Bhaktapur' },
  { name: 'Core Strength Club', owner: 'Dipak Adhikari', members: 95, status: 'Active', city: 'Biratnagar' },
];

const expiringMembers = [
  { name: 'Ram Bahadur', gym: 'Iron Paradise', expiry: '2026-05-15', days: 3 },
  { name: 'Sita Devi', gym: 'FitZone', expiry: '2026-05-17', days: 5 },
  { name: 'Hari Prasad', gym: 'PowerHouse', expiry: '2026-05-18', days: 6 },
  { name: 'Maya Gurung', gym: 'Peak Perf.', expiry: '2026-05-20', days: 8 },
  { name: 'Suresh Thapa', gym: 'Core Strength', expiry: '2026-05-22', days: 10 },
];

// Mini bar chart SVG
function MiniBarChart({ data, color }) {
  const max = Math.max(...data);
  return (
    <svg viewBox={`0 0 ${data.length * 10} 40`} style={{ width: '100%', height: '50px' }}>
      {data.map((v, i) => (
        <rect
          key={i}
          x={i * 10 + 1}
          y={40 - (v / max) * 38}
          width={7}
          height={(v / max) * 38}
          rx={2}
          fill={i === data.length - 1 ? color : `${color}55`}
        />
      ))}
    </svg>
  );
}

function MiniLineChart({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 200},${40 - ((v - min) / range) * 36}`).join(' ');
  return (
    <svg viewBox="0 0 200 40" style={{ width: '100%', height: '50px' }}>
      <defs>
        <linearGradient id={`g${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function DashboardPage() {
  const weeklyAttendance = [310, 420, 380, 510, 470, 560, 490, 620, 580, 670, 640, 720];

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '1.75rem' }}
      >
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.06em', color: '#f0f0f5' }}>
          PLATFORM <span style={{ color: '#f97316' }}>OVERVIEW</span>
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#5a5a6e', marginTop: '0.2rem' }}>
          Real-time metrics across all gyms — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            whileHover={{ y: -3 }}
            style={{
              background: '#18181f',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '0.875rem',
              padding: '1.25rem',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'default',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${card.color}40`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
          >
            <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${card.color}18, transparent 70%)`, filter: 'blur(15px)', pointerEvents: 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em', color: '#5a5a6e' }}>{card.label.toUpperCase()}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: card.bg }}>
                <card.icon size={15} color={card.color} />
              </div>
            </div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2.2rem', color: '#f0f0f5', letterSpacing: '0.04em', lineHeight: 1 }}>{card.value}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: card.color, marginTop: '0.4rem' }}>{card.change}</div>
            <div style={{ marginTop: '0.75rem' }}>
              <MiniLineChart data={[30,45,38,55,48,62,54,70,65,75,68,82]} color={card.color} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Weekly Attendance Chart */}
        <motion.div
          custom={4} variants={fadeUp} initial="hidden" animate="show"
          style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em' }}>ATTENDANCE TREND</h3>
              <p style={{ fontFamily: 'DM Sans', fontSize: '0.75rem', color: '#5a5a6e', marginTop: '0.1rem' }}>Platform-wide daily attendance</p>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['7D', '30D', '90D'].map((p, i) => (
                <button key={p} style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', padding: '0.25rem 0.6rem', borderRadius: '4px', border: '1px solid', borderColor: i === 0 ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.08)', background: i === 0 ? 'rgba(249,115,22,0.1)' : 'transparent', color: i === 0 ? '#f97316' : '#5a5a6e', cursor: 'pointer' }}>{p}</button>
              ))}
            </div>
          </div>
          {/* SVG bar chart */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '120px' }}>
            {weeklyAttendance.map((v, i) => {
              const max = Math.max(...weeklyAttendance);
              const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', background: i === weeklyAttendance.length - 1 ? '#f97316' : `rgba(249,115,22,${0.15 + (v/max)*0.45})`, borderRadius: '4px 4px 0 0', height: `${(v / max) * 100}%`, transition: 'height 0.4s ease', cursor: 'pointer' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f97316'}
                    onMouseLeave={e => { if (i !== weeklyAttendance.length - 1) e.currentTarget.style.background = `rgba(249,115,22,${0.15 + (v/max)*0.45})`; }}
                  />
                  <span style={{ fontFamily: 'DM Sans', fontSize: '0.6rem', color: '#3a3a4a' }}>{months[i]}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Member Status Donut */}
        <motion.div
          custom={5} variants={fadeUp} initial="hidden" animate="show"
          style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.5rem' }}
        >
          <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>MEMBER STATUS</h3>
          {/* Fake donut */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <svg viewBox="0 0 120 120" style={{ width: '120px', height: '120px' }}>
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" />
              {memberStatus.reduce((acc, s, i) => {
                const total = memberStatus.reduce((a, x) => a + x.count, 0);
                const circumference = 2 * Math.PI * 48;
                const dash = (s.count / total) * circumference;
                const offset = acc.offset;
                acc.elements.push(
                  <circle key={s.status} cx="60" cy="60" r="48"
                    fill="none" stroke={s.color} strokeWidth="18"
                    strokeDasharray={`${dash} ${circumference - dash}`}
                    strokeDashoffset={-offset}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dasharray 0.5s ease' }}
                  />
                );
                acc.offset += dash;
                return acc;
              }, { elements: [], offset: 0 }).elements}
              <text x="60" y="56" textAnchor="middle" style={{ fontFamily: 'Bebas Neue', fontSize: '20px', fill: '#f0f0f5' }}>82%</text>
              <text x="60" y="70" textAnchor="middle" style={{ fontFamily: 'DM Sans', fontSize: '8px', fill: '#5a5a6e' }}>active</text>
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {memberStatus.map(s => (
              <div key={s.status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: s.color }} />
                  <span style={{ fontFamily: 'DM Sans', fontSize: '0.8rem', color: '#9090a8' }}>{s.status}</span>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#f0f0f5' }}>{s.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
        {/* Recent Gyms */}
        <motion.div
          custom={6} variants={fadeUp} initial="hidden" animate="show"
          style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em' }}>REGISTERED GYMS</h3>
            <button style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.08em', color: '#f97316', background: 'none', border: 'none', cursor: 'pointer' }}>VIEW ALL →</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentGyms.map((gym, i) => (
              <motion.div
                key={gym.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem', cursor: 'default' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.05)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,115,22,0.1)', fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: '#f97316' }}>
                    {gym.name[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.03em' }}>{gym.name}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '0.72rem', color: '#5a5a6e' }}>{gym.city} · {gym.owner}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: '#f0f0f5' }}>{gym.members}</div>
                    <div style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: '#5a5a6e' }}>members</div>
                  </div>
                  <span style={{
                    fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.08em',
                    color: gym.status === 'Active' ? '#22c55e' : '#ef4444',
                    background: gym.status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    border: `1px solid ${gym.status === 'Active' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                    borderRadius: '4px', padding: '0.2rem 0.5rem',
                  }}>{gym.status.toUpperCase()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Expiring Members */}
        <motion.div
          custom={7} variants={fadeUp} initial="hidden" animate="show"
          style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', padding: '1.5rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em' }}>EXPIRING SOON</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'DM Sans', fontSize: '0.7rem', color: '#f59e0b' }}>
              <AlertTriangle size={12} />
              {expiringMembers.length} members
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {expiringMembers.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.07 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.5rem' }}
              >
                <div>
                  <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem' }}>{m.name}</div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: '#5a5a6e' }}>{m.gym}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: m.days <= 3 ? '#ef4444' : m.days <= 7 ? '#f59e0b' : '#9090a8' }}>
                    {m.days}d left
                  </div>
                  <div style={{ fontFamily: 'DM Sans', fontSize: '0.65rem', color: '#5a5a6e' }}>{m.expiry}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
