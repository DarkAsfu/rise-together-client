'use client'
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ location, onLocationChange }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current) return;

        // Initialize map
        if (!mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(
                [location.latitude, location.longitude],
                13
            );

            // Add OpenStreetMap tiles
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(mapInstanceRef.current);

            // Add marker
            markerRef.current = L.marker([location.latitude, location.longitude])
                .addTo(mapInstanceRef.current)
                .bindPopup('Your selected location');

            // Add click event to map
            mapInstanceRef.current.on('click', async (e) => {
                const { lat, lng } = e.latlng;
                
                // Update marker position
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                    markerRef.current.getPopup().setContent('Your selected location');
                }

                // Try to get address from coordinates (reverse geocoding)
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
                    );
                    const data = await response.json();
                    
                    let address = 'Unknown location';
                    if (data.display_name) {
                        // Extract city and country from full address
                        const addressParts = data.display_name.split(', ');
                        if (addressParts.length >= 2) {
                            address = `${addressParts[addressParts.length - 3] || addressParts[addressParts.length - 2]}, ${addressParts[addressParts.length - 1]}`;
                        } else {
                            address = data.display_name;
                        }
                    }

                    // Update location
                    onLocationChange({
                        latitude: lat,
                        longitude: lng,
                        address: address
                    });
                } catch (error) {
                    console.error('Error getting address:', error);
                    // Update location without address
                    onLocationChange({
                        latitude: lat,
                        longitude: lng,
                        address: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
                    });
                }
            });
        } else {
            // Update map view if location changes externally
            mapInstanceRef.current.setView([location.latitude, location.longitude], 13);
            if (markerRef.current) {
                markerRef.current.setLatLng([location.latitude, location.longitude]);
            }
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [location.latitude, location.longitude, onLocationChange]);

    return (
        <div 
            ref={mapRef} 
            className="w-full h-full"
            style={{ minHeight: '400px' }}
        />
    );
};

export default MapComponent;
