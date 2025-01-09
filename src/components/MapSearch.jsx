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
            const locationDetails = {
                address: event.result.place_name,
                coordinates: coords,
            };
        
            // Fetch the reverse geocode to get the country
            fetchReverseGeocode(coords).then((reverseGeocodedDetails) => {
                // Add country info to locationDetails and update parent
                const locationWithCountry = {
                    ...locationDetails,
                    country: reverseGeocodedDetails.country,
                };
        
                // Notify parent of location change with country
                onLocationChange(locationWithCountry);
            });
        
            // Create or update marker
            if (!markerRef.current) {
                markerRef.current = new mapboxgl.Marker({ draggable: true })
                    .setLngLat(coords)
                    .addTo(mapRef.current);
        
                // Handle marker dragend
                markerRef.current.on('dragend', async () => {
                    const newCoords = markerRef.current.getLngLat();
                    const reverseGeocodedDetails = await fetchReverseGeocode(newCoords);
                    onLocationChange(reverseGeocodedDetails);
                });
            } else {
                markerRef.current.setLngLat(coords);
            }
        
            // Fly to new location
            mapRef.current.flyTo({ center: coords, zoom: 13, speed: 1.5 });
        });
        

        return () => mapRef.current.remove();
    }, [onLocationChange]);

    useEffect(() => {
        // Update marker and map view if location changes
        if (location && location.coordinates) {
            const coords = location.coordinates;
            if (!markerRef.current) {
                markerRef.current = new mapboxgl.Marker({ draggable: true })
                    .setLngLat(coords)
                    .addTo(mapRef.current);

                // Handle marker dragend
                markerRef.current.on('dragend', async () => {
                    const newCoords = markerRef.current.getLngLat();
                    const reverseGeocodedDetails = await fetchReverseGeocode(newCoords);
                    onLocationChange(reverseGeocodedDetails);
                });
            } else {
                markerRef.current.setLngLat(coords);
            }
            mapRef.current.flyTo({ center: coords, zoom: 13, speed: 1.5 });
        }
    }, [location, onLocationChange]);

    const fetchReverseGeocode = async (coords) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${KEY}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            // Extract country from the context array
            const context = data.features[0].context || [];
            const countryInfo = context.find((item) => item.id.startsWith('country')) || {};
            
            return {
                address: data.features[0].place_name,
                coordinates: [coords.lng, coords.lat],
                country: countryInfo.text || "Unknown",
            };
        }
        return {
            address: "Unknown location",
            coordinates: [coords.lng, coords.lat],
            country: "Unknown",
        };
    };
    
    

    return <div id="map-search" ref={mapContainerRef} />;
}
