import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    // TODO: connect to API
    setTimeout(() => {
      setLoading(false)
      navigate('/')
    }, 1500)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ---- Left Panel (decorative) ---- */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        overflow: 'hidden',
      }}>
        {/* BG grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />

        {/* Glow */}
        <div style={{
          position: 'absolute',
          bottom: '-100px', left: '-100px',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Vertical gold line */}
        <div style={{
          position: 'absolute',
          top: 0, right: 0,
          width: '1px', height: '100%',
          background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.4), transparent)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '80px' }}>
            <div style={{
              width: '36px', height: '36px',
              background: 'linear-gradient(135deg, #F5A623, #B8761A)',
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A',
            }}>SR</div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
              SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
            </span>
          </Link>

          {/* Big text */}
          <h1 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
            lineHeight: 0.95,
            color: 'var(--white)',
            marginBottom: '24px',
          }}>
            WELCOME<br />
            <span style={{ color: 'var(--gold)' }}>BACK.</span>
          </h1>

          <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '340px', marginBottom: '60px' }}>
            Your city is moving. Get back in the driver's seat — or book your next ride in seconds.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '40px' }}>
            {[['10K+', 'Riders'], ['500+', 'Drivers'], ['4.9★', 'Rating']].map(([v, l]) => (
              <div key={l}>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: 'var(--gold)', lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--white-dim)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>

          {/* Bottom road deco */}
          <div style={{
            position: 'absolute',
            bottom: '40px', left: '80px', right: '0',
            height: '2px',
            background: 'linear-gradient(90deg, var(--gold), transparent)',
            opacity: 0.3,
          }} />
        </div>
      </div>

      {/* ---- Right Panel (form) ---- */}
      <div style={{
        width: '480px',
        flexShrink: 0,
        background: 'var(--black-2)',
        borderLeft: '1px solid rgba(245,166,35,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        position: 'relative',
      }}>
        {/* Top accent */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
        }} />

        <div className="animate-fade-up">
          <span className="section-tag" style={{ marginBottom: '32px', display: 'inline-block' }}>Sign In</span>

          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            fontSize: '2.4rem',
            color: 'var(--white)',
            letterSpacing: '0.05em',
            marginBottom: '8px',
          }}>LOGIN TO YOUR ACCOUNT</h2>

          <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: '40px' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
              Register here
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(255,80,80,0.1)',
              border: '1px solid rgba(255,80,80,0.3)',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '0.85rem',
              color: '#ff6b6b',
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  background: 'var(--black-3)',
                  border: '1px solid rgba(245,166,35,0.15)',
                  borderBottom: '1px solid rgba(245,166,35,0.4)',
                  padding: '14px 16px',
                  color: 'var(--white)',
                  fontSize: '0.95rem',
                  fontFamily: 'Barlow, sans-serif',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    background: 'var(--black-3)',
                    border: '1px solid rgba(245,166,35,0.15)',
                    borderBottom: '1px solid rgba(245,166,35,0.4)',
                    padding: '14px 48px 14px 16px',
                    color: 'var(--white)',
                    fontSize: '0.95rem',
                    fontFamily: 'Barlow, sans-serif',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--white-dim)', fontSize: '0.75rem', letterSpacing: '0.05em',
                    fontFamily: 'Bebas Neue, sans-serif',
                  }}>
                  {showPass ? 'HIDE' : 'SHOW'}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', opacity: 0.8 }}>
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Role selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Login As
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {['Rider', 'Driver'].map(role => (
                  <label key={role} style={{
                    border: '1px solid rgba(245,166,35,0.2)',
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'var(--black-3)',
                    transition: 'border-color 0.2s',
                  }}>
                    <input type="radio" name="role" value={role.toLowerCase()} defaultChecked={role === 'Rider'}
                      style={{ accentColor: 'var(--gold)' }} />
                    <span style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>{role}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-gold"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '8px',
                fontSize: '1rem',
                padding: '16px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN →'}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--white-dim)', letterSpacing: '0.1em' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Google */}
          <button style={{
            width: '100%', padding: '14px',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--white)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontFamily: 'Barlow, sans-serif',
            fontWeight: 600,
            transition: 'border-color 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  )
}



































//  ب JWT 

// import { useState } from 'react'
// import { Link, useNavigate, useLocation } from 'react-router-dom'
// // import { useAuth } from '../../context/AuthContext'

// export default function LoginPage() {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { login, user } = useAuth()

//   const [form, setForm] = useState({ email: '', password: '', role: 'rider' })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [showPass, setShowPass] = useState(false)

//   // Where to redirect after login (from ProtectedRoute)
//   const from = (location.state as any)?.from ?? null

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
//     setError('')
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!form.email || !form.password) { setError('Please fill in all fields.'); return }
//     setLoading(true)
//     setError('')

