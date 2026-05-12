import { motion } from 'framer-motion';
import { BarChart3, MessageSquare, CreditCard, Settings, Construction } from 'lucide-react';

function ComingSoon({ icon: Icon, title, color = '#f97316' }) {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Bebas Neue', fontSize: '2rem', letterSpacing: '0.06em', color: '#f0f0f5' }}>
          {title.split(' ')[0]} <span style={{ color }}>{title.split(' ').slice(1).join(' ')}</span>
        </h1>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }}
        style={{ background: '#18181f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}
      >
        <div style={{ width: '72px', height: '72px', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${color}18` }}>
          <Icon size={32} color={color} />
        </div>
        <h2 style={{ fontFamily: 'Rajdhani', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.05em', color: '#f0f0f5' }}>Coming Soon</h2>
        <p style={{ fontFamily: 'DM Sans', fontSize: '0.9rem', color: '#5a5a6e', textAlign: 'center', maxWidth: '360px' }}>
          This section is being built. In the full version, you'll have complete access to {title.toLowerCase()} features.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'DM Sans', fontSize: '0.8rem', color: color }}>
          <Construction size={14} />
          Under active development
        </div>
      </motion.div>
    </div>
  );
}

export function AnalyticsPage() {
  return <ComingSoon icon={BarChart3} title="PLATFORM ANALYTICS" color="#3b82f6" />;
}

export function SMSPage() {
  return <ComingSoon icon={MessageSquare} title="SMS USAGE" color="#a855f7" />;
}

export function SubscriptionsPage() {
  return <ComingSoon icon={CreditCard} title="SUBSCRIPTION MANAGEMENT" color="#22c55e" />;
}

export function SettingsPage() {
  return <ComingSoon icon={Settings} title="PLATFORM SETTINGS" color="#f59e0b" />;
}
