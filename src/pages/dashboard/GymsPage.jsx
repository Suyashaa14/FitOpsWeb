import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Building2, Users, MoreVertical, CheckCircle, XCircle, Filter } from 'lucide-react';

const gyms = [
  { id: 1, name: 'Iron Paradise Gym', owner: 'Rajan Shrestha', email: 'rajan@ironparadise.com', city: 'Kathmandu', members: 320, plan: 'Pro', status: 'Active', joined: '2024-01-15' },
  { id: 2, name: 'FitZone Fitness', owner: 'Sunita Tamang', email: 'sunita@fitzone.com', city: 'Pokhara', members: 215, plan: 'Starter', status: 'Active', joined: '2024-02-20' },
  { id: 3, name: 'PowerHouse Gym', owner: 'Bikash KC', email: 'bikash@powerhouse.com', city: 'Lalitpur', members: 180, plan: 'Pro', status: 'Inactive', joined: '2024-03-10' },
  { id: 4, name: 'Peak Performance', owner: 'Anita Rai', email: 'anita@peak.com', city: 'Bhaktapur', members: 412, plan: 'Enterprise', status: 'Active', joined: '2023-11-05' },
  { id: 5, name: 'Core Strength Club', owner: 'Dipak Adhikari', email: 'dipak@corestrength.com', city: 'Biratnagar', members: 95, plan: 'Starter', status: 'Active', joined: '2024-04-18' },
  { id: 6, name: 'Muscle Factory', owner: 'Suresh Gurung', email: 'suresh@musclefactory.com', city: 'Butwal', members: 260, plan: 'Pro', status: 'Active', joined: '2024-01-28' },
  { id: 7, name: 'Zen Fitness Studio', owner: 'Priya Sharma', email: 'priya@zen.com', city: 'Hetauda', members: 145, plan: 'Starter', status: 'Active', joined: '2024-05-02' },
  { id: 8, name: 'Alpha Gym', owner: 'Nabin Thapa', email: 'nabin@alphagym.com', city: 'Dharan', members: 88, plan: 'Starter', status: 'Inactive', joined: '2024-03-25' },
];

const planColors = { Starter: '#3b82f6', Pro: '#f97316', Enterprise: '#a855f7' };

export default function GymsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = gyms.filter(g =>
    (filter === 'All' || g.status === filter) &&
    (g.name.toLowerCase().includes(search.toLowerCase()) || g.owner.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.06em' }}>
            GYM <span style={{ color: '#f97316' }}>MANAGEMENT</span>
          </h1>
          <p style={{ fontFamily: 'DM Sans', fontSize: '0.875rem', color: '#5a5a6e', marginTop: '0.2rem' }}>
            Monitor and manage all registered gyms on the platform
          </p>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.08em', color: 'white', background: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'none', borderRadius: '0.6rem', padding: '0.65rem 1.25rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(249,115,22,0.3)' }}>
          <Plus size={15} /> ADD GYM
        </button>
      </motion.div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.875rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Gyms', val: gyms.length, color: '#f97316' },
          { label: 'Active', val: gyms.filter(g => g.status === 'Active').length, color: '#22c55e' },
          { label: 'Inactive', val: gyms.filter(g => g.status === 'Inactive').length, color: '#ef4444' },
          { label: 'Total Members', val: gyms.reduce((a, g) => a + g.members, 0).toLocaleString(), color: '#3b82f6' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}
          >
            <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#5a5a6e', marginBottom: '0.4rem' }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', color: s.color, letterSpacing: '0.04em' }}>{s.val}</div>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.875rem', overflow: 'hidden' }}
      >
        {/* Toolbar */}
        <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} color="#5a5a6e" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search gyms..."
              style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.4rem', padding: '0.5rem 0.75rem 0.5rem 2.2rem', fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#9090a8', outline: 'none', width: '240px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {['All', 'Active', 'Inactive'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.06em', padding: '0.35rem 0.8rem', borderRadius: '4px', border: '1px solid', borderColor: filter === f ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)', background: filter === f ? 'rgba(249,115,22,0.1)' : 'transparent', color: filter === f ? '#f97316' : '#5a5a6e', cursor: 'pointer' }}
              >{f}</button>
            ))}
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr', gap: '1rem', padding: '0.6rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          {['Gym', 'Owner', 'City', 'Members', 'Plan', 'Status', ''].map(h => (
            <div key={h} style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#5a5a6e' }}>{h.toUpperCase()}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.map((gym, i) => (
          <motion.div key={gym.id}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 + i * 0.05 }}
            style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 0.8fr 0.8fr 0.8fr 0.6fr', gap: '1rem', padding: '0.8rem 1.25rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'default', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(249,115,22,0.03)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(249,115,22,0.1)', fontFamily: 'Bebas Neue', fontSize: '0.95rem', color: '#f97316', flexShrink: 0 }}>{gym.name[0]}</div>
              <div>
                <div style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.875rem' }}>{gym.name}</div>
                <div style={{ fontFamily: 'DM Sans', fontSize: '0.7rem', color: '#5a5a6e' }}>{gym.email}</div>
              </div>
            </div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#9090a8' }}>{gym.owner}</div>
            <div style={{ fontFamily: 'DM Sans', fontSize: '0.85rem', color: '#9090a8' }}>{gym.city}</div>
            <div style={{ fontFamily: 'JetBrains Mono', fontSize: '0.85rem', color: '#f0f0f5' }}>{gym.members}</div>
            <div>
              <span style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', color: planColors[gym.plan], background: `${planColors[gym.plan]}15`, border: `1px solid ${planColors[gym.plan]}30`, borderRadius: '4px', padding: '0.2rem 0.5rem' }}>{gym.plan.toUpperCase()}</span>
            </div>
            <div>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.06em', color: gym.status === 'Active' ? '#22c55e' : '#ef4444' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: gym.status === 'Active' ? '#22c55e' : '#ef4444', boxShadow: `0 0 6px ${gym.status === 'Active' ? '#22c55e' : '#ef4444'}` }} />
                {gym.status.toUpperCase()}
              </span>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#5a5a6e', display: 'flex', padding: '4px' }}>
              <MoreVertical size={14} />
            </button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
