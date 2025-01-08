import { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import React from 'react';

import 'mapbox-gl/dist/mapbox-gl.css';
import '../index.css'

export default function MapShaded() {
    // const mapContainerRef = useRef();


    // // Reusable function to add country data to the map
    // const addCountryLayer = (map, countryId, color, opacity) => {
    //     map.addSource(countryId, {
    //         type: 'geojson',
    //         data: `./countries-geojson/${countryId}.geo.json`,
    //     });

    //     // Add a polygon, declare opacity and color
    //     map.addLayer({
    //         id: `${countryId}-fill`,
    //         type: 'fill',
    //         source: countryId,
    //         paint: {
    //             'fill-color': color,
    //             'fill-opacity': opacity,
    //         },
    //     });

    //     // Polgygon (country) border
    //     map.addLayer({
    //         id: `${countryId}-border`,
    //         type: 'line',
    //         source: countryId,
    //         paint: {
    //             'line-color': '#9ba1de',
    //             'line-width': 1,
    //         },
    //     });
    // };

    // useEffect(() => {

    //     const KEY = import.meta.env.VITE_MAPBOX_TOKEN;


    //     // HIDE THIS IN ENV
    //     mapboxgl.accessToken = KEY;

    //     const map = new mapboxgl.Map({
    //         container: mapContainerRef.current,
    //         style: 'mapbox://styles/millercw3/cm5hfi5yx002701qf6cl5anau',
    //         // STYLED MAP URL GO HERE ^^^^^
    //         center: [19.5033, 47.1625],
    //         zoom: 2,
    //     });

    //     map.on('load', () => {
    //         const countries = [
    //             { id: 'FRA', color: '#132a13', opacity: 0.9 },
    //             { id: 'USA', color: '#132a13', opacity: 0.88 },
    //             { id: 'ESP', color: '#132a13', opacity: 0.86 },
    //             { id: 'CHN', color: '#132a13', opacity: 0.84 },
    //             { id: 'ITA', color: '#132a13', opacity: 0.82 },
    //             { id: 'TUR', color: '#132a13', opacity: 0.8 },
    //             { id: 'MEX', color: '#132a13', opacity: 0.78 },
    //             { id: 'THA', color: '#132a13', opacity: 0.76 },
    //             { id: 'DEU', color: '#132a13', opacity: 0.74 },
    //             { id: 'GBR', color: '#132a13', opacity: 0.72 },

    //             { id: 'JPN', color: '#31572c', opacity: 0.8 },
    //             { id: 'AUT', color: '#31572c', opacity: 0.78 },
    //             { id: 'GRC', color: '#31572c', opacity: 0.76 },
    //             { id: 'IND', color: '#31572c', opacity: 0.74 },
    //             { id: 'MYS', color: '#31572c', opacity: 0.72 },
    //             { id: 'RUS', color: '#31572c', opacity: 0.7 },
    //             { id: 'PRT', color: '#31572c', opacity: 0.68 },
    //             { id: 'SAU', color: '#31572c', opacity: 0.66 },
    //             { id: 'CAN', color: '#31572c', opacity: 0.64 },
    //             { id: 'POL', color: '#31572c', opacity: 0.62 },

    //             { id: 'NLD', color: '#4f772d', opacity: 0.7 },
    //             { id: 'CHE', color: '#4f772d', opacity: 0.68 },
    //             { id: 'KOR', color: '#4f772d', opacity: 0.66 },
    //             { id: 'IDN', color: '#4f772d', opacity: 0.64 },
    //             { id: 'VNM', color: '#4f772d', opacity: 0.62 },
    //             { id: 'HRV', color: '#4f772d', opacity: 0.6 },
    //             { id: 'AUS', color: '#4f772d', opacity: 0.58 },
    //             { id: 'HUN', color: '#4f772d', opacity: 0.56 },
    //             { id: 'ARE', color: '#4f772d', opacity: 0.54 },
    //             { id: 'ZAF', color: '#4f772d', opacity: 0.52 },

    //             { id: 'CZE', color: '#90a955', opacity: 0.6 },
    //             { id: 'SGP', color: '#90a955', opacity: 0.58 },
    //             { id: 'EGY', color: '#90a955', opacity: 0.56 },
    //             { id: 'MAR', color: '#90a955', opacity: 0.54 },
    //             { id: 'DNK', color: '#90a955', opacity: 0.52 },
    //             { id: 'IRL', color: '#90a955', opacity: 0.5 },
    //             { id: 'NOR', color: '#90a955', opacity: 0.48 },
    //             { id: 'SWE', color: '#90a955', opacity: 0.46 },
    //             { id: 'BEL', color: '#90a955', opacity: 0.44 },
    //             { id: 'ARG', color: '#90a955', opacity: 0.42 },

    //             { id: 'BRA', color: '#ecf39e', opacity: 0.5 },
    //             { id: 'ISR', color: '#ecf39e', opacity: 0.48 },
    //             { id: 'QAT', color: '#ecf39e', opacity: 0.46 },
    //             { id: 'PER', color: '#ecf39e', opacity: 0.44 },
    //             { id: 'CHL', color: '#ecf39e', opacity: 0.42 },
    //             { id: 'NZL', color: '#ecf39e', opacity: 0.4 },
    //             { id: 'COL', color: '#ecf39e', opacity: 0.38 },
    //             { id: 'FIN', color: '#ecf39e', opacity: 0.36 },
    //             { id: 'PHL', color: '#ecf39e', opacity: 0.34 },
    //             { id: 'TUN', color: '#ecf39e', opacity: 0.32 },
    //         ];


    //         countries.forEach(({ id, color, opacity }) => {
    //             addCountryLayer(map, id, color, opacity);
    //         });
    //     });

    //     return () => map.remove();
    // }, []);


    return (
        // <div ref={mapContainerRef} id="map-shaded" />
        <div id='map-shaded'><h2>dummy map</h2></div>
    );
}
