import { useState, useEffect, useMemo } from "react";
import { getReports } from "@/services/reportService";

// Create a function to safely access the TimeFilterContext
const safelyUseTimeFilter = () => {
  try {
    // Dynamic import to avoid direct reference that would cause the error
    const { useTimeFilter } = require("@/context/TimeFilterContext");
    return useTimeFilter();
  } catch (error) {
    // Return default values if the hook isn't available
    return {
      timeFrame: "month",
      selectedYear: new Date().getFullYear(),
      selectedMonth: new Date().getMonth(),
      selectedDay: undefined,
      showOpenReports: true,
      showClosedReports: true,
      showInProgressReports: true,
      selectedCategory: null,
      selectedCategories: []
    };
  }
};

interface TimeFiltersProps {
  timeFrame?: "day" | "week" | "month" | "year";
  selectedYear?: number;
  selectedMonth?: number;
  selectedDay?: number;
  showOpenReports?: boolean;
  showClosedReports?: boolean;
  showInProgressReports?: boolean;
}

export interface UseMapReportsProps {
  filterStatus?: string;
  categoryOnly?: boolean;
  isStandalone?: boolean;
  timeFilters?: TimeFiltersProps;
  selectedCategories?: string[];
}

export const useMapReports = ({ 
  filterStatus, 
  categoryOnly = false, 
  isStandalone = false,
  timeFilters,
  selectedCategories: propSelectedCategories = []
}: UseMapReportsProps = {}) => {
  const [reports, setReports] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  // Use default filter values when isStandalone or catch TimeFilter errors
  const contextFilterValues = safelyUseTimeFilter();

  // Prioritize passed props over context values
  const timeFrame = timeFilters?.timeFrame || contextFilterValues.timeFrame;
  const selectedYear = timeFilters?.selectedYear !== undefined ? timeFilters.selectedYear : contextFilterValues.selectedYear;
  const selectedMonth = timeFilters?.selectedMonth !== undefined ? timeFilters.selectedMonth : contextFilterValues.selectedMonth;
  const selectedDay = timeFilters?.selectedDay || contextFilterValues.selectedDay;
  const showOpenReports = timeFilters?.showOpenReports !== undefined ? timeFilters.showOpenReports : contextFilterValues.showOpenReports;
  const showClosedReports = timeFilters?.showClosedReports !== undefined ? timeFilters.showClosedReports : contextFilterValues.showClosedReports;
  const showInProgressReports = timeFilters?.showInProgressReports !== undefined ? timeFilters.showInProgressReports : contextFilterValues.showInProgressReports;

  // Prioritize passed categories over context categories
  const selectedCategories = propSelectedCategories.length > 0 
    ? propSelectedCategories 
    : contextFilterValues.selectedCategories || [];

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
    console.log("Current time filters - Year:", selectedYear, "Month:", selectedMonth, "Day:", selectedDay);
    console.log("Status filters - Open:", showOpenReports, "In Progress:", showInProgressReports, "Closed:", showClosedReports);
    console.log("Mode - Category Only:", categoryOnly, "Is Standalone:", isStandalone);
    
    let filtered = reports;
    
    // If this is a standalone map (from the Map page), only apply the filterStatus
    if (isStandalone && filterStatus) {
      if (filterStatus === "open") {
        filtered = filtered.filter(report => report.status === "Open");
      } else if (filterStatus === "progress") {
        filtered = filtered.filter(report => report.status === "In Progress");
      } else if (filterStatus === "resolved") {
        filtered = filtered.filter(report => report.status === "Resolved");
      }
      return filtered;
    }
    
    // Apply time-based filters (for dashboard view)
    if (!categoryOnly) {
      if (selectedYear !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getFullYear() === selectedYear;
        });
      }
  
      if ((timeFrame === "month" || timeFrame === "week") && selectedMonth !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getMonth() === selectedMonth;
        });
      } else if (timeFrame === "day" && selectedMonth !== undefined && selectedDay !== undefined) {
        filtered = filtered.filter(report => {
          const reportDate = new Date(report.createdAt);
          return reportDate.getMonth() === selectedMonth && 
                reportDate.getDate() === selectedDay;
        });
      }
    }
    
    // Apply category filters if we're in category mode OR if categories are selected in any mode
    if (categoryOnly) {
      if (selectedCategories && selectedCategories.length > 0) {
        console.log("Applying categories filter in category mode:", selectedCategories);
        filtered = filtered.filter(report => 
          selectedCategories.includes(report.category)
        );
      }
    } else {
      // If not in category mode but still have categories selected (from dashboard)
      if (selectedCategories && selectedCategories.length > 0 && !isStandalone) {
        console.log("Applying categories filter in time mode:", selectedCategories);
        filtered = filtered.filter(report => 
          selectedCategories.includes(report.category)
        );
      }
    }
    
    // Then apply status filters if not in standalone map
    if (!isStandalone) {
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
      
      // Otherwise use the global filter context for reports in time mode view
      filtered = filtered.filter(report => {
        if (report.status === "Open" && showOpenReports) return true;
        if (report.status === "In Progress" && showInProgressReports) return true;
        if (report.status === "Resolved" && showClosedReports) return true;
        return false;
      });
    }
    
    console.log(`Final filtered reports: ${filtered.length} after applying all filters`);
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
    selectedCategories,
    categoryOnly,
    isStandalone
  ]);

  // Log information about the displayed reports
  useEffect(() => {
    console.log(`Map showing ${filteredReports.length} reports out of ${reports.length} total`);
    
    // Log the locations that are being displayed on the map
    const locations = filteredReports.map(report => report.location);
    console.log("Locations being displayed:", [...new Set(locations)]);
  }, [filteredReports, reports]);

  return { reports, filteredReports };
};
