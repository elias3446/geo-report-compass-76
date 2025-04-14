
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useMapReports } from './hooks/useMapReports';
import ReportMarker from './ui/ReportMarker';
import { toast } from 'sonner';

// Fix for Leaflet icon issues in React
import './icons/fixLeafletIcon';

interface TimeFilters {
  timeFrame?: "day" | "week" | "month" | "year";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  showOpenReports?: boolean;
  showClosedReports?: boolean;
  showInProgressReports?: boolean;
}

interface MapViewProps {
  height?: string;
  categoryOnly?: boolean;
  filterStatus?: string;
  isStandalone?: boolean;
  timeFilters?: TimeFilters;
  selectedCategories?: string[];
}

// This component will recenter the map when needed
const MapController = () => {
  const map = useMap();
  
  useEffect(() => {
    // Force a resize check after the map is loaded
    setTimeout(() => {
      map.invalidateSize();
    }, 250);
  }, [map]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  height = '500px',
  categoryOnly = false,
  filterStatus,
  isStandalone = false,
  timeFilters,
  selectedCategories = []
}) => {
  const { filteredReports, reports } = useMapReports({ 
    filterStatus, 
    categoryOnly, 
    isStandalone,
    timeFilters,
    selectedCategories
  });
  
  console.log(`MapView rendering with ${filteredReports.length} filtered reports, categoryOnly: ${categoryOnly}, isStandalone: ${isStandalone}`);
  
  // Default center coordinates (Mexico City)
  const defaultCenter: [number, number] = [19.4326, -99.1332];
  const defaultZoom = 12;

  return (
    <div style={{ height, width: '100%' }}>
      <MapContainer 
        center={defaultCenter}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="rounded-md z-0"
      >
        <MapController />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredReports.map((report, index) => (
          <ReportMarker 
            key={report.id || index}
            report={report}
            index={index}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
