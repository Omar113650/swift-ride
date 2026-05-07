import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";

// ---- Icons (inline SVG) ----
const IconBolt = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconShield = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconMap = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
    <line x1="9" y1="3" x2="9" y2="18" />
    <line x1="15" y1="6" x2="15" y2="21" />
  </svg>
);
const IconStar = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IconClock = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCard = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#F5A623"
    strokeWidth="2"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const CarSVG = () => (
  <svg
    className="car-svg"
    width="120"
    height="50"
    viewBox="0 0 120 50"
    fill="none"
  >
    <rect
      x="15"
      y="22"
      width="90"
      height="22"
      rx="4"
      fill="#1a1a1a"
      stroke="#F5A623"
      strokeWidth="1"
    />
    <path
      d="M25 22 L35 10 L80 10 L95 22"
      fill="#111"
      stroke="#F5A623"
      strokeWidth="1"
    />
    <rect
      x="38"
      y="12"
      width="18"
      height="10"
      rx="1"
      fill="rgba(245,166,35,0.3)"
    />
    <rect
      x="60"
      y="12"
      width="18"
      height="10"
      rx="1"
      fill="rgba(245,166,35,0.3)"
    />
    <circle
      cx="35"
      cy="42"
      r="8"
      fill="#0f0f0f"
      stroke="#F5A623"
      strokeWidth="1.5"
    />
    <circle cx="35" cy="42" r="4" fill="#1a1a1a" />
    <circle
      cx="85"
      cy="42"
      r="8"
      fill="#0f0f0f"
      stroke="#F5A623"
      strokeWidth="1.5"
    />
    <circle cx="85" cy="42" r="4" fill="#1a1a1a" />
    <rect
      x="100"
      y="26"
      width="12"
      height="6"
      rx="1"
      fill="rgba(245,166,35,0.8)"
    />
    <rect x="8" y="28" width="8" height="4" rx="1" fill="rgba(255,80,80,0.7)" />
  </svg>
);

const features = [
  {
    icon: <IconBolt />,
    title: "Real-Time Matching",
    desc: "Instant driver matching using geo-indexed search. No waiting, no delays.",
  },
  {
    icon: <IconMap />,
    title: "Live Tracking",
    desc: "Follow your ride on the map with live GPS updates via Socket.IO.",
  },
  {
    icon: <IconShield />,
    title: "Safe & Verified",
    desc: "All drivers are verified. Every ride is encrypted and secured.",
  },
  {
    icon: <IconClock />,
    title: "Always On-Time",
    desc: "BullMQ background jobs ensure notifications fire the moment you need them.",
  },
  {
    icon: <IconCard />,
    title: "Smart Payments",
    desc: "Seamless payment via Stripe or Paymob — processed in the background.",
  },
  {
    icon: <IconStar />,
    title: "Rated Experience",
    desc: "Rate your driver after every ride. Quality is always maintained.",
  },
];

const stats = [
  { value: "< 3min", label: "Average Pickup Time" },
  { value: "99.9%", label: "Uptime Reliability" },
  { value: "5★", label: "Driver Rating Avg" },
  { value: "0ms", label: "Tracking Delay" },
];

