
import React, { useRef, useEffect } from 'react';
import Nav from './Nav';


export default function AttractionDetail() {

    return (
        <div id='att-detail-page-container'>
            <Nav />
            <div id='att-detail-page-GRID'>
                <div id='att-detail-page-TITLE'>
                    <h1>Attraction Name</h1>
                    <h3>probably some details like Country, user who posted this attraction, amount of likes or reviews or something </h3>
                </div>
                <div id='att-detail-page-REVIEWS'>
                    <h2>List user reviews here</h2>
                </div>
                <div id='att-detail-page-IMAGE'>
                    <h2>dynamically render image here</h2>
                </div>
            </div>
        </div>
    )
}