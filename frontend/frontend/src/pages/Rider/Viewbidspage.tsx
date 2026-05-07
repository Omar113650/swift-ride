import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

interface Bid {
  id: string
  driverId: string
  price: number
  arrivalTime: number
  isSelected: boolean
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  createdAt: string
  driver?: {
    rating?: number
    totalTrips?: number
    user?: { name?: string }
    vehicle?: { model?: string; plateNumber?: string }
  }
}

interface RideInfo {
  id: string
  pickupAddress?: string
  destinationAddress?: string
  distance?: number
  status: string
}

// ─── Demo bids for when rideId === 'demo' ─────────────────────
const DEMO_BIDS: Bid[] = [
  { id: 'd1', driverId: 'drv1', price: 45, arrivalTime: 4, isSelected: false, status: 'PENDING', createdAt: '', driver: { rating: 4.9, totalTrips: 1240, user: { name: 'Ahmed Hassan' }, vehicle: { model: 'Toyota Camry 2022', plateNumber: 'ABC-1234' } } },
  { id: 'd2', driverId: 'drv2', price: 38, arrivalTime: 7, isSelected: false, status: 'PENDING', createdAt: '', driver: { rating: 4.7, totalTrips: 876, user: { name: 'Mohamed Ali' }, vehicle: { model: 'Hyundai Elantra 2021', plateNumber: 'XYZ-5678' } } },
  { id: 'd3', driverId: 'drv3', price: 35, arrivalTime: 10, isSelected: false, status: 'PENDING', createdAt: '', driver: { rating: 4.6, totalTrips: 542, user: { name: 'Khaled Omar' }, vehicle: { model: 'Kia Cerato 2023', plateNumber: 'LMN-9012' } } },
  { id: 'd4', driverId: 'drv4', price: 50, arrivalTime: 3, isSelected: false, status: 'PENDING', createdAt: '', driver: { rating: 4.8, totalTrips: 2100, user: { name: 'Samir Fathy' }, vehicle: { model: 'Honda Civic 2020', plateNumber: 'PQR-3456' } } },
]

