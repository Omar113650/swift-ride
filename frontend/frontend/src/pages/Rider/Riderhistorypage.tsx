import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Tab = 'history' | 'profile'

interface RideRecord {
  id: string
  date: string
  from: string
  to: string
  driver: string
  price: number
  status: 'COMPLETED' | 'CANCELLED'
  rating?: number
  distance: string
  duration: string
}

const MOCK_RIDES: RideRecord[] = [
  { id: '1', date: 'May 6, 2026 · 9:14 AM', from: 'Cairo University', to: 'Tahrir Square', driver: 'Ahmed Hassan', price: 45, status: 'COMPLETED', rating: 5, distance: '8.2 km', duration: '19 min' },
  { id: '2', date: 'May 5, 2026 · 6:30 PM', from: 'Maadi Metro', to: 'New Cairo Mall', driver: 'Mohamed Ali', price: 78, status: 'COMPLETED', rating: 4, distance: '14.5 km', duration: '32 min' },
  { id: '3', date: 'May 4, 2026 · 8:00 AM', from: 'Heliopolis', to: 'Downtown Cairo', driver: 'Samir Fathy', price: 55, status: 'CANCELLED', distance: '11 km', duration: '—' },
  { id: '4', date: 'May 2, 2026 · 3:45 PM', from: 'Nasr City', to: 'Zamalek', driver: 'Khaled Omar', price: 62, status: 'COMPLETED', rating: 5, distance: '12 km', duration: '28 min' },
  { id: '5', date: 'Apr 30, 2026 · 11:20 AM', from: 'Giza Pyramids', to: 'Cairo Airport', driver: 'Tarek Saad', price: 120, status: 'COMPLETED', rating: 4, distance: '28 km', duration: '45 min' },
]

