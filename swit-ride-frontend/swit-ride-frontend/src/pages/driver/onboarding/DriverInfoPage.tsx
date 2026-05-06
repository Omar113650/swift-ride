import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const steps = ['Driver Info', 'Vehicle Info', 'Done']

function StepBar({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '48px' }}>
      {steps.map((label, i) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              border: `1px solid ${i <= current ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
              background: i < current ? 'var(--gold)' : i === current ? 'rgba(245,166,35,0.15)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Bebas Neue, sans-serif', fontSize: '0.9rem',
              color: i < current ? 'var(--black)' : i === current ? 'var(--gold)' : 'var(--white-dim)',
              transition: 'all 0.3s', flexShrink: 0,
            }}>{i < current ? '✓' : i + 1}</div>
            <span style={{ fontSize: '0.65rem', color: i <= current ? 'var(--gold)' : 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div style={{ flex: 1, height: '1px', background: i < current ? 'var(--gold)' : 'rgba(255,255,255,0.1)', margin: '0 12px', marginBottom: '24px', transition: 'background 0.3s' }} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function DriverInfoPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ licenseNumber: '', nationalId: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<{ license?: string; national?: string }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleFile = (field: 'license' | 'national', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(prev => ({ ...prev, [field]: URL.createObjectURL(file) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.licenseNumber || !form.nationalId) { setError('Please fill in all fields.'); return }
    if (form.licenseNumber.length < 5) { setError('License number seems too short.'); return }
    if (form.nationalId.length < 14) { setError('National ID must be 14 digits.'); return }
    setLoading(true)
    // TODO: POST /drivers  → { licenseNumber, nationalId }
    setTimeout(() => { setLoading(false); navigate('/driver/onboarding/vehicle') }, 1200)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', top: '-200px', right: '-200px', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 40px 60px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ position: 'absolute', top: '32px', left: '40px' }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
            SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '640px' }}>
          <StepBar current={0} />

          <div style={{ marginBottom: '40px' }}>
            <span className="section-tag" style={{ marginBottom: '16px', display: 'inline-block' }}>Driver Onboarding — Step 1 of 2</span>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--white)', lineHeight: 1, marginBottom: '12px' }}>
              YOUR DRIVER<br /><span style={{ color: 'var(--gold)' }}>IDENTITY</span>
            </h1>
            <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px' }}>
              We need to verify your identity before you start accepting rides. Your data is encrypted and reviewed within 24 hours.
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', color: '#ff6b6b', borderRadius: '2px' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* License Number */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                <span>Driver License Number</span>
                <span style={{ color: form.licenseNumber.length >= 5 ? 'var(--gold)' : 'transparent' }}>✓ Valid</span>
              </label>
              <input
                name="licenseNumber" type="text"
                value={form.licenseNumber} onChange={handleChange}
                placeholder="e.g. DL-12345678"
                maxLength={20}
                style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--white-dim)', marginTop: '6px' }}>Enter the number exactly as it appears on your license.</p>
            </div>

            {/* National ID */}
            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                <span>National ID Number</span>
                <span style={{ color: form.nationalId.length === 14 ? 'var(--gold)' : 'var(--white-dim)' }}>{form.nationalId.length}/14</span>
              </label>
              <input
                name="nationalId" type="text"
                value={form.nationalId} onChange={e => {
                  if (/^\d*$/.test(e.target.value)) handleChange(e)
                }}
                placeholder="14-digit National ID"
                maxLength={14}
                style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--white-dim)', marginTop: '6px' }}>Egyptian National ID — numbers only, 14 digits.</p>
            </div>

            {/* Upload docs */}
            <div>
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '12px', fontWeight: 600 }}>Document Photos <span style={{ color: 'rgba(245,166,35,0.5)', fontSize: '0.7rem' }}>(Optional — speeds up verification)</span></p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { field: 'license' as const, label: 'License Photo', hint: 'Front side of your license' },
                  { field: 'national' as const, label: 'National ID Photo', hint: 'Front side of your ID' },
                ].map(({ field, label, hint }) => (
                  <div key={field}>
                    <p style={{ fontSize: '0.72rem', color: 'var(--white-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</p>
                    <label htmlFor={`upload-${field}`} style={{
                      display: 'block', cursor: 'pointer',
                      border: `1px dashed ${preview[field] ? 'rgba(245,166,35,0.7)' : 'rgba(245,166,35,0.25)'}`,
                      background: preview[field] ? 'rgba(245,166,35,0.05)' : 'var(--black-3)',
                      borderRadius: '4px', overflow: 'hidden',
                      height: '130px', position: 'relative',
                      transition: 'all 0.2s',
                    }}>
                      {preview[field] ? (
                        <>
                          <img src={preview[field]} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(245,166,35,0.9)', padding: '2px 8px', fontSize: '0.65rem', fontFamily: 'Bebas Neue', color: 'var(--black)', letterSpacing: '0.1em' }}>CHANGE</div>
                        </>
                      ) : (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(245,166,35,0.4)" strokeWidth="1.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          </svg>
                          <span style={{ fontSize: '0.75rem', color: 'var(--white-dim)', textAlign: 'center', padding: '0 12px', lineHeight: 1.4 }}>{hint}</span>
                        </div>
                      )}
                      <input id={`upload-${field}`} type="file" accept="image/*" onChange={e => handleFile(field, e)} style={{ display: 'none' }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Info notice */}
            <div style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.15)', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" style={{ flexShrink: 0, marginTop: '2px' }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p style={{ fontSize: '0.82rem', color: 'var(--white-dim)', lineHeight: 1.6 }}>
                Your documents are reviewed within <span style={{ color: 'var(--gold)' }}>24 hours</span>. You can start setting up your vehicle while you wait.
              </p>
            </div>

            <button type="submit" className="btn-gold" disabled={loading} style={{ width: '100%', fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)' }}>
              {loading ? 'SAVING...' : 'CONTINUE — ADD YOUR VEHICLE →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
