// import { BrowserRouter, Routes, Route } from 'react-router-dom'
// import LandingPage from './pages/home/LandingPage'
// import LoginPage from './pages/auth/LoginPage'
// import RegisterPage from './pages/auth/RegisterPage'
// import DriverInfoPage from './pages/driver/onboarding/DriverInfoPage'
// import VehiclePage from './pages/driver/onboarding/VehiclePage'
// import DriverDashboard from './pages/driver/DriverDashboard'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LandingPage />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/register" element={<RegisterPage />} />
//         <Route path="/driver/onboarding/info" element={<DriverInfoPage />} />
//         <Route path="/driver/onboarding/vehicle" element={<VehiclePage />} />
//         <Route path="/driver/dashboard" element={<DriverDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App














import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Existing
import LandingPage from './pages/home/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// Driver
import DriverInfoPage from './pages/driver/onboarding/DriverInfoPage'
import VehiclePage from './pages/driver/onboarding/VehiclePage'
import DriverDashboard from './pages/driver/DriverDashboard'

// 👇 Rider Pages (ضيفهم)
import BookRidePage from './pages/Rider/Bookridepage'
import BidsPage from './pages/Rider/Viewbidspage'
import LiveTrackingPage from './pages/Rider/Livetrackingpage'
import RiderHistoryPage from './pages/Rider/Livetrackingpage' // لو عاملها

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Driver */}
        <Route path="/driver/onboarding/info" element={<DriverInfoPage />} />
        <Route path="/driver/onboarding/vehicle" element={<VehiclePage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />

        {/* 🔥 Rider Flow */}
        <Route path="/rider/book" element={<BookRidePage />} />
        <Route path="/rider/bids" element={<BidsPage />} />
        <Route path="/rider/live" element={<LiveTrackingPage />} />
        <Route path="/rider/history" element={<RiderHistoryPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App