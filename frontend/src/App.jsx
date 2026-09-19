import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Layout/Header';
import { StatusFooter } from './components/Layout/StatusFooter';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { RealtimeAlertNotifier } from './components/Common/RealtimeAlertNotifier';

// SaaS Product Modules
import DigitalTwinPage from './pages/DigitalTwinPage';
import VisualizationPage from './pages/VisualizationPage';
import AlertsPage from './pages/AlertsPage';
import ScenarioAnalysisPage from './pages/ScenarioAnalysisPage';
import ComparePage from './pages/ComparePage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';

// Data & API Services
import { CHHATTISGARH_DISTRICTS } from './data/chhattisgarhGrid';
import { getHealth, getDistricts, getPredict, get7DaysPredict } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState('digital-twin');
  const [districts, setDistricts] = useState(CHHATTISGARH_DISTRICTS); // Instant initial baseline
  const [activeDistrict, setActiveDistrict] = useState(CHHATTISGARH_DISTRICTS[0]);
  const [backendStatus, setBackendStatus] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [livePrediction, setLivePrediction] = useState(null);
  const [live7Days, setLive7Days] = useState(null);
  const [loading, setLoading] = useState(false);

  // Centralized backend data fetcher
  const fetchBackendData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. GET /health
      const healthRes = await getHealth();
      if (healthRes.success) {
        setBackendStatus(true);
        setHealthData(healthRes.data);
      } else {
        setBackendStatus(false);
      }

      // 2. GET /api/districts
      const districtsRes = await getDistricts();
      if (districtsRes.success && Array.isArray(districtsRes.data) && districtsRes.data.length > 0) {
        setDistricts(districtsRes.data);
        setActiveDistrict((prev) => {
          if (!prev) return districtsRes.data[0];
          const match = districtsRes.data.find(d => d.id === prev.id || d.name === prev.name);
          return match || districtsRes.data[0];
        });
      }

      // 3. GET /predict
      const predictRes = await getPredict();
      if (predictRes.success) {
        setLivePrediction(predictRes.data);
      }

      // 4. GET /predict/7days
      const forecastRes = await get7DaysPredict();
      if (forecastRes.success) {
        setLive7Days(forecastRes.data);
      }
    } catch (err) {
      console.error('Failed to sync backend:', err);
      setBackendStatus(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch and periodic health sync
  useEffect(() => {
    fetchBackendData();
    const interval = setInterval(fetchBackendData, 30000);
    return () => clearInterval(interval);
  }, [fetchBackendData]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Responsive Top Navigation Header */}
      <Header
        backendStatus={backendStatus}
        onRefresh={fetchBackendData}
        districts={districts}
        activeDistrict={activeDistrict}
        setActiveDistrict={setActiveDistrict}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ErrorBoundary key={activeTab}>
          {/* 1. 🗺️ Live Regional Climate Map */}
          {activeTab === 'digital-twin' && (
            <DigitalTwinPage
              districts={districts}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
              setActiveTab={setActiveTab}
              backendStatus={backendStatus}
              onRefresh={fetchBackendData}
            />
          )}

          {/* 2. 📅 7-Day Weather Forecast */}
          {activeTab === 'forecast' && (
            <VisualizationPage
              districts={districts}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
              onRefresh={fetchBackendData}
            />
          )}

          {/* 3. ⚠️ Hazard & Safety Alerts */}
          {activeTab === 'alerts' && (
            <AlertsPage
              districts={districts}
              setActiveDistrict={setActiveDistrict}
              setActiveTab={setActiveTab}
            />
          )}

          {/* 4. 🧪 What-If Climate Simulator */}
          {activeTab === 'scenario' && (
            <ScenarioAnalysisPage
              districts={districts}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
            />
          )}

          {/* 5. 📊 District Comparison */}
          {activeTab === 'compare' && (
            <ComparePage
              districts={districts}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
            />
          )}

          {/* 6. 📄 District Climate Reports */}
          {activeTab === 'reports' && (
            <ReportsPage
              districts={districts}
              activeDistrict={activeDistrict}
              setActiveDistrict={setActiveDistrict}
            />
          )}

          {/* 7. ℹ️ About Data & Methodology */}
          {activeTab === 'about' && (
            <AboutPage />
          )}
        </ErrorBoundary>
      </main>

      {/* Persistent Bottom Status Footer */}
      <StatusFooter backendStatus={backendStatus} />

      {/* Real-time Dynamic Condition Breach & Hazard Surveillance Notifier */}
      <RealtimeAlertNotifier
        setActiveDistrict={setActiveDistrict}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default App;
