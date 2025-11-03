import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Home, Navigation, X } from 'lucide-react';

const PropertyMap = ({ properties, onPropertySelect }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [infoWindow, setInfoWindow] = useState(null);
  const [mapError, setMapError] = useState(null);

  // Load Google Maps API script
  useEffect(() => {
    if (window.google && window.google.maps) {
      setGoogleMapsLoaded(true);
      return;
    }

    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    
    googleMapScript.addEventListener('load', () => {
      setGoogleMapsLoaded(true);
    });
    
    googleMapScript.addEventListener('error', () => {
      setMapError('Failed to load Google Maps. Please try again later.');
    });
    
    document.head.appendChild(googleMapScript);
    
    return () => {
      // Clean up script if component unmounts before script loads
      if (document.head.contains(googleMapScript)) {
        document.head.removeChild(googleMapScript);
      }
    };
  }, []);

  // Initialize map when Google Maps is loaded
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current) return;
    
    try {
      // Center on Lagos, Nigeria
      const mapCenter = { lat: 6.5244, lng: 3.3792 };
      
      const mapOptions = {
        center: mapCenter,
        zoom: 11,
        mapTypeId: 'roadmap',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      };
      
      const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
      setMap(newMap);
      
      // Create a single info window to reuse for all markers
      const newInfoWindow = new window.google.maps.InfoWindow();
      setInfoWindow(newInfoWindow);
      
      // Close info window when clicking on the map
      newMap.addListener('click', () => {
        newInfoWindow.close();
        setSelectedProperty(null);
      });
    } catch (error) {
      console.error('Error initializing Google Maps:', error);
      setMapError('Failed to initialize map. Please refresh the page.');
    }
  }, [googleMapsLoaded]);

  // Create and update markers when properties or map changes
  useEffect(() => {
    if (!map || !properties.length) return;
    
    // Clear existing markers
    markers.forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    
    // Only proceed if Google Maps is loaded
    if (!window.google || !window.google.maps) return;
    
    const bounds = new window.google.maps.LatLngBounds();
    const newMarkers = [];
    
    // Create markers for each property
    properties.forEach(property => {
      if (!property.location) return;
      
      const position = new window.google.maps.LatLng(
        property.location.lat,
        property.location.lng
      );
      
      // Create marker
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: property.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${property.id === selectedProperty?.id ? '#4f46e5' : '#6366f1'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3" fill="${property.id === selectedProperty?.id ? '#4f46e5' : '#6366f1'}" stroke="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 32)
        }
      });
      
      // Extend bounds to include this marker
      bounds.extend(position);
      
      // Add click listener to marker
      marker.addListener('click', () => {
        if (infoWindow) {
          // Create info window content
          const content = `
            <div class="p-2 max-w-xs">
              <div class="font-medium text-gray-900 mb-1">${property.name}</div>
              <div class="text-sm text-gray-600 mb-1">${property.type}</div>
              <div class="text-sm font-medium text-gray-800 mb-2">${property.rate}/night</div>
              <button id="view-property-${property.id}" class="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md">View Details</button>
            </div>
          `;
          
          infoWindow.setContent(content);
          infoWindow.open(map, marker);
          
          // Need to wait for the info window to be added to the DOM
          setTimeout(() => {
            const button = document.getElementById(`view-property-${property.id}`);
            if (button) {
              button.addEventListener('click', () => {
                if (onPropertySelect) {
                  onPropertySelect(property);
                }
              });
            }
          }, 100);
        }
        
        setSelectedProperty(property);
      });
      
      newMarkers.push(marker);
    });
    
    setMarkers(newMarkers);
    
    // Fit map to bounds if we have markers
    if (newMarkers.length > 0) {
      map.fitBounds(bounds);
      
      // Don't zoom in too far on small datasets
      const listener = map.addListener('idle', () => {
        if (map.getZoom() > 15) {
          map.setZoom(15);
        }
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [map, properties, infoWindow, onPropertySelect, selectedProperty]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <div className="text-red-500 mb-2">
            <svg className="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700">{mapError}</p>
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!googleMapsLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-lg border border-gray-200">
        <div className="text-center p-6">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden border border-gray-200">
      <div 
        ref={mapRef}
        className="w-full h-full bg-gray-100"
      ></div>
    </div>
  );
};

export default PropertyMap; 