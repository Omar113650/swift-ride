import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const VEHICLE_TYPES = [
  { id: 'economy', label: 'Economy', icon: '🚗', desc: 'Affordable everyday rides', multiplier: 1 },
  { id: 'comfort', label: 'Comfort', icon: '🚙', desc: 'Spacious & comfortable', multiplier: 1.4 },
  { id: 'xl', label: 'XL', icon: '🚐', desc: 'Up to 6 passengers', multiplier: 1.8 },
]

export default function BookRidePage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState('economy')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const pickupRef = useRef<HTMLInputElement>(null)

  useEffect(() => { pickupRef.current?.focus() }, [])

  const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

  const handleSubmit = async () => {
    if (!pickup || !destination) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/rides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pickupAddress: pickup,
          destinationAddress: destination,
          vehicleType: selectedVehicle.toUpperCase(),
          note,
          pickupLat: 30.0264, pickupLng: 31.2131,
          destinationLat: 30.0444, destinationLng: 31.2357,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Failed to create ride')
      navigate(`/rider/bids/${data.id}`)
    } catch (_) {
      navigate('/rider/bids/demo')
    } finally {
      setLoading(false)
    }
  }

  const vehicle = VEHICLE_TYPES.find(v => v.id === selectedVehicle)!

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Barlow, sans-serif',
    }}>
      {/* BG Grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        pointerEvents: 'none',
      }} />

      {/* Top Glow */}
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(245,166,35,0.1)',
        padding: '20px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10,
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

        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px',
                border: `1px solid ${step >= s ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`,
                background: step > s ? 'var(--gold)' : step === s ? 'rgba(245,166,35,0.15)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.7rem', fontFamily: 'Bebas Neue, sans-serif',
                color: step > s ? '#0A0A0A' : step === s ? 'var(--gold)' : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s',
              }}>{step > s ? '✓' : s}</div>
              {s < 3 && <div style={{ width: '20px', height: '1px', background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />}
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/rider/dashboard')} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
          padding: '8px 16px', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em',
          fontFamily: 'Bebas Neue, sans-serif',
        }}>← BACK</button>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, display: 'flex', alignItems: 'stretch',
        maxWidth: '1100px', width: '100%', margin: '0 auto',
        padding: '40px 32px', gap: '40px', position: 'relative', zIndex: 1,
      }}>

        {/* Left — Map placeholder */}
        <div style={{
          flex: 1,
          background: 'var(--black-2)',
          border: '1px solid rgba(245,166,35,0.1)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '500px',
        }}>
          {/* Fake map grid */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(245,166,35,0.06) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,166,35,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
          {/* Roads */}
          {[20, 50, 80].map(p => (
            <div key={p} style={{
              position: 'absolute',
              top: `${p}%`, left: 0, right: 0,
              height: '2px',
              background: `rgba(245,166,35,${p === 50 ? 0.15 : 0.07})`,
            }} />
          ))}
          {[25, 55, 75].map(p => (
            <div key={p} style={{
              position: 'absolute',
              left: `${p}%`, top: 0, bottom: 0,
              width: '2px',
              background: `rgba(245,166,35,${p === 55 ? 0.15 : 0.07})`,
            }} />
          ))}

          {/* Pickup pin */}
          {pickup && (
            <div style={{
              position: 'absolute', top: '35%', left: '30%',
              transform: 'translate(-50%, -100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                background: 'var(--gold)', color: '#0A0A0A',
                padding: '4px 10px', fontSize: '0.65rem',
                fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
                whiteSpace: 'nowrap', marginBottom: '4px',
              }}>PICKUP</div>
              <div style={{ width: '12px', height: '12px', background: 'var(--gold)', borderRadius: '50%', boxShadow: '0 0 12px rgba(245,166,35,0.6)' }} />
              <div style={{ width: '2px', height: '16px', background: 'var(--gold)', opacity: 0.6 }} />
            </div>
          )}

          {/* Dest pin */}
          {destination && (
            <div style={{
              position: 'absolute', top: '60%', left: '65%',
              transform: 'translate(-50%, -100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <div style={{
                background: '#0A0A0A', color: 'var(--gold)',
                border: '1px solid var(--gold)',
                padding: '4px 10px', fontSize: '0.65rem',
                fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
                whiteSpace: 'nowrap', marginBottom: '4px',
              }}>DROP-OFF</div>
              <div style={{ width: '12px', height: '12px', border: '2px solid var(--gold)', background: 'transparent', boxShadow: '0 0 12px rgba(245,166,35,0.4)' }} />
              <div style={{ width: '2px', height: '16px', background: 'rgba(245,166,35,0.6)' }} />
            </div>
          )}

          {/* Route line */}
          {pickup && destination && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="rgba(245,166,35,0.7)" />
                </marker>
              </defs>
              <path
                d="M 30% 35% Q 50% 20% 65% 60%"
                stroke="rgba(245,166,35,0.5)"
                strokeWidth="2"
                strokeDasharray="6 4"
                fill="none"
                markerEnd="url(#arrow)"
              />
            </svg>
          )}

          {/* Map label */}
          <div style={{
            position: 'absolute', bottom: '16px', right: '16px',
            fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)',
            fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em',
          }}>SWIT-RIDE MAP ENGINE</div>

          {!pickup && !destination && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '12px',
            }}>
              <div style={{ fontSize: '2.5rem', opacity: 0.2 }}>🗺️</div>
              <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif' }}>
                ENTER LOCATIONS TO SEE ROUTE
              </p>
            </div>
          )}
        </div>

        {/* Right — Form */}
        <div style={{ width: '380px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span style={{
              fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--gold)', fontWeight: 700, borderLeft: '2px solid var(--gold)', paddingLeft: '8px',
            }}>Book a Ride</span>
            <h1 style={{
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '2.2rem',
              color: 'var(--white)',
              letterSpacing: '0.05em',
              marginTop: '8px', marginBottom: 0,
            }}>WHERE TO?</h1>
          </div>

          {/* Pickup */}
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>
              📍 Pickup Location
            </label>
            <input
              ref={pickupRef}
              value={pickup}
              onChange={e => setPickup(e.target.value)}
              placeholder="Enter pickup address..."
              style={{
                width: '100%',
                background: 'rgba(245,166,35,0.05)',
                border: '1px solid rgba(245,166,35,0.2)',
                borderLeft: '3px solid var(--gold)',
                padding: '13px 16px',
                color: 'var(--white)',
                fontSize: '0.9rem',
                fontFamily: 'Barlow, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.2)')}
            />
          </div>

          {/* Connector line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '-8px 0' }}>
            <div style={{ width: '3px', height: '32px', background: 'linear-gradient(180deg, var(--gold), rgba(245,166,35,0.2))', marginLeft: '8px' }} />
            <button onClick={() => { const t = pickup; setPickup(destination); setDestination(t) }}
              style={{
                background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)',
                color: 'var(--gold)', cursor: 'pointer', padding: '4px 10px', fontSize: '0.7rem',
                fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
              }}>⇅ SWAP</button>
          </div>

          {/* Destination */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>
              🏁 Destination
            </label>
            <input
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Where are you going?"
              style={{
                width: '100%',
                background: 'rgba(245,166,35,0.05)',
                border: '1px solid rgba(245,166,35,0.2)',
                borderLeft: '3px solid rgba(245,166,35,0.4)',
                padding: '13px 16px',
                color: 'var(--white)',
                fontSize: '0.9rem',
                fontFamily: 'Barlow, sans-serif',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.6)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.2)')}
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', fontWeight: 600 }}>
              Vehicle Type
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {VEHICLE_TYPES.map(v => (
                <div
                  key={v.id}
                  onClick={() => setSelectedVehicle(v.id)}
                  style={{
                    border: `1px solid ${selectedVehicle === v.id ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                    background: selectedVehicle === v.id ? 'rgba(245,166,35,0.08)' : 'transparent',
                    padding: '12px 16px',
                    cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.3rem' }}>{v.icon}</span>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: selectedVehicle === v.id ? 'var(--gold)' : 'var(--white)' }}>{v.label}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{v.desc}</div>
                    </div>
                  </div>
                  {selectedVehicle === v.id && (
                    <div style={{
                      width: '18px', height: '18px', background: 'var(--gold)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.7rem', color: '#0A0A0A', fontWeight: 700,
                    }}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '8px', fontWeight: 600 }}>
              Note for Driver <span style={{ color: 'rgba(255,255,255,0.2)' }}>(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Any special instructions..."
              rows={2}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '12px 16px',
                color: 'var(--white)',
                fontSize: '0.85rem',
                fontFamily: 'Barlow, sans-serif',
                outline: 'none',
                resize: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Summary */}
          {pickup && destination && (
            <div style={{
              background: 'rgba(245,166,35,0.05)',
              border: '1px solid rgba(245,166,35,0.15)',
              padding: '16px',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '12px', fontFamily: 'Bebas Neue, sans-serif' }}>ESTIMATED</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--gold)' }}>~8 km</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>DISTANCE</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--gold)' }}>~18 min</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>DURATION</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--gold)' }}>3-5 bids</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>EXPECTED</div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!pickup || !destination || loading}
            style={{
              width: '100%',
              padding: '16px',
              background: pickup && destination ? 'linear-gradient(135deg, #F5A623, #B8761A)' : 'rgba(255,255,255,0.05)',
              border: 'none',
              color: pickup && destination ? '#0A0A0A' : 'rgba(255,255,255,0.2)',
              fontFamily: 'Bebas Neue, sans-serif',
              fontSize: '1rem',
              letterSpacing: '0.12em',
              cursor: pickup && destination ? 'pointer' : 'not-allowed',
              clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              transition: 'all 0.3s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'FINDING DRIVERS...' : 'REQUEST RIDE →'}
          </button>
        </div>
      </main>
    </div>
  )
}