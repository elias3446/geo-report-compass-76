
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
// Using custom icon logic directly in this component
import { getCoordinates } from "../utils/LocationUtils";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for Leaflet icon issues in React
import '../icons/fixLeafletIcon';

// Component to recenter map when the location changes
const MapLocationUpdater = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);
  
  return null;
};

interface SingleReportMapProps {
  reportTitle: string;
  reportStatus: string;
  reportLocation: string;
  height?: string;
}

const SingleReportMap: React.FC<SingleReportMapProps> = ({ 
  reportTitle, 
  reportStatus, 
  reportLocation,
  height = '250px'
}) => {
  const [position, setPosition] = useState<[number, number]>(getCoordinates(reportLocation));
  
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
    
    // Try to extract coordinates from any part of the string
    const anyNumbersRegex = /(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/;
    const numbersMatch = locationStr.match(anyNumbersRegex);
    
    if (numbersMatch) {
      const lat = parseFloat(numbersMatch[1]);
      const lng = parseFloat(numbersMatch[3]);
      if (!isNaN(lat) && !isNaN(lng)) {
        return [lat, lng];
      }
    }
    
    return null;
  };
  
  // Update position when location changes
  useEffect(() => {
    console.log("SingleReportMap: Location changed to", reportLocation);
    // Try to parse coordinates first, then fall back to getCoordinates
    const parsedCoords = parseCoordinatesFromString(reportLocation);
    if (parsedCoords) {
      console.log("SingleReportMap: Using parsed coordinates:", parsedCoords);
      setPosition(parsedCoords);
    } else {
      const fallbackCoords = getCoordinates(reportLocation);
      console.log("SingleReportMap: Falling back to getCoordinates:", fallbackCoords);
      setPosition(fallbackCoords);
    }
  }, [reportLocation]);
  
  // Get marker icon based on status
  const getIcon = () => {
    let iconUrl;
    
    switch (reportStatus) {
      case "Open":
        iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png";
        break;
      case "In Progress":
        iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png";
        break;
      case "Resolved":
        iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png";
        break;
      default:
        iconUrl = "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png";
    }
    
    return new L.Icon({
      iconUrl,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Extract location name for display
  const getLocationDisplayName = () => {
    const nameMatch = reportLocation.match(/\(([^)]+)\)/);
    if (nameMatch && nameMatch[1]) {
      return nameMatch[1];
    }
    return reportLocation;
  };

  // Extract coordinates for display
  const getLocationCoordinates = () => {
    const coordsMatch = reportLocation.match(/(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)/);
    if (coordsMatch) {
      return `${coordsMatch[1]}, ${coordsMatch[3]}`;
    }
    return `${position[0].toFixed(6)}, ${position[1].toFixed(6)}`;
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-md overflow-hidden">
      <MapContainer 
        center={position}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="rounded-md"
      >
        <MapLocationUpdater position={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={getIcon()}>
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold">{reportTitle}</h3>
              <p className="text-sm">Ubicación: {getLocationDisplayName()}</p>
              <p className="text-xs text-muted-foreground">
                Coordenadas: {getLocationCoordinates()}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SingleReportMap;
