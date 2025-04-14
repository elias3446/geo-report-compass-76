import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { getReports, getReportsStats, getReportLocationHotspots, getAllActivities } from "@/services/reportService";
import { useTimeFilter } from "@/context/TimeFilterContext";

export interface ReportTimeData {
  name: string;
  open: number;
  closed: number;
  inProgress: number;
}

export const useDashboardData = () => {
  const { 
    timeFrame, 
    selectedYear, 
    selectedMonth, 
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports,
    selectedCategory,
    selectedCategories,
    setTimeFrame,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    setShowOpenReports,
    setShowClosedReports,
    setShowInProgressReports,
    setSelectedCategory,
    setSelectedCategories,
    toggleCategory
  } = useTimeFilter();
  
  const [stats, setStats] = useState({
    totalReports: 0,
    openIssues: 0,
    resolvedIssues: 0,
    averageResponse: "0 days"
  });
  
  const [reportsByCategory, setReportsByCategory] = useState([]);
  const [reportsByTimeFrame, setReportsByTimeFrame] = useState<ReportTimeData[]>([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [locationHotspots, setLocationHotspots] = useState([]);
  
  const [allReports, setAllReports] = useState<any[]>([]);
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  
  const [activeReportTab, setActiveReportTab] = useState("reports");
  
  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  useEffect(() => {
    if (activeReportTab === "reports") {
      setSelectedCategory(null);
      setSelectedCategories([]);
      setActiveIndex(undefined);
    } else if (activeReportTab === "categories") {
      setShowOpenReports(true);
      setShowClosedReports(true);
      setShowInProgressReports(true);
    }
  }, [activeReportTab, setSelectedCategory, setShowOpenReports, setShowClosedReports, setShowInProgressReports, setSelectedCategories]);

  const getActiveIndices = () => {
    if (!selectedCategories.length) return [];
    
    return reportsByCategory
      .map((cat, index) => ({ index, name: cat.name }))
      .filter(item => selectedCategories.includes(item.name))
      .map(item => item.index);
  };

  const getSelectedCategoryReports = () => {
    if (selectedCategories.length === 0) return allReports;
    
    return allReports.filter(report => 
      selectedCategories.includes(report.category)
    );
  };

  const getMonthShortName = (monthIndex: number): string => {
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][monthIndex];
  };

  const getTimeFrameFormat = (date: Date, timeFrame: string): string => {
    const d = new Date(date);
    switch(timeFrame) {
      case "day":
        return `${d.getHours()}:00`;
      case "week":
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
      case "month":
        return d.getDate().toString();
      case "year":
        return getMonthShortName(d.getMonth());
      default:
        return d.toLocaleDateString();
    }
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(undefined);
  };

  const onPieClick = (_: any, index: number) => {
    if (reportsByCategory[index]) {
      const category = reportsByCategory[index].name;
      toggleCategory(category);
    }
  };

  const handleExportReportsData = () => {
    try {
      if (reportsByTimeFrame.length === 0) {
        toast.info("Nothing to export", {
          description: "There is no report data available to export."
        });
        return;
      }

      let exportData = JSON.parse(JSON.stringify(reportsByTimeFrame));
      
      if (!showOpenReports) {
        exportData = exportData.map((item: any) => {
          const { open, ...rest } = item;
          return rest;
        });
      }
      
      if (!showInProgressReports) {
        exportData = exportData.map((item: any) => {
          const { inProgress, ...rest } = item;
          return rest;
        });
      }
      
      if (!showClosedReports) {
        exportData = exportData.map((item: any) => {
          const { closed, ...rest } = item;
          return rest;
        });
      }
      
      const timeFrameInfo = timeFrame;
      const yearInfo = selectedYear ? `_${selectedYear}` : '';
      const monthInfo = selectedMonth !== undefined ? `_${months[selectedMonth]}` : '';
      const dayInfo = selectedDay ? `_day${selectedDay}` : '';
      
      let headers = ['Time Period'];
      if (showOpenReports) headers.push('Open Reports');
      if (showInProgressReports) headers.push('In Progress Reports');
      if (showClosedReports) headers.push('Closed Reports');
      
      const csvData = exportData.map((row: any) => {
        const csvRow = [row.name];
        if (showOpenReports) csvRow.push(row.open);
        if (showInProgressReports) csvRow.push(row.inProgress);
        if (showClosedReports) csvRow.push(row.closed);
        return csvRow;
      });
      
      csvData.unshift(headers);
      
      const csvContent = csvData.map(row => 
        row.map((field: any) => {
          const stringField = String(field);
          if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        }).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = `reports_${timeFrameInfo}${yearInfo}${monthInfo}${dayInfo}_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Export successful", {
        description: `${reportsByTimeFrame.length} time periods exported to CSV`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: "There was an error exporting the report data. Please try again."
      });
    }
  };

  const handleExportCategoryData = () => {
    try {
      if (reportsByCategory.length === 0) {
        toast.info("Nothing to export", {
          description: "There is no category data available to export."
        });
        return;
      }
      
      const dataToExport = selectedCategories.length > 0
        ? reportsByCategory.filter(cat => selectedCategories.includes(cat.name))
        : reportsByCategory;
      
      const headers = ['Category', 'Reports Count', 'Percentage'];
      
      const totalReports = reportsByCategory.reduce((sum, cat) => sum + cat.value, 0);
      
      const categoryCsv = dataToExport.map(category => [
        category.name,
        category.value,
        `${((category.value / totalReports) * 100).toFixed(2)}%`
      ]);
      
      categoryCsv.unshift(headers);
      
      const csvContent = categoryCsv.map(row => 
        row.map(field => {
          const stringField = String(field);
          if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
            return `"${stringField.replace(/"/g, '""')}"`;
          }
          return stringField;
        }).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const categoryFilter = selectedCategories.length > 0 
        ? `_${selectedCategories.map(c => c.replace(/\s+/g, '_')).join('_and_')}`
        : '';
      const filename = `category_distribution${categoryFilter}_${new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Export successful", {
        description: `${dataToExport.length} categories exported to CSV`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: "There was an error exporting the category data. Please try again."
      });
    }
  };

  const handleExportLocationData = () => {
    try {
      // Get filtered reports based on current filters
      let filtered = [...allReports];
      
      if (activeReportTab === 'categories' && selectedCategories.length > 0) {
        filtered = filtered.filter(report => selectedCategories.includes(report.category));
      } else {
        // Filter by time period
        if (selectedYear) {
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
        
        // Apply status filters
        filtered = filtered.filter(report => {
          if (report.status === "Open" && showOpenReports) return true;
          if (report.status === "In Progress" && showInProgressReports) return true;
          if (report.status === "Resolved" && showClosedReports) return true;
          return false;
        });
      }
      
      // Create exportable data
      const data = filtered.map(report => ({
        id: report.id,
        title: report.title,
        status: report.status,
        category: report.category,
        date: report.createdAt,
        location: report.location,
        tags: report.tags || []
      }));
      
      if (data.length === 0) {
        toast.info("No data to export", {
          description: "There are no map locations matching your current filters."
        });
        return;
      }
      
      const replacer = (key: string, value: any) => value === null ? '' : value;
      const header = Object.keys(data[0] || {});
      const csv = [
        header.join(','),
        ...data.map(row => header.map(fieldName => {
          if (fieldName === 'location') {
            return JSON.stringify(row[fieldName]).replace(/"/g, '""');
          }
          if (fieldName === 'tags') {
            return `"${(row[fieldName] || []).join(';')}"`;
          }
          return JSON.stringify(row[fieldName], replacer).replace(/"/g, '""');
        }).join(','))
      ].join('\r\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const filename = `map-locations-${activeReportTab === 'categories' ? 'by-category' : 'by-timeframe'}_${new Date().toISOString().slice(0, 10)}.csv`;
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Export successful', {
        description: `${data.length} report locations exported to CSV`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export failed", {
        description: "There was an error exporting the map data. Please try again."
      });
    }
  };

  useEffect(() => {
    if (selectedMonth !== undefined && selectedYear !== undefined) {
      const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const daysArray = Array.from({ length: days }, (_, i) => i + 1);
      setDaysInMonth(daysArray);
      
      if (selectedDay && selectedDay > days) {
        setSelectedDay(days);
      } else if (!selectedDay && daysArray.length > 0) {
        setSelectedDay(1);
      }
    }
  }, [selectedMonth, selectedYear, selectedDay, setSelectedDay]);

  useEffect(() => {
    if (allReports && allReports.length > 0) {
      const years = allReports.map(report => new Date(report.createdAt).getFullYear());
      const uniqueYears = Array.from(new Set(years)).sort();
      
      if (uniqueYears.length === 0 || Math.min(...uniqueYears) > new Date().getFullYear()) {
        uniqueYears.unshift(new Date().getFullYear());
      }
      
      setAvailableYears(uniqueYears);
      
      if (uniqueYears.length > 0 && !selectedYear) {
        setSelectedYear(Math.max(...uniqueYears));
      }
    }
  }, [allReports, selectedYear, setSelectedYear]);

  const generateChartData = (): ReportTimeData[] => {
    if (!allReports || !allReports.length) return [];
    
    const reports = [...allReports];
    let timeFrameData: Record<string, ReportTimeData> = {};
    
    let filteredReports = reports;
    
    if (selectedYear !== undefined) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getFullYear() === selectedYear;
      });
    }
    
    if ((timeFrame === "month" || timeFrame === "week") && selectedMonth !== undefined) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === selectedMonth;
      });
      
      if (timeFrame === "month") {
        const daysInMonth = new Date(selectedYear!, selectedMonth + 1, 0).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          timeFrameData[i.toString()] = { name: i.toString(), open: 0, closed: 0, inProgress: 0 };
        }
      } else if (timeFrame === "week") {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        days.forEach(day => {
          timeFrameData[day] = { name: day, open: 0, closed: 0, inProgress: 0 };
        });
      }
    } else if (timeFrame === "year") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      months.forEach(month => {
        timeFrameData[month] = { name: month, open: 0, closed: 0, inProgress: 0 };
      });
    } else if (timeFrame === "day" && selectedMonth !== undefined && selectedDay !== undefined) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === selectedMonth && 
               reportDate.getDate() === selectedDay;
      });
      
      for (let i = 0; i < 24; i++) {
        const hourLabel = `${i}:00`;
        timeFrameData[hourLabel] = { name: hourLabel, open: 0, closed: 0, inProgress: 0 };
      }
    }
    
    console.log(`Filtered reports for ${timeFrame} chart:`, filteredReports.length, 
                `found with year: ${selectedYear}, month: ${selectedMonth !== undefined ? months[selectedMonth] : 'all'}, day: ${selectedDay || 'all'}`);
    
    filteredReports.forEach(report => {
      const reportDate = new Date(report.createdAt);
      const key = getTimeFrameFormat(reportDate, timeFrame);
      
      if (!timeFrameData[key]) {
        timeFrameData[key] = { name: key, open: 0, closed: 0, inProgress: 0 };
      }
      
      if (report.status === "Open") {
        timeFrameData[key].open += 1;
      } else if (report.status === "In Progress") {
        timeFrameData[key].inProgress += 1;
      } else if (report.status === "Resolved") {
        timeFrameData[key].closed += 1;
      }
    });
    
    let dataArray = Object.values(timeFrameData);
    
    if (timeFrame === "day") {
      dataArray.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    } else if (timeFrame === "month") {
      dataArray.sort((a, b) => parseInt(a.name) - parseInt(b.name));
    } else if (timeFrame === "week") {
      const daysOrder: Record<string, number> = { "Sun": 0, "Mon": 1, "Tue": 2, "Wed": 3, "Thu": 4, "Fri": 5, "Sat": 6 };
      dataArray.sort((a, b) => daysOrder[a.name] - daysOrder[b.name]);
    } else if (timeFrame === "year") {
      const monthsOrder: Record<string, number> = { "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, 
                         "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 };
      dataArray.sort((a, b) => monthsOrder[a.name] - monthsOrder[b.name]);
    }
    
    console.log("Sorted data array for chart:", dataArray);
    return dataArray;
  };

  const clearAllSelectedCategories = () => {
    setSelectedCategories([]);
    setSelectedCategory(null);
    setActiveIndex(undefined);
  };

  const refreshDashboardData = () => {
    const reports = getReports();
    console.log("All reports loaded:", reports.length);
    setAllReports(reports);
    
    const { 
      totalReports, 
      openIssues, 
      resolvedIssues, 
      averageResponse,
      reportsByCategory,
      recentActivities,
    } = getReportsStats();
    
    setStats({
      totalReports,
      openIssues,
      resolvedIssues,
      averageResponse
    });
    
    setReportsByCategory(reportsByCategory);
    setRecentActivities(recentActivities);
    setLocationHotspots(getReportLocationHotspots());
  };

  useEffect(() => {
    refreshDashboardData();
  }, [refreshKey]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefreshKey(prevKey => prevKey + 1);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (allReports && allReports.length > 0) {
      console.log(`Regenerating chart data based on timeframe: ${timeFrame}, year: ${selectedYear}, month: ${selectedMonth !== undefined ? months[selectedMonth] : 'all'}, day: ${selectedDay || 'all'}`);
      const timeFrameData = generateChartData();
      setReportsByTimeFrame(timeFrameData);
    }
  }, [timeFrame, selectedYear, selectedMonth, selectedDay, allReports]);

  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value as "day" | "week" | "month" | "year");
  };
  
  return {
    stats,
    reportsByCategory,
    reportsByTimeFrame,
    recentActivities,
    allReports,
    availableYears,
    daysInMonth,
    months,
    activeIndex,
    activeReportTab,
    setActiveReportTab,
    getActiveIndices,
    getSelectedCategoryReports,
    onPieEnter,
    onPieLeave,
    onPieClick,
    handleExportReportsData,
    handleExportCategoryData,
    handleExportLocationData,
    clearAllSelectedCategories,
    handleTimeFrameChange
  };
};
