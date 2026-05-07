// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'

// const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

// type RideStatus = 'PENDING' | 'DRIVER_SELECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'

// interface ActiveRide {
//   id: string
//   status: RideStatus
//   pickupAddress?: string
//   destinationAddress?: string
//   selectedPrice?: number
//   driver?: {
//     user?: { name?: string }
//     rating?: number
//     vehicle?: { model?: string; plateNumber?: string }
//   }
// }

// interface RecentRide {
//   id: string
//   createdAt: string
//   pickupAddress?: string
//   destinationAddress?: string
//   selectedPrice?: number
//   status: RideStatus
// }

// const STATUS_COLOR: Record<RideStatus, string> = {
//   PENDING: '#F5A623',
//   DRIVER_SELECTED: '#2196F3',
//   IN_PROGRESS: '#4CAF50',
//   COMPLETED: 'rgba(255,255,255,0.3)',
//   CANCELLED: 'rgba(255,80,80,0.7)',
// }

// const STATUS_LABEL: Record<RideStatus, string> = {
//   PENDING: 'Finding drivers...',
//   DRIVER_SELECTED: 'Driver on the way',
//   IN_PROGRESS: 'Ride in progress',
//   COMPLETED: 'Completed',
//   CANCELLED: 'Cancelled',
// }

// const QUICK_PLACES = [
//   { label: 'Home', icon: '🏠', address: 'Maadi, Cairo' },
//   { label: 'Work', icon: '💼', address: 'Downtown, Cairo' },
//   { label: 'Airport', icon: '✈️', address: 'Cairo International Airport' },
//   { label: 'Mall', icon: '🛍️', address: 'City Stars, Heliopolis' },
// ]

// export default function RiderDashboard() {
//   const navigate = useNavigate()
//   const { user, token, logout } = useAuth()

//   const [activeRide, setActiveRide] = useState<ActiveRide | null>(null)
//   const [recentRides, setRecentRides] = useState<RecentRide[]>([])
//   const [loadingRide, setLoadingRide] = useState(true)
//   const [greeting, setGreeting] = useState('')
//   const [notifCount, setNotifCount] = useState(2)

//   useEffect(() => {
//     const h = new Date().getHours()
//     setGreeting(h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening')
//   }, [])

//   // Fetch active ride
//   useEffect(() => {
//     const fetchActive = async () => {
//       try {
//         const res = await fetch(`${API}/rides/my/active`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (res.ok) {
//           const data = await res.json()
//           setActiveRide(data)
//         }
//       } catch (_) {}
//       finally { setLoadingRide(false) }
//     }
//     fetchActive()
//   }, [token])

//   // Fetch recent rides
//   useEffect(() => {
//     const fetchRecent = async () => {
//       try {
//         const res = await fetch(`${API}/rides/my/history?limit=4`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         if (res.ok) {
//           const data = await res.json()
//           setRecentRides(data?.rides ?? data ?? [])
//         }
//       } catch (_) {}
//     }
//     fetchRecent()
//   }, [token])

//   const activeColor = activeRide ? STATUS_COLOR[activeRide.status] : 'var(--gold)'

//   return (
//     <div style={{
//       minHeight: '100vh', background: 'var(--black)',
//       fontFamily: 'Barlow, sans-serif', position: 'relative', overflow: 'hidden',
//     }}>
//       {/* BG */}
//       <div style={{
//         position: 'fixed', inset: 0,
//         backgroundImage: `linear-gradient(rgba(245,166,35,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.025) 1px, transparent 1px)`,
//         backgroundSize: '60px 60px', pointerEvents: 'none',
//       }} />
//       <div style={{
//         position: 'fixed', top: '-300px', right: '-200px',
//         width: '700px', height: '700px',
//         background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, transparent 65%)',
//         pointerEvents: 'none',
//       }} />

//       {/* ── Sidebar ── */}
//       <aside style={{
//         position: 'fixed', left: 0, top: 0, bottom: 0,
//         width: '72px',
//         background: 'rgba(10,10,10,0.95)',
//         borderRight: '1px solid rgba(245,166,35,0.1)',
//         display: 'flex', flexDirection: 'column', alignItems: 'center',
//         padding: '24px 0', gap: '8px', zIndex: 50,
//       }}>
//         {/* Logo */}
//         <div style={{
//           width: '38px', height: '38px',
//           background: 'linear-gradient(135deg, #F5A623, #B8761A)',
//           clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           fontSize: '11px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A',
//           marginBottom: '24px',
//         }}>SR</div>

