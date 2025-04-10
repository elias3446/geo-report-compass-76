import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Link } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Sector
} from "recharts";
import StatCard from "@/components/ui/StatCard";
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MapPin, 
  Users,
  CalendarIcon,
  Edit,
  Eye,
  FilterX
} from "lucide-react";
import MapView from "@/components/map/MapView";
import { useEffect, useState, useMemo, useRef } from "react";
import { getReports, getReportsStats, getReportLocationHotspots, getAllActivities, Activity } from "@/services/reportService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeFilterProvider, useTimeFilter } from "@/context/TimeFilterContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

interface ReportTimeData {
  name: string;
  open: number;
  closed: number;
  inProgress: number;
}

const DashboardContent = () => {
  const { 
    timeFrame, 
    selectedYear, 
    selectedMonth, 
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports,
    selectedCategory,
    setTimeFrame,
    setSelectedYear,
    setSelectedMonth,
    setSelectedDay,
    setShowOpenReports,
    setShowClosedReports,
    setShowInProgressReports,
    setSelectedCategory
  } = useTimeFilter();
  
  const [stats, setStats] = useState({
    totalReports: 0,
    openIssues: 0,
    resolvedIssues: 0,
    averageResponse: "0 days"
  });
  
  const [reportsByCategory, setReportsByCategory] = useState([]);
  const [reportsByTimeFrame, setReportsByTimeFrame] = useState<ReportTimeData[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [locationHotspots, setLocationHotspots] = useState([]);
  
  const [allReports, setAllReports] = useState<any[]>([]);
  
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  
  const [activeReportTab, setActiveReportTab] = useState("reports");
  
  const pieChartRef = useRef<HTMLDivElement | null>(null);

  const months = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeReportTab === "categories" && 
          pieChartRef.current && 
          !pieChartRef.current.contains(event.target as Node) && 
          selectedCategory) {
        setSelectedCategory(null);
        setActiveIndex(undefined);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pieChartRef, selectedCategory, activeReportTab, setSelectedCategory]);

  useEffect(() => {
    if (activeReportTab === "reports") {
      setSelectedCategory(null);
      setActiveIndex(undefined);
    } else if (activeReportTab === "categories") {
      setShowOpenReports(true);
      setShowClosedReports(true);
      setShowInProgressReports(true);
    }
  }, [activeReportTab, setSelectedCategory, setShowOpenReports, setShowClosedReports, setShowInProgressReports]);

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

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" className="text-xs">{`${value} reports`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" className="text-xs">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    if (!selectedCategory) {
      setActiveIndex(undefined);
    }
  };

  const onPieClick = (_: any, index: number) => {
    setActiveIndex(index);
    if (reportsByCategory[index]) {
      setSelectedCategory(reportsByCategory[index].name);
    }
  };

  useEffect(() => {
    if (selectedMonth !== undefined && selectedYear !== undefined) {
      const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      const daysArray = Array.from({ length: days }, (_, i) => i + 1);
      setDaysInMonth(daysArray);
      
      if (selectedDay > days) {
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
    
    if (selectedYear) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getFullYear() === selectedYear;
      });
    }
    
    if (timeFrame === "month" && selectedMonth !== undefined) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === selectedMonth;
      });
      
      const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        timeFrameData[i.toString()] = { name: i.toString(), open: 0, closed: 0, inProgress: 0 };
      }
    } else if (timeFrame === "week" && selectedMonth !== undefined) {
      filteredReports = filteredReports.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate.getMonth() === selectedMonth;
      });
      
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      days.forEach(day => {
        timeFrameData[day] = { name: day, open: 0, closed: 0, inProgress: 0 };
      });
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

  const refreshDashboardData = () => {
    const reports = getReports();
    console.log("All reports loaded:", reports.length);
    setAllReports(reports);
    
    const { 
      totalReports, 
      openIssues, 
      resolvedIssues, 
      inProgressIssues,
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

  const renderTimePeriodSelectors = () => {
    if (timeFrame === "year") {
      return (
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    } 
    
    if (timeFrame === "month" || timeFrame === "week") {
      return (
        <div className="flex flex-wrap space-x-2 items-center">
          <div className="flex items-center space-x-2 mb-2 sm:mb-0">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Month:</span>
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    if (timeFrame === "day") {
      return (
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Year:</span>
            <Select
              value={selectedYear?.toString()}
              onValueChange={(value) => setSelectedYear(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Month:</span>
            <Select
              value={selectedMonth?.toString()}
              onValueChange={(value) => setSelectedMonth(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Day:</span>
            <Select
              value={selectedDay?.toString()}
              onValueChange={(value) => setSelectedDay(parseInt(value))}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {daysInMonth.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      );
    }
    
    return null;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "report_created":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "report_updated":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "report_resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "report_assigned":
        return <Users className="h-4 w-4 text-purple-500" />;
      case "priority_changed":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      case "category_changed":
        return <Edit className="h-4 w-4 text-indigo-500" />;
      case "location_changed":
        return <MapPin className="h-4 w-4 text-pink-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Reports"
          value={stats.totalReports.toString()}
          description="All time submitted reports"
          icon={FileText}
          change={{ value: "12%", positive: true }}
        />
        <StatCard 
          title="Open Issues"
          value={stats.openIssues.toString()}
          description="Pending resolution"
          icon={AlertCircle}
          iconColor="text-yellow-500"
          change={{ value: "5%", positive: false }}
        />
        <StatCard 
          title="Resolved Issues"
          value={stats.resolvedIssues.toString()}
          description="Successfully addressed"
          icon={CheckCircle2}
          iconColor="text-green-500"
          change={{ value: "18%", positive: true }}
        />
        <StatCard 
          title="Average Response"
          value={stats.averageResponse}
          description="Time to first action"
          icon={Clock}
          iconColor="text-blue-500"
          change={{ value: "0.5 days", positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Tabs 
          defaultValue="reports" 
          onValueChange={setActiveReportTab}
        >
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="reports">Reports Overview</TabsTrigger>
            <TabsTrigger value="categories">Category Distribution</TabsTrigger>
          </TabsList>
          <TabsContent value="reports" className="p-0 mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div>
                    <CardTitle>Reports Activity</CardTitle>
                    <CardDescription>
                      Number of opened and resolved reports over time
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Toggle
                      pressed={showOpenReports}
                      onPressedChange={setShowOpenReports}
                      variant="outline"
                      className="border-blue-300 data-[state=on]:bg-blue-100 data-[state=on]:text-blue-700"
                      onClick={() => setShowOpenReports(!showOpenReports)}
                    >
                      Open
                    </Toggle>
                    <Toggle
                      pressed={showInProgressReports}
                      onPressedChange={setShowInProgressReports}
                      variant="outline"
                      className="border-yellow-300 data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-700"
                      onClick={() => setShowInProgressReports(!showInProgressReports)}
                    >
                      In Progress
                    </Toggle>
                    <Toggle
                      pressed={showClosedReports}
                      onPressedChange={setShowClosedReports}
                      variant="outline"
                      className="border-green-300 data-[state=on]:bg-green-100 data-[state=on]:text-green-700"
                      onClick={() => setShowClosedReports(!showClosedReports)}
                    >
                      Closed
                    </Toggle>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 gap-2">
                  <Tabs defaultValue={timeFrame} onValueChange={handleTimeFrameChange}>
                    <TabsList>
                      <TabsTrigger value="day">Day</TabsTrigger>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
                    </TabsList>
                  </Tabs>
                  
                  {renderTimePeriodSelectors()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={reportsByTimeFrame}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {showOpenReports && (
                        <Line
                          type="monotone"
                          dataKey="open"
                          name="Open Reports"
                          stroke="#0EA5E9"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {showInProgressReports && (
                        <Line
                          type="monotone"
                          dataKey="inProgress"
                          name="In Progress Reports"
                          stroke="#FFBB28"
                          activeDot={{ r: 8 }}
                        />
                      )}
                      {showClosedReports && (
                        <Line 
                          type="monotone" 
                          dataKey="closed" 
                          name="Closed Reports"
                          stroke="#10B981" 
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="categories" className="p-0 mt-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
                  <div>
                    <CardTitle>Reports by Category</CardTitle>
                    <CardDescription>
                      Distribution of reports across different categories
                    </CardDescription>
                  </div>
                  {selectedCategory && (
                    <Badge 
                      variant="outline" 
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer"
                      onClick={() => {
                        setSelectedCategory(null);
                        setActiveIndex(undefined);
                      }}
                    >
                      Filtering by: {selectedCategory} × Clear
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80" ref={pieChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={reportsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => activeIndex !== undefined ? '' : `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                        onClick={onPieClick}
                      >
                        {reportsByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                            style={{ cursor: 'pointer' }}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center text-sm">
                  <p className="text-muted-foreground mb-2">
                    Click on a category to filter the map view
                  </p>
                  {selectedCategory && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(null);
                        setActiveIndex(undefined);
                      }}
                      className="flex items-center"
                    >
                      <FilterX className="h-4 w-4 mr-2" />
                      Clear category filter
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
              <div>
                <CardTitle>Report Locations</CardTitle>
                <CardDescription>
                  Geographic distribution of reported issues
                </CardDescription>
              </div>
              {selectedCategory && activeReportTab === "categories" && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                  <span>Showing: {selectedCategory}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => {
                      setSelectedCategory(null);
                      setActiveIndex(undefined);
                    }}
                  >
                    <FilterX className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <MapView 
              height="330px" 
              categoryOnly={activeReportTab === "categories"}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest updates and submitted reports
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                Real-time updates
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  getAllActivities().map((activity) => (
                    <Alert key={activity.id} variant="default" className="transition-all duration-300 animate-in fade-in">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <AlertTitle className="text-sm font-medium">
                            {activity.title}
                          </AlertTitle>
                          <AlertDescription className="text-xs mt-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <span>{activity.description}</span>
                              <div className="flex items-center space-x-2 mt-1 sm:mt-0">
                                <span className="text-muted-foreground">
                                  {activity.time}
                                </span>
                                <Link 
                                  to={`/reports/${activity.relatedReportId}`} 
                                  className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span className="text-xs">View</span>
                                </Link>
                              </div>
                            </div>
                          </AlertDescription>
                        </div>
                      </div>
                    </Alert>
                  ))
                ) : (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-md">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Hotspot Locations
            </CardTitle>
            <CardDescription>
              Areas with the highest number of reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {locationHotspots.length > 0 ? (
                locationHotspots.map((location, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium">{location.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold">{location.count}</span>
                      <span className="text-xs text-muted-foreground ml-1">reports</span>
                    </div>
                  </div>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-4 w-4 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DashboardView = () => {
  return (
    <TimeFilterProvider>
      <DashboardContent />
    </TimeFilterProvider>
  );
};

export default DashboardView;
