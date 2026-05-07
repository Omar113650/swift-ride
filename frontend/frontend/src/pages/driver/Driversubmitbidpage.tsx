import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// ─── API base URL ───────────────────────────────────────────────
const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// ─── Types ──────────────────────────────────────────────────────
interface RideDetails {
  id: string
  pickupAddress: string
  destinationAddress: string
  distance: number | null
  status: string
  riderId: string
}

interface MyBid {
  id: string
  price: number
  arrivalTime: number
  status: string
  isSelected: boolean
}

export default function DriverSubmitBidPage() {
  const navigate = useNavigate()
  const { rideId } = useParams<{ rideId: string }>()

  // ── State ──
  const [ride, setRide] = useState<RideDetails | null>(null)
  const [myBid, setMyBid] = useState<MyBid | null>(null)
  const [price, setPrice] = useState('')
  const [arrivalTime, setArrivalTime] = useState('')
  const [loadingRide, setLoadingRide] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Quick price suggestions based on distance
  const baseFare = ride?.distance ? Math.round(ride.distance * 4.5) : 40
  const suggestions = [
    Math.round(baseFare * 0.85),
    baseFare,
    Math.round(baseFare * 1.2),
  ]

  // ── Fetch ride details ──
  useEffect(() => {
    if (!rideId) return
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/rides/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Ride not found')
        const data = await res.json()
        setRide(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoadingRide(false)
      }
    }
    fetchRide()
  }, [rideId])

  // ── Fetch existing bids to check if driver already bid ──
  useEffect(() => {
    if (!rideId) return
    const fetchBids = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API}/ride-bids/${rideId}/bids`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) return
        const bids: MyBid[] = await res.json()
        // The backend returns all bids for this ride;
        // filter to find current driver's bid via driverId claim in token
        // For simplicity we mark the first one as "mine" if exists
        // In real usage you'd compare driverId from JWT
        if (bids.length > 0) {
          // Try to find driver's own bid from localStorage driverId
          const driverId = localStorage.getItem('driverId')
          const mine = bids.find((b: any) => b.driverId === driverId)
          if (mine) {
            setMyBid(mine)
            setPrice(String(mine.price))
            setArrivalTime(String(mine.arrivalTime))
          }
        }
      } catch (_) {}
    }
    fetchBids()
  }, [rideId])

  // ── Submit bid ──
  const handleSubmit = async () => {
    if (!price || !arrivalTime) {
      setError('Please enter price and arrival time.')
      return
    }
    if (Number(price) <= 0 || Number(arrivalTime) <= 0) {
      setError('Values must be greater than 0.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/ride-bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rideId,
          price: Number(price),
          arrivalTime: Number(arrivalTime),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Failed to submit bid')
      setMyBid(data)
      setSuccess('Bid submitted! Waiting for rider to choose.')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Update existing bid ──
  const handleUpdate = async () => {
    if (!myBid) return
    setError('')
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/ride-bids/${myBid.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number(price),
          arrivalTime: Number(arrivalTime),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message ?? 'Failed to update bid')
      setMyBid(data)
      setSuccess('Bid updated successfully!')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ── Delete bid ──
  const handleDelete = async () => {
    if (!myBid) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${API}/ride-bids/${myBid.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message ?? 'Failed to delete bid')
      }
      setMyBid(null)
      setPrice('')
      setArrivalTime('')
      setSuccess('Bid withdrawn.')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // ─────────────────────────── UI ────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG Grid */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(245,166,35,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,166,35,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '-200px', right: '-200px',
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(245,166,35,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
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

        {/* Bid status badge */}
        {myBid && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: myBid.isSelected
              ? 'rgba(76,175,80,0.1)'
              : 'rgba(245,166,35,0.08)',
            border: `1px solid ${myBid.isSelected ? 'rgba(76,175,80,0.3)' : 'rgba(245,166,35,0.2)'}`,
            padding: '8px 16px',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: myBid.isSelected ? '#4CAF50' : 'var(--gold)',
              animation: 'pulse 1.2s infinite',
            }} />
            <span style={{
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem',
              letterSpacing: '0.12em',
              color: myBid.isSelected ? '#4CAF50' : 'var(--gold)',
            }}>
              {myBid.isSelected ? 'BID SELECTED ✓' : `BID ACTIVE — ${myBid.price} EGP`}
            </span>
          </div>
        )}

        <button onClick={() => navigate('/driver/dashboard')} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)', padding: '8px 16px',
          cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.1em',
          fontFamily: 'Bebas Neue, sans-serif',
        }}>← DASHBOARD</button>
      </header>

      {/* Main */}
      <main style={{
        flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto',
        padding: '40px 32px', position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', gap: '28px',
      }}>

        {/* Page title */}
        <div>
          <span style={{
            fontSize: '0.7rem', letterSpacing: '0.15em', color: 'var(--gold)',
            borderLeft: '2px solid var(--gold)', paddingLeft: '8px', fontWeight: 700,
          }}>Driver Panel</span>
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.4rem',
            color: 'var(--white)', letterSpacing: '0.05em', margin: '8px 0 0',
          }}>
            {myBid ? 'MANAGE YOUR BID' : 'SUBMIT A BID'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '4px 0 0' }}>
            {myBid ? 'Update or withdraw your offer on this ride.' : 'Make an offer to the rider — best price wins.'}
          </p>
        </div>

        {/* ── Ride Details Card ── */}
        {loadingRide ? (
          <div style={{
            background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.1)',
            padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
          }}>
            <div style={{
              width: '20px', height: '20px',
              border: '2px solid rgba(245,166,35,0.2)', borderTop: '2px solid var(--gold)',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em' }}>
              LOADING RIDE DETAILS...
            </span>
          </div>
        ) : ride ? (
          <div style={{
            background: 'rgba(245,166,35,0.04)',
            border: '1px solid rgba(245,166,35,0.15)',
            padding: '24px 28px',
            display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'center',
          }}>
            {/* Route */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                <div style={{ width: '10px', height: '10px', background: 'var(--gold)', borderRadius: '50%', boxShadow: '0 0 8px rgba(245,166,35,0.6)' }} />
                <div style={{ width: '1px', height: '28px', background: 'linear-gradient(180deg, var(--gold), rgba(245,166,35,0.2))' }} />
                <div style={{ width: '10px', height: '10px', border: '2px solid var(--gold)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '3px', fontFamily: 'Bebas Neue, sans-serif' }}>PICKUP</div>
                  <div style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 600 }}>{ride.pickupAddress ?? 'Cairo University Gate'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginBottom: '3px', fontFamily: 'Bebas Neue, sans-serif' }}>DROP-OFF</div>
                  <div style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.7)' }}>{ride.destinationAddress ?? 'Tahrir Square'}</div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                ['DISTANCE', ride.distance ? `${ride.distance.toFixed(1)} km` : '—'],
                ['FARE BASE', `~${baseFare} EGP`],
                ['STATUS', ride.status],
              ].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif', marginBottom: '4px' }}>{l}</div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'var(--gold)', lineHeight: 1 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,80,80,0.07)', border: '1px solid rgba(255,80,80,0.2)', padding: '20px', color: '#ff6b6b', fontSize: '0.85rem' }}>
            Ride not found or has been cancelled.
          </div>
        )}

        {/* ── Already Selected notice ── */}
        {myBid?.isSelected && (
          <div style={{
            background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)',
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <span style={{ fontSize: '1.8rem' }}>🎉</span>
            <div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#4CAF50', letterSpacing: '0.05em' }}>YOUR BID WAS SELECTED!</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '2px' }}>The rider chose your offer of <strong style={{ color: 'var(--gold)' }}>{myBid.price} EGP</strong>. Head to pickup now.</div>
            </div>
            <button onClick={() => navigate('/driver/active-ride')} style={{
              marginLeft: 'auto', padding: '12px 28px',
              background: 'linear-gradient(135deg, #F5A623, #B8761A)',
              border: 'none', color: '#0A0A0A',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em',
              cursor: 'pointer',
              clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
            }}>START RIDE →</button>
          </div>
        )}

        {/* ── Bid Form ── (hidden if selected) */}
        {!myBid?.isSelected && (
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            padding: '28px',
            display: 'flex', flexDirection: 'column', gap: '24px',
          }}>
            <div style={{
              fontSize: '0.7rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.3)',
              fontFamily: 'Bebas Neue, sans-serif', borderBottom: '1px solid rgba(255,255,255,0.06)',
              paddingBottom: '12px',
            }}>
              {myBid ? 'EDIT YOUR OFFER' : 'YOUR OFFER'}
            </div>

            {/* Price */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: 600 }}>
                💰 Your Price (EGP)
              </label>

              {/* Quick suggestions */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {suggestions.map((s, i) => (
                  <button key={s} onClick={() => setPrice(String(s))} style={{
                    background: price === String(s) ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${price === String(s) ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                    color: price === String(s) ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                    padding: '6px 16px', cursor: 'pointer',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem',
                    transition: 'all 0.2s',
                  }}>
                    {i === 0 ? '🔥 ' : i === 1 ? '⭐ ' : '💎 '}{s} EGP
                  </button>
                ))}
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', alignSelf: 'center', marginLeft: '4px' }}>or enter custom:</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <div style={{
                  background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)',
                  borderRight: 'none', padding: '13px 16px',
                  fontFamily: 'Bebas Neue, sans-serif', color: 'var(--gold)', fontSize: '0.9rem',
                }}>EGP</div>
                <input
                  type="number"
                  min="1"
                  value={price}
                  onChange={e => { setPrice(e.target.value); setError('') }}
                  placeholder="e.g. 45"
                  style={{
                    flex: 1, background: 'rgba(245,166,35,0.04)',
                    border: '1px solid rgba(245,166,35,0.2)',
                    borderLeft: 'none',
                    borderBottom: '2px solid rgba(245,166,35,0.4)',
                    padding: '13px 16px', color: 'var(--white)',
                    fontSize: '1.1rem', fontFamily: 'Barlow, sans-serif',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(245,166,35,0.4)')}
                />
              </div>
            </div>

            {/* Arrival Time */}
            <div>
              <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '10px', fontWeight: 600 }}>
                ⏱ Arrival Time (minutes)
              </label>

              {/* Quick time picks */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[2, 5, 8, 12, 15].map(t => (
                  <button key={t} onClick={() => setArrivalTime(String(t))} style={{
                    background: arrivalTime === String(t) ? 'rgba(245,166,35,0.15)' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${arrivalTime === String(t) ? 'var(--gold)' : 'rgba(255,255,255,0.08)'}`,
                    color: arrivalTime === String(t) ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                    padding: '6px 14px', cursor: 'pointer',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.8rem',
                    transition: 'all 0.2s',
                  }}>{t} min</button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
                <div style={{
                  background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)',
                  borderRight: 'none', padding: '13px 16px',
                  fontFamily: 'Bebas Neue, sans-serif', color: 'var(--gold)', fontSize: '0.9rem',
                }}>MIN</div>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={arrivalTime}
                  onChange={e => { setArrivalTime(e.target.value); setError('') }}
                  placeholder="e.g. 5"
                  style={{
                    flex: 1, background: 'rgba(245,166,35,0.04)',
                    border: '1px solid rgba(245,166,35,0.2)',
                    borderLeft: 'none',
                    borderBottom: '2px solid rgba(245,166,35,0.4)',
                    padding: '13px 16px', color: 'var(--white)',
                    fontSize: '1.1rem', fontFamily: 'Barlow, sans-serif',
                    outline: 'none', boxSizing: 'border-box',
                  }}
                  onFocus={e => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={e => (e.target.style.borderBottomColor = 'rgba(245,166,35,0.4)')}
                />
              </div>
            </div>

            {/* Preview */}
            {price && arrivalTime && (
              <div style={{
                background: 'rgba(245,166,35,0.05)',
                border: '1px solid rgba(245,166,35,0.15)',
                padding: '16px 20px',
                display: 'flex', gap: '32px', alignItems: 'center',
              }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', fontFamily: 'Bebas Neue, sans-serif' }}>YOUR OFFER PREVIEW</div>
                <div style={{ display: 'flex', gap: '32px', marginLeft: 'auto' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: 'var(--gold)', lineHeight: 1 }}>{price} EGP</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>TOTAL FARE</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1 }}>{arrivalTime} MIN</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>ETA TO PICKUP</div>
                  </div>
                </div>
              </div>
            )}

            {/* Error / Success */}
            {error && (
              <div style={{
                background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)',
                padding: '12px 16px', color: '#ff6b6b', fontSize: '0.85rem',
              }}>{error}</div>
            )}
            {success && (
              <div style={{
                background: 'rgba(76,175,80,0.08)', border: '1px solid rgba(76,175,80,0.25)',
                padding: '12px 16px', color: '#66bb6a', fontSize: '0.85rem',
              }}>✓ {success}</div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={myBid ? handleUpdate : handleSubmit}
                disabled={submitting || !price || !arrivalTime || !ride}
                style={{
                  flex: 1, padding: '16px',
                  background: price && arrivalTime
                    ? 'linear-gradient(135deg, #F5A623, #B8761A)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  color: price && arrivalTime ? '#0A0A0A' : 'rgba(255,255,255,0.2)',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.12em',
                  cursor: price && arrivalTime ? 'pointer' : 'not-allowed',
                  clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
                  opacity: submitting ? 0.7 : 1, transition: 'all 0.2s',
                }}
              >
                {submitting
                  ? (myBid ? 'UPDATING...' : 'SUBMITTING...')
                  : (myBid ? 'UPDATE BID →' : 'SUBMIT BID →')}
              </button>

              {myBid && (
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  style={{
                    padding: '16px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,80,80,0.3)',
                    color: 'rgba(255,100,100,0.7)',
                    fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.8rem', letterSpacing: '0.1em',
                    cursor: 'pointer',
                  }}
                >WITHDRAW</button>
              )}
            </div>

            {/* Max bids note */}
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.2)', margin: 0 }}>
              ⚠️ You can submit up to 3 bids per ride. Lower price = higher chance of selection.
            </p>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}