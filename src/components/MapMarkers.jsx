import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import coordinates from '../seeded-user-data/tourism-coordinates.json';

const MapMarkers = () => {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        // Initialize the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-98.5795, 39.8283],
            zoom: 2,
        });

        // Add markers to the map
        coordinates.forEach(({ lng, lat }) => {
            new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        });

        return () => map.remove();
    }, []);

    return <div ref={mapContainerRef} style={{ width: '100%', height: '500px' }} />;
};

export default MapMarkers;
