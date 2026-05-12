import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, UserX, Clock, AlertTriangle, MoreVertical } from 'lucide-react';

const members = [
  { id: 1, name: 'Ram Bahadur Thapa', phone: '9801234567', gym: 'Iron Paradise', package: 'Premium', status: 'Active', expiry: '2026-07-15', joined: '2026-01-15' },
  { id: 2, name: 'Sita Devi Sharma', phone: '9807654321', gym: 'FitZone Fitness', package: 'Basic', status: 'Pending', expiry: '2026-05-17', joined: '2026-04-30' },
  { id: 3, name: 'Hari Prasad KC', phone: '9812345678', gym: 'PowerHouse', package: 'Standard', status: 'Expired', expiry: '2026-05-01', joined: '2025-11-01' },
  { id: 4, name: 'Maya Gurung', phone: '9845678901', gym: 'Peak Performance', package: 'Premium', status: 'Active', expiry: '2026-12-20', joined: '2025-12-20' },
  { id: 5, name: 'Suresh Thapa Magar', phone: '9823456789', gym: 'Core Strength', package: 'Basic', status: 'Active', expiry: '2026-06-10', joined: '2026-05-10' },
  { id: 6, name: 'Anita Shrestha', phone: '9856789012', gym: 'Iron Paradise', package: 'Standard', status: 'Active', expiry: '2026-08-05', joined: '2026-02-05' },
  { id: 7, name: 'Dipesh Karki', phone: '9834567890', gym: 'Muscle Factory', package: 'Basic', status: 'Deactivated', expiry: '2026-04-01', joined: '2025-10-01' },
  { id: 8, name: 'Rekha Rai', phone: '9867890123', gym: 'FitZone Fitness', package: 'Premium', status: 'Active', expiry: '2026-09-30', joined: '2025-09-30' },
];

const statusConfig = {
  Active: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  Expired: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  Deactivated: { color: '#5a5a6e', bg: 'rgba(90,90,110,0.1)', border: 'rgba(90,90,110,0.2)' },
};

const packageColors = { Basic: '#3b82f6', Standard: '#f97316', Premium: '#a855f7' };

export default function MembersPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = members.filter(m =>
    (filter === 'All' || m.status === filter) &&
    (m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search) || m.gym.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.06em' }}>
          ALL <span style={{ color: '#f97316' }}>MEMBERS</span>
        </h1>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#5a5a6e', marginTop: '0.2rem' }}>
          Platform-wide member overview across all gyms
        </p>
      </motion.div>

      {/* Status summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {Object.entries(statusConfig).map(([status, cfg], i) => (
          <motion.div key={status} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'border-color 0.2s' }}
            whileHover={{ y: -2 }}
            onClick={() => setFilter(filter === status ? 'All' : status)}
          >
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#5a5a6e', marginBottom: '0.4rem' }}>{status.toUpperCase()}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: cfg.color, letterSpacing: '0.04em' }}>
              {members.filter(m => m.status === status).length}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', overflow: 'hidden' }}
      >
        <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#5a5a6e" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, gym..."
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.4rem', padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#9090a8', outline: 'none', width: '280px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['All', 'Active', 'Pending', 'Expired', 'Deactivated'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', padding: '0.3rem 0.65rem', borderRadius: '4px', border: '1px solid', borderColor: filter === f ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)', background: filter === f ? 'rgba(249,115,22,0.1)' : 'transparent', color: filter === f ? '#f97316' : '#5a5a6e', cursor: 'pointer' }}
              >{f}</button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.8fr 0.5fr', gap: '1rem', padding: '0.6rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['Member', 'Phone', 'Gym', 'Package', 'Expiry', 'Status', ''].map(h => (
            <div key={h} style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#5a5a6e' }}>{h}</div>
          ))}
        </div>

        {filtered.map((m, i) => {
          const cfg = statusConfig[m.status];
          return (
            <motion.div key={m.id}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + i * 0.05 }}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 0.8fr 0.5fr', gap: '1rem', padding: '0.8rem 1.25rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s', cursor: 'default' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${cfg.color}18`, fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: cfg.color, flexShrink: 0 }}>
                  {m.name[0]}
                </div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem' }}>{m.name}</div>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#9090a8' }}>{m.phone}</div>
              <div style={{ fontFamily: 'DM Sans', fontSize: '0.82rem', color: '#9090a8' }}>{m.gym}</div>
              <div>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', color: packageColors[m.package], background: `${packageColors[m.package]}15`, borderRadius: '4px', padding: '0.15rem 0.45rem' }}>{m.package}</span>
              </div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#9090a8' }}>{m.expiry}</div>
              <div>
                <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.06em', color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: '4px', padding: '0.2rem 0.45rem' }}>{m.status.toUpperCase()}</span>
              </div>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a6e' }}><MoreVertical size={14} /></button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
