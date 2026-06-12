import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { RouteOption, Location, JourneyPass } from './mockData';
import { locations, journeyPasses } from './mockData';
import { apiService } from './api';

export type AppTab = 'dashboard' | 'search' | 'bookings' | 'pass' | 'tracking' | 'wallet' | 'settings';
export type SearchStep = 'form' | 'options' | 'details' | 'booking' | 'payment' | 'tracking';

interface BookingDetails {
  id: string;
  routeId: string;
  sourceId: string;
  destId: string;
  status: 'pending' | 'confirmed';
  bookingReference: string;
  createdAt: string;
  route?: RouteOption;
}

interface JourneyContextType {
  // Navigation & Steps
  currentTab: AppTab;
  setTab: (tab: AppTab) => void;
  searchStep: SearchStep;
  setSearchStep: (step: SearchStep) => void;

  // Locations & Search params
  allLocations: Location[];
  sourceId: string;
  destId: string;
  preference: string;
  setSearchQuery: (source: string, dest: string, pref: string) => void;

  // Active planning data
  routes: RouteOption[];
  selectedRoute: RouteOption | null;
  setSelectedRoute: (route: RouteOption | null) => void;
  executeSearch: () => Promise<void>;

  // Booking & Wallet
  walletBalance: number;
  topUpWallet: (amount: number) => void;
  booking: BookingDetails | null;
  startBooking: () => Promise<void>;
  completePayment: (method: 'wallet' | 'card') => Promise<boolean>;

  // Passes
  passes: JourneyPass[];
  activatePass: (passId: string) => Promise<void>;

  // Tracking Simulation
  isTrackingActive: boolean;
  trackingProgress: number; // 0 to 100
  simulatedETA: number; // minutes remaining
  setTrackingActive: (active: boolean) => void;
  resetSimulation: () => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const JourneyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setTabState] = useState<AppTab>('dashboard');
  const [searchStep, setSearchStep] = useState<SearchStep>('form');

  // Search parameters
  const [allLocations, setAllLocations] = useState<Location[]>(locations);
  const [sourceId, setSourceId] = useState<string>('central-railway');
  const [destId, setDestId] = useState<string>('tech-park');
  const [preference, setPreference] = useState<string>('recommended');

  // Planning data
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);

  // Booking, Wallet & Passes
  const [walletBalance, setWalletBalance] = useState<number>(250);
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [passes, setPasses] = useState<JourneyPass[]>(journeyPasses);

  // Tracking simulation states
  const [isTrackingActive, setIsTrackingActive] = useState<boolean>(false);
  const [trackingProgress, setTrackingProgress] = useState<number>(0);
  const [simulatedETA, setSimulatedETA] = useState<number>(54);

  const simulationInterval = useRef<NodeJS.Timeout | null>(null);

  // Load locations on start
  useEffect(() => {
    apiService.getLocations().then(res => setAllLocations(res));
  }, []);

  const setTab = (tab: AppTab) => {
    setTabState(tab);
    // If user explicitly clicks 'tracking' and tracking is active, show the tracking screen
    if (tab === 'tracking' && isTrackingActive) {
      setSearchStep('tracking');
    }
  };

  const setSearchQuery = (src: string, dest: string, pref: string) => {
    setSourceId(src);
    setDestId(dest);
    setPreference(pref);
  };

  const executeSearch = async () => {
    const plannedRoutes = await apiService.planJourney(sourceId, destId);
    setRoutes(plannedRoutes);
    // Sort according to user preference
    let sorted = [...plannedRoutes];
    if (preference === 'cheapest') {
      sorted.sort((a, b) => a.cost - b.cost);
    } else if (preference === 'fastest') {
      sorted.sort((a, b) => a.duration - b.duration);
    }
    setRoutes(sorted);
    setSelectedRoute(sorted[0] || null);
    setSearchStep('options');
    setTabState('search');
  };

  const startBooking = async () => {
    if (!selectedRoute) return;
    const bk = await apiService.createBooking(selectedRoute.id, sourceId, destId);
    setBooking({
      ...bk,
      route: selectedRoute
    });
    setSearchStep('booking');
  };

  const completePayment = async (method: 'wallet' | 'card'): Promise<boolean> => {
    if (!booking || !selectedRoute) return false;

    if (method === 'wallet') {
      if (walletBalance < selectedRoute.cost) {
        return false; // Insufficient balance
      }
      setWalletBalance(prev => prev - selectedRoute.cost);
    }

    const payRes = await apiService.confirmPayment(booking.id, method);
    
    if (payRes.status === 'success') {
      setBooking(prev => prev ? { ...prev, status: 'confirmed' } : null);
      setSearchStep('tracking');
      setTabState('search'); // Stay in search tab, which renders LiveTracking when searchStep is 'tracking'
      
      // Start movement simulation
      startSimulation(selectedRoute.duration);
      return true;
    }
    return false;
  };

  const topUpWallet = (amount: number) => {
    setWalletBalance(prev => prev + amount);
  };

  const activatePass = async (passId: string) => {
    const pass = passes.find(p => p.id === passId);
    if (!pass) return;

    if (walletBalance < pass.price) {
      alert('Insufficient wallet balance to purchase this pass! Please top up your wallet.');
      return;
    }

    const res = await apiService.purchasePass(passId);
    if (res.success) {
      setWalletBalance(prev => prev - pass.price);
      setPasses(prev => prev.map(p => {
        if (p.id === passId) {
          return { ...p, isActive: true, tripsLeft: p.type === 'All-in-One Commuter' ? 45 : undefined };
        }
        return p;
      }));
    }
  };

  const startSimulation = (duration: number) => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    setIsTrackingActive(true);
    setTrackingProgress(0);
    setSimulatedETA(duration);

    simulationInterval.current = setInterval(() => {
      setTrackingProgress(prev => {
        if (prev >= 100) {
          clearInterval(simulationInterval.current!);
          setIsTrackingActive(false);
          return 100;
        }
        const nextProgress = prev + 1; // Increment progress
        // Calculate remaining ETA proportionally
        const remaining = Math.max(0, Math.round(duration * (1 - nextProgress / 100)));
        setSimulatedETA(remaining);
        return nextProgress;
      });
    }, 1000); // Fast simulation: updates every second
  };

  const stopTrackingSimulation = () => {
    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }
    setIsTrackingActive(false);
  };

  const setTrackingActive = (active: boolean) => {
    if (!active) {
      stopTrackingSimulation();
    } else if (booking && booking.route) {
      startSimulation(booking.route.duration);
    }
  };

  const resetSimulation = () => {
    stopTrackingSimulation();
    setTrackingProgress(0);
    setBooking(null);
    setSelectedRoute(null);
    setSearchStep('form');
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current);
      }
    };
  }, []);

  return (
    <JourneyContext.Provider value={{
      currentTab,
      setTab,
      searchStep,
      setSearchStep,
      allLocations,
      sourceId,
      destId,
      preference,
      setSearchQuery,
      routes,
      selectedRoute,
      setSelectedRoute,
      executeSearch,
      walletBalance,
      topUpWallet,
      booking,
      startBooking,
      completePayment,
      passes,
      activatePass,
      isTrackingActive,
      trackingProgress,
      simulatedETA,
      setTrackingActive,
      resetSimulation
    }}>
      {children}
    </JourneyContext.Provider>
  );
};

export const useJourney = () => {
  const context = useContext(JourneyContext);
  if (context === undefined) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
};
