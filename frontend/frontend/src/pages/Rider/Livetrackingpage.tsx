import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type RideStatus = 'DRIVER_ARRIVING' | 'DRIVER_ARRIVED' | 'IN_PROGRESS' | 'COMPLETED'

const STATUS_CONFIG: Record<RideStatus, { label: string; color: string; desc: string; step: number }> = {
  DRIVER_ARRIVING: { label: 'Driver on the way', color: '#F5A623', desc: 'Your driver is heading to you', step: 1 },
  DRIVER_ARRIVED: { label: 'Driver arrived', color: '#4CAF50', desc: 'Your driver is waiting at pickup', step: 2 },
  IN_PROGRESS: { label: 'Ride in progress', color: '#2196F3', desc: "You're on your way!", step: 3 },
  COMPLETED: { label: 'Arrived!', color: '#4CAF50', desc: 'You have reached your destination', step: 4 },
}

export default function LiveTrackingPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<RideStatus>('DRIVER_ARRIVING')
  const [eta, setEta] = useState(4)
  const [driverPos, setDriverPos] = useState({ x: 15, y: 70 })
  const [showRating, setShowRating] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  const driver = {
    name: 'Ahmed Hassan',
    rating: 4.9,
    carModel: 'Toyota Camry 2022',
    plate: 'ABC-1234',
    phone: '+20 100 123 4567',
    avatar: 'AH',
  }

  // Simulate ride progression
  useEffect(() => {
    const sequence = [
      { delay: 3000, status: 'DRIVER_ARRIVING' as RideStatus, eta: 3, pos: { x: 25, y: 60 } },
      { delay: 6000, status: 'DRIVER_ARRIVING' as RideStatus, eta: 2, pos: { x: 35, y: 52 } },
      { delay: 9000, status: 'DRIVER_ARRIVING' as RideStatus, eta: 1, pos: { x: 42, y: 45 } },
      { delay: 12000, status: 'DRIVER_ARRIVED' as RideStatus, eta: 0, pos: { x: 48, y: 40 } },
      { delay: 16000, status: 'IN_PROGRESS' as RideStatus, eta: 15, pos: { x: 52, y: 35 } },
      { delay: 19000, status: 'IN_PROGRESS' as RideStatus, eta: 10, pos: { x: 60, y: 30 } },
      { delay: 22000, status: 'IN_PROGRESS' as RideStatus, eta: 5, pos: { x: 68, y: 28 } },
      { delay: 25000, status: 'COMPLETED' as RideStatus, eta: 0, pos: { x: 75, y: 25 } },
    ]

    const timers = sequence.map(s =>
      setTimeout(() => {
        setStatus(s.status)
        setEta(s.eta)
        setDriverPos(s.pos)
        if (s.status === 'COMPLETED') setTimeout(() => setShowRating(true), 800)
      }, s.delay)
    )

    return () => timers.forEach(clearTimeout)
  }, [])

  const cfg = STATUS_CONFIG[status]

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG Grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Road grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

        {/* Roads */}
        {[15, 35, 55, 75].map(p => (
          <div key={`h${p}`} style={{
            position: 'absolute', top: `${p}%`, left: 0, right: 0,
            height: p === 35 ? '3px' : '1px',
            background: p === 35 ? 'rgba(245,166,35,0.2)' : 'rgba(245,166,35,0.07)',
          }} />
        ))}
        {[20, 45, 65, 80].map(p => (
          <div key={`v${p}`} style={{
            position: 'absolute', left: `${p}%`, top: 0, bottom: 0,
            width: p === 45 ? '3px' : '1px',
            background: p === 45 ? 'rgba(245,166,35,0.2)' : 'rgba(245,166,35,0.07)',
          }} />
        ))}

        {/* Route path */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245,166,35,0.6)" />
              <stop offset="100%" stopColor="rgba(245,166,35,0.15)" />
            </linearGradient>
          </defs>
          <path
            d={`M ${driverPos.x}% ${driverPos.y}% Q 55% 35% 75% 25%`}
            stroke="url(#routeGrad)"
            strokeWidth="3"
            strokeDasharray="10 5"
            fill="none"
          />
        </svg>

        {/* Pickup marker */}
        <div style={{ position: 'absolute', left: '48%', top: '40%', transform: 'translate(-50%, -100%)' }}>
          <div style={{
            background: 'var(--gold)', color: '#0A0A0A', padding: '3px 8px',
            fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '0.1em', marginBottom: '3px', whiteSpace: 'nowrap',
          }}>PICKUP</div>
          <div style={{
            width: '14px', height: '14px', background: 'var(--gold)', borderRadius: '50%',
            margin: '0 auto', boxShadow: '0 0 16px rgba(245,166,35,0.8)',
          }} />
        </div>

        {/* Destination marker */}
        <div style={{ position: 'absolute', left: '75%', top: '25%', transform: 'translate(-50%, -100%)' }}>
          <div style={{
            background: '#0A0A0A', color: 'var(--gold)',
            border: '1px solid var(--gold)',
            padding: '3px 8px', fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '0.1em', marginBottom: '3px', whiteSpace: 'nowrap',
          }}>DROP-OFF</div>
          <div style={{
            width: '14px', height: '14px', border: '2px solid var(--gold)',
            margin: '0 auto', boxShadow: '0 0 12px rgba(245,166,35,0.4)',
          }} />
        </div>

        {/* Driver marker */}
        <div style={{
          position: 'absolute',
          left: `${driverPos.x}%`, top: `${driverPos.y}%`,
          transform: 'translate(-50%, -50%)',
          transition: 'all 1.5s ease',
          zIndex: 10,
        }}>
          <div style={{
            width: '40px', height: '40px',
            background: 'var(--black)',
            border: '2px solid var(--gold)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 0 20px rgba(245,166,35,0.5)',
          }}>🚗</div>
          <div style={{
            position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid var(--gold)', padding: '2px 8px',
            fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif',
            color: 'var(--gold)', whiteSpace: 'nowrap',
          }}>{driver.name.split(' ')[0]}</div>
        </div>

        {/* Status overlay top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.95) 0%, transparent 100%)',
          padding: '20px 32px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
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

          {/* Live badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(245,166,35,0.3)',
            padding: '6px 14px',
          }}>
            <div style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: cfg.color, animation: 'pulse 1s infinite',
            }} />
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: cfg.color }}>LIVE TRACKING</span>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div style={{
        background: 'var(--black-2)',
        borderTop: '1px solid rgba(245,166,35,0.15)',
        padding: '24px 32px',
        position: 'relative', zIndex: 10,
      }}>
        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', gap: '0' }}>
          {(['DRIVER_ARRIVING', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED'] as RideStatus[]).map((s, i) => (
            <div key={s} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '28px', height: '28px', flexShrink: 0,
                border: `2px solid ${cfg.step > i ? STATUS_CONFIG[s].color : cfg.step === i + 1 ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                background: cfg.step > i + 1 ? STATUS_CONFIG[s].color : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.4s',
              }}>
                {cfg.step > i + 1
                  ? <span style={{ color: '#0A0A0A', fontSize: '0.8rem', fontWeight: 700 }}>✓</span>
                  : <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', color: cfg.step === i + 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                }
              </div>
              {i < 3 && (
                <div style={{
                  flex: 1, height: '2px',
                  background: cfg.step > i + 1 ? 'var(--gold)' : 'rgba(255,255,255,0.08)',
                  transition: 'background 0.4s',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Status + Driver Card */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
          {/* Status */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, animation: 'pulse 1s infinite' }} />
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: cfg.color, letterSpacing: '0.05em', margin: 0 }}>
                {cfg.label.toUpperCase()}
              </h2>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0 }}>{cfg.desc}</p>
            {eta > 0 && (
              <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', color: 'var(--white)', lineHeight: 1 }}>{eta}</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>
                  {status === 'IN_PROGRESS' ? 'MIN TO DESTINATION' : 'MIN AWAY'}
                </span>
              </div>
            )}
          </div>

          {/* Driver Card */}
          <div style={{
            background: 'rgba(245,166,35,0.05)',
            border: '1px solid rgba(245,166,35,0.15)',
            padding: '16px 20px',
            display: 'flex', alignItems: 'center', gap: '16px',
            minWidth: '300px',
          }}>
            <div style={{
              width: '48px', height: '48px',
              background: 'linear-gradient(135deg, rgba(245,166,35,0.3), rgba(245,166,35,0.05))',
              border: '1px solid rgba(245,166,35,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: 'var(--gold)',
            }}>{driver.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: '0.95rem' }}>{driver.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '2px' }}>{driver.carModel}</div>
              <div style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 600 }}>{driver.plate} • ⭐ {driver.rating}</div>
            </div>
            <a href={`tel:${driver.phone}`} style={{
              background: 'rgba(245,166,35,0.1)',
              border: '1px solid rgba(245,166,35,0.3)',
              color: 'var(--gold)', textDecoration: 'none',
              padding: '8px 14px', fontSize: '1.1rem',
              display: 'flex', alignItems: 'center',
            }}>📞</a>
          </div>

          {/* Cancel */}
          {(status === 'DRIVER_ARRIVING') && (
            <button onClick={() => navigate('/rider/book')} style={{
              background: 'transparent',
              border: '1px solid rgba(255,80,80,0.3)',
              color: 'rgba(255,100,100,0.7)',
              padding: '12px 20px', cursor: 'pointer',
              fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
            }}>CANCEL RIDE</button>
          )}
        </div>
      </div>

      {/* Rating Modal */}
      {showRating && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--black-2)',
            border: '1px solid rgba(245,166,35,0.2)',
            padding: '48px',
            maxWidth: '420px', width: '90%',
            textAlign: 'center',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
              background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
            }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--white)', margin: '0 0 8px 0' }}>YOU ARRIVED!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: '0 0 32px 0' }}>How was your ride with {driver.name}?</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(s)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '2rem', transition: 'transform 0.15s',
                    transform: (hoverRating || rating) >= s ? 'scale(1.2)' : 'scale(1)',
                    filter: (hoverRating || rating) >= s ? 'brightness(1)' : 'grayscale(1) brightness(0.3)',
                  }}
                >⭐</button>
              ))}
            </div>
            <button
              onClick={() => navigate('/rider/history')}
              style={{
                width: '100%', padding: '14px',
                background: rating > 0 ? 'linear-gradient(135deg, #F5A623, #B8761A)' : 'rgba(255,255,255,0.05)',
                border: 'none',
                color: rating > 0 ? '#0A0A0A' : 'rgba(255,255,255,0.2)',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '0.1em',
                cursor: 'pointer',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              }}
            >{rating > 0 ? 'SUBMIT RATING →' : 'SKIP'}</button>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}