//     try {
//       await login(form.email, form.password)
//       // login sets user in context — redirect based on role or original destination
//       const loggedUser = JSON.parse(atob(localStorage.getItem('token')!.split('.')[1]))
//       const role: string = loggedUser?.role ?? 'RIDER'

//       if (from) {
//         navigate(from, { replace: true })
//       } else if (role === 'DRIVER') {
//         navigate('/driver/dashboard', { replace: true })
//       } else {
//         navigate('/rider/book', { replace: true })
//       }
//     } catch (e: any) {
//       setError(e.message ?? 'Invalid email or password.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: 'var(--black)',
//       display: 'flex',
//       position: 'relative',
//       overflow: 'hidden',
//     }}>

//       {/* ---- Left Panel ---- */}
//       <div style={{
//         flex: 1, position: 'relative',
//         display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', padding: '80px', overflow: 'hidden',
//       }}>
//         <div style={{
//           position: 'absolute', inset: 0,
//           backgroundImage: `
//             linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)
//           `,
//           backgroundSize: '50px 50px',
//         }} />
//         <div style={{
//           position: 'absolute', bottom: '-100px', left: '-100px',
//           width: '500px', height: '500px',
//           background: 'radial-gradient(circle, rgba(245,166,35,0.15) 0%, transparent 70%)',
//           pointerEvents: 'none',
//         }} />
//         <div style={{
//           position: 'absolute', top: 0, right: 0,
//           width: '1px', height: '100%',
//           background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.4), transparent)',
//         }} />

//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '80px' }}>
//             <div style={{
//               width: '36px', height: '36px',
//               background: 'linear-gradient(135deg, #F5A623, #B8761A)',
//               clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               fontSize: '12px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A',
//             }}>SR</div>
//             <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
//               SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
//             </span>
//           </Link>

//           <h1 style={{
//             fontFamily: 'Bebas Neue, sans-serif',
//             fontSize: 'clamp(3.5rem, 6vw, 5.5rem)',
//             lineHeight: 0.95, color: 'var(--white)', marginBottom: '24px',
//           }}>
//             WELCOME<br /><span style={{ color: 'var(--gold)' }}>BACK.</span>
//           </h1>

//           <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '340px', marginBottom: '60px' }}>
//             Your city is moving. Get back in the driver's seat — or book your next ride in seconds.
//           </p>

//           <div style={{ display: 'flex', gap: '40px' }}>
//             {[['10K+', 'Riders'], ['500+', 'Drivers'], ['4.9★', 'Rating']].map(([v, l]) => (
//               <div key={l}>
//                 <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.6rem', color: 'var(--gold)', lineHeight: 1 }}>{v}</div>
//                 <div style={{ fontSize: '0.7rem', color: 'var(--white-dim)', marginTop: '4px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{l}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ---- Right Panel (form) ---- */}
//       <div style={{
//         width: '480px', flexShrink: 0,
//         background: 'var(--black-2)',
//         borderLeft: '1px solid rgba(245,166,35,0.1)',
//         display: 'flex', flexDirection: 'column',
//         justifyContent: 'center', padding: '60px 48px', position: 'relative',
//       }}>
//         <div style={{
//           position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
//           background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
//         }} />

//         <div className="animate-fade-up">
//           <span className="section-tag" style={{ marginBottom: '32px', display: 'inline-block' }}>Sign In</span>

//           <h2 style={{
//             fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.4rem',
//             color: 'var(--white)', letterSpacing: '0.05em', marginBottom: '8px',
//           }}>LOGIN TO YOUR ACCOUNT</h2>

//           <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: '40px' }}>
//             Don't have an account?{' '}
//             <Link to="/register" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>
//               Register here
//             </Link>
//           </p>

//           {/* Redirect notice */}
//           {from && (
//             <div style={{
//               background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.2)',
//               padding: '10px 14px', marginBottom: '20px',
//               fontSize: '0.8rem', color: 'rgba(245,166,35,0.8)',
//             }}>
//               🔒 Please sign in to continue.
//             </div>
//           )}

