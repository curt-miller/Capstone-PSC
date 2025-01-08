import React, { useState } from 'react';
import MapSearch from './MapSearch';

export default function NewPostForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [location, setLocation] = useState(null); // Capture marker coordinates

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('Image URL:', imageUrl);
        console.log('Marker Coordinates:', location);
    };

    return (
        <div id="submit-page">
            <div id="submit-form">
                <h1>Drop a Pin!</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="description">Description (140 characters max):</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={140}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="imageUrl">Image URL:</label>
                        <input
                            type="url"
                            id="imageUrl"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </div>

                    <button type="submit">Submit</button>
                </form>
            </div>
            <div>
                <MapSearch onLocationChange={setLocation} location={location} />
            </div>
        </div>
    );
}
