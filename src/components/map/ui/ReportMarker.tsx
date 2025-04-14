
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getCoordinates } from '../utils/LocationUtils';

interface ReportMarkerProps {
  report: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    createdAt: string;
    location: string;
    coordinates?: [number, number]; // [lat, lng]
  };
  index: number;
}

const ReportMarker: React.FC<ReportMarkerProps> = ({ report, index }) => {
  const navigate = useNavigate();
  
  // Helper function to get coordinates - falls back to simulated coordinates if none exist
  const getMarkerCoordinates = (): [number, number] => {
    if (report.coordinates) {
      return report.coordinates;
    }
    
    // Use LocationUtils to get coordinates for common locations
    if (report.location) {
      return getCoordinates(report.location);
    }
    
    // Simulate coordinates around Mexico City if no valid coordinates found
    const baseCoords = [19.4326, -99.1332];
    const offset = 0.01 * (index + 1);
    const direction = index % 4;
    
    switch (direction) {
      case 0: return [baseCoords[0] + offset, baseCoords[1]]; // North
      case 1: return [baseCoords[0], baseCoords[1] + offset]; // East
      case 2: return [baseCoords[0] - offset, baseCoords[1]]; // South
      case 3: return [baseCoords[0], baseCoords[1] - offset]; // West
      default: return baseCoords as [number, number];
    }
  };
  
  const getStatusIcon = () => {
    switch (report.status) {
      case "Open":
        return <AlertCircle className="h-4 w-4 text-red-500 mr-1" />;
      case "In Progress":
        return <Clock className="h-4 w-4 text-yellow-500 mr-1" />;
      case "Resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500 mr-1" />;
    }
  };
  
  const getStatusColor = () => {
    switch (report.status) {
      case "Open": return "bg-red-100 text-red-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  
  // Get marker icon based on status
  const getIcon = () => {
    let iconUrl;
    
    switch (report.status) {
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

  const handleViewReport = () => {
    navigate(`/reports/${report.id}`);
  };
  
  const coordinates = getMarkerCoordinates();
  const markerIcon = getIcon();
  
  return (
    <Marker 
      position={coordinates}
      icon={markerIcon}
    >
      <Popup>
        <div className="w-48">
          <h3 className="font-medium text-sm mb-1">{report.title}</h3>
          
          <div className="flex items-center mb-2">
            <div className={`flex items-center text-xs px-2 py-0.5 rounded-full ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{report.status}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {report.description}
          </p>
          
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {report.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {report.location}
            </span>
          </div>
          
          <Button 
            size="sm"
            className="w-full text-xs"
            onClick={handleViewReport}
          >
            View Report
          </Button>
        </div>
      </Popup>
    </Marker>
  );
};

export default ReportMarker;
