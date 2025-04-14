import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTimeFilter } from "@/context/TimeFilterContext";
import { 
  ChevronDown, 
  Filter, 
  PlusCircle, 
  Search,
  ArrowUpDown,
  Download,
  X
} from "lucide-react";
import { toast } from "sonner";
import { getReports, Report } from "@/services/reportService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortConfig = {
  key: keyof Report;
  direction: 'asc' | 'desc';
} | null;

const ReportList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFromUrl = searchParams.get('status');
  
  const [reports, setReports] = useState<Report[]>([]);
  const [allReports, setAllReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(statusFromUrl);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedCategories, toggleCategory } = useTimeFilter();
  
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [filterValue, setFilterValue] = useState<string>("");

  useEffect(() => {
    setStatusFilter(statusFromUrl);
  }, [statusFromUrl]);
  
  useEffect(() => {
    const reportData = getReports();
    setAllReports(reportData);
    
    let filteredReports = [...reportData];
    
    if (statusFilter) {
      filteredReports = filteredReports.filter(report => 
        report.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    if (selectedCategories && selectedCategories.length > 0) {
      filteredReports = filteredReports.filter(report => 
        selectedCategories.includes(report.category)
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      
      filteredReports = filteredReports.filter(report => {
        if (report.title.toLowerCase().includes(query)) return true;
        if (report.category.toLowerCase().includes(query)) return true;
        if (report.status.toLowerCase().includes(query)) return true;
        if (report.priority.toLowerCase().includes(query)) return true;
        if (report.location.toLowerCase().includes(query)) return true;
        const reportDate = new Date(report.createdAt).toISOString().split('T')[0];
        if (reportDate.includes(query)) return true;
        const dateOptions = { 
          year: 'numeric' as const, 
          month: 'short' as const, 
          day: 'numeric' as const 
        };
        const formattedDate = new Date(report.createdAt)
          .toLocaleDateString('es-MX', dateOptions)
          .toLowerCase();
        if (formattedDate.includes(query)) return true;
        return false;
      });
    }
    
    // Apply specific filter if both filter type and value are selected
    if (selectedFilter && filterValue) {
      filteredReports = filteredReports.filter(report => {
        const value = report[selectedFilter as keyof Report];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(filterValue.toLowerCase());
        } else if (selectedFilter === 'createdAt') {
          // Fix TypeScript error by properly type checking
          const dateValue = value as unknown as string;
          const reportDateStr = new Date(dateValue).toLocaleDateString('es-MX');
          return reportDateStr.includes(filterValue);
        }
        return false;
      });
    }
    
    if (sortConfig) {
      filteredReports.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setReports(filteredReports);
  }, [refreshKey, statusFilter, searchQuery, sortConfig, selectedCategories, selectedFilter, filterValue]);

  const refreshReports = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshReports();
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    refreshReports();
  }, []);

  const handleStatusFilter = (status: string | null) => {
    setStatusFilter(status);
    
    if (status) {
      setSearchParams({ status });
    } else {
      setSearchParams({});
    }
    
    toast(`Filtered by status: ${status || 'All'}`);
  };

  const handleSort = (key: keyof Report) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
    setSelectedFilter(key);
    setFilterValue("");
    toast(`Sorted by ${key} ${direction === 'asc' ? 'ascending' : 'descending'}`);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter(null);
    setSortConfig(null);
    setSearchParams({});
    setSelectedFilter("");
    setFilterValue("");
    if (selectedCategories && selectedCategories.length > 0) {
      selectedCategories.forEach(category => toggleCategory(category));
    }
    toast("All filters cleared");
  };

  // Get unique filter values for the selected filter type
  const getFilterOptions = () => {
    if (!selectedFilter) return [];
    
    const uniqueValues = new Set<string>();
    
    allReports.forEach(report => {
      const value = report[selectedFilter as keyof Report];
      if (typeof value === 'string') {
        uniqueValues.add(value);
      } else if (selectedFilter === 'createdAt') {
        // Fix TypeScript error by properly type checking
        const dateValue = value as unknown as string;
        const dateStr = new Date(dateValue).toLocaleDateString('es-MX');
        uniqueValues.add(dateStr);
      }
    });
    
    return Array.from(uniqueValues).sort();
  };

  const filterOptions = getFilterOptions();

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    toast(`Filtered by ${selectedFilter}: ${value}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "Resolved":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 hover:bg-red-200";
      case "Medium":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      case "Low":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Export reports to CSV
  const handleExportReports = () => {
    try {
      if (reports.length === 0) {
        toast("Nothing to export", {
          description: "There are no reports matching your current filters."
        });
        return;
      }
      
      const headers = ['ID', 'Title', 'Category', 'Status', 'Priority', 'Location', 'Assigned To', 'Created At'];
      
      const reportsCsv = reports.map(report => [
        report.id,
        report.title,
        report.category,
        report.status,
        report.priority,
        report.location,
        report.assignedTo,
        formatDate(report.createdAt)
      ]);
      
      reportsCsv.unshift(headers);
      
      const csvContent = reportsCsv.map(row => 
        row.map(field => {
          if (String(field).includes(',') || String(field).includes('"') || String(field).includes('\n')) {
            return `"${String(field).replace(/"/g, '""')}"`;
          }
          return String(field);
        }).join(',')
      ).join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      const url = URL.createObjectURL(blob);
      
      let filename = 'reports';
      if (statusFilter) {
        filename += `_${statusFilter.toLowerCase().replace(/\s+/g, '_')}`;
      }
      if (searchQuery) {
        filename += `_search_${searchQuery.toLowerCase().replace(/\s+/g, '_')}`;
      }
      filename += `_${new Date().toISOString().split('T')[0]}.csv`;
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast("Export successful", {
        description: `${reports.length} reports exported to CSV`
      });
    } catch (error) {
      console.error("Export error:", error);
      toast("Export failed", {
        description: "There was an error exporting the reports. Please try again."
      });
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <div>
            <CardTitle>Reports</CardTitle>
            <CardDescription>
              Manage and monitor all reported issues
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Link to="/new-report">
              <Button className="flex items-center">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Status
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleStatusFilter(null)}>
                  All Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Open")}>
                  Open Reports
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("In Progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusFilter("Resolved")}>
                  Resolved
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center hidden sm:flex"
              onClick={handleExportReports}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <div className="relative flex-grow">
              <div className="flex items-center w-full">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Search reports by title, category, status, priority, location or date..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            {searchQuery && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="flex items-center">
                Clear Filters
              </Button>
            )}
            
            <Select 
              onValueChange={(value) => handleSort(value as keyof Report)}
              value={sortConfig?.key as string || ""}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Sort by Title</SelectItem>
                <SelectItem value="category">Sort by Category</SelectItem>
                <SelectItem value="status">Sort by Status</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
                <SelectItem value="location">Sort by Location</SelectItem>
                <SelectItem value="createdAt">Sort by Date</SelectItem>
              </SelectContent>
            </Select>
            
            {selectedFilter && (
              <Select 
                onValueChange={handleFilterChange}
                value={filterValue}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Filter by ${selectedFilter}...`} />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center sm:hidden"
              onClick={handleExportReports}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: {searchQuery}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSearchQuery("")}
                >
                  &times;
                </Button>
              </Badge>
            )}
            {statusFilter && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Status: {statusFilter}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleStatusFilter(null)}
                >
                  &times;
                </Button>
              </Badge>
            )}
            {selectedCategories?.map(category => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                Category: {category}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => toggleCategory(category)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {selectedFilter && filterValue && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedFilter}: {filterValue}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setFilterValue("")}
                >
                  &times;
                </Button>
              </Badge>
            )}
            {sortConfig && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Sorted by: {sortConfig.key} ({sortConfig.direction})
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSortConfig(null)}
                >
                  &times;
                </Button>
              </Badge>
            )}
          </div>
        </div>
        <div className="rounded-md border overflow-hidden">
          <ScrollArea className="h-[calc(100vh-20rem)] pr-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort('title')} className="cursor-pointer">
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('category')} className="hidden md:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('status')} className="cursor-pointer">
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('priority')} className="hidden md:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Priority
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('location')} className="hidden lg:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort('createdAt')} className="hidden lg:table-cell cursor-pointer">
                    <div className="flex items-center">
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">
                        <Link to={`/reports/${report.id}`} className="hover:underline">
                          {report.title}
                        </Link>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{report.category}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className={getPriorityColor(report.priority)}>
                          {report.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{report.location}</TableCell>
                      <TableCell className="hidden lg:table-cell">{formatDate(report.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No reports found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportList;
