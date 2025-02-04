import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const OfficeMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with the token from Supabase Edge Function Secrets
    mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN || '';
    
    // SRM Institute of Science and Technology Tiruchirappalli coordinates
    const latitude = 10.7601;
    const longitude = 78.8139;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [longitude, latitude],
      zoom: 15
    });

    // Add marker at the location
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <div className="w-full h-[400px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default OfficeMap;