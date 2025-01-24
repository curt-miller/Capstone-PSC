import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import supabase from "../supaBaseClient";
import { useNavigate } from "react-router-dom";

const MapHomePage = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const navigate = useNavigate();
    const [postData, setPostData] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // 500ms loading timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 500);
        return () => clearTimeout(timer);
    }, []);


    // media query:
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Fetch post data from Supabase
    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const { data, error } = await supabase
                    .from("Posts")
                    .select(
                        "id, title, img_url, coordinates, Users(display_name, profilePicture)"
                    );

                if (error) {
                    console.error("Error fetching post data:", error);
                    return;
                }

                // Convert post data to GeoJSON
                const geoJSONData = {
                    type: "FeatureCollection",
                    features: data
                        .filter((post) => post.coordinates)
                        .map((post) => ({
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: JSON.parse(post.coordinates),
                            },
                            properties: {
                                id: post.id,
                                title: post.title,
                                img_url: post.img_url,
                                username: post.Users.display_name,
                                profilePicture: post.Users.profilePicture,
                                weight: 1,
                            },
                        })),
                };

                setPostData(geoJSONData);
            } catch (err) {
                console.error("Unexpected error fetching post data:", err.message);
            }
        };

        fetchPostData();
    }, []);

    // Initialize Mapbox only when isLoaded is true
    useEffect(() => {
        if (!isLoaded) return; // Avoid running map setup if not loaded

        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/millercw3/cm5hfi5yx002701qf6cl5anau",
            center: [10, 55],
            zoom: isMobile ? .5 : 1.2,
            bearing: 0,
        });

        mapRef.current.on("load", () => {
            if (postData) {
                mapRef.current.addSource("posts", {
                    type: "geojson",
                    data: postData,
                });

                // Add a heatmap layer
                mapRef.current.addLayer({
                    id: "posts-heat",
                    type: "heatmap",
                    source: "posts",
                    maxzoom: 8,
                    paint: {
                        'heatmap-weight': [
                            'interpolate',
                            ['linear'],
                            ['get', 'weight'],
                            0, 0,
                            1, 0.6
                        ],

                        'heatmap-intensity': [
                            'interpolate',
                            ['linear'],
                            ['zoom'],
                            0, 1.5,
                            9, .5
                        ],

                        "heatmap-color": [
                            "interpolate",
                            ["linear"],
                            ["heatmap-density"],
                            0,
                            "rgba(33,102,172,0)",
                            0.2,
                            "rgb(103,169,207)",
                            0.4,
                            "rgb(209,229,240)",
                            0.6,
                            "rgb(253,219,199)",
                            0.8,
                            "rgb(239,138,98)",
                            1,
                            "rgb(178,24,43)",
                        ],
                        "heatmap-radius": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            0,
                            18,
                            15,
                            40,
                        ],
                        "heatmap-opacity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7,
                            1,
                            8,
                            0,
                        ],
                    },
                });

                // Add a circle layer for individual points
                mapRef.current.addLayer({
                    id: "posts-point",
                    type: "circle",
                    source: "posts",
                    minzoom: 7,
                    paint: {
                        "circle-radius": ["interpolate", ["linear"], ["zoom"], 0, 3, 8, 12],
                        "circle-color": "rgb(239,138,98)",
                        "circle-stroke-color": "white",
                        "circle-stroke-width": 1.5,
                        "circle-opacity": [
                            "interpolate",
                            ["linear"],
                            ["zoom"],
                            7,
                            0.8,
                            8,
                            1,
                        ],
                    },
                });

                // Add interactivity (hover popup, click to navigate)
                const popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                });

                mapRef.current.on("mouseenter", "posts-point", (e) => {
                    mapRef.current.getCanvas().style.cursor = "pointer";

                    const { username, profilePicture, title } = e.features[0].properties;
                    popup
                        .setLngLat(e.features[0].geometry.coordinates)
                        .setHTML(
                            `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <img src="${profilePicture}" alt="${username}" style="width: 30px; height: 30px; border-radius: 50%;" />
                                <div>
                                    <strong>${username}</strong>
                                    <p style="margin: 0;">${title}</p>
                                </div>
                            </div>
                        `
                        )
                        .addTo(mapRef.current);
                });

                mapRef.current.on("mouseleave", "posts-point", () => {
                    mapRef.current.getCanvas().style.cursor = "";
                    popup.remove();
                });

                mapRef.current.on("click", "posts-point", (e) => {
                    const { id } = e.features[0].properties;
                    navigate(`/attraction/${id}`);
                });
            }
        });

        class TitleControl {
            onAdd(map) {
                this._map = map;
                this._container = document.createElement("div");
                this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
                this._container.style.padding = "10px";
                this._container.style.background = "rgba(255, 255, 255, 0.7)";
                this._container.style.fontWeight = "bold";
                this._container.innerHTML =
                    '<h2 style="font-size: 16px; text-align: center;">Explore the map to view where our users have traveled!</h2>';
                return this._container;
            }

            onRemove() {
                this._container.parentNode.removeChild(this._container);
                this._map = undefined;
            }
        }

        mapRef.current.addControl(new TitleControl(), "top");

        return () => mapRef.current.remove();
    }, [isLoaded, postData, navigate]);



    return (
        <div>
            {!isLoaded ? (
                <p className="home_page_map_loading_message">Loading map...</p> //  loading indicator
            ) : (
                <div
                    ref={mapContainerRef}
                    style={{
                        height: isMobile ? "40vh" : "100vh",
                        width: isMobile ? "100vw" : "100%",
                    }}
                />
            )}
        </div>
    );
};

export default MapHomePage;
