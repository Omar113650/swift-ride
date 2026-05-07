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





import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public
import LandingPage from "./pages/home/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Driver
import DriverInfoPage from "./pages/driver/onboarding/DriverInfoPage";
import VehiclePage from "./pages/driver/onboarding/VehiclePage";
import DriverDashboard from "./pages/driver/DriverDashboard";
import DriverActiveRidePage from "./pages/driver/Driveractiveridepage";

// Rider
import BookRidePage from "./pages/Rider/Bookridepage";
import ViewBidsPage from "./pages/Rider/Viewbidspage";
import LiveTrackingPage from "./pages/Rider/Livetrackingpage";
import RiderHistoryPage from "./pages/Rider/Riderhistorypage";
import DriverSubmitBidPage from "./pages/driver/Driversubmitbidpage";




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ── Driver ── */}
        <Route path="/driver/onboarding/info" element={<DriverInfoPage />} />
        <Route path="/driver/onboarding/vehicle" element={<VehiclePage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
        <Route path="/driver/active-ride" element={<DriverActiveRidePage />} />
        {/* rideId param → السائق يشوف الـ ride ويقدم عرض */}
        <Route path="/driver/bid/:rideId" element={<DriverSubmitBidPage />} />

        {/* ── Rider Flow ── */}
        <Route path="/rider/book" element={<BookRidePage />} />
        {/* rideId param → الراكب يشوف الـ bids على ride معين */}
        <Route path="/rider/bids/:rideId" element={<ViewBidsPage />} />
        <Route path="/rider/tracking" element={<LiveTrackingPage />} />
        <Route path="/rider/history" element={<RiderHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


































































// ب jwt



// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider } from "./pages/auth/Authcontext";
// import ProtectedRoute from "./pages/auth/Protectedroute";

// // ── Public ──
// import LandingPage from "./pages/home/LandingPage";
// import LoginPage from "./pages/auth/LoginPage";
// import RegisterPage from "./pages/auth/RegisterPage";

// // ── Driver ──
// import DriverInfoPage from "./pages/driver/onboarding/DriverInfoPage";
// import VehiclePage from "./pages/driver/onboarding/VehiclePage";
// import DriverDashboard from "./pages/driver/DriverDashboard";
// import DriverActiveRidePage from "./pages/driver/Driveractiveridepage";
// import DriverSubmitBidPage from "./pages/driver/Driversubmitbidpage";

// // ── Rider ──
// import BookRidePage from "./pages/Rider/Bookridepage";
// import ViewBidsPage from "./pages/Rider/Viewbidspage";
// import LiveTrackingPage from "./pages/Rider/Livetrackingpage";
// import RiderHistoryPage from "./pages/Rider/Riderhistorypage";

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* ══ Public (no auth needed) ══ */}
//           <Route path="/" element={<LandingPage />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />

//           {/* ══ Driver Onboarding (auth required, DRIVER role) ══ */}
//           <Route
//             path="/driver/onboarding/info"
//             element={
//               <ProtectedRoute role="DRIVER">
//                 <DriverInfoPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/driver/onboarding/vehicle"
//             element={
//               <ProtectedRoute role="DRIVER">
//                 <VehiclePage />
//               </ProtectedRoute>
//             }
//           />

//           {/* ══ Driver App ══ */}
//           <Route
//             path="/driver/dashboard"
//             element={
//               <ProtectedRoute role="DRIVER">
//                 <DriverDashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/driver/bid/:rideId"
//             element={
//               <ProtectedRoute role="DRIVER">
//                 <DriverSubmitBidPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/driver/active-ride"
//             element={
//               <ProtectedRoute role="DRIVER">
//                 <DriverActiveRidePage />
//               </ProtectedRoute>
//             }
//           />

//           {/* ══ Rider App ══ */}
//           <Route
//             path="/rider/book"
//             element={
//               <ProtectedRoute role="RIDER">
//                 <BookRidePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/rider/bids/:rideId"
//             element={
//               <ProtectedRoute role="RIDER">
//                 <ViewBidsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/rider/tracking"
//             element={
//               <ProtectedRoute role="RIDER">
//                 <LiveTrackingPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/rider/history"
//             element={
//               <ProtectedRoute role="RIDER">
//                 <RiderHistoryPage />
//               </ProtectedRoute>
//             }
//           />

//           {/* ══ Fallback ══ */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;
