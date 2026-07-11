/// <reference types="@types/google.maps" />
import { useEffect } from 'react';

declare global {
  interface Window {
    initMap: () => void;
  }
}

const Map = () => {
  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    };

    window.initMap = function () {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -1.286389, lng: 36.817223 }, // Example: Nairobi
        zoom: 12,
      });
    };

    loadMapScript();

    // Cleanup
    return () => {
      window.initMap = () => {};
      const scripts = document.querySelectorAll('script[src*="maps.googleapis.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default Map; 