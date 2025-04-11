
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useReports } from '@/contexts/ReportContext';
import { useTimeFilter } from '@/context/TimeFilterContext';
import { toast } from 'sonner';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  height?: string;
  filterStatus?: string;
  isStandalone?: boolean;
  categoryOnly?: boolean;
}

// Create custom marker icons
const createMarkerIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const redIcon = createMarkerIcon('red');
const greenIcon = createMarkerIcon('green');
const blueIcon = createMarkerIcon('blue');
const yellowIcon = createMarkerIcon('yellow');
const orangeIcon = createMarkerIcon('orange');
const greyIcon = createMarkerIcon('grey');

const getMarkerIcon = (status: string, category: string | undefined) => {
  const lowercaseCategory = category?.toLowerCase();
  
  if (lowercaseCategory?.includes('urgent') || lowercaseCategory?.includes('emergency')) {
    return redIcon;
  }
  
  switch (status) {
    case 'Open':
      return blueIcon;
    case 'In Progress':
      return yellowIcon;
    case 'Resolved':
      return greenIcon;
    case 'approved':
      return greenIcon;
    case 'rejected':
      return redIcon;
    case 'draft':
      return greyIcon;
    case 'submitted':
      return orangeIcon;
    default:
      return blueIcon;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Open':
      return 'bg-blue-500';
    case 'In Progress':
      return 'bg-yellow-500';
    case 'Resolved':
      return 'bg-green-500';
    case 'approved':
      return 'bg-green-500';
    case 'rejected':
      return 'bg-red-500';
    case 'draft':
      return 'bg-gray-500';
    case 'submitted':
      return 'bg-orange-500';
    default:
      return 'bg-blue-500';
  }
};

const getCategoryColor = (category: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
    'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  
  // Simple hash to pick a consistent color for each category
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const MapView: React.FC<MapViewProps> = ({ 
  height = '400px', 
  filterStatus = 'all',
  isStandalone = false,
  categoryOnly = false
}) => {
  const { reports } = useReports();
  const { selectedCategories } = useTimeFilter();
  const mapRef = useRef<HTMLDivElement>(null);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  
  useEffect(() => {
    const reportOverview = document.createEvent('CustomEvent');
    document.addEventListener('export-map-data', handleExportMapData);
    
    return () => {
      document.removeEventListener('export-map-data', handleExportMapData);
    };
  }, [filteredReports]);
  
  useEffect(() => {
    let filtered = [...reports];
    
    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => {
        switch (filterStatus) {
          case 'open':
            return report.status === 'Open' || report.status === 'submitted';
          case 'progress':
            return report.status === 'In Progress';
          case 'resolved':
            return report.status === 'Resolved' || report.status === 'approved';
          default:
            return true;
        }
      });
    }
    
    // Filter by category
    if (categoryOnly && selectedCategories.length > 0) {
      filtered = filtered.filter(report => 
        selectedCategories.includes(report.category)
      );
    }
    
    setFilteredReports(filtered);
  }, [reports, filterStatus, selectedCategories, categoryOnly]);
  
  const handleExportMapData = () => {
    try {
      const data = filteredReports.map(report => ({
        id: report.id,
        title: report.title,
        description: report.description,
        status: report.status,
        category: report.category,
        location: report.location,
        coordinates: report.coordinates,
        createdAt: report.createdAt
      }));
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `map-data-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Map data exported successfully!');
    } catch (error) {
      console.error('Error exporting map data:', error);
      toast.error('Failed to export map data.');
    }
  };
  
  return (
    <div ref={mapRef} style={{ height: height, width: '100%' }}>
      {filteredReports.length > 0 ? (
        <MapContainer 
          center={[51.505, -0.09]} 
          zoom={13} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredReports.map((report, index) => (
            report.coordinates ? (
              <Marker 
                key={index}
                position={[report.coordinates.lat, report.coordinates.lng]}
                icon={getMarkerIcon(report.status, report.category)}
              >
                <Popup className="map-popup">
                  <div className="p-2">
                    <h3 className="font-bold text-base">{report.title}</h3>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getStatusColor(report.status)}`}></span>
                      <span className="text-xs font-medium">{report.status}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1 ${getCategoryColor(report.category)}`}></span>
                      <span className="text-xs">{report.category}</span>
                    </div>
                    <p className="text-xs mt-2 text-gray-600 line-clamp-2">{report.description}</p>
                    {isStandalone && (
                      <button 
                        className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => {
                          window.location.href = `/reports/${report.id}`;
                        }}
                      >
                        View Details
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            ) : null
          ))}
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full bg-gray-50 border rounded-md">
          <div className="text-center p-6">
            <p className="text-gray-500 mb-2">No map data available</p>
            <p className="text-sm text-gray-400">
              {selectedCategories.length > 0 
                ? 'No reports match the selected category filters' 
                : 'No reports with location data found'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
