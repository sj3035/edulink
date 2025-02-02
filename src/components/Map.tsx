import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with the token from Supabase Edge Function Secrets
    mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN || '';
    
    // Get user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [longitude, latitude],
        zoom: 13
      });

      // Add marker at user's location
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default Map;