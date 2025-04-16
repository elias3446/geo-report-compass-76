
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { getCoordinates } from '../utils/LocationUtils';
import 'leaflet/dist/leaflet.css';
import '../icons/fixLeafletIcon';
import { toast } from 'sonner';

interface EditableLocationMapProps {
  location: string;
  height?: string;
  onLocationChange: (lat: number, lng: number, locationName?: string) => void;
}

const EditableLocationMap: React.FC<EditableLocationMapProps> = ({
  location,
  height = '300px',
  onLocationChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [currentPosition, setCurrentPosition] = useState<[number, number]>(getCoordinates(location));
  const [userMovedMarker, setUserMovedMarker] = useState(false);

  // Parse coordinates from location string if possible
  const parseCoordinatesFromString = (locationStr: string): [number, number] | null => {
    const coordsMatch = locationStr.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
    if (coordsMatch) {
      const lat = parseFloat(coordsMatch[1]);
      const lng = parseFloat(coordsMatch[3]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    return null;
  };

  // Fetch location information using Nominatim reverse geocoding
  const fetchLocationInfo = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      );
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Location data:', data);
      
      // Extract relevant information
      const street = data.address.road || data.address.pedestrian || data.address.street || '';
      const neighbourhood = data.address.neighbourhood || data.address.suburb || '';
      const city = data.address.city || data.address.town || data.address.village || '';
      
      // Create a descriptive location name
      let locationName = '';
      
      if (street) {
        locationName = street;
        if (neighbourhood) {
          locationName += `, ${neighbourhood}`;
        }
      } else if (neighbourhood) {
        locationName = neighbourhood;
      }
      
      if (city && city !== locationName) {
        locationName += locationName ? `, ${city}` : city;
      }
      
      // If we couldn't get a meaningful name, use a generic one
      if (!locationName) {
        locationName = data.display_name ? data.display_name.split(',')[0] : 'Ubicación personalizada';
      }
      
      return locationName;
    } catch (error) {
      console.error('Error fetching location info:', error);
      return 'Ubicación personalizada';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Try to parse coordinates from location string first
    const parsedCoords = parseCoordinatesFromString(location);
    const position = parsedCoords || getCoordinates(location);
    setCurrentPosition(position);
    
    // Create map
    const map = L.map(mapContainerRef.current).setView(position, 14);
    
    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create custom icon
    const icon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    // Add marker
    const marker = L.marker(position, { 
      icon,
      draggable: true 
    }).addTo(map);

    // Add popup
    marker.bindPopup(`
      <div class="text-sm">
        <p>Arrastra el marcador para actualizar la ubicación</p>
        <p class="text-muted-foreground mt-1">
          Lat: ${position[0].toFixed(6)}, 
          Lng: ${position[1].toFixed(6)}
        </p>
      </div>
    `);

    // Add drag event handler
    marker.on('dragend', async function() {
      const latLng = marker.getLatLng();
      const newPosition: [number, number] = [latLng.lat, latLng.lng];
      
      // Show loading toast
      const loadingToast = toast.loading('Obteniendo información de ubicación...');
      
      // Fetch location information
      const locationName = await fetchLocationInfo(latLng.lat, latLng.lng);
      
      // Update current position state
      setCurrentPosition(newPosition);
      setUserMovedMarker(true);
      
      // Update popup content
      marker.setPopupContent(`
        <div class="text-sm">
          <p>${locationName}</p>
          <p class="text-muted-foreground mt-1">
            Lat: ${latLng.lat.toFixed(6)}, 
            Lng: ${latLng.lng.toFixed(6)}
          </p>
        </div>
      `);
      
      // Open the popup to show the new information
      marker.openPopup();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      toast.success('Ubicación actualizada');
      
      // Notify parent component with both coordinates and location name
      onLocationChange(latLng.lat, latLng.lng, locationName);
    });

    // Save refs
    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup
    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  // Update marker position when location changes, but only if the user hasn't manually moved the marker
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    
    // Don't update if the user just moved the marker (prevents position reset)
    if (userMovedMarker) {
      setUserMovedMarker(false);
      return;
    }
    
    // Try to parse coordinates from location string first
    const parsedCoords = parseCoordinatesFromString(location);
    const newPosition = parsedCoords || getCoordinates(location);
    
    // Only update if position has actually changed
    if (newPosition[0] !== currentPosition[0] || newPosition[1] !== currentPosition[1]) {
      setCurrentPosition(newPosition);
      markerRef.current.setLatLng(newPosition);
      
      // Update popup content
      markerRef.current.setPopupContent(`
        <div class="text-sm">
          <p>Arrastra el marcador para actualizar la ubicación</p>
          <p class="text-muted-foreground mt-1">
            Lat: ${newPosition[0].toFixed(6)}, 
            Lng: ${newPosition[1].toFixed(6)}
          </p>
        </div>
      `);
      
      // Center map on new position
      mapRef.current.setView(newPosition, mapRef.current.getZoom());
    }
  }, [location, userMovedMarker]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ height, width: '100%' }} 
      className="rounded-md overflow-hidden"
    />
  );
};

export default EditableLocationMap;