//         {[
//           { icon: '🏠', label: 'Home', active: true, path: '/rider/dashboard' },
//           { icon: '🚗', label: 'Book', active: false, path: '/rider/book' },
//           { icon: '🕘', label: 'History', active: false, path: '/rider/history' },
//           { icon: '🔔', label: 'Alerts', active: false, path: '/rider/notifications', badge: notifCount },
//         ].map(item => (
//           <button key={item.label} onClick={() => navigate(item.path)} style={{
//             width: '48px', height: '48px',
//             background: item.active ? 'rgba(245,166,35,0.15)' : 'transparent',
//             border: `1px solid ${item.active ? 'rgba(245,166,35,0.4)' : 'transparent'}`,
//             cursor: 'pointer', fontSize: '1.2rem',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             position: 'relative', transition: 'all 0.2s',
//             title: item.label,
//           }}
//             onMouseEnter={e => { if (!item.active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
//             onMouseLeave={e => { if (!item.active) e.currentTarget.style.background = 'transparent' }}
//           >
//             {item.icon}
//             {item.badge ? (
//               <div style={{
//                 position: 'absolute', top: '6px', right: '6px',
//                 width: '16px', height: '16px', background: '#F5A623',
//                 borderRadius: '50%', fontSize: '0.55rem', fontWeight: 700,
//                 color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
//               }}>{item.badge}</div>
//             ) : null}
//           </button>
//         ))}

//         {/* Bottom: logout */}
//         <button onClick={logout} style={{
//           marginTop: 'auto', width: '48px', height: '48px',
//           background: 'transparent', border: 'none',
//           cursor: 'pointer', fontSize: '1.1rem',
//           display: 'flex', alignItems: 'center', justifyContent: 'center',
//           color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s',
//         }}
//           onMouseEnter={e => (e.currentTarget.style.color = '#ff6b6b')}
//           onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
//           title="Logout"
//         >🚪</button>
//       </aside>

//       {/* ── Main Content ── */}
//       <main style={{ marginLeft: '72px', padding: '40px 40px 60px', maxWidth: '1100px' }}>

//         {/* ── Top Bar ── */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
//           <div>
//             <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>{greeting}</p>
//             <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.4rem', color: 'var(--white)', letterSpacing: '0.05em', margin: '4px 0 0', lineHeight: 1 }}>
//               {user?.name?.split(' ')[0] ?? 'Rider'}<span style={{ color: 'var(--gold)' }}>.</span>
//             </h1>
//           </div>

//           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
//             {/* Notif bell */}
//             <button onClick={() => navigate('/rider/notifications')} style={{
//               position: 'relative', background: 'rgba(255,255,255,0.04)',
//               border: '1px solid rgba(255,255,255,0.08)', padding: '10px 12px',
//               cursor: 'pointer', fontSize: '1rem', color: 'var(--white)',
//             }}>
//               🔔
//               {notifCount > 0 && (
//                 <div style={{
//                   position: 'absolute', top: '4px', right: '4px',
//                   width: '16px', height: '16px', background: 'var(--gold)',
//                   borderRadius: '50%', fontSize: '0.55rem', fontWeight: 700,
//                   color: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 }}>{notifCount}</div>
//               )}
//             </button>

//             {/* Avatar */}
//             <div style={{
//               width: '42px', height: '42px',
//               background: 'linear-gradient(135deg, rgba(245,166,35,0.4), rgba(245,166,35,0.1))',
//               border: '1px solid rgba(245,166,35,0.3)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: 'var(--gold)',
//             }}>
//               {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? 'RD'}
//             </div>
//           </div>
//         </div>

