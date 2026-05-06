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

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Minivan', 'Truck', 'Hatchback', 'Coupe']
const COLORS = [
  { name: 'Black', hex: '#1a1a1a' }, { name: 'White', hex: '#f0f0f0' },
  { name: 'Silver', hex: '#9e9e9e' }, { name: 'Red', hex: '#e53935' },
  { name: 'Blue', hex: '#1976D2' }, { name: 'Gold', hex: '#F5A623' },
  { name: 'Green', hex: '#388E3C' }, { name: 'Brown', hex: '#795548' },
]

export default function VehiclePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    type: '',
    model: '',
    color: '',
    plateNumber: '',
    year: '',
    insuranceExpiry: '',
  })
  const [imagePreview, setImagePreview] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const currentYear = new Date().getFullYear()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.type || !form.model || !form.color || !form.plateNumber || !form.year) {
      setError('Please fill in all required fields.'); return
    }
    const yr = parseInt(form.year)
    if (yr < 2000 || yr > currentYear) { setError(`Year must be between 2000 and ${currentYear}.`); return }
    if (form.plateNumber.length < 3) { setError('Plate number seems too short.'); return }

    setLoading(true)
    // TODO: POST /vehicles → { type, model, color, plateNumber, year, insuranceExpiry, image }
    setTimeout(() => { setLoading(false); navigate('/driver/dashboard') }, 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'absolute', bottom: '-200px', left: '-200px', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 40px 60px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ position: 'absolute', top: '32px', left: '40px' }}>
          <span style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '0.1em', color: 'var(--white)' }}>
            SWIT<span style={{ color: 'var(--gold)' }}>-RIDE</span>
          </span>
        </div>

        <div style={{ width: '100%', maxWidth: '700px' }}>
          <StepBar current={1} />

          <div style={{ marginBottom: '40px' }}>
            <span className="section-tag" style={{ marginBottom: '16px', display: 'inline-block' }}>Driver Onboarding — Step 2 of 2</span>
            <h1 style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--white)', lineHeight: 1, marginBottom: '12px' }}>
              YOUR<br /><span style={{ color: 'var(--gold)' }}>VEHICLE</span>
            </h1>
            <p style={{ color: 'var(--white-dim)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '480px' }}>
              Add your vehicle details. Riders will see this information when they book a ride with you.
            </p>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)', padding: '12px 16px', marginBottom: '24px', fontSize: '0.85rem', color: '#ff6b6b' }}>{error}</div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

            {/* Vehicle Type */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '12px', fontWeight: 600 }}>
                Vehicle Type <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {VEHICLE_TYPES.map(type => (
                  <div key={type} onClick={() => { setForm(prev => ({ ...prev, type })); setError('') }}
                    style={{
                      padding: '12px 16px', cursor: 'pointer', textAlign: 'center',
                      border: `1px solid ${form.type === type ? 'rgba(245,166,35,0.7)' : 'rgba(255,255,255,0.08)'}`,
                      background: form.type === type ? 'rgba(245,166,35,0.1)' : 'var(--black-3)',
                      color: form.type === type ? 'var(--gold)' : 'var(--white-dim)',
                      fontSize: '0.85rem', fontWeight: 600,
                      transition: 'all 0.2s',
                    }}>
                    {type}
                  </div>
                ))}
              </div>
            </div>

            {/* Model + Year */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                  Vehicle Model <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
                <input
                  name="model" type="text" value={form.model} onChange={handleChange}
                  placeholder="e.g. Toyota Camry"
                  style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                  Year <span style={{ color: '#ff6b6b' }}>*</span>
                </label>
                <input
                  name="year" type="number" value={form.year} onChange={handleChange}
                  placeholder={`e.g. ${currentYear - 2}`}
                  min="2000" max={currentYear}
                  style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
                />
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '12px', fontWeight: 600 }}>
                Vehicle Color <span style={{ color: '#ff6b6b' }}>*</span>
                {form.color && <span style={{ color: 'var(--gold)', marginLeft: '12px', fontSize: '0.7rem' }}>— {form.color}</span>}
              </label>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {COLORS.map(c => (
                  <div key={c.name} onClick={() => { setForm(prev => ({ ...prev, color: c.name })); setError('') }}
                    title={c.name}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: c.hex, cursor: 'pointer',
                      border: form.color === c.name ? '2px solid var(--gold)' : '2px solid transparent',
                      outline: form.color === c.name ? '1px solid rgba(245,166,35,0.5)' : '1px solid rgba(255,255,255,0.1)',
                      outlineOffset: '2px',
                      transition: 'all 0.2s',
                      transform: form.color === c.name ? 'scale(1.15)' : 'scale(1)',
                    }} />
                ))}
              </div>
            </div>

            {/* Plate Number */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Plate Number <span style={{ color: '#ff6b6b' }}>*</span>
              </label>
              <input
                name="plateNumber" type="text"
                value={form.plateNumber} onChange={e => { setForm(prev => ({ ...prev, plateNumber: e.target.value.toUpperCase() })); setError('') }}
                placeholder="e.g. ABC 1234"
                maxLength={10}
                style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: 'var(--white)', fontSize: '1rem', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '0.15em', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--white-dim)', marginTop: '6px' }}>Must be unique — exactly as on your vehicle registration.</p>
            </div>

            {/* Insurance Expiry */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Insurance Expiry Date <span style={{ color: 'rgba(245,166,35,0.5)', fontSize: '0.7rem' }}>(Optional)</span>
              </label>
              <input
                name="insuranceExpiry" type="date"
                value={form.insuranceExpiry} onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                style={{ width: '100%', background: 'var(--black-3)', border: '1px solid rgba(245,166,35,0.15)', borderBottom: '1px solid rgba(245,166,35,0.4)', padding: '14px 16px', color: form.insuranceExpiry ? 'var(--white)' : 'var(--white-dim)', fontSize: '0.95rem', fontFamily: 'Barlow, sans-serif', outline: 'none', transition: 'border-color 0.2s', colorScheme: 'dark' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.8)'}
                onBlur={e => e.target.style.borderColor = 'rgba(245,166,35,0.15)'}
              />
            </div>

            {/* Vehicle Image */}
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--white-dim)', marginBottom: '8px', fontWeight: 600 }}>
                Vehicle Photo <span style={{ color: 'rgba(245,166,35,0.5)', fontSize: '0.7rem' }}>(Optional — uploaded to Cloudinary)</span>
              </label>
              <label htmlFor="vehicle-image" style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                border: `1px dashed ${imagePreview ? 'rgba(245,166,35,0.7)' : 'rgba(245,166,35,0.25)'}`,
                background: 'var(--black-3)', cursor: 'pointer',
                padding: imagePreview ? '0' : '20px', height: imagePreview ? '160px' : 'auto',
                position: 'relative', overflow: 'hidden', transition: 'all 0.2s',
              }}>
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Vehicle" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(245,166,35,0.4)', padding: '6px 14px', fontSize: '0.7rem', fontFamily: 'Bebas Neue', color: 'var(--gold)', letterSpacing: '0.1em', cursor: 'pointer' }}>CHANGE PHOTO</div>
                  </>
                ) : (
                  <>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(245,166,35,0.6)" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--white)', fontWeight: 600, marginBottom: '4px' }}>Upload vehicle photo</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--white-dim)' }}>JPG, PNG up to 5MB — riders will see this photo</p>
                    </div>
                  </>
                )}
                <input id="vehicle-image" type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              </label>
            </div>

            {/* Summary preview */}
            {(form.type || form.model || form.color) && (
              <div style={{ background: 'rgba(245,166,35,0.04)', border: '1px solid rgba(245,166,35,0.15)', padding: '16px 20px' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px', fontFamily: 'Bebas Neue' }}>Vehicle Summary</p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Type', value: form.type },
                    { label: 'Model', value: form.model },
                    { label: 'Year', value: form.year },
                    { label: 'Color', value: form.color },
                    { label: 'Plate', value: form.plateNumber },
                  ].filter(f => f.value).map(f => (
                    <div key={f.label}>
                      <p style={{ fontSize: '0.65rem', color: 'var(--white-dim)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{f.label}</p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--white)', fontWeight: 600, marginTop: '2px' }}>{f.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => navigate('/driver/onboarding/info')} className="btn-ghost"
                style={{ flex: '0 0 auto', fontSize: '0.9rem', padding: '14px 24px', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
                ← BACK
              </button>
              <button type="submit" className="btn-gold" disabled={loading}
                style={{ flex: 1, fontSize: '1rem', padding: '16px', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer', clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}>
                {loading ? 'SUBMITTING...' : 'FINISH & GO TO DASHBOARD →'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}
