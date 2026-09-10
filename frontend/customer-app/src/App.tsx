import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Footer } from './components/common/Footer';
import { SurchargeModal } from './components/common/SurchargeModal';

// Screens — pre-existing
import { LoginScreen } from './screens/LoginScreen';
import { OtpScreen } from './screens/OtpScreen';
import { NewBookingScreen } from './screens/NewBookingScreen';
import { VehicleSelectionScreen } from './screens/VehicleSelectionScreen';
import { ActiveTripScreen } from './screens/ActiveTripScreen';
import { HandoffScreen } from './screens/HandoffScreen';
import { FileReportScreen } from './screens/FileReportScreen';
import { ReportStatusScreen } from './screens/ReportStatusScreen';
import { PaymentScreen } from './screens/PaymentScreen';
import { TripHistoryScreen } from './screens/TripHistoryScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ChatScreen } from './screens/ChatScreen';
import { DebugSimulatorScreen } from './screens/DebugSimulatorScreen';

// Screens — new
import { LandingScreen } from './screens/LandingScreen';
import { AboutScreen } from './screens/AboutScreen';
import { DriverPortalScreen } from './screens/DriverPortalScreen';
import { AdminConsoleScreen } from './screens/AdminConsoleScreen';

// Show footer only on public-facing pages
const FOOTER_ROUTES = ['/', '/about', '/driver'];

function AppLayout() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/console';
  const showFooter = FOOTER_ROUTES.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink font-sans antialiased selection:bg-primary selection:text-card">
      {!isAdminPage && <Header />}

      <main className="flex-1">
        <Routes>
          {/* ── Public / Marketing Routes ── */}
          <Route path="/" element={<LandingScreen />} />
          <Route path="/about" element={<AboutScreen />} />
          <Route path="/driver" element={<DriverPortalScreen />} />
          <Route path="/admin" element={<AdminConsoleScreen />} />
          <Route path="/console" element={<AdminConsoleScreen />} />

          {/* ── Auth Routes ── */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/otp" element={<OtpScreen />} />

          {/* ── Shipper / Client Routes ── */}
          <Route path="/book" element={<NewBookingScreen />} />
          <Route path="/vehicles" element={<VehicleSelectionScreen />} />
          <Route path="/trip" element={<ActiveTripScreen />} />
          <Route path="/handoff/:mode" element={<HandoffScreen />} />
          <Route path="/report" element={<FileReportScreen />} />
          <Route path="/report/status" element={<ReportStatusScreen />} />
          <Route path="/report/:id" element={<ReportStatusScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/trips" element={<TripHistoryScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/chat" element={<ChatScreen />} />

          {/* ── Dev Tools ── */}
          <Route path="/debug" element={<DebugSimulatorScreen />} />
          <Route path="/simulator" element={<DebugSimulatorScreen />} />

          {/* ── Fallback ── */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer only on public pages */}
      {showFooter && <Footer />}

      {/* Always-present app chrome */}
      {!isAuthPage && !isAdminPage && <BottomNav />}
      <SurchargeModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
}