const steps = [
  {
    num: "01",
    title: "Request a Ride",
    desc: "Enter your destination and our system instantly finds nearby drivers using GEO search.",
  },
  {
    num: "02",
    title: "Driver Accepts",
    desc: "The closest available driver gets notified via real-time socket event and accepts your ride.",
  },
  {
    num: "03",
    title: "Track Live",
    desc: "Watch your driver move on the map in real-time. No refresh needed.",
  },
  {
    num: "04",
    title: "Arrive & Pay",
    desc: "Get dropped off. Payment is processed automatically. Rate your experience.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        background: "var(--black)",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* ======== HERO ======== */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          paddingTop: "72px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
            linear-gradient(rgba(245,166,35,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,166,35,0.04) 1px, transparent 1px)
          `,
            backgroundSize: "60px 60px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "55%",
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40vw",
            height: "100%",
            background:
              "linear-gradient(135deg, transparent 0%, rgba(245,166,35,0.04) 100%)",
            borderLeft: "1px solid rgba(245,166,35,0.1)",
            clipPath: "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)",
          }}
        />

        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 40px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Left */}
          <div>
            <div className="animate-fade-up" style={{ marginBottom: "24px" }}>
              <span className="section-tag">Next-Gen Ride Hailing</span>
            </div>
            <h1
              className="animate-fade-up-delay-1 animate-glow"
              style={{
                fontSize: "clamp(4rem, 8vw, 7rem)",
                lineHeight: "0.95",
                color: "var(--white)",
                marginBottom: "8px",
              }}
            >
              SWITCH ON.
            </h1>
            <h1
              className="animate-fade-up-delay-2"
              style={{
                fontSize: "clamp(4rem, 8vw, 7rem)",
                lineHeight: "0.95",
                color: "var(--gold)",
                marginBottom: "32px",
              }}
            >
              RIDE SMART.
            </h1>
            <p
              className="animate-fade-up-delay-3"
              style={{
                color: "var(--white-dim)",
                fontSize: "1.1rem",
                lineHeight: "1.7",
                maxWidth: "420px",
                marginBottom: "40px",
                fontWeight: 400,
              }}
            >
              Real-time ride hailing powered by Socket.IO, BullMQ, and Redis.
              Your ride, tracked live. Your payment, handled smart.
            </p>

            <div
              className="animate-fade-up-delay-4"
              style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}
            >
              {/* ✅ Book a Ride → /rider/book */}
              <button
                className="btn-gold"
                onClick={() => navigate("/rider/book")}
              >
                Book a Ride
              </button>
              {/* ✅ Become a Driver → /register?role=driver */}
              <button
                className="btn-ghost"
                onClick={() => navigate("/register?role=driver")}
              >
                Become a Driver
              </button>
            </div>

            <div
              className="animate-fade-in"
              style={{
                display: "flex",
                gap: "40px",
                marginTop: "60px",
                paddingTop: "32px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {[
                ["10K+", "Active Riders"],
                ["500+", "Drivers"],
                ["4.9★", "Rating"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "1.8rem",
                      color: "var(--gold)",
                      lineHeight: 1,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--white-dim)",
                      marginTop: "4px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Mockup */}
          <div className="animate-slide-right" style={{ position: "relative" }}>
            <div
              style={{
                width: "280px",
                margin: "0 auto",
                background: "var(--black-3)",
                border: "1px solid rgba(245,166,35,0.2)",
                borderRadius: "24px",
                padding: "20px",
                boxShadow:
                  "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(245,166,35,0.08)",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "Bebas Neue",
                    color: "var(--gold)",
                    fontSize: "1rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  SWIT-RIDE
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--white-dim)" }}>
                  12:52 AM
                </span>
              </div>
              <div
                style={{
                  height: "160px",
                  background:
                    "linear-gradient(135deg, #0f1a0f 0%, #0a100a 50%, #111a08 100%)",
                  borderRadius: "12px",
                  border: "1px solid rgba(245,166,35,0.1)",
                  marginBottom: "16px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  style={{ position: "absolute", inset: 0 }}
                >
                  {[0.2, 0.4, 0.6, 0.8].map((x) => (
                    <line
                      key={x}
                      x1={`${x * 100}%`}
                      y1="0"
                      x2={`${x * 100}%`}
                      y2="100%"
                      stroke="rgba(245,166,35,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                  {[0.25, 0.5, 0.75].map((y) => (
                    <line
                      key={y}
                      x1="0"
                      y1={`${y * 100}%`}
                      x2="100%"
                      y2={`${y * 100}%`}
                      stroke="rgba(245,166,35,0.08)"
                      strokeWidth="1"
                    />
                  ))}
                  <path
                    d="M30 130 Q80 60 180 30"
                    stroke="#F5A623"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    fill="none"
                    opacity="0.8"
                  />
                  <circle
                    cx="100"
                    cy="88"
                    r="8"
                    fill="rgba(245,166,35,0.2)"
                    stroke="#F5A623"
                    strokeWidth="1.5"
                  />
                  <circle cx="100" cy="88" r="3" fill="#F5A623" />
                  <circle cx="180" cy="30" r="5" fill="#F5A623" opacity="0.9" />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "rgba(245,166,35,0.15)",
                    border: "1px solid rgba(245,166,35,0.3)",
                    borderRadius: "6px",
                    padding: "4px 8px",
                    fontSize: "0.65rem",
                    color: "var(--gold)",
                    fontFamily: "Bebas Neue",
                    letterSpacing: "0.1em",
                  }}
                >
                  LIVE
                </div>
              </div>
              <div
                style={{
                  background: "rgba(245,166,35,0.05)",
                  border: "1px solid rgba(245,166,35,0.12)",
                  borderRadius: "10px",
                  padding: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "linear-gradient(135deg, #F5A623, #B8761A)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Bebas Neue",
                    color: "#0A0A0A",
                    fontSize: "1rem",
                  }}
                >
                  AK
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      color: "var(--white)",
                    }}
                  >
                    Ahmed K.
                  </div>
                  <div
                    style={{ fontSize: "0.7rem", color: "var(--white-dim)" }}
                  >
                    Toyota Camry · XYZ 1234
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gold)",
                      fontFamily: "Bebas Neue",
                    }}
                  >
                    4.9★
                  </div>
                  <div
                    style={{ fontSize: "0.65rem", color: "var(--white-dim)" }}
                  >
                    2 min away
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                }}
              >
                <span
                  style={{ fontSize: "0.75rem", color: "var(--white-dim)" }}
                >
                  Estimated arrival
                </span>
                <span
                  style={{
                    fontFamily: "Bebas Neue",
                    color: "var(--gold)",
                    fontSize: "1.2rem",
                    letterSpacing: "0.05em",
                  }}
                >
                  8 MIN
                </span>
              </div>
              {/* ✅ Mockup cancel → navigate to tracking (demo) */}
              <button
                onClick={() => navigate("/rider/tracking")}
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "var(--white-dim)",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  fontFamily: "Bebas Neue",
                  letterSpacing: "0.1em",
                }}
              >
                TRACK MY RIDE
              </button>
            </div>
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                background: "var(--gold)",
                color: "var(--black)",
                padding: "8px 16px",
                fontFamily: "Bebas Neue",
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                clipPath:
                  "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                boxShadow: "0 4px 20px rgba(245,166,35,0.4)",
              }}
            >
              LIVE NOW
            </div>
          </div>
        </div>

        <div className="road-container">
          <div className="road">
            <div className="road-lines">
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="road-dash" />
              ))}
            </div>
          </div>
          <CarSVG />
        </div>
      </section>

      {/* ======== STATS ======== */}
      <section
        style={{ padding: "80px 40px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            background: "rgba(245,166,35,0.1)",
            border: "1px solid rgba(245,166,35,0.1)",
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="stat-card"
              style={{ background: "var(--black-2)" }}
            >
              <div
                style={{
                  fontFamily: "Bebas Neue, sans-serif",
                  fontSize: "3rem",
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "var(--white-dim)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======== FEATURES ======== */}
      <section id="features" style={{ padding: "80px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ marginBottom: "16px" }}>
            <span className="section-tag">What We Offer</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "60px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                color: "var(--white)",
                lineHeight: 1,
              }}
            >
              BUILT FOR
              <br />
              <span style={{ color: "var(--gold)" }}>PERFORMANCE</span>
            </h2>
            <p
              style={{
                maxWidth: "300px",
                color: "var(--white-dim)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              Every feature is engineered for speed, reliability, and real-world
              scale.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div style={{ marginBottom: "20px" }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.4rem",
                    letterSpacing: "0.06em",
                    color: "var(--white)",
                    marginBottom: "12px",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    color: "var(--white-dim)",
                    fontSize: "0.9rem",
                    lineHeight: 1.6,
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== HOW IT WORKS ======== */}
      <section
        id="how-it-works"
        style={{
          padding: "100px 40px",
          background: "var(--black-2)",
          borderTop: "1px solid rgba(245,166,35,0.08)",
          borderBottom: "1px solid rgba(245,166,35,0.08)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <span className="section-tag">The Flow</span>
            <h2
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                marginTop: "16px",
                color: "var(--white)",
              }}
            >
              HOW IT <span style={{ color: "var(--gold)" }}>WORKS</span>
            </h2>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "0",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "32px",
                left: "12.5%",
                right: "12.5%",
                height: "1px",
                background:
                  "linear-gradient(90deg, transparent, var(--gold), transparent)",
                opacity: 0.3,
              }}
            />
            {steps.map((s, i) => (
              <div
                key={s.num}
                style={{
                  padding: "0 24px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    width: "64px",
                    height: "64px",
                    border: "1px solid rgba(245,166,35,0.4)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 28px",
                    background:
                      i === 0 ? "rgba(245,166,35,0.15)" : "var(--black-2)",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "Bebas Neue, sans-serif",
                      fontSize: "1.4rem",
                      color: "var(--gold)",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {s.num}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "Bebas Neue, sans-serif",
                    fontSize: "1.2rem",
                    color: "var(--white)",
                    letterSpacing: "0.06em",
                    marginBottom: "12px",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--white-dim)",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA ======== */}
      <section
        style={{
          padding: "120px 40px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "800px",
            height: "800px",
            background:
              "radial-gradient(circle, rgba(245,166,35,0.08) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="section-tag">Ready?</span>
          <h2
            style={{
              fontSize: "clamp(3rem, 7vw, 6rem)",
              color: "var(--white)",
              marginTop: "20px",
              lineHeight: 1,
            }}
          >
            YOUR RIDE
            <br />
            <span style={{ color: "var(--gold)" }}>AWAITS.</span>
          </h2>
          <p
            style={{
              color: "var(--white-dim)",
              marginTop: "24px",
              marginBottom: "48px",
              fontSize: "1rem",
            }}
          >
            Join thousands of riders and drivers on the smartest ride platform.
          </p>
          <div
            style={{
              display: "flex",
              gap: "16px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* ✅ CTA → Book */}
            <button
              className="btn-gold"
              style={{ fontSize: "1rem", padding: "16px 48px" }}
              onClick={() => navigate("/rider/book")}
            >
              Book Your First Ride
            </button>
            {/* ✅ CTA → Driver register */}
            <button
              className="btn-ghost"
              style={{ fontSize: "1rem", padding: "16px 48px" }}
              onClick={() => navigate("/register?role=driver")}
            >
              Drive With Us
            </button>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <footer
        style={{
          borderTop: "1px solid rgba(245,166,35,0.1)",
          padding: "40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "Bebas Neue",
            fontSize: "1.2rem",
            letterSpacing: "0.1em",
          }}
        >
          SWIT<span style={{ color: "var(--gold)" }}>-RIDE</span>
        </div>
        <div style={{ color: "var(--white-dim)", fontSize: "0.8rem" }}>
          © 2025 Swit-Ride. Switch On. Ride Smart.
        </div>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Privacy", "Terms", "Support"].map((l) => (
            <a
              key={l}
              href="#"
              className="nav-link"
              style={{ fontSize: "0.75rem" }}
            >
              {l}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