export default function RiderHistoryPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('history')
  const [editMode, setEditMode] = useState(false)
  const [profile, setProfile] = useState({
    name: 'Omar Youssef',
    email: 'omar.youssef@email.com',
    phone: '+20 100 987 6543',
    city: 'Cairo, Egypt',
  })
  const [form, setForm] = useState(profile)

  const totalSpent = MOCK_RIDES.filter(r => r.status === 'COMPLETED').reduce((s, r) => s + r.price, 0)
  const completedRides = MOCK_RIDES.filter(r => r.status === 'COMPLETED').length
  const avgRating = (MOCK_RIDES.filter(r => r.rating).reduce((s, r) => s + (r.rating || 0), 0) / MOCK_RIDES.filter(r => r.rating).length).toFixed(1)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
    }}>
      {/* BG */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundImage: `linear-gradient(rgba(245,166,35,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.025) 1px, transparent 1px)`,
        backgroundSize: '60px 60px', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '-200px', left: '-200px', width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 70%)',
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

        <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '4px' }}>
          {(['history', 'profile'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 24px', border: 'none', cursor: 'pointer',
              background: tab === t ? 'rgba(245,166,35,0.15)' : 'transparent',
              color: tab === t ? 'var(--gold)' : 'rgba(255,255,255,0.4)',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem', letterSpacing: '0.12em',
              borderBottom: tab === t ? '2px solid var(--gold)' : '2px solid transparent',
              transition: 'all 0.2s', textTransform: 'capitalize',
            }}>{t === 'history' ? '🕘 HISTORY' : '👤 PROFILE'}</button>
          ))}
        </div>

        <button onClick={() => navigate('/rider/book')} style={{
          background: 'linear-gradient(135deg, #F5A623, #B8761A)',
          border: 'none', color: '#0A0A0A',
          padding: '10px 24px', cursor: 'pointer',
          fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.85rem', letterSpacing: '0.1em',
          clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
        }}>+ BOOK RIDE</button>
      </header>

      <main style={{
        flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto',
        padding: '40px 32px', position: 'relative', zIndex: 1,
      }}>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Rides', value: MOCK_RIDES.length.toString(), icon: '🚗' },
            { label: 'Completed', value: completedRides.toString(), icon: '✅' },
            { label: 'Total Spent', value: `${totalSpent} EGP`, icon: '💳' },
            { label: 'Avg Rating Given', value: `${avgRating} ⭐`, icon: '⭐' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(245,166,35,0.04)',
              border: '1px solid rgba(245,166,35,0.12)',
              padding: '20px',
            }}>
              <div style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.5rem', color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* HISTORY TAB */}
        {tab === 'history' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--white)', margin: 0, letterSpacing: '0.05em' }}>RIDE HISTORY</h2>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>{MOCK_RIDES.length} RIDES TOTAL</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {MOCK_RIDES.map(ride => (
                <div key={ride.id} style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                  padding: '20px 24px',
                  display: 'flex', alignItems: 'center', gap: '20px',
                  transition: 'border-color 0.2s',
                  cursor: 'default',
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)')}
                >
                  {/* Status dot */}
                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: ride.status === 'COMPLETED' ? '#4CAF50' : 'rgba(255,80,80,0.8)',
                    }} />
                    <div style={{ width: '1px', height: '30px', background: 'rgba(255,255,255,0.06)' }} />
                    <div style={{ width: '10px', height: '10px', border: '1px solid rgba(255,255,255,0.2)' }} />
                  </div>

                  {/* Route */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '8px', letterSpacing: '0.05em' }}>{ride.date}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--white)', fontWeight: 600, marginBottom: '4px' }}>{ride.from}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>↓</div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}>{ride.to}</div>
                  </div>

                  {/* Meta */}
                  <div style={{ textAlign: 'center', minWidth: '80px' }}>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>{ride.distance}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{ride.duration}</div>
                  </div>

                  {/* Driver */}
                  <div style={{ textAlign: 'center', minWidth: '100px' }}>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '2px', letterSpacing: '0.05em' }}>DRIVER</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>{ride.driver}</div>
                    {ride.rating && <div style={{ fontSize: '0.7rem', color: 'var(--gold)', marginTop: '2px' }}>{'⭐'.repeat(ride.rating)}</div>}
                  </div>

                  {/* Status & Price */}
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <div style={{
                      display: 'inline-block',
                      fontSize: '0.65rem', letterSpacing: '0.1em',
                      padding: '3px 10px', marginBottom: '6px',
                      background: ride.status === 'COMPLETED' ? 'rgba(76,175,80,0.1)' : 'rgba(255,80,80,0.1)',
                      border: `1px solid ${ride.status === 'COMPLETED' ? 'rgba(76,175,80,0.3)' : 'rgba(255,80,80,0.3)'}`,
                      color: ride.status === 'COMPLETED' ? '#4CAF50' : '#ff6b6b',
                      fontFamily: 'Bebas Neue, sans-serif',
                    }}>{ride.status}</div>
                    <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.2rem', color: ride.status === 'COMPLETED' ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>
                      {ride.status === 'COMPLETED' ? `${ride.price} EGP` : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
              <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--white)', margin: 0, letterSpacing: '0.05em' }}>MY PROFILE</h2>
              <button onClick={() => { if (editMode) setProfile(form); setEditMode(!editMode) }} style={{
                background: editMode ? 'linear-gradient(135deg, #F5A623, #B8761A)' : 'transparent',
                border: `1px solid ${editMode ? 'transparent' : 'rgba(245,166,35,0.3)'}`,
                color: editMode ? '#0A0A0A' : 'var(--gold)',
                padding: '8px 20px', cursor: 'pointer',
                fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.8rem', letterSpacing: '0.1em',
              }}>{editMode ? 'SAVE CHANGES ✓' : 'EDIT PROFILE'}</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              {/* Avatar block */}
              <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '8px' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, rgba(245,166,35,0.4), rgba(245,166,35,0.1))',
                  border: '2px solid rgba(245,166,35,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--gold)',
                }}>OY</div>
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: 'var(--white)', letterSpacing: '0.05em' }}>{profile.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>RIDER ACCOUNT</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gold)', marginTop: '4px' }}>⭐ {avgRating} avg · {completedRides} rides</div>
                </div>
              </div>

              {[
                { label: 'Full Name', key: 'name', icon: '👤' },
                { label: 'Email Address', key: 'email', icon: '✉️' },
                { label: 'Phone Number', key: 'phone', icon: '📞' },
                { label: 'City', key: 'city', icon: '📍' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: 'block', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '8px', fontWeight: 600 }}>
                    {f.icon} {f.label}
                  </label>
                  {editMode ? (
                    <input
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      style={{
                        width: '100%', background: 'rgba(245,166,35,0.05)',
                        border: '1px solid rgba(245,166,35,0.3)',
                        borderBottom: '2px solid var(--gold)',
                        padding: '12px 16px', color: 'var(--white)',
                        fontSize: '0.9rem', fontFamily: 'Barlow, sans-serif',
                        outline: 'none', boxSizing: 'border-box',
                      }}
                    />
                  ) : (
                    <div style={{
                      padding: '12px 16px',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'var(--white)', fontSize: '0.9rem',
                      background: 'rgba(255,255,255,0.02)',
                    }}>{profile[f.key as keyof typeof profile]}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Danger Zone */}
            <div style={{ marginTop: '48px', borderTop: '1px solid rgba(255,80,80,0.1)', paddingTop: '24px' }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,80,80,0.5)', letterSpacing: '0.12em', marginBottom: '16px', fontFamily: 'Bebas Neue, sans-serif' }}>ACCOUNT ACTIONS</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.4)', padding: '10px 24px', cursor: 'pointer',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em',
                }}>LOG OUT</button>
                <button style={{
                  background: 'transparent', border: '1px solid rgba(255,80,80,0.2)',
                  color: 'rgba(255,80,80,0.5)', padding: '10px 24px', cursor: 'pointer',
                  fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem', letterSpacing: '0.1em',
                }}>DELETE ACCOUNT</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
