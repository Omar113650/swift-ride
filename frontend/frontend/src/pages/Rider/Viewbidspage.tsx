import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface Bid {
  id: string
  driverName: string
  rating: number
  trips: number
  carModel: string
  carPlate: string
  price: number
  arrivalTime: number
  isTop?: boolean
}

const MOCK_BIDS: Bid[] = [
  { id: '1', driverName: 'Ahmed Hassan', rating: 4.9, trips: 1240, carModel: 'Toyota Camry 2022', carPlate: 'ABC-1234', price: 45, arrivalTime: 4, isTop: true },
  { id: '2', driverName: 'Mohamed Ali', rating: 4.7, trips: 876, carModel: 'Hyundai Elantra 2021', carPlate: 'XYZ-5678', price: 38, arrivalTime: 7 },
  { id: '3', driverName: 'Khaled Omar', rating: 4.6, trips: 542, carModel: 'Kia Cerato 2023', carPlate: 'LMN-9012', price: 35, arrivalTime: 10 },
  { id: '4', driverName: 'Samir Fathy', rating: 4.8, trips: 2100, carModel: 'Honda Civic 2020', carPlate: 'PQR-3456', price: 50, arrivalTime: 3 },
]

export default function ViewBidsPage() {
  const navigate = useNavigate()
  const [bids, setBids] = useState<Bid[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120)
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'time'>('price')

  useEffect(() => {
    // Simulate bids arriving one by one
    const timers = MOCK_BIDS.map((bid, i) =>
      setTimeout(() => setBids(prev => [...prev, bid]), i * 800 + 400)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) return
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft])

  const sorted = [...bids].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price
    if (sortBy === 'rating') return b.rating - a.rating
    return a.arrivalTime - b.arrivalTime
  })

  const handleAccept = () => {
    if (!selected) return
    setConfirming(true)
    setTimeout(() => navigate('/rider/tracking'), 1500)
  }

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(245,166,35,0.1)',
        padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #F5A623, #B8761A)',
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
          background: timeLeft < 30 ? 'rgba(255,80,80,0.1)' : 'rgba(245,166,35,0.08)',
          border: `1px solid ${timeLeft < 30 ? 'rgba(255,80,80,0.3)' : 'rgba(245,166,35,0.2)'}`,
          padding: '8px 20px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: timeLeft < 30 ? '#ff5050' : 'var(--gold)',
            animation: 'pulse 1s infinite',
          }} />
          <div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif' }}>BIDS EXPIRE IN</div>
            <div style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem',
              color: timeLeft < 30 ? '#ff5050' : 'var(--gold)',
              lineHeight: 1,
            }}>{mins}:{secs.toString().padStart(2, '0')}</div>
          </div>
        </div>

        <button onClick={() => navigate('/rider/book')} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
          padding: '8px 16px', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em',
          fontFamily: 'Bebas Neue, sans-serif',
        }}>← EDIT RIDE</button>
      </header>

      {/* Ride Info Banner */}
      <div style={{
        background: 'rgba(245,166,35,0.05)',
        borderBottom: '1px solid rgba(245,166,35,0.1)',
        padding: '16px 32px',
        display: 'flex', alignItems: 'center', gap: '32px',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>Cairo University</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>→</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', border: '1px solid var(--gold)' }} />
          <span style={{ fontSize: '0.85rem', color: 'var(--white)' }}>Tahrir Square</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>8 km • ~18 min</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 600 }}>Economy</span>
        </div>
      </div>

      {/* Main Content */}
      <main style={{
        flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto',
        padding: '32px', position: 'relative', zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--white)', letterSpacing: '0.05em', margin: 0 }}>
              DRIVER BIDS
              {bids.length > 0 && (
                <span style={{
                  marginLeft: '12px',
                  background: 'var(--gold)', color: '#0A0A0A',
                  fontFamily: 'Barlow, sans-serif', fontSize: '0.75rem', fontWeight: 700,
                  padding: '3px 10px', verticalAlign: 'middle',
                }}>{bids.length}</span>
              )}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '4px 0 0 0' }}>
              {bids.length === 0 ? 'Waiting for drivers to bid...' : 'Select the best offer for your ride'}
            </p>
          </div>

          {/* Sort */}
          {bids.length > 0 && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['price', 'rating', 'time'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    background: sortBy === s ? 'rgba(245,166,35,0.15)' : 'transparent',
                    border: `1px solid ${sortBy === s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                    color: sortBy === s ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
                    padding: '6px 14px', cursor: 'pointer', fontSize: '0.7rem',
                    fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
                    textTransform: 'capitalize', transition: 'all 0.2s',
                  }}
                >{s === 'time' ? 'ETA' : s}</button>
              ))}
            </div>
          )}
        </div>

        {/* Loading state */}
        {bids.length === 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', minHeight: '300px', gap: '20px',
          }}>
            <div style={{
              width: '60px', height: '60px',
              border: '2px solid rgba(245,166,35,0.2)',
              borderTop: '2px solid var(--gold)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em' }}>
              BROADCASTING YOUR RIDE REQUEST...
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes slideIn { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }`}</style>
          </div>
        )}

        {/* Bids */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} } @keyframes slideIn { from { opacity:0; transform: translateY(-10px); } to { opacity:1; transform: translateY(0); } }`}</style>
          {sorted.map((bid) => (
            <div
              key={bid.id}
              onClick={() => setSelected(bid.id)}
              style={{
                border: `1px solid ${selected === bid.id ? 'var(--gold)' : bid.isTop ? 'rgba(245,166,35,0.25)' : 'rgba(255,255,255,0.07)'}`,
                background: selected === bid.id
                  ? 'rgba(245,166,35,0.08)'
                  : bid.isTop
                  ? 'rgba(245,166,35,0.03)'
                  : 'rgba(255,255,255,0.02)',
                padding: '20px 24px',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.25s',
                animation: 'slideIn 0.3s ease',
              }}
            >
              {bid.isTop && (
                <div style={{
                  position: 'absolute', top: '-1px', left: '20px',
                  background: 'var(--gold)', color: '#0A0A0A',
                  fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '0.1em', padding: '2px 10px',
                }}>⭐ TOP PICK</div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Avatar */}
                <div style={{
                  width: '52px', height: '52px', flexShrink: 0,
                  background: `linear-gradient(135deg, rgba(245,166,35,${selected === bid.id ? 0.4 : 0.2}), rgba(245,166,35,0.05))`,
                  border: `1px solid rgba(245,166,35,${selected === bid.id ? 0.5 : 0.15})`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem',
                  color: 'var(--gold)', letterSpacing: '0.05em',
                }}>
                  {bid.driverName.split(' ').map(n => n[0]).join('')}
                </div>

                {/* Driver info */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--white)' }}>{bid.driverName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>⭐ {bid.rating}</span>
                    <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)' }}>{bid.trips.toLocaleString()} trips</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                    {bid.carModel} • <span style={{ color: 'rgba(245,166,35,0.7)', fontWeight: 600 }}>{bid.carPlate}</span>
                  </div>
                </div>

                {/* ETA */}
                <div style={{ textAlign: 'center', minWidth: '70px' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{bid.arrivalTime}</div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>MIN AWAY</div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', minWidth: '90px' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: selected === bid.id ? 'var(--gold)' : 'var(--white)', lineHeight: 1 }}>
                    {bid.price} EGP
                  </div>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>TOTAL FARE</div>
                </div>

                {/* Select indicator */}
                <div style={{
                  width: '24px', height: '24px', flexShrink: 0,
                  border: `2px solid ${selected === bid.id ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                  background: selected === bid.id ? 'var(--gold)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  {selected === bid.id && <span style={{ color: '#0A0A0A', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Accept Button */}
        {selected && (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--black)',
            borderTop: '1px solid rgba(245,166,35,0.15)',
            padding: '20px 32px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px',
            zIndex: 100,
          }}>
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              Selected: <strong style={{ color: 'var(--gold)' }}>{bids.find(b => b.id === selected)?.driverName}</strong>
              {' '}— <strong style={{ color: 'var(--white)' }}>{bids.find(b => b.id === selected)?.price} EGP</strong>
            </div>
            <button
              onClick={handleAccept}
              disabled={confirming}
              style={{
                padding: '14px 48px',
                background: 'linear-gradient(135deg, #F5A623, #B8761A)',
                border: 'none',
                color: '#0A0A0A',
                fontFamily: 'Bebas Neue, sans-serif',
                fontSize: '1rem', letterSpacing: '0.12em',
                cursor: 'pointer',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
                opacity: confirming ? 0.7 : 1,
              }}
            >
              {confirming ? 'CONFIRMING...' : 'ACCEPT BID →'}
            </button>
          </div>
        )}
      </main>
    </div>
  )
}