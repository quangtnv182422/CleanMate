import React, { useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Helmet } from 'react-helmet';

const GoogleMapAutocomplete = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    useEffect(() => {
        // Dùng flag để tránh load lại nhiều lần trong dev (Hot Reload)
        if (window._googleMapAutocompleteInitialized) return;
        window._googleMapAutocompleteInitialized = true;

        const loader = new Loader({
            apiKey: apiKey,
            version: "weekly",
            libraries: ["places"],
        });

        loader.load().then(async () => {
            const [{ Map }, { AdvancedMarkerElement }] = await Promise.all([
                google.maps.importLibrary("maps"),
                google.maps.importLibrary("marker"),
            ]);

            await google.maps.importLibrary("places");

            const center = { lat: 21.0278, lng: 105.8342 };

            const map = new Map(document.getElementById("map"), {
                center,
                zoom: 13,
                mapId: "4504f8b37365c3d0",
                mapTypeControl: false,
            });

            const placeAutocomplete = new google.maps.places.PlaceAutocompleteElement({
                locationBias: center,
                includedRegionCodes: ['vn'],
            });

            placeAutocomplete.id = "place-autocomplete-input";

            const card = document.getElementById("place-autocomplete-card");

            // ✅ Tránh duplicate input
            if (!document.getElementById("place-autocomplete-input")) {
                card.appendChild(placeAutocomplete);
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(card);
            }

            const marker = new AdvancedMarkerElement({ map });
            const infoWindow = new google.maps.InfoWindow({});

            const title = document.getElementById("place-title");
            const info = document.getElementById("place-info");

            placeAutocomplete.addEventListener("gmp-select", async ({ placePrediction }) => {
                const place = placePrediction.toPlace();
                await place.fetchFields({
                    fields: ["displayName", "formattedAddress", "location", "viewport"],
                });

                if (place.viewport) {
                    map.fitBounds(place.viewport);
                } else {
                    map.setCenter(place.location);
                    map.setZoom(17);
                }

                marker.position = place.location;

                const content =
                    `<div><strong>${place.displayName}</strong><br>${place.formattedAddress}</div>`;
                infoWindow.setContent(content);
                infoWindow.setPosition(place.location);
                infoWindow.open({ map, anchor: marker });

                title.textContent = "Selected Place:";
                info.textContent = JSON.stringify(place.toJSON(), null, 2);
            });
        });
    }, [apiKey]);

    return (
        <>
            <Helmet>
                <title>Google Maps + Place Autocomplete</title>
            </Helmet>

            <div id="map" style={{ height: "60vh", width: "100%" }}></div>

            <div id="place-autocomplete-card" style={{
                background: 'white', padding: '10px', borderRadius: '8px',
                margin: '10px', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)'
            }}></div>

            <div id="info-panel" style={{
                padding: '10px', background: '#f3f3f3',
                height: '40vh', overflowY: 'auto', fontSize: '14px'
            }}>
                <h3 id="place-title">Selected Place:</h3>
                <pre id="place-info">None</pre>
            </div>
        </>
    );
};

export default GoogleMapAutocomplete;