//         {/* ── ACTIVE RIDE CARD ── */}
//         {loadingRide ? (
//           <div style={{
//             background: 'rgba(245,166,35,0.03)', border: '1px solid rgba(245,166,35,0.1)',
//             padding: '32px', display: 'flex', alignItems: 'center', gap: '12px',
//             marginBottom: '32px',
//           }}>
//             <div style={{ width: '18px', height: '18px', border: '2px solid rgba(245,166,35,0.2)', borderTop: '2px solid var(--gold)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
//             <span style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.12em', fontSize: '0.8rem' }}>CHECKING FOR ACTIVE RIDE...</span>
//           </div>
//         ) : activeRide ? (
//           <div style={{
//             background: `linear-gradient(135deg, rgba(245,166,35,0.06), rgba(0,0,0,0))`,
//             border: `1px solid ${activeColor}40`,
//             padding: '28px 32px',
//             marginBottom: '32px',
//             position: 'relative', overflow: 'hidden',
//           }}>
//             {/* Glow */}
//             <div style={{
//               position: 'absolute', top: '-60px', right: '-60px',
//               width: '200px', height: '200px',
//               background: `radial-gradient(circle, ${activeColor}20 0%, transparent 70%)`,
//               pointerEvents: 'none',
//             }} />

//             <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
//               <div style={{ flex: 1 }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
//                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeColor, animation: 'pulse 1.2s infinite' }} />
//                   <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.75rem', letterSpacing: '0.15em', color: activeColor }}>
//                     ACTIVE RIDE — {STATUS_LABEL[activeRide.status].toUpperCase()}
//                   </span>
//                 </div>

//                 {/* Route */}
//                 <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '20px' }}>
//                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', marginTop: '5px' }}>
//                     <div style={{ width: '9px', height: '9px', background: 'var(--gold)', borderRadius: '50%' }} />
//                     <div style={{ width: '1px', height: '24px', background: 'linear-gradient(180deg, var(--gold), rgba(245,166,35,0.2))' }} />
//                     <div style={{ width: '9px', height: '9px', border: '2px solid var(--gold)' }} />
//                   </div>
//                   <div>
//                     <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--white)', marginBottom: '14px' }}>
//                       {activeRide.pickupAddress ?? 'Pickup location'}
//                     </div>
//                     <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
//                       {activeRide.destinationAddress ?? 'Destination'}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Driver info */}
//                 {activeRide.driver && (
//                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px' }}>
//                     <div style={{
//                       width: '38px', height: '38px',
//                       background: 'linear-gradient(135deg, rgba(245,166,35,0.3), rgba(245,166,35,0.05))',
//                       border: '1px solid rgba(245,166,35,0.2)',
//                       display: 'flex', alignItems: 'center', justifyContent: 'center',
//                       fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', color: 'var(--gold)',
//                     }}>
//                       {activeRide.driver.user?.name?.split(' ').map(n => n[0]).join('') ?? 'DR'}
//                     </div>
//                     <div>
//                       <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--white)' }}>{activeRide.driver.user?.name ?? 'Your driver'}</div>
//                       <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
//                         {activeRide.driver.vehicle?.model ?? 'Vehicle'} · ⭐ {activeRide.driver.rating?.toFixed(1) ?? '4.8'}
//                       </div>
//                     </div>
//                     {activeRide.selectedPrice && (
//                       <div style={{ marginLeft: 'auto', fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--gold)' }}>
//                         {activeRide.selectedPrice} EGP
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>

//               {/* Track button */}
//               <button onClick={() => navigate('/rider/tracking')} style={{
//                 padding: '14px 28px',
//                 background: 'linear-gradient(135deg, #F5A623, #B8761A)',
//                 border: 'none', color: '#0A0A0A',
//                 fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', letterSpacing: '0.1em',
//                 cursor: 'pointer', flexShrink: 0,
//                 clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
//               }}>
//                 {activeRide.status === 'PENDING' ? 'VIEW BIDS →' : 'TRACK RIDE →'}
//               </button>
//             </div>
//           </div>
//         ) : (
//           /* No active ride — Book CTA */
//           <div style={{
//             background: 'rgba(245,166,35,0.04)',
//             border: '1px solid rgba(245,166,35,0.12)',
//             padding: '32px',
//             marginBottom: '32px',
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px',
//           }}>
//             <div>
//               <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.8rem', color: 'var(--white)', margin: '0 0 8px', letterSpacing: '0.05em' }}>
//                 WHERE TO <span style={{ color: 'var(--gold)' }}>TODAY?</span>
//               </h2>
//               <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: 0 }}>
//                 No active ride. Book one now and drivers will bid on your route.
//               </p>
//             </div>
//             <button onClick={() => navigate('/rider/book')} style={{
//               padding: '16px 36px',
//               background: 'linear-gradient(135deg, #F5A623, #B8761A)',
//               border: 'none', color: '#0A0A0A',
//               fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.12em',
//               cursor: 'pointer', flexShrink: 0,
//               clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
//             }}>+ BOOK A RIDE</button>
//           </div>
//         )}

