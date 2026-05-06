import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// ---- Types ----
type DriverStatus = 'ONLINE' | 'OFFLINE' | 'ON_RIDE'

interface RideRequest {
  id: string
  riderName: string
  pickup: string
  destination: string
  distance: string
  estimatedPrice: number
  eta: string
}

// ---- Mock Data ----
const MOCK_REQUESTS: RideRequest[] = [
  { id: '1', riderName: 'Sara M.', pickup: 'Tahrir Square', destination: 'Cairo Airport', distance: '24 km', estimatedPrice: 180, eta: '3 min' },
  { id: '2', riderName: 'Ahmed K.', pickup: 'Zamalek', destination: 'Nasr City', distance: '11 km', estimatedPrice: 85, eta: '5 min' },
]

// ---- Icons ----
const IconPower = ({ on }: { on: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={on ? '#0A0A0A' : '#F5A623'} strokeWidth="2.5">
    <path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/>
  </svg>
)
const IconLocation = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F5A623" stroke="#F5A623" strokeWidth="1">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const IconWallet = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M16 14a2 2 0 0 0 0-4h-4v4h4z"/>
  </svg>
)
const IconRide = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
  </svg>
)
const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)
const IconBell = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
)
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ---- Stat Card ----
function StatCard({ label, value, sub, icon }: { label: string; value: string; sub?: string; icon: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--black-2)',
      border: '1px solid rgba(245,166,35,0.12)',
      padding: '24px',
      position: 'relative',
      transition: 'border-color 0.3s',
    }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.35)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.12)')}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '2px', background: 'var(--gold)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--white-dim)', fontWeight: 600 }}>{label}</span>
        <span style={{ color: 'var(--gold)', opacity: 0.7 }}>{icon}</span>
      </div>
      <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.4rem', color: 'var(--white)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--white-dim)', marginTop: '6px' }}>{sub}</div>}
    </div>
  )
}

