import { useState, useCallback, useEffect } from 'react';
import { reverseGeocode } from '@/lib/geocode';
import type { GeoLocation, PermissionState, LocationPhase } from '@/types/seller';

const LS_LAT = 'user_lat';
const LS_LNG = 'user_lng';
const LS_COUNTY = 'detected_county';
const LS_TOWN = 'detected_town';

interface UseGeolocationReturn {
  location: GeoLocation | null;
  permissionState: PermissionState;
  phase: LocationPhase;
  error: string | null;
  detectLocation: () => void;
  resetLocation: () => void;
}

function loadCachedLocation(): GeoLocation | null {
  const lat = localStorage.getItem(LS_LAT);
  const lng = localStorage.getItem(LS_LNG);
  const county = localStorage.getItem(LS_COUNTY);
  const town = localStorage.getItem(LS_TOWN);
  if (lat && lng) {
    return {
      latitude: parseFloat(lat),
      longitude: parseFloat(lng),
      county: county || '',
      town: town || '',
      region: county || '',
    };
  }
  return null;
}

function persistLocation(loc: GeoLocation): void {
  localStorage.setItem(LS_LAT, loc.latitude.toString());
  localStorage.setItem(LS_LNG, loc.longitude.toString());
  localStorage.setItem(LS_COUNTY, loc.county);
  localStorage.setItem(LS_TOWN, loc.town);
}

export function useGeolocation(): UseGeolocationReturn {
  const [location, setLocation] = useState<GeoLocation | null>(loadCachedLocation);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');
  const [phase, setPhase] = useState<LocationPhase>(
    loadCachedLocation() ? 'located' : 'idle'
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' }).then((status) => {
        if (status.state === 'granted') setPermissionState('granted');
        else if (status.state === 'denied') {
          setPermissionState('denied');
          if (!loadCachedLocation()) setPhase('denied');
        }
      }).catch(() => {});
    }
  }, []);

  const detectLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setPermissionState('unavailable');
      setPhase('error');
      setError('Geolocation is not available on this device');
      return;
    }

    setPhase('detecting');
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const geo = await reverseGeocode(latitude, longitude);
          const loc: GeoLocation = {
            latitude,
            longitude,
            county: geo.county || '',
            town: geo.town || '',
            region: geo.region || geo.county || '',
          };
          setLocation(loc);
          persistLocation(loc);
          setPermissionState('granted');
          setPhase('located');
        } catch (e) {
          const loc: GeoLocation = {
            latitude,
            longitude,
            county: '',
            town: '',
            region: '',
          };
          setLocation(loc);
          persistLocation(loc);
          setPermissionState('granted');
          setPhase('located');
        }
      },
      (err) => {
        if (err.code === 1) {
          setPermissionState('denied');
          setPhase('denied');
        } else {
          setPhase('error');
          setError(err.message);
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const resetLocation = useCallback(() => {
    localStorage.removeItem(LS_LAT);
    localStorage.removeItem(LS_LNG);
    localStorage.removeItem(LS_COUNTY);
    localStorage.removeItem(LS_TOWN);
    setLocation(null);
    setPhase('idle');
    setError(null);
  }, []);

  return { location, permissionState, phase, error, detectLocation, resetLocation };
}
