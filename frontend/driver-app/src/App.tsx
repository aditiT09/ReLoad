import React, { useState } from 'react';
import { 
  ScreenType, 
  CargoJob, 
  Vehicle, 
  DriverProfile, 
  Certification, 
  ChatMessage, 
  TripStatus,
  SurchargeItem
} from './types';
import { 
  INITIAL_DRIVER, 
  INITIAL_VEHICLES, 
  INITIAL_CERTIFICATIONS, 
  INITIAL_ACTIVE_JOB, 
  AVAILABLE_JOBS, 
  INITIAL_CHAT 
} from './data';
import { HeaderBar } from './components/HeaderBar';
import { BottomNavBar } from './components/BottomNavBar';
import { ScreenLogin } from './components/ScreenLogin';
import { ScreenSignup } from './components/ScreenSignup';
import { ScreenOtp } from './components/ScreenOtp';
import { ScreenVerification } from './components/ScreenVerification';
import { ScreenHome } from './components/ScreenHome';
import { ScreenActiveTrip } from './components/ScreenActiveTrip';
import { ScreenHandoff } from './components/ScreenHandoff';
import { ScreenChat } from './components/ScreenChat';
import { ScreenTrustScore } from './components/ScreenTrustScore';
import { ScreenHistory } from './components/ScreenHistory';
import { ScreenProfile } from './components/ScreenProfile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [driver, setDriver] = useState<DriverProfile>(INITIAL_DRIVER);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh-1');
  const [certifications, setCertifications] = useState<Certification[]>(INITIAL_CERTIFICATIONS);
  const [activeJob, setActiveJob] = useState<CargoJob | null>(INITIAL_ACTIVE_JOB);
  const [availableJobs, setAvailableJobs] = useState<CargoJob[]>(AVAILABLE_JOBS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // Active vehicle object
  const activeVehicle = vehicles.find((v) => v.id === selectedVehicleId) || vehicles[0];

  // Surcharge counts
  const pendingSurcharges = activeJob?.surcharges.filter((s) => s.status === 'requested') || [];
  const pendingSurchargeCount = pendingSurcharges.length;

  // Handlers
  const handleLoginSuccess = (phoneEntered?: string) => {
    if (phoneEntered) {
      setDriver((prev) => ({ ...prev, phone: phoneEntered }));
    }
    setCurrentScreen('otp');
  };

  const handleSignupSuccess = (newDriver: Partial<DriverProfile>, newVehicle: Partial<Vehicle>) => {
    const newVehId = `veh-${Date.now()}`;
    const createdVehicle: Vehicle = {
      id: newVehId,
      makeModel: newVehicle.makeModel || 'Tata Winger Reefer Chiller',
      licensePlate: newVehicle.licensePlate || 'MH-12-TR-902',
      type: newVehicle.type || 'Refrigerated Van',
      isReeferCertified: newVehicle.isReeferCertified ?? true,
      isHazmatCertified: newVehicle.isHazmatCertified ?? false,
      reeferTempMin: newVehicle.isReeferCertified ? -25 : undefined,
      reeferTempMax: newVehicle.isReeferCertified ? 10 : undefined,
      maxPayloadKg: 1600,
      odometer: '12,400 km',
      inspectionStatus: 'verified',
    };

    setVehicles((prev) => [createdVehicle, ...prev]);
    setSelectedVehicleId(newVehId);

    setDriver((prev) => ({
      ...prev,
      ...newDriver,
      selectedVehicleId: newVehId,
    }));

    setCurrentScreen('otp');
  };

  const handleVerifyOtp = () => {
    setCurrentScreen('verification_status');
  };

  const handleProceedToHome = () => {
    setCurrentScreen('home');
  };

  const handleSwitchVehicle = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId);
    setDriver((prev) => ({ ...prev, selectedVehicleId: vehicleId }));
  };

  const handleAcceptJob = (job: CargoJob) => {
    const jobWithInitialStatus: CargoJob = {
      ...job,
      tripStatus: 'heading_to_pickup',
    };
    setActiveJob(jobWithInitialStatus);
    setAvailableJobs((prev) => prev.filter((j) => j.id !== job.id));
    setCurrentScreen('active_trip');
  };

  const handleUpdateTripStatus = (newStatus: TripStatus) => {
    if (!activeJob) return;
    setActiveJob((prev) => (prev ? { ...prev, tripStatus: newStatus } : null));
  };

  // CRITICAL SURCHARGE RULE:
  // Surcharge only affects fare after customer explicitly confirms it
  const handleRequestSurcharge = (reason: string, amount: number, note?: string) => {
    if (!activeJob) return;
    const newSurcharge: SurchargeItem = {
      id: `sur-${Date.now()}`,
      reason,
      amount,
      status: 'requested', // Pending customer confirmation!
      requestedAt: 'Just now',
      note,
    };

    setActiveJob((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        surcharges: [...prev.surcharges, newSurcharge],
      };
    });
  };

  const handleSimulateCustomerApproval = (surchargeId: string) => {
    if (!activeJob) return;
    setActiveJob((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        surcharges: prev.surcharges.map((s) =>
          s.id === surchargeId
            ? { ...s, status: 'approved', approvedAt: 'Confirmed by customer just now' }
            : s
        ),
      };
    });
  };

  const handleCompleteHandoff = () => {
    if (!activeJob) return;
    setActiveJob((prev) => (prev ? { ...prev, tripStatus: 'completed' } : null));
  };

  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'driver',
      senderName: `${driver.fullName} (You)`,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);

    // Simulate friendly customer reply after 1.5s
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: `msg-reply-${Date.now()}`,
        sender: 'customer',
        senderName: activeJob ? activeJob.dropoff.recipientName : 'Dispatch Support',
        text: 'Received! Dock bay is clear and intercom is unlocked.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  const handleSignOut = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-surface text-ink flex flex-col font-sans">
      {/* Top Header with flow switcher */}
      <HeaderBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        driver={driver}
        activeVehicle={activeVehicle}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-3xl mx-auto overflow-x-hidden">
        {currentScreen === 'login' && (
          <ScreenLogin
            onLoginSuccess={handleLoginSuccess}
            onNavigateToSignup={() => setCurrentScreen('signup')}
            driver={driver}
          />
        )}

        {currentScreen === 'signup' && (
          <ScreenSignup
            onSignupSuccess={handleSignupSuccess}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'otp' && (
          <ScreenOtp
            onVerifySuccess={handleVerifyOtp}
            onBackToLogin={() => setCurrentScreen('login')}
            phone={driver.phone}
          />
        )}

        {currentScreen === 'verification_status' && (
          <ScreenVerification
            certifications={certifications}
            activeVehicle={activeVehicle}
            allVehicles={vehicles}
            onProceedToHome={handleProceedToHome}
            onSwitchVehicle={handleSwitchVehicle}
          />
        )}

        {currentScreen === 'home' && (
          <ScreenHome
            availableJobs={availableJobs}
            activeVehicle={activeVehicle}
            onAcceptJob={handleAcceptJob}
            onSwitchVehicle={handleSwitchVehicle}
            allVehicles={vehicles}
            isOnline={isOnline}
            onToggleOnline={() => setIsOnline(!isOnline)}
            activeJob={activeJob}
            onViewActiveTrip={() => setCurrentScreen('active_trip')}
          />
        )}

        {currentScreen === 'active_trip' && activeJob && (
          <ScreenActiveTrip
            job={activeJob}
            onUpdateTripStatus={handleUpdateTripStatus}
            onRequestSurcharge={handleRequestSurcharge}
            onSimulateCustomerApproval={handleSimulateCustomerApproval}
            onProceedToHandoff={() => setCurrentScreen('handoff')}
            onOpenChat={() => setCurrentScreen('chat')}
          />
        )}

        {currentScreen === 'active_trip' && !activeJob && (
          <div className="p-6 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="text-muted text-base font-semibold">
              No active trip right now.
            </div>
            <button
              onClick={() => setCurrentScreen('home')}
              className="touch-btn bg-primary hover:bg-primary-dark text-card px-5 py-3 rounded-xl font-bold text-sm shadow transition-colors cursor-pointer"
            >
              Browse Available Cargo Jobs
            </button>
          </div>
        )}

        {currentScreen === 'handoff' && activeJob && (
          <ScreenHandoff
            job={activeJob}
            onCompleteHandoff={handleCompleteHandoff}
            onProceedToTrust={() => setCurrentScreen('trust_score')}
          />
        )}

        {currentScreen === 'handoff' && !activeJob && (
          <div className="p-6 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="text-muted text-base font-semibold">
              No active trip to hand off.
            </div>
            <button
              onClick={() => setCurrentScreen('home')}
              className="touch-btn bg-primary hover:bg-primary-dark text-card px-5 py-3 rounded-xl font-bold text-sm shadow transition-colors cursor-pointer"
            >
              Browse Available Cargo Jobs
            </button>
          </div>
        )}

        {currentScreen === 'chat' && activeJob && (
          <ScreenChat
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            job={activeJob}
            onProceedToTrust={() => setCurrentScreen('trust_score')}
            onBackToTrip={() => setCurrentScreen('active_trip')}
          />
        )}

        {currentScreen === 'chat' && !activeJob && (
          <div className="p-6 text-center space-y-4 max-w-md mx-auto my-12">
            <div className="text-muted text-base font-semibold">
              No active recipient chat session.
            </div>
            <button
              onClick={() => setCurrentScreen('home')}
              className="touch-btn bg-primary hover:bg-primary-dark text-card px-5 py-3 rounded-xl font-bold text-sm shadow transition-colors cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        )}

        {currentScreen === 'trust_score' && (
          <ScreenTrustScore
            driver={driver}
            onProceedToHistory={() => setCurrentScreen('history')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'history' && (
          <ScreenHistory
            onProceedToProfile={() => setCurrentScreen('profile')}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}

        {currentScreen === 'profile' && (
          <ScreenProfile
            driver={driver}
            activeVehicle={activeVehicle}
            allVehicles={vehicles}
            certifications={certifications}
            onSwitchVehicle={handleSwitchVehicle}
            onSignOut={handleSignOut}
            onBackToHome={() => setCurrentScreen('home')}
          />
        )}
      </main>

      {/* Thumb-friendly persistent bottom navigation */}
      <BottomNavBar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        hasActiveTrip={!!activeJob}
        pendingSurchargeCount={pendingSurchargeCount}
      />
    </div>
  );
}
