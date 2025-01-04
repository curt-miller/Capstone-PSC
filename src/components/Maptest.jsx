import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import {RenderingType} from '@vis.gl/react-google-maps';

const KEY = import.meta.env.VITE_KEY

export default function Maptest() {

    return (
        <div className='map'>
        <APIProvider apiKey={KEY}>
            <Map
zoom={5} center={{lat: 53.54992, lng: 10.00678}}
            />
        </APIProvider>
        </div>
    );
}