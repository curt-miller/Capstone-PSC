import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default function MapSearch({ onLocationChange, location }) {
    const mapContainerRef = useRef();
    const mapRef = useRef();
    const markerRef = useRef(null);
    const KEY = import.meta.env.VITE_MAPBOX_TOKEN;

    useEffect(() => {
        mapboxgl.accessToken = KEY;

        // Initialize the map
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: location || [-79.37147650253334, 43.67804813837568],
            zoom: 13,
        });

        // Add geocoder
        const geocoder = new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl,
            marker: false,
        });
        mapRef.current.addControl(geocoder);

        // Handle geocoder result
        geocoder.on('result', (event) => {
            const coords = event.result.geometry.coordinates;

            // Create or update marker
            if (!markerRef.current) {
                markerRef.current = new mapboxgl.Marker({ draggable: true })
                    .setLngLat(coords)
                    .addTo(mapRef.current);

                // Handle marker dragend
                markerRef.current.on('dragend', () => {
                    const newCoords = markerRef.current.getLngLat();
                    onLocationChange([newCoords.lng, newCoords.lat]);
                });
            } else {
                markerRef.current.setLngLat(coords);
            }

            // Notify parent of location change
            onLocationChange(coords);

            // Fly to new location
            mapRef.current.flyTo({ center: coords, zoom: 13, speed: 1.5 });
        });

        return () => mapRef.current.remove();
    }, [onLocationChange]);

    useEffect(() => {
        // Update marker and map view if location changes
        if (location) {
            if (!markerRef.current) {
                markerRef.current = new mapboxgl.Marker({ draggable: true })
                    .setLngLat(location)
                    .addTo(mapRef.current);

                // Handle marker dragend
                markerRef.current.on('dragend', () => {
                    const newCoords = markerRef.current.getLngLat();
                    onLocationChange([newCoords.lng, newCoords.lat]);
                });
            } else {
                markerRef.current.setLngLat(location);
            }
            mapRef.current.flyTo({ center: location, zoom: 13, speed: 1.5 });
        }
    }, [location, onLocationChange]);

    return <div id="map-search" ref={mapContainerRef} style={{ height: '400px' }} />;
}