//         {/* ── Quick Destinations ── */}
//         <div style={{ marginBottom: '40px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
//             <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', margin: 0 }}>QUICK DESTINATIONS</h3>
//           </div>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
//             {QUICK_PLACES.map(p => (
//               <button key={p.label} onClick={() => navigate('/rider/book')} style={{
//                 background: 'rgba(255,255,255,0.02)',
//                 border: '1px solid rgba(255,255,255,0.07)',
//                 padding: '16px', cursor: 'pointer',
//                 display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px',
//                 transition: 'all 0.2s', textAlign: 'left',
//               }}
//                 onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)'; e.currentTarget.style.background = 'rgba(245,166,35,0.05)' }}
//                 onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
//               >
//                 <span style={{ fontSize: '1.4rem' }}>{p.icon}</span>
//                 <div>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem', color: 'var(--white)', letterSpacing: '0.08em' }}>{p.label}</div>
//                   <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>{p.address}</div>
//                 </div>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── Stats Row ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '40px' }}>
//           {[
//             { label: 'Total Rides', value: recentRides.length > 0 ? `${recentRides.length}+` : '—', icon: '🚗' },
//             { label: 'This Month', value: '3', icon: '📅' },
//             { label: 'Total Spent', value: recentRides.filter(r => r.status === 'COMPLETED').reduce((s, r) => s + (r.selectedPrice ?? 0), 0) > 0 ? `${recentRides.filter(r => r.status === 'COMPLETED').reduce((s, r) => s + (r.selectedPrice ?? 0), 0)} EGP` : '—', icon: '💳' },
//             { label: 'Avg Rating', value: '4.8 ⭐', icon: '⭐' },
//           ].map(s => (
//             <div key={s.label} style={{
//               background: 'rgba(245,166,35,0.03)',
//               border: '1px solid rgba(245,166,35,0.1)',
//               padding: '18px',
//             }}>
//               <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{s.icon}</div>
//               <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
//               <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
//             </div>
//           ))}
//         </div>

//         {/* ── Recent Rides ── */}
//         <div>
//           <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
//             <h3 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', margin: 0 }}>RECENT RIDES</h3>
//             <button onClick={() => navigate('/rider/history')} style={{
//               background: 'none', border: '1px solid rgba(255,255,255,0.1)',
//               color: 'rgba(255,255,255,0.4)', padding: '6px 14px', cursor: 'pointer',
//               fontSize: '0.7rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
//             }}>VIEW ALL →</button>
//           </div>

//           {recentRides.length === 0 ? (
//             <div style={{ padding: '40px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
//               No rides yet — book your first ride above.
//             </div>
//           ) : (
//             <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
//               {recentRides.slice(0, 4).map(ride => (
//                 <div key={ride.id} style={{
//                   border: '1px solid rgba(255,255,255,0.06)',
//                   padding: '16px 20px',
//                   display: 'flex', alignItems: 'center', gap: '16px',
//                   transition: 'border-color 0.2s', cursor: 'default',
//                 }}
//                   onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.15)')}
//                   onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)')}
//                 >
//                   <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: STATUS_COLOR[ride.status], flexShrink: 0 }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>{ride.pickupAddress ?? 'Pickup'}</div>
//                     <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>→ {ride.destinationAddress ?? 'Destination'}</div>
//                   </div>
//                   <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{new Date(ride.createdAt).toLocaleDateString()}</div>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', color: ride.status === 'COMPLETED' ? 'var(--gold)' : 'rgba(255,255,255,0.2)', minWidth: '80px', textAlign: 'right' }}>
//                     {ride.selectedPrice ? `${ride.selectedPrice} EGP` : '—'}
//                   </div>
//                   <div style={{
//                     fontSize: '0.6rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.1em',
//                     padding: '3px 8px',
//                     background: `${STATUS_COLOR[ride.status]}15`,
//                     border: `1px solid ${STATUS_COLOR[ride.status]}30`,
//                     color: STATUS_COLOR[ride.status],
//                     minWidth: '70px', textAlign: 'center',
//                   }}>{ride.status}</div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
//       `}</style>
//     </div>
//   )
// }