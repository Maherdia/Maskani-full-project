import { useState, useEffect } from 'react';

interface GeolocationState {
  position: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          position: null,
          loading: false,
          error: error.message,
        });
      }
    );
  }, []);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setState({
        position: null,
        loading: false,
        error: 'Geolocation is not supported by your browser',
      });
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          position: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState({
          position: null,
          loading: false,
          error: error.message,
        });
      }
    );
  };

  return { ...state, requestLocation };
} 