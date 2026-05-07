import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

type RidePhase = 'HEADING_TO_PICKUP' | 'AT_PICKUP' | 'IN_PROGRESS' | 'COMPLETED'

const PHASES: Record<RidePhase, { label: string; color: string; action: string; next: RidePhase | null }> = {
  HEADING_TO_PICKUP: { label: 'Heading to Pickup', color: '#F5A623', action: 'ARRIVED AT PICKUP', next: 'AT_PICKUP' },
  AT_PICKUP: { label: 'Waiting at Pickup', color: '#2196F3', action: 'START RIDE', next: 'IN_PROGRESS' },
  IN_PROGRESS: { label: 'Ride in Progress', color: '#4CAF50', action: 'COMPLETE RIDE', next: 'COMPLETED' },
  COMPLETED: { label: 'Ride Completed!', color: '#4CAF50', action: '', next: null },
}

export default function DriverActiveRidePage() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState<RidePhase>('HEADING_TO_PICKUP')
  const [eta, setEta] = useState(6)
  const [elapsed, setElapsed] = useState(0)
  const [carPos, setCarPos] = useState({ x: 20, y: 65 })
  const [showComplete, setShowComplete] = useState(false)

  const rider = {
    name: 'Omar Youssef',
    rating: 4.7,
    trips: 34,
    phone: '+20 100 987 6543',
    note: 'Please call when you arrive',
  }
  const ride = {
    pickup: 'Cairo University Gate 1',
    destination: 'Tahrir Square, Downtown',
    fare: 45,
    distance: '8.2 km',
  }

  // Simulate car movement
  useEffect(() => {
    if (phase === 'COMPLETED') return
    const t = setInterval(() => {
      setCarPos(p => ({
        x: Math.min(p.x + 0.5, phase === 'HEADING_TO_PICKUP' ? 48 : 78),
        y: Math.max(p.y - 0.3, phase === 'HEADING_TO_PICKUP' ? 42 : 22),
      }))
    }, 300)
    return () => clearInterval(t)
  }, [phase])

  // ETA countdown
  useEffect(() => {
    if (eta <= 0 || phase === 'COMPLETED') return
    const t = setInterval(() => setEta(p => Math.max(0, p - 1)), 60000)
    return () => clearInterval(t)
  }, [eta, phase])

  // Elapsed timer during ride
  useEffect(() => {
    if (phase !== 'IN_PROGRESS') return
    const t = setInterval(() => setElapsed(p => p + 1), 1000)
    return () => clearInterval(t)
  }, [phase])

  const advance = () => {
    const cfg = PHASES[phase]
    if (!cfg.next) return
    setPhase(cfg.next)
    if (cfg.next === 'IN_PROGRESS') { setEta(18); setCarPos({ x: 48, y: 42 }) }
    if (cfg.next === 'COMPLETED') setShowComplete(true)
  }

  const cfg = PHASES[phase]
  const mins = Math.floor(elapsed / 60)
  const secs = elapsed % 60

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />

      {/* Map */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '400px' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        {[15, 35, 55, 75].map(p => (
          <div key={`h${p}`} style={{ position: 'absolute', top: `${p}%`, left: 0, right: 0, height: p === 42 ? '3px' : '1px', background: p === 35 ? 'rgba(245,166,35,0.2)' : 'rgba(245,166,35,0.07)' }} />
        ))}
        {[20, 45, 65, 80].map(p => (
          <div key={`v${p}`} style={{ position: 'absolute', left: `${p}%`, top: 0, bottom: 0, width: p === 48 ? '3px' : '1px', background: p === 45 ? 'rgba(245,166,35,0.2)' : 'rgba(245,166,35,0.07)' }} />
        ))}

        {/* Route */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path
            d={`M ${carPos.x}% ${carPos.y}% Q 60% 35% 78% 22%`}
            stroke="rgba(245,166,35,0.4)" strokeWidth="2" strokeDasharray="8 4" fill="none"
          />
        </svg>

        {/* Pickup marker */}
        <div style={{ position: 'absolute', left: '48%', top: '42%', transform: 'translate(-50%,-100%)' }}>
          <div style={{ background: 'var(--gold)', color: '#0A0A0A', padding: '2px 8px', fontSize: '0.55rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', marginBottom: '3px', whiteSpace: 'nowrap' }}>PICKUP</div>
          <div style={{ width: '12px', height: '12px', background: 'var(--gold)', borderRadius: '50%', margin: '0 auto', boxShadow: '0 0 14px rgba(245,166,35,0.8)' }} />
        </div>

        {/* Dest marker */}
        <div style={{ position: 'absolute', left: '78%', top: '22%', transform: 'translate(-50%,-100%)' }}>
          <div style={{ background: '#0A0A0A', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '2px 8px', fontSize: '0.55rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em', marginBottom: '3px', whiteSpace: 'nowrap' }}>DROP-OFF</div>
          <div style={{ width: '12px', height: '12px', border: '2px solid var(--gold)', margin: '0 auto', boxShadow: '0 0 12px rgba(245,166,35,0.4)' }} />
        </div>

        {/* Car */}
        <div style={{
          position: 'absolute', left: `${carPos.x}%`, top: `${carPos.y}%`,
          transform: 'translate(-50%,-50%)', transition: 'all 0.8s ease', zIndex: 10,
        }}>
          <div style={{
            width: '44px', height: '44px', background: 'var(--black)',
            border: `2px solid ${cfg.color}`, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem',
            boxShadow: `0 0 20px ${cfg.color}60`,
          }}>🚗</div>
          <div style={{
            position: 'absolute', top: '-22px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.9)', border: `1px solid ${cfg.color}`,
            padding: '2px 8px', fontSize: '0.55rem', fontFamily: 'Bebas Neue, sans-serif',
            color: cfg.color, whiteSpace: 'nowrap',
          }}>YOU</div>
        </div>

        {/* Top bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.96) 0%, transparent 100%)',
          padding: '20px 32px 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A' }}>SR</div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', letterSpacing: '0.1em', color: 'var(--white)' }}>SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.7)', border: `1px solid ${cfg.color}40`, padding: '8px 16px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, animation: 'pulse 1s infinite' }} />
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.7rem', letterSpacing: '0.15em', color: cfg.color }}>ACTIVE RIDE</span>
          </div>

          {phase === 'IN_PROGRESS' && (
            <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'var(--gold)' }}>
              {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
            </div>
          )}
        </div>
      </div>

      {/* Bottom panel */}
      <div style={{ background: 'var(--black-2)', borderTop: '1px solid rgba(245,166,35,0.15)', padding: '24px 32px', position: 'relative', zIndex: 10 }}>

        {/* Phase steps */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '24px', alignItems: 'center' }}>
          {(['HEADING_TO_PICKUP', 'AT_PICKUP', 'IN_PROGRESS', 'COMPLETED'] as RidePhase[]).map((p, i) => {
            const currentStep = ['HEADING_TO_PICKUP','AT_PICKUP','IN_PROGRESS','COMPLETED'].indexOf(phase)
            const thisStep = i
            return (
              <div key={p} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '26px', height: '26px', flexShrink: 0,
                  border: `2px solid ${thisStep < currentStep ? cfg.color : thisStep === currentStep ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                  background: thisStep < currentStep ? cfg.color : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.4s',
                }}>
                  {thisStep < currentStep
                    ? <span style={{ color: '#0A0A0A', fontSize: '0.75rem', fontWeight: 700 }}>✓</span>
                    : <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.65rem', color: thisStep === currentStep ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>{i + 1}</span>
                  }
                </div>
                {i < 3 && <div style={{ flex: 1, height: '2px', background: thisStep < currentStep ? cfg.color : 'rgba(255,255,255,0.07)', transition: 'background 0.4s' }} />}
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
          {/* Status + rider info */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: cfg.color, animation: 'pulse 1s infinite' }} />
              <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: cfg.color, letterSpacing: '0.05em' }}>{cfg.label.toUpperCase()}</span>
            </div>

            {eta > 0 && phase !== 'IN_PROGRESS' && (
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', margin: '0 0 12px 0' }}>ETA: <strong style={{ color: 'var(--gold)' }}>{eta} min</strong></p>
            )}

            {/* Route */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%' }} />
                <div style={{ width: '1px', height: '20px', background: 'rgba(245,166,35,0.3)' }} />
                <div style={{ width: '8px', height: '8px', border: '1px solid var(--gold)' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--white)', fontWeight: 600, marginBottom: '12px' }}>{ride.pickup}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>{ride.destination}</div>
              </div>
            </div>
          </div>

          {/* Rider card */}
          <div style={{
            background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)',
            padding: '16px 20px', minWidth: '260px',
          }}>
            <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: '12px', fontFamily: 'Bebas Neue, sans-serif' }}>YOUR RIDER</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{
                width: '44px', height: '44px',
                background: 'linear-gradient(135deg, rgba(245,166,35,0.25), rgba(245,166,35,0.05))',
                border: '1px solid rgba(245,166,35,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', color: 'var(--gold)',
              }}>OY</div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--white)', fontSize: '0.9rem' }}>{rider.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>⭐ {rider.rating} · {rider.trips} trips</div>
              </div>
              <a href={`tel:${rider.phone}`} style={{
                marginLeft: 'auto',
                background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)',
                color: 'var(--gold)', textDecoration: 'none',
                padding: '7px 12px', fontSize: '1rem',
              }}>📞</a>
            </div>
            {rider.note && (
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.03)', padding: '8px 12px', borderLeft: '2px solid rgba(245,166,35,0.3)' }}>
                📝 {rider.note}
              </div>
            )}
          </div>

          {/* Fare + action */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.12)', padding: '12px 20px' }}>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: 'Bebas Neue, sans-serif' }}>FARE</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--gold)', lineHeight: 1 }}>{ride.fare} EGP</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{ride.distance}</div>
            </div>

            {cfg.next && (
              <button onClick={advance} style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #F5A623, #B8761A)',
                border: 'none', color: '#0A0A0A',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', letterSpacing: '0.1em',
                cursor: 'pointer',
                clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
              }}>{cfg.action} →</button>
            )}
          </div>
        </div>
      </div>

      {/* Completion modal */}
      {showComplete && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--black-2)', border: '1px solid rgba(245,166,35,0.25)',
            padding: '48px', maxWidth: '420px', width: '90%', textAlign: 'center', position: 'relative',
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--gold)', margin: '0 0 8px 0' }}>RIDE COMPLETE!</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 32px 0', fontSize: '0.85rem' }}>You earned <strong style={{ color: 'var(--gold)', fontSize: '1.1rem' }}>{ride.fare} EGP</strong> on this ride.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '32px' }}>
              {[['Distance', ride.distance], ['Duration', `${mins}:${secs.toString().padStart(2,'0')}`], ['Rider', rider.name], ['Rating', '⭐⭐⭐⭐⭐']].map(([l, v]) => (
                <div key={l} style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.1)', padding: '12px' }}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '4px', fontFamily: 'Bebas Neue, sans-serif' }}>{l}</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--white)', fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/driver/dashboard')} style={{
              width: '100%', padding: '14px',
              background: 'linear-gradient(135deg, #F5A623, #B8761A)',
              border: 'none', color: '#0A0A0A',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.95rem', letterSpacing: '0.1em',
              cursor: 'pointer',
              clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
            }}>BACK TO DASHBOARD →</button>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    </div>
  )
}
