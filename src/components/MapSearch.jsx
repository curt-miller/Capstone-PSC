import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import NewPostForm from './NewPostForm';

const MapSearch = ({ onLocationChange }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef(); // Ref to store map instance
  const markerRef = useRef(null); // Ref for the marker
  const markerAddedRef = useRef(false); // Ref to track if the marker is added
  const [markerLocation, setMarkerLocation] = useState(null);
  const KEY = import.meta.env.VITE_MAPBOX_TOKEN;
  const storedCountry = JSON.parse(localStorage.getItem("country"));
  const capital = storedCountry.capital;

  // Function to fetch reverse geocode data
  const fetchReverseGeocode = async (coords) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${coords.lng},${coords.lat}.json?access_token=${KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      const context = data.features[0].context || [];
      const countryInfo = context.find(item => item.id.startsWith('country')) || {};

      return {
        address: data.features[0].place_name,
        coordinates: [coords.lng, coords.lat],
        country: countryInfo.text || "Unknown"
      };
    }
    return {
      address: "Unknown location",
      coordinates: [coords.lng, coords.lat],
      country: "Unknown"
    };
  };

  // Reverse geocode the capital and update the map view
  function reverseGeocodeCapital(capital) {

    if (capital === 'Washington') {
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(capital)}.json?access_token=${KEY}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          const coordinates = data.features[0].geometry.coordinates;
          console.log('Coordinates for', capital, ':', coordinates);
          if (mapRef.current) {
            mapRef.current.setCenter(coordinates);
          }
        } else {
          console.log('No results found for', capital);
        }
      })
      .catch(error => {
        console.error('Error fetching reverse geocode data:', error);
      });
  }

  useEffect(() => {
    mapboxgl.accessToken = KEY;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-97.784965, 39.800321], // Default center
      zoom: 3.5,
      attributionControl: false,
    });

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false // Disable the default marker
    });

    mapRef.current.addControl(geocoder);

    const handleClick = async (e) => {
      if (!markerAddedRef.current) {
        const newMarker = new mapboxgl.Marker({ draggable: true })
          .setLngLat(e.lngLat)
          .addTo(mapRef.current);

        markerRef.current = newMarker;
        markerAddedRef.current = true;
        const locationDetails = await fetchReverseGeocode(e.lngLat);
        setMarkerLocation(locationDetails);
        onLocationChange(locationDetails); // Pass location data to parent

        // Add dragend event listener to update location when marker is dragged
        newMarker.on('dragend', async () => {
          const lngLat = newMarker.getLngLat();
          const updatedLocation = await fetchReverseGeocode(lngLat);
          setMarkerLocation(updatedLocation);
          onLocationChange(updatedLocation); // Pass updated location to parent
        });
      }
    };

    mapRef.current.on('click', handleClick);

    // Call reverseGeocodeCapital to center the map on the capital
    reverseGeocodeCapital(capital);

    return () => {
      mapRef.current.off('click', handleClick);
      mapRef.current.remove();
    };
  }, [capital, onLocationChange]);

  return (
    <>
      <div ref={mapContainerRef} id='map-search' />
      {markerLocation && !markerAddedRef.current && (
        <NewPostForm location={markerLocation} />
      )}
    </>
  );
};

export default MapSearch;