export default function ViewBidsPage() {
  const navigate = useNavigate()
  const { rideId } = useParams<{ rideId: string }>()
  const isDemo = rideId === 'demo'

  const [bids, setBids] = useState<Bid[]>([])
  const [ride, setRide] = useState<RideInfo | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(!isDemo)
  const [error, setError] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'time'>('price')
  const [timeLeft, setTimeLeft] = useState(120)
  const [pollingActive, setPollingActive] = useState(!isDemo)

  const token = localStorage.getItem('token')

  // ── Demo mode: simulate bids arriving one by one ──
  useEffect(() => {
    if (!isDemo) return
    setRide({ id: 'demo', pickupAddress: 'Cairo University', destinationAddress: 'Tahrir Square', distance: 8.2, status: 'PENDING' })
    DEMO_BIDS.forEach((bid, i) => {
      setTimeout(() => setBids(prev => [...prev, bid]), i * 700 + 500)
    })
  }, [isDemo])

  // ── Real mode: fetch ride info ──
  useEffect(() => {
    if (isDemo || !rideId) return
    fetch(`${API}/rides/${rideId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => d && setRide(d))
      .catch(() => {})
  }, [rideId, isDemo])

  // ── Real mode: poll bids every 5s ──
  const fetchBids = useCallback(async () => {
    if (isDemo || !rideId) return
    try {
      const res = await fetch(`${API}/ride-bids/${rideId}/bids`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load bids')
      const data: Bid[] = await res.json()
      setBids(data)
      setLoading(false)
      const accepted = data.find(b => b.isSelected)
      if (accepted) { setSelected(accepted.id); setPollingActive(false) }
    } catch (e: any) {
      setError(e.message); setLoading(false)
    }
  }, [rideId, isDemo, token])

  useEffect(() => {
    if (isDemo) return
    fetchBids()
    if (!pollingActive) return
    const interval = setInterval(fetchBids, 5000)
    return () => clearInterval(interval)
  }, [fetchBids, pollingActive, isDemo])

  // ── Timer ──
  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  // ── Accept bid ──
  const handleAccept = async () => {
    if (!selected || !rideId) return
    setConfirming(true); setError('')

    if (isDemo) {
      setTimeout(() => navigate('/rider/tracking'), 1000)
      return
    }

    try {
      const res = await fetch(`${API}/ride-bids/${rideId}/select/${selected}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Failed to confirm')
      setPollingActive(false)
      navigate('/rider/tracking')
    } catch (e: any) {
      setError(e.message); setConfirming(false)
    }
  }

  const sorted = [...bids].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'rating') return (b.driver?.rating ?? 0) - (a.driver?.rating ?? 0)
    return a.arrivalTime - b.arrivalTime
  })

  const cheapest = bids.length > 0 ? Math.min(...bids.map(b => b.price)) : null
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  const selectedBid = bids.find(b => b.id === selected)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* ── Header ── */}
      <header style={{
        borderBottom: '1px solid rgba(245,166,35,0.1)', padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px', background: 'linear-gradient(135deg, #F5A623, #B8761A)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A',
          }}>SR</div>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
            SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
          </span>
        </div>

        {/* Timer */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          background: timeLeft < 30 ? 'rgba(255,80,80,0.1)' : 'rgba(245,166,35,0.07)',
          border: `1px solid ${timeLeft < 30 ? 'rgba(255,80,80,0.3)' : 'rgba(245,166,35,0.2)'}`,
          padding: '8px 20px', transition: 'all 0.3s',
        }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: timeLeft < 30 ? '#ff5050' : 'var(--gold)', animation: 'pulse 1s infinite' }} />
          <div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif' }}>
              {pollingActive ? 'COLLECTING BIDS' : isDemo ? 'BIDS EXPIRE IN' : 'BIDS CLOSED'}
            </div>
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', lineHeight: 1, color: timeLeft < 30 ? '#ff5050' : 'var(--gold)' }}>
              {mins}:{secs.toString().padStart(2, '0')}
            </div>
          </div>
        </div>

        <button onClick={() => navigate('/rider/book')} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', padding: '8px 16px', cursor: 'pointer',
          fontSize: '0.75rem', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif',
        }}>← EDIT RIDE</button>
      </header>

      {/* ── Ride Banner ── */}
      {ride && (
        <div style={{
          background: 'rgba(245,166,35,0.04)', borderBottom: '1px solid rgba(245,166,35,0.1)',
          padding: '14px 32px', display: 'flex', alignItems: 'center', gap: '16px',
          position: 'relative', zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', background: 'var(--gold)', borderRadius: '50%' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>{ride.pickupAddress ?? 'Pickup'}</span>
          </div>
          <div style={{ color: 'rgba(255,255,255,0.2)' }}>→</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '7px', height: '7px', border: '1px solid var(--gold)' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>{ride.destinationAddress ?? 'Destination'}</span>
          </div>
          {ride.distance && (
            <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{ride.distance.toFixed(1)} km</span>
          )}
          {pollingActive && !isDemo && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'rgba(245,166,35,0.6)' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--gold)', animation: 'pulse 1s infinite' }} />
              auto-refreshing every 5s
            </div>
          )}
          {isDemo && (
            <div style={{
              marginLeft: 'auto', fontSize: '0.65rem', color: 'rgba(245,166,35,0.5)',
              border: '1px solid rgba(245,166,35,0.15)', padding: '3px 10px',
              fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
            }}>DEMO MODE</div>
          )}
        </div>
      )}

      {/* ── Main ── */}
      <main style={{
        flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto',
        padding: '32px', position: 'relative', zIndex: 1,
        paddingBottom: selected ? '110px' : '32px',
      }}>

        {/* Title + Sort */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--white)', letterSpacing: '0.05em', margin: 0 }}>
              DRIVER BIDS
              {bids.length > 0 && (
                <span style={{ marginLeft: '12px', background: 'var(--gold)', color: '#0A0A0A', fontFamily: 'Barlow, sans-serif', fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', verticalAlign: 'middle' }}>
                  {bids.length}
                </span>
              )}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '4px 0 0' }}>
              {loading ? 'Connecting to server...' : bids.length === 0 ? 'Waiting for driver bids...' : 'Choose the best offer for your ride'}
            </p>
          </div>

          {bids.length > 1 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['price', 'rating', 'time'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{
                  background: sortBy === s ? 'rgba(245,166,35,0.15)' : 'transparent',
                  border: `1px solid ${sortBy === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  color: sortBy === s ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                  padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem',
                  fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', transition: 'all 0.2s',
                }}>{s === 'time' ? 'ETA' : s.toUpperCase()}</button>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.2)', padding: '12px 16px', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '16px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading spinner */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', gap: '16px' }}>
            <div style={{ width: '48px', height: '48px', border: '2px solid rgba(245,166,35,0.15)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em', fontSize: '0.85rem' }}>CONNECTING TO SERVER...</p>
          </div>
        )}

        {/* Empty — waiting for bids */}
        {!loading && bids.length === 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', gap: '16px' }}>
            <div style={{ width: '52px', height: '52px', border: '2px solid rgba(245,166,35,0.15)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 1.2s linear infinite' }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
              BROADCASTING YOUR RIDE REQUEST...
            </p>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', margin: 0 }}>Drivers nearby will submit their offers shortly</p>
          </div>
        )}

        {/* ── Bids List ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sorted.map((bid, index) => {
            const isLowest = bid.price === cheapest
            const driverName = bid.driver?.user?.name ?? `Driver #${bid.driverId.slice(0, 6)}`
            const driverRating = bid.driver?.rating ?? 4.5
            const driverTrips = bid.driver?.totalTrips ?? 0
            const carModel = bid.driver?.vehicle?.model ?? '—'
            const plate = bid.driver?.vehicle?.plateNumber ?? '—'
            const initials = driverName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
            const isChosen = selected === bid.id
            const isRejected = bid.status === 'REJECTED'

            return (
              <div
                key={bid.id}
                onClick={() => { if (!isRejected) setSelected(bid.id) }}
                style={{
                  border: `1px solid ${isChosen ? 'var(--gold)' : isLowest && bids.length > 1 ? 'rgba(245,166,35,0.25)' : 'rgba(255,255,255,0.07)'}`,
                  background: isChosen
                    ? 'rgba(245,166,35,0.08)'
                    : isLowest && bids.length > 1 ? 'rgba(245,166,35,0.03)' : 'rgba(255,255,255,0.02)',
                  padding: '20px 24px',
                  cursor: isRejected ? 'default' : 'pointer',
                  position: 'relative',
                  transition: 'all 0.25s',
                  opacity: isRejected ? 0.4 : 1,
                  animation: `slideIn 0.3s ease ${index * 0.05}s both`,
                }}
              >
                {/* Badge */}
                {isLowest && bids.length > 1 && !isRejected && (
                  <div style={{ position: 'absolute', top: '-1px', left: '20px', background: 'var(--gold)', color: '#0A0A0A', fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', padding: '2px 10px' }}>
                    🔥 LOWEST PRICE
                  </div>
                )}
                {isRejected && (
                  <div style={{ position: 'absolute', top: '-1px', left: '20px', background: 'rgba(255,80,80,0.5)', color: '#fff', fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', padding: '2px 10px' }}>REJECTED</div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '52px', height: '52px', flexShrink: 0,
                    background: `linear-gradient(135deg, rgba(245,166,35,${isChosen ? 0.4 : 0.2}), rgba(245,166,35,0.05))`,
                    border: `1px solid rgba(245,166,35,${isChosen ? 0.5 : 0.15})`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'var(--gold)',
                  }}>{initials}</div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--white)' }}>{driverName}</span>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>⭐ {driverRating.toFixed(1)}</span>
                      {driverTrips > 0 && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{driverTrips.toLocaleString()} trips</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                      {carModel}
                      {plate !== '—' && <span style={{ color: 'rgba(245,166,35,0.7)', fontWeight: 600 }}> · {plate}</span>}
                    </div>
                  </div>

                  {/* ETA */}
                  <div style={{ textAlign: 'center', minWidth: '70px' }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{bid.arrivalTime}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>MIN AWAY</div>
                  </div>

                  {/* Price */}
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: isChosen ? 'var(--gold)' : 'var(--white)', lineHeight: 1 }}>
                      {bid.price} EGP
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>TOTAL FARE</div>
                  </div>

                  {/* Checkbox */}
                  <div style={{
                    width: '24px', height: '24px', flexShrink: 0,
                    border: `2px solid ${isChosen ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                    background: isChosen ? 'var(--gold)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                  }}>
                    {isChosen && <span style={{ color: '#0A0A0A', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Accept sticky bar ── */}
      {selected && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(10,10,10,0.97)',
          borderTop: '1px solid rgba(245,166,35,0.2)',
          padding: '18px 32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px',
          zIndex: 100, backdropFilter: 'blur(8px)',
        }}>
          {confirming ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid rgba(245,166,35,0.3)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em', color: 'var(--gold)' }}>CONFIRMING RIDE...</span>
            </>
          ) : (
            <>
              {selectedBid && (
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                  Selected: <strong style={{ color: 'var(--gold)' }}>
                    {selectedBid.driver?.user?.name ?? `Driver #${selectedBid.driverId.slice(0, 6)}`}
                  </strong>
                  {' '}— <strong style={{ color: 'var(--white)' }}>{selectedBid.price} EGP</strong>
                  {' '}· <span>{selectedBid.arrivalTime} min away</span>
                </div>
              )}
              <button onClick={handleAccept} style={{
                padding: '14px 52px',
                background: 'linear-gradient(135deg, #F5A623, #B8761A)',
                border: 'none', color: '#0A0A0A',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.12em',
                cursor: 'pointer',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              }}>ACCEPT BID →</button>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}