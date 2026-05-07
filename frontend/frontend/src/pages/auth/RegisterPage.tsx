import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

type Role = 'RIDER' | 'DRIVER';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  // ✅ لو جه من "Become a Driver" هيبقى DRIVER تلقائي
  const [role, setRole] = useState<Role>(
    searchParams.get('role') === 'driver' ? 'DRIVER' : 'RIDER'
  );
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) { setError('Please fill in all fields.'); return; }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.password || !form.confirm) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);

    // TODO: POST /auth/register → { name, email, phone, password, role }
    setTimeout(() => {
      setLoading(false);
      // ✅ لو DRIVER → روح على الـ onboarding، لو RIDER → روح على login
      if (role === 'DRIVER') {
        navigate('/driver/onboarding/info');
      } else {
        navigate('/login');
      }
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Left Panel */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.4), transparent)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '80px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A' }}>SR</div>
            <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
              SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
            </span>
          </Link>

          <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, color: 'var(--white)', marginBottom: '24px' }}>
            JOIN THE<br /><span style={{ color: 'var(--gold)' }}>MOVEMENT.</span>
          </h1>

          <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '340px', marginBottom: '60px' }}>
            Whether you need a ride or want to earn — Swit-Ride connects you in real time.
          </p>

          {/* Role cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '320px' }}>
            {[
              { r: 'RIDER' as Role, title: 'Ride', desc: 'Book rides instantly, track live.' },
              { r: 'DRIVER' as Role, title: 'Drive', desc: 'Accept rides, earn on your schedule.' },
            ].map(({ r, title, desc }) => (
              <div key={r} onClick={() => setRole(r)} style={{
                padding: '16px 20px',
                border: `1px solid ${role === r ? 'rgba(245,166,35,0.6)' : 'rgba(255,255,255,0.06)'}`,
                background: role === r ? 'rgba(245,166,35,0.08)' : 'transparent',
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: '16px',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: role === r ? 'var(--gold)' : 'rgba(255,255,255,0.2)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: role === r ? 'var(--gold)' : 'var(--white)' }}>{title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--white-dim)', marginTop: '2px' }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Role indicator */}
          {role === 'DRIVER' && (
            <div style={{ marginTop: '20px', padding: '10px 16px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', maxWidth: '320px' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--gold)', lineHeight: 1.5 }}>
                🚗 After registration, you'll complete your driver profile and add your vehicle.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div style={{ width: '480px', flexShrink: 0, background: 'var(--black-2)', borderLeft: '1px solid rgba(245,166,35,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

        <div className="animate-fade-up">
          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            {[1, 2].map((s) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  border: `1px solid ${step >= s ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                  background: step > s ? 'var(--gold)' : step === s ? 'rgba(245,166,35,0.15)' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif',
                  color: step > s ? 'var(--black)' : step === s ? 'var(--gold)' : 'var(--white-dim)',
                  transition: 'all 0.3s',
                }}>{step > s ? '✓' : s}</div>
                <span style={{ fontSize: '0.7rem', color: step >= s ? 'var(--gold)' : 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {s === 1 ? 'Your Info' : 'Password'}
                </span>
                {s < 2 && <div style={{ width: '30px', height: '1px', background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />}
              </div>
            ))}
          </div>

          <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--white)', letterSpacing: '0.05em', marginBottom: '8px' }}>
            {step === 1 ? 'CREATE ACCOUNT' : 'SET PASSWORD'}
          </h2>
          <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: '32px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
          </p>

          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', padding: '12px 16px', marginBottom: '20px', fontSize: '0.85rem', color: '#ff6b6b' }}>{error}</div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Khaled' },
                { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
                { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+20 1XX XXX XXXX' },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>{f.label}</label>
                  <input
                    name={f.name} type={f.type}
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange} placeholder={f.placeholder}
                    style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
                    onBlur={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
                  />
                </div>
              ))}
              <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '8px', fontSize: '1rem', padding: '16px', clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
                CONTINUE →
              </button>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {[
                { name: 'password', label: 'Password', placeholder: '••••••••' },
                { name: 'confirm', label: 'Confirm Password', placeholder: '••••••••' },
              ].map((f) => (
                <div key={f.name}>
                  <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>{f.label}</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      name={f.name} type={showPass ? 'text' : 'password'}
                      value={form[f.name as keyof typeof form]}
                      onChange={handleChange} placeholder={f.placeholder}
                      style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 48px 14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
                    />
                    {f.name === 'password' && (
                      <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-dim)', fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif' }}>
                        {showPass ? 'HIDE' : 'SHOW'}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Password strength */}
              <div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: '3px', background: form.password.length >= i * 2 ? i <= 1 ? '#ff4444' : i <= 2 ? '#ffaa00' : i <= 3 ? '#88cc00' : '#00cc88' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--white-dim)' }}>
                  {form.password.length === 0 ? '' : form.password.length < 4 ? 'Weak' : form.password.length < 6 ? 'Fair' : form.password.length < 8 ? 'Good' : 'Strong'}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn-ghost" style={{ flex: 1, fontSize: '0.9rem', padding: '14px', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>← BACK</button>
                <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 2, fontSize: '0.9rem', padding: '14px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
                  {loading ? 'CREATING...' : role === 'DRIVER' ? 'NEXT: DRIVER PROFILE →' : 'CREATE ACCOUNT →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}




























// jwtب 






// import { useState } from 'react'
// import { Link, useNavigate, useSearchParams } from 'react-router-dom'
// import { useAuth } from '../../context/AuthContext'

// type Role = 'RIDER' | 'DRIVER'

// export default function RegisterPage() {
//   const navigate = useNavigate()
//   const [searchParams] = useSearchParams()
//   const { register } = useAuth()

//   const [step, setStep] = useState(1)
//   const [role, setRole] = useState<Role>(
//     searchParams.get('role') === 'driver' ? 'DRIVER' : 'RIDER'
//   )
//   const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' })
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
//   const [showPass, setShowPass] = useState(false)

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
//     setError('')
//   }

//   const handleStep1 = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!form.name || !form.email || !form.phone) { setError('Please fill in all fields.'); return }
//     const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
//     if (!emailOk) { setError('Please enter a valid email.'); return }
//     setStep(2)
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!form.password || !form.confirm) { setError('Please fill in all fields.'); return }
//     if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
//     if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }

//     setLoading(true)
//     setError('')

//     try {
//       await register({
//         name: form.name,
//         email: form.email,
//         phone: form.phone,
//         password: form.password,
//         role,
//       })
//       // ✅ Redirect based on role
//       if (role === 'DRIVER') {
//         navigate('/driver/onboarding/info', { replace: true })
//       } else {
//         navigate('/rider/book', { replace: true })
//       }
//     } catch (e: any) {
//       setError(e.message ?? 'Registration failed. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   const pwStrength = form.password.length === 0 ? null
//     : form.password.length < 4 ? { label: 'Weak', color: '#ff4444', bars: 1 }
//     : form.password.length < 6 ? { label: 'Fair', color: '#ffaa00', bars: 2 }
//     : form.password.length < 8 ? { label: 'Good', color: '#88cc00', bars: 3 }
//     : { label: 'Strong', color: '#00cc88', bars: 4 }

//   return (
//     <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', position: 'relative', overflow: 'hidden' }}>

//       {/* ---- Left Panel ---- */}
//       <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', overflow: 'hidden' }}>
//         <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,166,35,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.05) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />
//         <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)' }} />
//         <div style={{ position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', background: 'linear-gradient(180deg, transparent, rgba(245,166,35,0.4), transparent)' }} />

//         <div style={{ position: 'relative', zIndex: 1 }}>
//           <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '80px' }}>
//             <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #F5A623, #B8761A)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontFamily: 'Bebas Neue, sans-serif', color: '#0A0A0A' }}>SR</div>
//             <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
//               SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
//             </span>
//           </Link>

//           <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(3rem, 6vw, 5rem)', lineHeight: 0.95, color: 'var(--white)', marginBottom: '24px' }}>
//             JOIN THE<br /><span style={{ color: 'var(--gold)' }}>MOVEMENT.</span>
//           </h1>
//           <p style={{ color: 'var(--white-dim)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '340px', marginBottom: '48px' }}>
//             Whether you need a ride or want to earn — Swit-Ride connects you in real time.
//           </p>

//           {/* Role cards */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '320px' }}>
//             {([
//               { r: 'RIDER' as Role, icon: '🧍', title: 'Ride', desc: 'Book rides instantly, track live.' },
//               { r: 'DRIVER' as Role, icon: '🚗', title: 'Drive', desc: 'Accept rides, earn on your schedule.' },
//             ]).map(({ r, icon, title, desc }) => (
//               <div key={r} onClick={() => setRole(r)} style={{
//                 padding: '16px 20px',
//                 border: `1px solid ${role === r ? 'rgba(245,166,35,0.6)' : 'rgba(255,255,255,0.06)'}`,
//                 background: role === r ? 'rgba(245,166,35,0.08)' : 'transparent',
//                 cursor: 'pointer', transition: 'all 0.2s',
//                 display: 'flex', alignItems: 'center', gap: '16px',
//               }}>
//                 <span style={{ fontSize: '1.4rem' }}>{icon}</span>
//                 <div>
//                   <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: '0.1em', color: role === r ? 'var(--gold)' : 'var(--white)' }}>{title}</div>
//                   <div style={{ fontSize: '0.8rem', color: 'var(--white-dim)', marginTop: '2px' }}>{desc}</div>
//                 </div>
//                 {role === r && <div style={{ marginLeft: 'auto', width: '18px', height: '18px', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#0A0A0A', fontWeight: 700 }}>✓</div>}
//               </div>
//             ))}
//           </div>

//           {role === 'DRIVER' && (
//             <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.18)', maxWidth: '320px' }}>
//               <p style={{ fontSize: '0.78rem', color: 'rgba(245,166,35,0.8)', lineHeight: 1.5, margin: 0 }}>
//                 🚗 After registration, you'll complete your driver profile and add your vehicle details.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ---- Right Panel ---- */}
//       <div style={{ width: '480px', flexShrink: 0, background: 'var(--black-2)', borderLeft: '1px solid rgba(245,166,35,0.1)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', position: 'relative' }}>
//         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }} />

//         <div className="animate-fade-up">
//           {/* Steps indicator */}
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
//             {[1, 2].map(s => (
//               <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                 <div style={{
//                   width: '28px', height: '28px', borderRadius: '50%',
//                   border: `1px solid ${step >= s ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
//                   background: step > s ? 'var(--gold)' : step === s ? 'rgba(245,166,35,0.15)' : 'transparent',
//                   display: 'flex', alignItems: 'center', justifyContent: 'center',
//                   fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif',
//                   color: step > s ? 'var(--black)' : step === s ? 'var(--gold)' : 'var(--white-dim)',
//                   transition: 'all 0.3s',
//                 }}>{step > s ? '✓' : s}</div>
//                 <span style={{ fontSize: '0.7rem', color: step >= s ? 'var(--gold)' : 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
//                   {s === 1 ? 'Your Info' : 'Password'}
//                 </span>
//                 {s < 2 && <div style={{ width: '30px', height: '1px', background: step > s ? 'var(--gold)' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />}
//               </div>
//             ))}
//             {/* Role badge */}
//             <div style={{ marginLeft: 'auto', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)', padding: '4px 12px', fontSize: '0.65rem', fontFamily: 'Bebas Neue, sans-serif', color: 'var(--gold)', letterSpacing: '0.1em' }}>
//               {role}
//             </div>
//           </div>

//           <h2 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2rem', color: 'var(--white)', letterSpacing: '0.05em', marginBottom: '8px' }}>
//             {step === 1 ? 'CREATE ACCOUNT' : 'SET PASSWORD'}
//           </h2>
//           <p style={{ color: 'var(--white-dim)', fontSize: '0.85rem', marginBottom: '32px' }}>
//             Already have an account?{' '}
//             <Link to="/login" style={{ color: 'var(--gold)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
//           </p>

//           {error && (
//             <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', padding: '12px 16px', marginBottom: '20px', fontSize: '0.85rem', color: '#ff6b6b' }}>{error}</div>
//           )}

//           {/* ── Step 1: Personal Info ── */}
//           {step === 1 && (
//             <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
//               {[
//                 { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Ahmed Khaled' },
//                 { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com' },
//                 { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+20 1XX XXX XXXX' },
//               ].map(f => (
//                 <div key={f.name}>
//                   <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>{f.label}</label>
//                   <input
//                     name={f.name} type={f.type}
//                     value={form[f.name as keyof typeof form]}
//                     onChange={handleChange} placeholder={f.placeholder}
//                     style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
//                     onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
//                     onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
//                   />
//                 </div>
//               ))}
//               <button type="submit" className="btn-gold" style={{ width: '100%', marginTop: '8px', fontSize: '1rem', padding: '16px', clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
//                 CONTINUE →
//               </button>
//             </form>
//           )}

//           {/* ── Step 2: Password ── */}
//           {step === 2 && (
//             <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
//               {[
//                 { name: 'password', label: 'Password', placeholder: '••••••••' },
//                 { name: 'confirm', label: 'Confirm Password', placeholder: '••••••••' },
//               ].map(f => (
//                 <div key={f.name}>
//                   <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>{f.label}</label>
//                   <div style={{ position: 'relative' }}>
//                     <input
//                       name={f.name} type={showPass ? 'text' : 'password'}
//                       value={form[f.name as keyof typeof form]}
//                       onChange={handleChange} placeholder={f.placeholder}
//                       style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 48px 14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
//                       onFocus={e => (e.target.style.borderColor = 'rgba(245,166,35,0.8)')}
//                       onBlur={e => (e.target.style.borderColor = 'rgba(245,166,35,0.15)')}
//                     />
//                     {f.name === 'password' && (
//                       <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--white-dim)', fontSize: '0.75rem', fontFamily: 'Bebas Neue, sans-serif' }}>
//                         {showPass ? 'HIDE' : 'SHOW'}
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Password strength */}
//               {pwStrength && (
//                 <div>
//                   <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
//                     {[1, 2, 3, 4].map(i => (
//                       <div key={i} style={{ flex: 1, height: '3px', background: i <= pwStrength.bars ? pwStrength.color : 'rgba(255,255,255,0.1)', transition: 'background 0.3s', borderRadius: '2px' }} />
//                     ))}
//                   </div>
//                   <span style={{ fontSize: '0.7rem', color: pwStrength.color }}>{pwStrength.label}</span>
//                 </div>
//               )}

//               {/* Password match indicator */}
//               {form.confirm && (
//                 <div style={{ fontSize: '0.75rem', color: form.password === form.confirm ? '#4CAF50' : '#ff6b6b' }}>
//                   {form.password === form.confirm ? '✓ Passwords match' : '✗ Passwords do not match'}
//                 </div>
//               )}

//               <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
//                 <button type="button" onClick={() => { setStep(1); setError('') }} className="btn-ghost" style={{ flex: 1, fontSize: '0.9rem', padding: '14px', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
//                   ← BACK
//                 </button>
//                 <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 2, fontSize: '0.9rem', padding: '14px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
//                   {loading ? 'CREATING...' : role === 'DRIVER' ? 'NEXT: DRIVER PROFILE →' : 'CREATE ACCOUNT →'}
//                 </button>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }