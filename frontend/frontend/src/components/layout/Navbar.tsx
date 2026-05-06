import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        padding: '0 40px',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled
          ? 'rgba(10,10,10,0.95)'
          : 'transparent',
        borderBottom: scrolled
          ? '1px solid rgba(245,166,35,0.15)'
          : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.4s ease',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px',
          background: 'linear-gradient(135deg, #F5A623, #B8761A)',
          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontFamily: 'Bebas Neue, sans-serif',
          color: '#0A0A0A',
        }}>SR</div>
        <span style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: '1.4rem',
          letterSpacing: '0.1em',
          color: '#F5F5F0',
        }}>
          SWIT<span style={{ color: '#F5A623' }}>-RIDE</span>
        </span>
      </div>

      {/* Desktop Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}
        className="desktop-nav">
        {['Features', 'How It Works', 'Drivers', 'Download'].map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(/\s/g, '-')}`}
            className="nav-link">{link}</a>
        ))}
      </div>

      {/* CTA */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <a href="/login" className="nav-link">Sign In</a>
        <a href="/register">
          <button className="btn-gold" style={{ fontSize: '0.85rem', padding: '10px 24px' }}>
            Get Started
          </button>
        </a>
      </div>
    </nav>
  )
}