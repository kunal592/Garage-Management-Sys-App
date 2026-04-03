import Constants from 'expo-constants';

// Dynamically resolve the host for Expo Go / dev tunnels
const getApiBaseUrl = (): string => {
  // In Expo Go dev mode, hostUri gives the Metro bundler IP (e.g. "192.168.x.x:8081")
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:5001/api`;
  }

  // Fallback: hardcode your machine's local LAN IP here for standalone APK testing
  // Run `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows) to find it
  return 'http://172.20.10.11:5001/api';
};

export const API_BASE_URL = getApiBaseUrl();
