
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useReports } from '@/contexts/ReportContext';
import { useTimeFilter } from '@/context/TimeFilterContext';

// Import marker images as modules
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet's default marker
const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  height?: string;
  categoryOnly?: boolean;
  ignoreFilters?: boolean;
}

const MapView = ({ height = "500px", categoryOnly = false, ignoreFilters = false }: MapViewProps) => {
  const { reports: allReports } = useReports();
  const { selectedCategories } = useTimeFilter();
  const [mapCenter, setMapCenter] = useState<[number, number]>([51.505, -0.09]); // Default map center
  const [zoomLevel, setZoomLevel] = useState(5);
  const mapRef = useRef(null);

  useEffect(() => {
    if (allReports && allReports.length > 0) {
      // Calculate the average latitude and longitude
      let sumLat = 0;
      let sumLng = 0;
      allReports.forEach(report => {
        // Check if location exists and has lat/lng properties
        if (report.location && report.location.lat !== undefined && report.location.lng !== undefined) {
          sumLat += report.location.lat;
          sumLng += report.location.lng;
        }
      });
      const avgLat = sumLat / allReports.length;
      const avgLng = sumLng / allReports.length;

      if (!isNaN(avgLat) && !isNaN(avgLng)) {
        setMapCenter([avgLat, avgLng]);
        setZoomLevel(10);
      }
    }
  }, [allReports]);

  // Get filtered reports based on the selected categories
  const getFilteredReports = () => {
    if (ignoreFilters) {
      return allReports;
    }
    
    if (categoryOnly && selectedCategories.length > 0) {
      return allReports.filter(report => 
        selectedCategories.includes(report.category)
      );
    }
    
    return allReports;
  };

  const ExportMapData = () => {
    useMapEvents({
      load: () => {
        console.log('map loaded');
      },
      export: () => {
        const map = mapRef.current;
        if (!map) {
          console.error('Map reference is not available.');
          return;
        }
    
        let geojsonData = {
          type: "FeatureCollection",
          features: []
        };
    
        filteredReports.forEach(report => {
          if (!report.location) {
            console.warn('Report missing location:', report);
            return;
          }
          
          const latitude = report.location.lat;
          const longitude = report.location.lng;
          
          if (latitude === undefined || longitude === undefined) {
            console.warn('Report missing coordinates:', report);
            return;
          }
          
          const feature = {
            type: "Feature",
            properties: {
              title: report.title,
              description: report.description,
              category: report.category,
              status: report.status,
              date: report.date,
              // Include other relevant properties
            },
            geometry: {
              type: "Point",
              coordinates: [longitude, latitude]
            }
          };
          geojsonData.features.push(feature);
        });
    
        const geojsonDataString = JSON.stringify(geojsonData, null, 2);
        const blob = new Blob([geojsonDataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'map_data.geojson';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
    
    return null;
  };

  // Use the filtered reports for the map
  const filteredReports = getFilteredReports();

  return (
    <div className="relative" style={{ height: height || "500px" }}>
      <MapContainer 
        center={mapCenter} 
        zoom={zoomLevel} 
        style={{ height: height || "500px", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredReports.map(report => {
          if (!report.location || report.location.lat === undefined || report.location.lng === undefined) {
            return null;
          }
          
          return (
            <Marker 
              key={report.id} 
              position={[report.location.lat, report.location.lng]}
            >
              <Popup>
                <h2>{report.title}</h2>
                <p>{report.description}</p>
                <p>Category: {report.category}</p>
              </Popup>
            </Marker>
          );
        })}
        <ExportMapData />
      </MapContainer>
    </div>
  );
};

export default MapView;