//           {/* Error */}
//           {error && (
//             <div style={{
//               background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
//               padding: '12px 16px', marginBottom: '24px',
//               fontSize: '0.85rem', color: '#ff6b6b',
//             }}>{error}</div>
//           )}

//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

//             {/* Email */}
//             <div>
//               <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
//                 Email Address
//               </label>
//               <input
//                 name="email" type="email"
//                 value={form.email} onChange={handleChange}
//                 placeholder="you@example.com"
//                 style={{
//                   width: '100%', background: 'var(--black-3)',
//                   border: '1px solid rgba(245,166,35,0.15)',
//                   borderBottom: '1px solid rgba(245,166,35,0.4)',
//                   padding: '14px 16px', color: 'var(--white)',
//                   fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif',
//                   outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
//                 }}
//                 onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
//                 onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
//                 Password
//               </label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   name="password" type={showPass ? 'text' : 'password'}
//                   value={form.password} onChange={handleChange}
//                   placeholder="••••••••"
//                   style={{
//                     width: '100%', background: 'var(--black-3)',
//                     border: '1px solid rgba(245,166,35,0.15)',
//                     borderBottom: '1px solid rgba(245,166,35,0.4)',
//                     padding: '14px 48px 14px 16px', color: 'var(--white)',
//                     fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif',
//                     outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
//                   }}
//                   onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
//                   onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
//                 />
//                 <button type="button" onClick={() => setShowPass(!showPass)} style={{
//                   position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
//                   background: 'none', border: 'none', cursor: 'pointer',
//                   color: 'var(--white-dim)', fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif',
//                 }}>{showPass ? 'HIDE' : 'SHOW'}</button>
//               </div>
//               <div style={{ textAlign: 'right', marginTop: '8px' }}>
//                 <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--gold)', textDecoration: 'none', opacity: 0.8 }}>
//                   Forgot password?
//                 </Link>
//               </div>
//             </div>

//             {/* Role selector (UI only — role comes from token) */}
//             <div>
//               <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
//                 Login As
//               </label>
//               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
//                 {['Rider', 'Driver'].map(r => (
//                   <label key={r} style={{
//                     border: `1px solid ${form.role === r.toLowerCase() ? 'rgba(245,166,35,0.5)' : 'rgba(245,166,35,0.2)'}`,
//                     background: form.role === r.toLowerCase() ? 'rgba(245,166,35,0.08)' : 'var(--black-3)',
//                     padding: '12px', cursor: 'pointer',
//                     display: 'flex', alignItems: 'center', gap: '8px',
//                     transition: 'all 0.2s',
//                   }}>
//                     <input
//                       type="radio" name="role" value={r.toLowerCase()}
//                       checked={form.role === r.toLowerCase()}
//                       onChange={handleChange}
//                       style={{ accentColor: 'var(--gold)' }}
//                     />
//                     <span style={{ fontSize: '0.85rem', color: 'var(--white)', fontWeight: 600 }}>{r}</span>
//                   </label>
//                 ))}
//               </div>
//               <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)', marginTop: '6px' }}>
//                 Your account role is set at registration — this is just a hint.
//               </p>
//             </div>

//             {/* Submit */}
//             <button
//               type="submit"
//               className="btn-gold"
//               disabled={loading}
//               style={{
//                 width: '100%', marginTop: '8px',
//                 fontSize: '1rem', padding: '16px',
//                 opacity: loading ? 0.7 : 1,
//                 cursor: loading ? 'not-allowed' : 'pointer',
//                 clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)',
//               }}
//             >
//               {loading ? 'SIGNING IN...' : 'SIGN IN →'}
//             </button>
//           </form>

//           {/* Divider */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
//             <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
//             <span style={{ fontSize: '0.75rem', color: 'var(--white-dim)', letterSpacing: '0.1em' }}>OR</span>
//             <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
//           </div>

//           {/* Google (placeholder) */}
//           <button style={{
//             width: '100%', padding: '14px',
//             background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
//             color: 'var(--white)', fontSize: '0.85rem', cursor: 'pointer',
//             display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
//             fontFamily: 'Barlow, sans-serif', fontWeight: 600, transition: 'border-color 0.2s',
//           }}
//             onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(245,166,35,0.3)')}
//             onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
//           >
//             <svg width="18" height="18" viewBox="0 0 24 24">
//               <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//               <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//               <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//               <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//             </svg>
//             Continue with Google
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }