
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports } from "@/services/reportService";
import { useTimeFilter } from "@/context/TimeFilterContext";

// Create custom marker icons for different report status
const getReportIcon = (status: string) => {
  // Define icon configurations based on status
  if (status === "Open") {
    return new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  } else if (status === "In Progress") {
    return new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  } else {
    return new L.Icon({
      iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  }
};

// Mock locations for sample reports
const sampleLocations: Record<string, [number, number]> = {
  "Av. Reforma 123": [19.4326, -99.1332],
  "Calle 16 de Septiembre": [19.4328, -99.1386],
  "Parque Lincoln": [19.4284, -99.2007],
  "Bosque de Chapultepec": [19.4120, -99.1946],
  "Insurgentes Sur": [19.3984, -99.1713],
  "Centro Histórico": [19.4326, -99.1332],
  "Paseo de la Reforma": [19.4284, -99.1557],
  "Polanco": [19.4284, -99.1907],
  "Condesa": [19.4128, -99.1732],
  "Roma Norte": [19.4195, -99.1599],
};

// Default location (Mexico City)
const defaultCenter: [number, number] = [19.4326, -99.1332];

// Map Center component to fix the center property issue
function SetMapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface MapViewProps {
  height?: string;
  filterStatus?: string;
  categoryOnly?: boolean;
  ignoreFilters?: boolean;
}

const MapView = ({ 
  height = "500px", 
  filterStatus, 
  categoryOnly = false,
  ignoreFilters = false 
}: MapViewProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const {
    timeFrame,
    selectedYear,
    selectedMonth,
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports,
    selectedCategory
  } = useTimeFilter();

  // Fetch reports data
  useEffect(() => {
    const reportData = getReports();
    setReports(reportData);
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [refreshKey]);

  // Filter reports based on status filters and time period
  const filteredReports = useMemo(() => {
    // If ignoreFilters is true, return all reports without any filtering
    if (ignoreFilters) {
      return reports;
    }
    
    let filtered = reports;
    
    // First apply time period filters if not in categoryOnly mode
    if (!categoryOnly) {
      if (selectedYear !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getFullYear() === selectedYear;
        });
      }
  
      if (timeFrame === "month" && selectedMonth !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getMonth() === selectedMonth;
        });
      } else if (timeFrame === "week" && selectedMonth !== undefined) {
        // For week view, we approximate by filtering the current month
        // and then checking the day within the week
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getMonth() === selectedMonth;
          // A more precise week filter would be implemented here
        });
      } else if (timeFrame === "day" && selectedMonth !== undefined && selectedDay !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getMonth() === selectedMonth && 
                reportDate.getDate() === selectedDay;
        });
      }
    }
    
    // Always apply category filter if selected, regardless of categoryOnly mode
    if (selectedCategory) {
      filtered = filtered.filter(report => report.category === selectedCategory);
    }
    
    // Then apply status filters if not in categoryOnly mode
    if (!categoryOnly) {
      // If a specific filterStatus is provided (from the MapPage), use that
      if (filterStatus) {
        if (filterStatus === "open") {
          filtered = filtered.filter(report => report.status === "Open");
        } else if (filterStatus === "progress") {
          filtered = filtered.filter(report => report.status === "In Progress");
        } else if (filterStatus === "resolved") {
          filtered = filtered.filter(report => report.status === "Resolved");
        }
        // If "all" is selected, keep all reports
        return filtered;
      }
      
      // Otherwise use the global filter context
      return filtered.filter(report => {
        if (report.status === "Open" && showOpenReports) return true;
        if (report.status === "In Progress" && showInProgressReports) return true;
        if (report.status === "Resolved" && showClosedReports) return true;
        return false;
      });
    }
    
    // When categoryOnly is true, we don't apply status filters
    return filtered;
  }, [
    reports, 
    showOpenReports, 
    showClosedReports, 
    showInProgressReports, 
    filterStatus, 
    timeFrame, 
    selectedYear, 
    selectedMonth, 
    selectedDay,
    selectedCategory,
    categoryOnly,
    ignoreFilters
  ]);

  // Get coordinates for each report
  const getCoordinates = (location: string): [number, number] => {
    return sampleLocations[location] || defaultCenter;
  };

  // Log the filtered reports for debugging
  useEffect(() => {
    console.log(`Map showing ${filteredReports.length} reports for ${timeFrame} view with year=${selectedYear}, month=${selectedMonth}, day=${selectedDay}`);
    console.log('Status filters:', { showOpenReports, showInProgressReports, showClosedReports });
    if (selectedCategory) {
      console.log(`Category filter applied: ${selectedCategory}`);
    }
    if (ignoreFilters) {
      console.log('All filters ignored - showing unfiltered map');
    }
  }, [filteredReports, timeFrame, selectedYear, selectedMonth, selectedDay, showOpenReports, showInProgressReports, showClosedReports, selectedCategory, ignoreFilters]);

  // Handle CSV export
  useEffect(() => {
    const handleExportData = () => {
      console.log("Export data requested");
      // CSV export logic would go here
    };
    
    document.addEventListener("export-map-data", handleExportData);
    
    return () => {
      document.removeEventListener("export-map-data", handleExportData);
    };
  }, [filteredReports]);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer 
        style={{ height: "100%", width: "100%" }}
        zoom={13}
        scrollWheelZoom={false}
      >
        <SetMapCenter center={defaultCenter} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredReports.map((report, index) => {
          const position = getCoordinates(report.location);
          return (
            <Marker 
              key={index}
              position={position}
              icon={getReportIcon(report.status)}
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-semibold">{report.title}</h3>
                  <p className="text-sm mt-1">Status: {report.status}</p>
                  <p className="text-sm">Location: {report.location}</p>
                  <p className="text-sm">Category: {report.category}</p>
                  <p className="text-sm">Priority: {report.priority}</p>
                  <p className="text-sm">Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapView;
