import React, { useEffect, useState } from "react";
import dummyposts from "../seeded-user-data/dummy-user-posts.json";

export default function ImageGrid({ country }) {
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Filter posts by the passed country
        const filteredImages = dummyposts
            .filter((post) => post.location.country === country)
            .map((post) => post.img_url);
        setImages(filteredImages);
    }, [country]); // Re-run when country changes

    return (
        <div id="image_grid">
            {images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`Post image ${index + 1}`} />
            ))}
        </div>
    );
}
