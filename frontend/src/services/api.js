import axios from 'axios';

// API Base URL from environment variable or default to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Check backend health status
 * Endpoint: GET /health
 */
export const getHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/health):', error.message);
    return { success: false, error: error.message || 'Server connection failed' };
  }
};

/**
 * Fetch baseline prediction (backward compatibility)
 * Endpoint: GET /predict
 */
export const getPredict = async () => {
  try {
    const response = await apiClient.get('/predict');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/predict):', error.message);
    return { success: false, error: error.message || 'Prediction failed' };
  }
};

/**
 * Fetch 7-day auto-regressive prediction (backward compatibility)
 * Endpoint: GET /predict/7days
 */
export const get7DaysPredict = async () => {
  try {
    const response = await apiClient.get('/predict/7days');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/predict/7days):', error.message);
    return { success: false, error: error.message || '7-day forecast failed' };
  }
};

/**
 * Fetch all 33 districts telemetry & live climate state
 * Endpoint: GET /api/districts
 */
export const getDistricts = async () => {
  try {
    const response = await apiClient.get('/api/districts');
    const data = response.data?.districts || response.data;
    return { success: true, data };
  } catch (error) {
    console.error('API Error (/api/districts):', error.message);
    return { success: false, error: error.message || 'Unable to fetch district climate data' };
  }
};

/**
 * Fetch 7-day auto-regressive PyTorch LSTM forecast for a specific district
 * Endpoint: GET /api/forecast?district={district_id}&days={days}
 */
export const getDistrictForecast = async (districtId = 'raipur', days = 7) => {
  try {
    const response = await apiClient.get('/api/forecast', {
      params: { district: districtId, days }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/api/forecast?district=${districtId}):`, error.message);
    return { success: false, error: error.message || 'Unable to generate district forecast' };
  }
};

/**
 * Fetch statewide risk alerts across all 33 districts
 * Endpoint: GET /api/alerts
 */
export const getAlerts = async () => {
  try {
    const response = await apiClient.get('/api/alerts');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/api/alerts):', error.message);
    return { success: false, error: error.message || 'Unable to fetch risk alerts' };
  }
};

/**
 * Simulate what-if climate perturbation scenario on backend
 * Endpoint: POST /api/scenario
 */
export const runScenarioSimulation = async (districtId = 'raipur', tempDeltaC = 2.0, rainDeltaPct = -20.0) => {
  try {
    const response = await apiClient.post('/api/scenario', {
      district_id: districtId,
      temp_delta_c: tempDeltaC,
      rain_delta_pct: rainDeltaPct
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/api/scenario):', error.message);
    return { success: false, error: error.message || 'Scenario calculation failed' };
  }
};

/**
 * Compare up to 3 districts side-by-side
 * Endpoint: GET /api/compare?districts=d1,d2,d3
 */
export const compareDistrictsApi = async (districtIds = ['raipur', 'bastar', 'surguja']) => {
  try {
    const idsString = Array.isArray(districtIds) ? districtIds.join(',') : districtIds;
    const response = await apiClient.get('/api/compare', {
      params: { districts: idsString }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/api/compare):', error.message);
    return { success: false, error: error.message || 'District comparison failed' };
  }
};

/**
 * Fetch formal executive climate decision brief
 * Endpoint: GET /api/report?district={district_id}
 */
export const getDistrictReport = async (districtId = 'raipur') => {
  try {
    const response = await apiClient.get('/api/report', {
      params: { district: districtId }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/api/report?district=${districtId}):`, error.message);
    return { success: false, error: error.message || 'Report generation failed' };
  }
};

/**
 * Fetch live AI model specs, parameters & training loss history
 * Endpoint: GET /api/model-metrics
 */
export const getModelMetrics = async () => {
  try {
    const response = await apiClient.get('/api/model-metrics');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/api/model-metrics):', error.message);
    return { success: false, error: error.message || 'Model metrics unavailable' };
  }
};

/**
 * Fetch real-time pilot territory metadata & IMD dataset stats
 * Endpoint: GET /api/pilot-info
 */
export const getPilotInfo = async () => {
  try {
    const response = await apiClient.get('/api/pilot-info');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/api/pilot-info):', error.message);
    return { success: false, error: error.message || 'Pilot metadata unavailable' };
  }
};

/**
 * Fetch list of all 33 districts and coordinates from native backend
 * Endpoint: GET /weather/locations
 */
export const getWeatherLocations = async () => {
  try {
    const response = await apiClient.get('/weather/locations');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/weather/locations):', error.message);
    return { success: false, error: error.message || 'Weather locations unavailable' };
  }
};

/**
 * Fetch detailed live & 14-day timeline weather for a district
 * Endpoint: GET /weather/district/{district_id}
 */
export const getDistrictWeatherDetail = async (districtId = 'raipur') => {
  try {
    const response = await apiClient.get(`/weather/district/${districtId.toLowerCase()}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/weather/district/${districtId}):`, error.message);
    return { success: false, error: error.message || 'Detailed district weather unavailable' };
  }
};

/**
 * Fetch multi-year historical ERA5-Land reanalysis daily rows
 * Endpoint: GET /climate/history/{district_id}?years={years}
 */
export const getClimateHistory = async (districtId = 'raipur', years = 5) => {
  try {
    const response = await apiClient.get(`/climate/history/${districtId.toLowerCase()}`, {
      params: { years }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/climate/history/${districtId}):`, error.message);
    return { success: false, error: error.message || 'Climate history unavailable' };
  }
};

/**
 * Fetch multi-year climate summary & averages
 * Endpoint: GET /climate/summary/{district_id}?years={years}
 */
export const getClimateSummary = async (districtId = 'raipur', years = 5) => {
  try {
    const response = await apiClient.get(`/climate/summary/${districtId.toLowerCase()}`, {
      params: { years }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/climate/summary/${districtId}):`, error.message);
    return { success: false, error: error.message || 'Climate summary unavailable' };
  }
};

/**
 * Fetch AI LSTM next-day prediction from native AI route
 * Endpoint: GET /ai/next-day/{district_id}
 */
export const getNextDayAIPrediction = async (districtId = 'raipur') => {
  try {
    const response = await apiClient.get(`/ai/next-day/${districtId.toLowerCase()}`);
    return { success: true, data: response.data };
  } catch (error) {
    console.error(`API Error (/ai/next-day/${districtId}):`, error.message);
    return { success: false, error: error.message || 'AI next-day prediction unavailable' };
  }
};

/**
 * Raw digital twin simulation endpoint
 * Endpoint: POST /simulate
 */
export const simulateClimateRaw = async (districtId = 'raipur', rainChangeMm = 0, tempChangeC = 0) => {
  try {
    const response = await apiClient.post('/simulate', {
      district_id: districtId.toLowerCase(),
      rainfall_change_mm: rainChangeMm,
      temperature_change_c: tempChangeC,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error (/simulate):', error.message);
    return { success: false, error: error.message || 'Simulation calculation failed' };
  }
};

export default {
  getHealth,
  getPredict,
  get7DaysPredict,
  getDistricts,
  getDistrictForecast,
  getAlerts,
  runScenarioSimulation,
  compareDistrictsApi,
  getDistrictReport,
  getModelMetrics,
  getPilotInfo,
  getWeatherLocations,
  getDistrictWeatherDetail,
  getClimateHistory,
  getClimateSummary,
  getNextDayAIPrediction,
  simulateClimateRaw,
  API_BASE_URL,
};


