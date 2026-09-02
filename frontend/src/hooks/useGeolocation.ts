import { useState, useEffect, useCallback } from 'react';
import { UserLocation } from '../types/institution';

export function useGeolocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setPermissionGranted(true);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setError(err.message || 'Unable to retrieve your location.');
        // Set fallback to New Delhi for realistic nearby distance demonstrations if denied
        setLocation({
          latitude: 28.6139,
          longitude: 77.2090,
          city: 'New Delhi (Default)',
          state: 'Delhi',
        });
        setPermissionGranted(false);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  useEffect(() => {
    // Attempt non-blocking initial request
    requestLocation();
  }, [requestLocation]);

  return {
    location,
    isLoading,
    error,
    permissionGranted,
    requestLocation,
  };
}
