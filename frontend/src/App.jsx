import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { StatusFooter } from './components/Layout/StatusFooter';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { RealtimeAlertNotifier } from './components/Common/RealtimeAlertNotifier';

// 11 Core Platform Modules
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DistrictExplorerPage from './pages/DistrictExplorerPage';
import ClimateHistoryPage from './pages/ClimateHistoryPage';
import AIPredictionPage from './pages/AIPredictionPage';
import FourteenDayWeatherPage from './pages/FourteenDayWeatherPage';
import ScenarioAnalysisPage from './pages/ScenarioAnalysisPage';
import TravelAssistantPage from './pages/TravelAssistantPage';
import ComparePage from './pages/ComparePage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';

// Data & Central API Services
import { CHHATTISGARH_DISTRICTS } from './data/chhattisgarhGrid';
import { getHealth, getDistricts, getWeatherLocations } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('climatetwin_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [districts, setDistricts] = useState(CHHATTISGARH_DISTRICTS);
  const [activeDistrict, setActiveDistrict] = useState(CHHATTISGARH_DISTRICTS[0]);
  const [backendStatus, setBackendStatus] = useState(false);
  const [healthData, setHealthData] = useState(null);

  // Sync initial backend telemetry
  const syncBackend = useCallback(async () => {
    try {
      // 1. GET /health
      const hRes = await getHealth();
      if (hRes.success) {
        setBackendStatus(true);
        setHealthData(hRes.data);
      } else {
        setBackendStatus(false);
      }

      // 2. GET /api/districts (loads full 33 districts with coordinates & telemetry)
      const dRes = await getDistricts();
      if (dRes.success && Array.isArray(dRes.data) && dRes.data.length > 0) {
        setDistricts(dRes.data);
        setActiveDistrict(prev => {
          if (!prev) return dRes.data[0];
          const found = dRes.data.find(d => d.id === prev.id || d.name === prev.name);
          return found || dRes.data[0];
        });
      }
    } catch (err) {
      console.error('Backend sync error:', err);
      setBackendStatus(false);
    }
  }, []);

  useEffect(() => {
    syncBackend();
    const interval = setInterval(syncBackend, 45000);
    return () => clearInterval(interval);
  }, [syncBackend]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans antialiased">
      
      {/* 1. Collapsible Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        backendStatus={backendStatus}
        user={user}
        setUser={setUser}
      />

      {/* 2. Main Workspace Layout */}
      <div className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Top Header */}
        <Header
          backendStatus={backendStatus}
          onRefresh={syncBackend}
          districts={districts}
          activeDistrict={activeDistrict}
          setActiveDistrict={setActiveDistrict}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setMobileOpen={setMobileOpen}
          user={user}
          setUser={setUser}
        />

        {/* Dynamic Page Router */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <ErrorBoundary key={activeTab}>
            {activeTab === 'home' && (
              <HomePage
                setActiveTab={setActiveTab}
                districts={districts}
                activeDistrict={activeDistrict}
              />
            )}

            {activeTab === 'dashboard' && (
              <DashboardPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
                setActiveTab={setActiveTab}
                backendStatus={backendStatus}
                onRefresh={syncBackend}
              />
            )}

            {activeTab === 'district-explorer' && (
              <DistrictExplorerPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'climate-history' && (
              <ClimateHistoryPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {activeTab === 'ai-prediction' && (
              <AIPredictionPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {activeTab === '14-day-weather' && (
              <FourteenDayWeatherPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {activeTab === 'scenario-simulation' && (
              <ScenarioAnalysisPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {activeTab === 'travel-assistant' && (
              <TravelAssistantPage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {activeTab === 'compare-districts' && (
              <ComparePage
                districts={districts}
                activeDistrict={activeDistrict}
                setActiveDistrict={setActiveDistrict}
              />
            )}

            {(activeTab === 'login' || activeTab === 'register') && (
              <AuthPage setActiveTab={setActiveTab} user={user} setUser={setUser} />
            )}

            {activeTab === 'about' && (
              <AboutPage />
            )}
          </ErrorBoundary>
        </main>

        {/* Persistent Bottom Status Footer */}
        <StatusFooter backendStatus={backendStatus} />

        {/* Realtime Alert Notifier */}
        <RealtimeAlertNotifier
          setActiveDistrict={setActiveDistrict}
          setActiveTab={setActiveTab}
        />
      </div>

    </div>
  );
}

export default App;
