
import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { getReports } from "@/services/reportService";
import { useTimeFilter } from "@/context/TimeFilterContext";
import { toast } from "sonner";

// Fix TypeScript errors by augmenting the types
declare module 'react-leaflet' {
  interface MapContainerProps {
    center?: [number, number];
    zoom?: number;
  }
  
  interface TileLayerProps {
    attribution?: string;
  }
  
  interface MarkerProps {
    icon?: L.Icon;
  }
}

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

// Expanded list of sample locations to support more reports
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
  "Coyoacán": [19.3429, -99.1609],
  "Santa Fe": [19.3659, -99.2873],
  "Xochimilco": [19.2571, -99.1050],
  "Zócalo": [19.4326, -99.1332],
  "Alameda Central": [19.4362, -99.1443],
  "Bellas Artes": [19.4352, -99.1413],
  "Plaza Garibaldi": [19.4396, -99.1386],
  "Torre Latinoamericana": [19.4339, -99.1406],
  "Universidad Nacional": [19.3324, -99.1868],
  "Perisur": [19.3031, -99.1914],
  "Aeropuerto": [19.4360, -99.0719],
  "Estadio Azteca": [19.3031, -99.1504],
  "Basílica de Guadalupe": [19.4849, -99.1177],
  "Six Flags": [19.2957, -99.2159],
  "Teotihuacán": [19.6926, -98.8444]
};

// Helper function to generate coordinates for locations not in our predefined list
const generateRandomCoordinates = (locationName: string): [number, number] => {
  // Use location name to generate a deterministic position based on hash
  const hash = locationName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Create a position within Mexico City area (approximately)
  const baseLat = 19.4;
  const baseLng = -99.15;
  const latOffset = (hash % 200) / 1000; // +/- 0.2 degrees
  const lngOffset = ((hash * 13) % 200) / 1000;
  
  return [
    baseLat + latOffset - 0.1,
    baseLng + lngOffset - 0.1
  ];
};

// Default location (Mexico City)
const defaultCenter: [number, number] = [19.4326, -99.1332];

interface MapViewProps {
  height?: string;
  filterStatus?: string;
  categoryOnly?: boolean;
  isStandalone?: boolean;
}

const MapView = ({
  height = "500px",
  filterStatus,
  categoryOnly = false,
  isStandalone = false
}: MapViewProps) => {
  const [reports, setReports] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use optional chaining with useTimeFilter to handle cases when TimeFilterProvider is not available
  const {
    timeFrame,
    selectedYear,
    selectedMonth,
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports,
    selectedCategory,
    selectedCategories
  } = isStandalone ? {
    timeFrame: undefined,
    selectedYear: undefined,
    selectedMonth: undefined,
    selectedDay: undefined,
    showOpenReports: true,
    showClosedReports: true,
    showInProgressReports: true,
    selectedCategory: null,
    selectedCategories: []
  } : useTimeFilter();

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
    console.log("Filtering reports with categories:", selectedCategories);
    let filtered = reports;
    
    // If this is a standalone map (from the Map page), only apply the filterStatus
    if (isStandalone) {
      if (filterStatus) {
        if (filterStatus === "open") {
          filtered = filtered.filter(report => report.status === "Open");
        } else if (filterStatus === "progress") {
          filtered = filtered.filter(report => report.status === "In Progress");
        } else if (filterStatus === "resolved") {
          filtered = filtered.filter(report => report.status === "Resolved");
        }
      }
      return filtered;
    }
    
    // Otherwise apply all filters from TimeFilterContext (for dashboard view)
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
    
    // Apply category filters - important part for Category Distribution
    if (selectedCategories && selectedCategories.length > 0) {
      console.log("Applying categories filter:", selectedCategories);
      filtered = filtered.filter(report => 
        selectedCategories.includes(report.category)
      );
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
    
    // When categoryOnly is true, we only apply category filters (already done above)
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
    selectedCategories,
    categoryOnly,
    isStandalone
  ]);

  // Get coordinates for each report - enhanced to dynamically generate coordinates if not found
  const getCoordinates = (location: string): [number, number] => {
    if (location in sampleLocations) {
      return sampleLocations[location];
    }
    
    // Generate deterministic coordinates for unknown locations
    return generateRandomCoordinates(location);
  };

  // Export reports to CSV
  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      toast.error("No hay reportes para exportar");
      return;
    }
    
    // Define CSV headers based on report properties
    const headers = [
      "ID", 
      "Título", 
      "Descripción", 
      "Estado", 
      "Prioridad", 
      "Categoría", 
      "Ubicación", 
      "Fecha de Creación", 
      "Latitud", 
      "Longitud"
    ].join(",");
    
    // Convert each report to CSV row
    const csvRows = filteredReports.map(report => {
      const coordinates = getCoordinates(report.location);
      // Check if properties exist before accessing them to avoid undefined errors
      const safeTitle = report.title ? report.title.replace(/"/g, '""') : "";
      const safeDescription = report.description ? report.description.replace(/"/g, '""') : "";
      const safeLocation = report.location ? report.location.replace(/"/g, '""') : "";
      
      return [
        report.id || "",
        `"${safeTitle}"`,
        `"${safeDescription}"`,
        report.status || "",
        report.priority || "",
        report.category || "",
        `"${safeLocation}"`,
        report.createdAt ? new Date(report.createdAt).toISOString() : "",
        coordinates[0],
        coordinates[1]
      ].join(",");
    });
    
    // Combine headers and rows
    const csvContent = [headers, ...csvRows].join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Set file name based on current filter
    let fileName = "todos_los_reportes.csv";
    if (isStandalone && filterStatus) {
      if (filterStatus === "open") fileName = "reportes_abiertos.csv";
      else if (filterStatus === "progress") fileName = "reportes_en_progreso.csv";
      else if (filterStatus === "resolved") fileName = "reportes_resueltos.csv";
      else fileName = "todos_los_reportes.csv";
    } else if (selectedCategories.length > 0) {
      fileName = `reportes_${selectedCategories.join('_')}.csv`;
    } else if (selectedCategory) {
      fileName = `reportes_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}.csv`;
    }
    
    // Configure link for download
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    
    // Add to document, click to download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Notify user
    toast.success(`Exportación completada: ${fileName}`);
  };

  // Add event listener for export button click
  useEffect(() => {
    const handleExportEvent = () => {
      console.log("Export event triggered, exporting reports:", filteredReports.length);
      exportToCSV();
    };
    
    document.addEventListener("export-map-data", handleExportEvent);
    
    return () => {
      document.removeEventListener("export-map-data", handleExportEvent);
    };
  }, [filteredReports]);

  // Log information about the displayed reports
  useEffect(() => {
    console.log(`Map showing ${filteredReports.length} reports out of ${reports.length} total`);
    
    // Log the locations that are being displayed on the map
    const locations = filteredReports.map(report => report.location);
    console.log("Locations being displayed:", [...new Set(locations)]);
  }, [filteredReports, reports]);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer 
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {filteredReports.map((report, index) => (
          <Marker 
            key={index}
            position={getCoordinates(report.location)}
            icon={getReportIcon(report.status)}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold">{report.title}</h3>
                <p className="text-sm mt-1">Estado: {report.status}</p>
                <p className="text-sm">Ubicación: {report.location}</p>
                <p className="text-sm">Categoría: {report.category}</p>
                <p className="text-sm">Prioridad: {report.priority}</p>
                <p className="text-sm">Fecha: {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
