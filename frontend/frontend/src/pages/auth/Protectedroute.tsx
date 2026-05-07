// import { Navigate, useLocation } from 'react-router-dom'
// import { useAuth } from './Authcontext'

// interface ProtectedRouteProps {
//   children: React.ReactNode
//   role?: 'RIDER' | 'DRIVER' // optional: restrict to specific role
// }

// export default function ProtectedRoute({ children, role }: ProtectedRouteProps) {
//   const { user, token, loading } = useAuth()
//   const location = useLocation()

//   // Show nothing while checking token validity
//   if (loading) {
//     return (
//       <div style={{
//         minHeight: '100vh', background: 'var(--black)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         flexDirection: 'column', gap: '16px',
//       }}>
//         <div style={{
//           width: '40px', height: '40px',
//           border: '2px solid rgba(245,166,35,0.15)',
//           borderTop: '2px solid #F5A623',
//           borderRadius: '50%',
//           animation: 'spin 0.8s linear infinite',
//         }} />
//         <span style={{
//           fontFamily: 'Bebas Neue, sans-serif',
//           letterSpacing: '0.15em', fontSize: '0.8rem',
//           color: 'rgba(255,255,255,0.3)',
//         }}>LOADING...</span>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     )
//   }

//   // Not logged in → redirect to login, remember where they wanted to go
//   if (!token || !user) {
//     return <Navigate to="/login" state={{ from: location.pathname }} replace />
//   }

//   // Wrong role (e.g. RIDER trying to access driver page)
//   if (role && user.role !== role) {
//     return <Navigate to={user.role === 'DRIVER' ? '/driver/dashboard' : '/rider/book'} replace />
//   }

//   return <>{children}</>
// }