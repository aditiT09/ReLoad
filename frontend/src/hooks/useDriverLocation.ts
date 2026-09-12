'use client';

import { useState, useEffect } from 'react';

export interface DriverPosition {
  lat: number;
  lng: number;
  speed: number | null;     // in m/s (from Geolocation API)
  heading: number | null;   // in degrees relative to true north
  accuracy: number | null;  // in meters
  timestamp: number;        // epoch milliseconds
}

export interface UseDriverLocationResult {
  position: DriverPosition | null;
  error: string | null;
  isTracking: boolean;
  permissionDenied: boolean;
}

export function useDriverLocation(enabled: boolean = true): UseDriverLocationResult {
  const [position, setPosition] = useState<DriverPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [permissionDenied, setPermissionDenied] = useState<boolean>(false);

  useEffect(() => {
    if (!enabled) {
      setIsTracking(false);
      return;
    }

    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setError('Geolocation is not supported by your browser or environment.');
      setIsTracking(false);
      return;
    }

    setIsTracking(true);
    setError(null);
    setPermissionDenied(false);

    const handleSuccess = (pos: GeolocationPosition) => {
      setPosition({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        speed: pos.coords.speed !== null && !isNaN(pos.coords.speed) ? pos.coords.speed : null,
        heading: pos.coords.heading !== null && !isNaN(pos.coords.heading) ? pos.coords.heading : null,
        accuracy: pos.coords.accuracy,
        timestamp: pos.timestamp || Date.now(),
      });
      setError(null);
      setPermissionDenied(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      let message = 'Unable to retrieve location.';
      switch (err.code) {
        case err.PERMISSION_DENIED:
          message = 'Location access was denied. Please allow location permissions to enable live tracking.';
          setPermissionDenied(true);
          break;
        case err.POSITION_UNAVAILABLE:
          message = 'Location information is currently unavailable.';
          break;
        case err.TIMEOUT:
          message = 'Location request timed out.';
          break;
      }
      setError(message);
    };

    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 1000,
    });

    return () => {
      navigator.geolocation.clearWatch(watchId);
      setIsTracking(false);
    };
  }, [enabled]);

  return { position, error, isTracking, permissionDenied };
}
