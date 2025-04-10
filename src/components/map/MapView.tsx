import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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

  // Only use TimeFilterContext if this is not a standalone map (i.e., it's part of dashboard)
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
    isStandalone
  ]);

  // Get coordinates for each report
  const getCoordinates = (location: string): [number, number] => {
    return sampleLocations[location] || defaultCenter;
  };

  // Export reports to CSV
  const exportToCSV = () => {
    if (filteredReports.length === 0) {
      console.log("No reports to export");
      return;
    }
    
    // Define CSV headers based on report properties
    const headers = [
      "ID", 
      "Title", 
      "Description", 
      "Status", 
      "Priority", 
      "Category", 
      "Location", 
      "Created At", 
      "Latitude", 
      "Longitude"
    ].join(",");
    
    // Convert each report to CSV row
    const csvRows = filteredReports.map(report => {
      const coordinates = getCoordinates(report.location);
      return [
        report.id,
        `"${report.title.replace(/"/g, '""')}"`,
        `"${report.description.replace(/"/g, '""')}"`,
        report.status,
        report.priority,
        report.category,
        `"${report.location.replace(/"/g, '""')}"`,
        new Date(report.createdAt).toISOString(),
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
    let fileName = "all_reports.csv";
    if (isStandalone && filterStatus) {
      fileName = `${filterStatus}_reports.csv`;
    } else if (selectedCategory) {
      fileName = `${selectedCategory.toLowerCase()}_reports.csv`;
    }
    
    // Configure link for download
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = "hidden";
    
    // Add to document, click to download, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add event listener for export button click
  useEffect(() => {
    const handleExportEvent = () => {
      exportToCSV();
    };
    
    document.addEventListener("export-map-data", handleExportEvent);
    
    return () => {
      document.removeEventListener("export-map-data", handleExportEvent);
    };
  }, [filteredReports]);

  // Log the filtered reports for debugging
  useEffect(() => {
    if (isStandalone) {
      console.log(`Standalone map showing ${filteredReports.length} reports with filter: ${filterStatus || 'all'}`);
    } else {
      console.log(`Dashboard map showing ${filteredReports.length} reports for ${timeFrame} view with year=${selectedYear}, month=${selectedMonth}, day=${selectedDay}`);
      console.log('Status filters:', { showOpenReports, showInProgressReports, showClosedReports });
      if (selectedCategory) {
        console.log(`Category filter applied: ${selectedCategory}`);
      }
    }
  }, [filteredReports, timeFrame, selectedYear, selectedMonth, selectedDay, showOpenReports, showInProgressReports, showClosedReports, selectedCategory, isStandalone, filterStatus]);

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer 
        style={{ height: "100%", width: "100%" }}
        center={defaultCenter}
        zoom={13}
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
                <p className="text-sm mt-1">Status: {report.status}</p>
                <p className="text-sm">Location: {report.location}</p>
                <p className="text-sm">Category: {report.category}</p>
                <p className="text-sm">Priority: {report.priority}</p>
                <p className="text-sm">Date: {new Date(report.createdAt).toLocaleDateString()}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
