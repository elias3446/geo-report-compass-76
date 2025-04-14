
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { getReportIcon } from "../icons/MarkerIcons";
import { getCoordinates } from "../utils/LocationUtils";
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet icon issues in React
import '../icons/fixLeafletIcon';

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
  const position = getCoordinates(reportLocation);
  
  return (
    <div style={{ height, width: '100%' }} className="rounded-md overflow-hidden">
      <MapContainer 
        center={position}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
        className="rounded-md"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <div className="p-1">
              <h3 className="font-semibold">{reportTitle}</h3>
              <p className="text-sm">Ubicación: {reportLocation}</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default SingleReportMap;
