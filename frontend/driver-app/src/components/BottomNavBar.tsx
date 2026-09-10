import React from 'react';
import { ScreenType } from '../types';
import { 
  Package, 
  Navigation, 
  CheckSquare, 
  MessageSquare, 
  UserCheck
} from 'lucide-react';

interface BottomNavBarProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  hasActiveTrip: boolean;
  unreadChatCount?: number;
  pendingSurchargeCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentScreen,
  onNavigate,
  unreadChatCount = 0,
  pendingSurchargeCount = 0,
}) => {
  // Hide on login & OTP screens
  if (currentScreen === 'login' || currentScreen === 'otp') {
    return null;
  }

  const navItems: { screen: ScreenType; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      screen: 'home',
      label: 'Jobs',
      icon: <Package className="w-5 h-5" />,
    },
    {
      screen: 'active_trip',
      label: 'Active Trip',
      icon: <Navigation className="w-5 h-5" />,
      badge: pendingSurchargeCount > 0 ? pendingSurchargeCount : undefined,
    },
    {
      screen: 'handoff',
      label: 'Handoff',
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      screen: 'chat',
      label: 'Chat',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: unreadChatCount > 0 ? unreadChatCount : undefined,
    },
    {
      screen: 'profile',
      label: 'Profile',
      icon: <UserCheck className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-40 bg-ink text-card border-t border-white/10 select-none pb-safe">
      <div className="max-w-3xl mx-auto flex items-stretch justify-around px-1 py-1">
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          return (
            <button
              key={item.screen}
              onClick={() => onNavigate(item.screen)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 relative transition-colors touch-btn ${
                isActive ? 'text-primary font-bold' : 'text-white/65 hover:text-white'
              }`}
            >
              <div className={`relative p-1 rounded-xl transition-all ${
                isActive ? 'bg-surface text-primary' : ''
              }`}>
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-warning text-ink rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-ink">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'text-card font-bold' : 'text-white/70'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