// ---- Ride Request Card ----
function RideRequestCard({ req, onAccept, onReject }: { req: RideRequest; onAccept: (id: string) => void; onReject: (id: string) => void }) {
  const [timeLeft, setTimeLeft] = useState(30)

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => { if (p <= 1) { clearInterval(t); onReject(req.id); return 0; } return p - 1 }), 1000)
    return () => clearInterval(t)
  }, [])

  const pct = (timeLeft / 30) * 100

  return (
    <div className="animate-fade-up" style={{
      background: 'var(--black-3)',
      border: '1px solid rgba(245,166,35,0.25)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Timer bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.06)' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct > 50 ? 'var(--gold)' : pct > 20 ? '#ffaa00' : '#ff4444', transition: 'width 1s linear, background 0.3s' }} />
      </div>

      {/* Timer badge */}
      <div style={{ position: 'absolute', top: '12px', right: '12px', background: timeLeft <= 10 ? 'rgba(255,68,68,0.15)' : 'rgba(245,166,35,0.1)', border: `1px solid ${timeLeft <= 10 ? 'rgba(255,68,68,0.4)' : 'rgba(245,166,35,0.3)'}`, padding: '2px 10px', fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', color: timeLeft <= 10 ? '#ff6b6b' : 'var(--gold)', letterSpacing: '0.1em' }}>
        {timeLeft}s
      </div>

      {/* Rider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', color: '#0A0A0A', fontSize: '0.9rem', flexShrink: 0 }}>
          {req.riderName.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--white)' }}>{req.riderName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <IconStar /><span style={{ fontSize: '0.72rem', color: 'var(--white-dim)' }}>4.8 rider</span>
          </div>
        </div>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', paddingLeft: '4px' }}>
        {[
          { dot: '#44ff88', label: 'Pickup', val: req.pickup },
          { dot: '#F5A623', label: 'Drop-off', val: req.destination },
        ].map(({ dot, label, val }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: dot, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.65rem', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>{val}</div>
            </div>
          </div>
        ))}
        {/* connector line */}
        <div style={{ position: 'absolute', left: '32px', marginTop: '28px', width: '1px', height: '20px', background: 'rgba(255,255,255,0.15)' }} />
      </div>

      {/* Meta */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { label: 'Distance', val: req.distance },
          { label: 'ETA', val: req.eta },
          { label: 'Fare', val: `${req.estimatedPrice} EGP` },
        ].map(({ label, val }) => (
          <div key={label}>
            <div style={{ fontSize: '0.65rem', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
            <div style={{ fontSize: '0.9rem', color: label === 'Fare' ? 'var(--gold)' : 'var(--white)', fontWeight: 700, marginTop: '2px', fontFamily: label === 'Fare' ? 'Bebas Neue' : 'inherit', letterSpacing: label === 'Fare' ? '0.05em' : 'normal' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
        <button onClick={() => onReject(req.id)} style={{ padding: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--white-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.8rem', fontFamily: 'Bebas Neue', letterSpacing: '0.1em', transition: 'border-color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,68,68,0.4)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}>
          <IconX /> DECLINE
        </button>
        <button onClick={() => onAccept(req.id)} className="btn-gold" style={{ padding: '12px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
          <IconCheck /> ACCEPT RIDE
        </button>
      </div>
    </div>
  )
}

// ---- Main ----
export default function DriverDashboard() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<DriverStatus>('OFFLINE')
  const [requests, setRequests] = useState<RideRequest[]>([])
  const [earnings, setEarnings] = useState({ today: 420, week: 2850, rides: 7 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    if (status === 'ONLINE') {
      const t = setTimeout(() => setRequests(MOCK_REQUESTS), 3000)
      return () => clearTimeout(t)
    } else {
      setRequests([])
    }
  }, [status])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const toggleStatus = () => {
    if (status === 'OFFLINE') { setStatus('ONLINE'); showToast('You are now ONLINE — waiting for ride requests...') }
    else if (status === 'ONLINE') { setStatus('OFFLINE'); setRequests([]); showToast('You are now OFFLINE') }
  }

  const handleAccept = (id: string) => {
    setRequests([])
    setStatus('ON_RIDE')
    showToast('Ride accepted! Navigate to pickup location.')
    navigate('/driver/active')
  }

  const handleReject = (id: string) => {
    setRequests(prev => prev.filter(r => r.id !== id))
    showToast('Ride declined.')
  }

  const statusColor = status === 'ONLINE' ? '#44ff88' : status === 'ON_RIDE' ? '#F5A623' : '#666'
  const statusLabel = status === 'ONLINE' ? 'Online' : status === 'ON_RIDE' ? 'On Ride' : 'Offline'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', fontFamily: 'Barlow, sans-serif' }}>

      {/* ---- Sidebar ---- */}
      <div style={{
        width: sidebarOpen ? '260px' : '72px',
        background: 'var(--black-2)',
        borderRight: '1px solid rgba(245,166,35,0.1)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        flexShrink: 0,
        position: 'relative', zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(245,166,35,0.08)', display: 'flex', alignItems: 'center', gap: '12px', minHeight: '72px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontFamily: 'Bebas Neue', color: '#0A0A0A', flexShrink: 0 }}>SR</div>
          {sidebarOpen && <span style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.1em', color: 'var(--white)', whiteSpace: 'nowrap' }}>SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span></span>}
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            { icon: '🏠', label: 'Dashboard', active: true },
            { icon: '🚗', label: 'My Rides', active: false },
            { icon: '💰', label: 'Earnings', active: false },
            { icon: '📍', label: 'Location', active: false },
            { icon: '⭐', label: 'Ratings', active: false },
            { icon: '🚘', label: 'My Vehicle', active: false },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '10px 12px', cursor: 'pointer',
              background: item.active ? 'rgba(245,166,35,0.1)' : 'transparent',
              border: item.active ? '1px solid rgba(245,166,35,0.2)' : '1px solid transparent',
              transition: 'all 0.2s', borderRadius: '2px',
            }}
              onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && <span style={{ fontSize: '0.85rem', color: item.active ? 'var(--gold)' : 'var(--white-dim)', fontWeight: 600, whiteSpace: 'nowrap' }}>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(245,166,35,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Bebas Neue', color: '#0A0A0A', fontSize: '1rem', flexShrink: 0 }}>AK</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--white)', whiteSpace: 'nowrap' }}>Ahmed Khaled</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><IconStar /><span style={{ fontSize: '0.72rem', color: 'var(--white-dim)' }}>4.9 rating</span></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---- Main ---- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top Bar */}
        <header style={{ height: '72px', borderBottom: '1px solid rgba(245,166,35,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', background: 'var(--black)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-dim)', padding: '4px' }}>
              <IconMenu />
            </button>
            <div>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.1rem', letterSpacing: '0.08em', color: 'var(--white)' }}>DRIVER DASHBOARD</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--white-dim)' }}>
                {time.toLocaleDateString('en-EG', { weekday: 'long', day: 'numeric', month: 'long' })} · {time.toLocaleTimeString('en-EG', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Status pill */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', border: `1px solid ${statusColor}30`, background: `${statusColor}10`, borderRadius: '20px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: statusColor, boxShadow: status === 'ONLINE' ? `0 0 8px ${statusColor}` : 'none' }} />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{statusLabel}</span>
            </div>

            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-dim)', position: 'relative' }}>
              <IconBell />
              {requests.length > 0 && <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: '#ff4444', borderRadius: '50%' }} />}
            </button>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>

          {/* Power toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: 'var(--black-2)',
            border: `1px solid ${status !== 'OFFLINE' ? 'rgba(245,166,35,0.3)' : 'rgba(255,255,255,0.06)'}`,
            padding: '24px 32px',
            marginBottom: '28px',
            transition: 'border-color 0.3s',
          }}>
            <div>
              <h2 style={{ fontFamily: 'Bebas Neue', fontSize: '1.8rem', letterSpacing: '0.05em', color: 'var(--white)', lineHeight: 1 }}>
                {status === 'OFFLINE' ? 'START YOUR SHIFT' : status === 'ON_RIDE' ? 'ON A RIDE' : 'WAITING FOR REQUESTS...'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--white-dim)', marginTop: '4px' }}>
                {status === 'OFFLINE' ? 'Go online to start receiving ride requests.' : status === 'ON_RIDE' ? 'Complete the current ride to go back online.' : 'You will be notified when a rider requests a trip.'}
              </p>
            </div>

            {status !== 'ON_RIDE' && (
              <button onClick={toggleStatus} style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: status === 'ONLINE' ? 'linear-gradient(135deg, #F5A623, #B8761A)' : 'transparent',
                border: `2px solid ${status === 'ONLINE' ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.3s',
                boxShadow: status === 'ONLINE' ? '0 0 30px rgba(245,166,35,0.4)' : 'none',
              }}>
                <IconPower on={status === 'ONLINE'} />
              </button>
            )}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'rgba(245,166,35,0.08)', marginBottom: '28px' }}>
            <StatCard label="Today's Earnings" value={`${earnings.today} EGP`} sub="↑ 12% vs yesterday" icon={<IconWallet />} />
            <StatCard label="Weekly Earnings" value={`${earnings.week} EGP`} sub="5 days active" icon={<IconWallet />} />
            <StatCard label="Rides Today" value={String(earnings.rides)} sub="Last: 45 min ago" icon={<IconRide />} />
          </div>

          {/* Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>

            {/* Map placeholder */}
            <div style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.1)', position: 'relative', overflow: 'hidden', minHeight: '380px' }}>
              {/* Fake map grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                {/* Fake roads */}
                <line x1="0" y1="40%" x2="100%" y2="40%" stroke="rgba(245,166,35,0.1)" strokeWidth="8"/>
                <line x1="30%" y1="0" x2="30%" y2="100%" stroke="rgba(245,166,35,0.1)" strokeWidth="6"/>
                <line x1="70%" y1="0" x2="70%" y2="100%" stroke="rgba(245,166,35,0.08)" strokeWidth="4"/>
                <line x1="0" y1="70%" x2="100%" y2="70%" stroke="rgba(245,166,35,0.08)" strokeWidth="4"/>
                {/* Driver dot */}
                <circle cx="50%" cy="50%" r="10" fill="rgba(245,166,35,0.2)" stroke="#F5A623" strokeWidth="2"/>
                <circle cx="50%" cy="50%" r="4" fill="#F5A623"/>
              </svg>
              <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(245,166,35,0.2)', padding: '8px 14px', backdropFilter: 'blur(8px)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconLocation />
                  <span style={{ fontSize: '0.78rem', color: 'var(--white)', fontWeight: 600 }}>Cairo, Egypt</span>
                </div>
              </div>
              <div style={{ position: 'absolute', bottom: '16px', right: '16px', background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(245,166,35,0.2)', padding: '6px 12px' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--gold)', fontFamily: 'Bebas Neue', letterSpacing: '0.1em' }}>LIVE MAP</span>
              </div>
              {status === 'OFFLINE' && (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1.2rem', color: 'var(--white-dim)', letterSpacing: '0.15em', marginBottom: '8px' }}>GO ONLINE TO SEE REQUESTS</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>Press the power button above</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Ride Requests */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
                    RIDE REQUESTS
                    {requests.length > 0 && <span style={{ marginLeft: '8px', background: 'var(--gold)', color: 'var(--black)', fontSize: '0.7rem', padding: '1px 7px', fontFamily: 'Bebas Neue' }}>{requests.length}</span>}
                  </h3>
                </div>

                {status === 'OFFLINE' && (
                  <div style={{ background: 'var(--black-3)', border: '1px dashed rgba(255,255,255,0.08)', padding: '32px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>😴</div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: 'var(--white-dim)', letterSpacing: '0.1em' }}>YOU'RE OFFLINE</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Go online to receive requests</div>
                  </div>
                )}

                {status === 'ONLINE' && requests.length === 0 && (
                  <div style={{ background: 'var(--black-3)', border: '1px dashed rgba(245,166,35,0.15)', padding: '32px 20px', textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '2px solid rgba(245,166,35,0.3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '0.9rem', color: 'var(--gold)', letterSpacing: '0.1em' }}>SEARCHING FOR RIDERS...</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>Requests will appear here</div>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {requests.map(req => (
                    <RideRequestCard key={req.id} req={req} onAccept={handleAccept} onReject={handleReject} />
                  ))}
                </div>
              </div>

              {/* Recent rides */}
              <div style={{ background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.1)', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', letterSpacing: '0.1em', color: 'var(--white)' }}>RECENT RIDES</h3>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontFamily: 'Bebas Neue', letterSpacing: '0.1em' }}>
                    VIEW ALL <IconArrow />
                  </button>
                </div>
                {[
                  { from: 'Mohandessin', to: 'Heliopolis', amount: 95, time: '2h ago' },
                  { from: 'Maadi', to: 'Downtown', amount: 70, time: '4h ago' },
                  { from: 'Zamalek', to: '6th October', amount: 130, time: '6h ago' },
                ].map((ride, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IconRide />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--white)', fontWeight: 600 }}>{ride.from} → {ride.to}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--white-dim)', marginTop: '2px' }}>{ride.time}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Bebas Neue', fontSize: '1rem', color: 'var(--gold)', letterSpacing: '0.05em' }}>{ride.amount} EGP</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.3)',
          padding: '12px 24px', fontSize: '0.85rem', color: 'var(--white)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          animation: 'fadeUp 0.3s ease',
          zIndex: 9999, whiteSpace: 'nowrap',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}
