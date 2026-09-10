import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Truck, Navigation, MessageSquare, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentBooking, t } = useApp();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/otp';
  const isAdminPage = location.pathname === '/admin' || location.pathname === '/console';
  if (isAuthPage || isAdminPage) return null;

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path === '/about' && location.pathname === '/about') return true;
    if (path === '/book' && (location.pathname === '/book' || location.pathname === '/vehicles')) return true;
    if (path === '/trip' && (
      location.pathname === '/trip' ||
      location.pathname.startsWith('/handoff') ||
      location.pathname === '/payment' ||
      location.pathname.startsWith('/report')
    )) return true;
    if (path === '/profile' && (location.pathname === '/profile' || location.pathname === '/driver')) return true;
    if (path === '/trips' && (location.pathname === '/trips' || location.pathname.startsWith('/trips/'))) return true;
    return location.pathname === path;
  };

  const navItems = [
    {
      id: 'nav-home',
      label: 'Home',
      path: '/',
      icon: Home,
    },
    {
      id: 'nav-book',
      label: t.nav.book,
      path: '/book',
      icon: Truck,
    },
    {
      id: 'nav-active-trip',
      label: 'Live Trip',
      path: '/trip',
      icon: Navigation,
      badge: currentBooking.status !== 'closed' && currentBooking.status !== 'requested' ? 'Active' : undefined,
    },
    {
      id: 'nav-chat',
      label: t.nav.chat,
      path: '/chat',
      icon: MessageSquare,
    },
    {
      id: 'nav-profile',
      label: t.nav.profile,
      path: '/profile',
      icon: User,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border shadow-md"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-2">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={item.id}
                onClick={() => navigate(item.path)}
                className={`relative flex-1 flex flex-col items-center justify-center py-1 px-1 h-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded-md cursor-pointer ${
                  active ? 'text-primary' : 'text-muted hover:text-ink hover:bg-surface/50'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${active ? 'scale-110 stroke-[2.5]' : ''}`} />
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-regulated-cargo rounded-full ring-2 ring-card" />
                  )}
                </div>
                <span className={`text-[11px] mt-1 font-medium whitespace-nowrap tracking-tight ${active ? 'font-bold text-primary' : ''}`}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute bottom-1 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
