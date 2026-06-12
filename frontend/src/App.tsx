import React from 'react';
import { JourneyProvider, useJourney } from './services/JourneyContext';
import { Sidebar } from './components/Sidebar';
import { InteractiveMap } from './components/InteractiveMap';

// Screens
import { LandingHomeScreen } from './screens/LandingHomeScreen';
import { HomeSearchScreen } from './screens/HomeSearchScreen';
import { RouteOptionsScreen } from './screens/RouteOptionsScreen';
import { RouteDetailsScreen } from './screens/RouteDetailsScreen';
import { BookingSummaryScreen } from './screens/BookingSummaryScreen';
import { MockPaymentScreen } from './screens/MockPaymentScreen';
import { LiveTrackingScreen } from './screens/LiveTrackingScreen';
import { JourneyPassScreen } from './screens/JourneyPassScreen';
import { BookingsScreen } from './screens/BookingsScreen';
import { WalletScreen } from './screens/WalletScreen';
import { SettingsScreen } from './screens/SettingsScreen';

const DashboardLayout: React.FC = () => {
  const { currentTab, searchStep } = useJourney();

  /* ── Show full-screen landing when on dashboard tab ── */
  if (currentTab === 'dashboard') {
    return (
      <div className="w-screen h-screen bg-white overflow-hidden font-sans antialiased select-none">
        {/* Full-screen landing hero — no sidebar */}
        <LandingHomeScreen />
      </div>
    );
  }

  /* ── All other tabs: standard 3-column layout ── */
  const renderRightPanel = () => {
    switch (currentTab) {
      case 'search':
        switch (searchStep) {
          case 'form':     return <HomeSearchScreen />;
          case 'options':  return <RouteOptionsScreen />;
          case 'details':  return <RouteDetailsScreen />;
          case 'booking':  return <BookingSummaryScreen />;
          case 'payment':  return <MockPaymentScreen />;
          case 'tracking': return <LiveTrackingScreen />;
          default:         return <HomeSearchScreen />;
        }
      case 'bookings':  return <BookingsScreen />;
      case 'pass':      return <JourneyPassScreen />;
      case 'tracking':  return <LiveTrackingScreen />;
      case 'wallet':    return <WalletScreen />;
      case 'settings':  return <SettingsScreen />;
      default:          return <HomeSearchScreen />;
    }
  };

  return (
    <div className="w-screen h-screen flex bg-slate-50 overflow-hidden font-sans text-slate-600 antialiased select-none">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Center Interactive Vector Map Panel */}
      <main className="flex-1 h-full relative">
        <InteractiveMap />
      </main>

      {/* Right Action Control Panel */}
      <section className="w-[380px] h-full bg-white border-l border-slate-100 flex flex-col p-6 shadow-sm rounded-l-3xl z-10 overflow-y-auto">
        {renderRightPanel()}
      </section>
    </div>
  );
};

function App() {
  return (
    <JourneyProvider>
      <DashboardLayout />
    </JourneyProvider>
  );
}

export default App;
