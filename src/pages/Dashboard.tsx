
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '@/contexts/ReportContext';
import { useTimeFilter } from '@/context/TimeFilterContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowRight,
  CircleX,
  FileDown,
  X
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import MapView from '@/components/map/MapView';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import ReportCard from '@/components/ReportCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const Dashboard = () => {
  const { reports } = useReports();
  const { selectedCategories, toggleCategory } = useTimeFilter();
  const navigate = useNavigate();
  
  const totalReports = reports.length;
  const approvedReports = reports.filter(r => r.status === 'approved').length;
  const pendingReports = reports.filter(r => r.status === 'submitted').length;
  const draftReports = reports.filter(r => r.status === 'draft').length;
  const rejectedReports = reports.filter(r => r.status === 'rejected').length;
  
  const categoryData = reports.reduce((acc, report) => {
    const existing = acc.find(item => item.category === report.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ category: report.category, count: 1 });
    }
    return acc;
  }, [] as { category: string; count: number }[]);
  
  categoryData.sort((a, b) => b.count - a.count);
  
  const recentReports = [...reports]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 2);
  
  const handleExportMapData = () => {
    const exportEvent = new Event('export-map-data');
    document.dispatchEvent(exportEvent);
    toast.success('Exportando datos geográficos...');
  };

  const handleExportLocationData = () => {
    // Create and dispatch the export event specifically for location data
    const exportEvent = new Event('export-map-data');
    document.dispatchEvent(exportEvent);
    toast.success('Exportando datos de ubicaciones...');
  };
  
  const handleCategoryClick = (category: string) => {
    toggleCategory(category);
  };
  
  // Calcular el total de reportes para las categorías seleccionadas
  const getSelectedCategoriesInfo = () => {
    if (selectedCategories.length === 0) return null;
    
    const selectedCategoriesData = categoryData.filter(cat => 
      selectedCategories.includes(cat.category)
    );
    
    const totalSelectedReports = selectedCategoriesData.reduce(
      (sum, cat) => sum + cat.count, 0
    );
    
    const totalAllReports = categoryData.reduce(
      (sum, cat) => sum + cat.count, 0
    );
    
    return {
      categories: selectedCategoriesData,
      totalReports: totalSelectedReports,
      percentage: ((totalSelectedReports / totalAllReports) * 100).toFixed(1)
    };
  };
  
  // Información de las categorías seleccionadas
  const selectedCategoriesInfo = getSelectedCategoriesInfo();
  
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your GeoReport Dashboard</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => navigate('/reports/new')}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">Geographic reports in the system</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-geo-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedReports}</div>
            <div className="flex items-center pt-1">
              <Progress value={(approvedReports / totalReports) * 100} className="h-2" />
              <span className="text-xs text-muted-foreground ml-2">
                {Math.round((approvedReports / totalReports) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-geo-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingReports}</div>
            <div className="flex items-center pt-1">
              <Progress value={(pendingReports / totalReports) * 100} className="h-2" />
              <span className="text-xs text-muted-foreground ml-2">
                {Math.round((pendingReports / totalReports) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Drafts & Rejected</CardTitle>
            <div className="flex gap-1">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <CircleX className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{draftReports + rejectedReports}</div>
            <div className="flex items-center pt-1">
              <Progress value={((draftReports + rejectedReports) / totalReports) * 100} className="h-2" />
              <span className="text-xs text-muted-foreground ml-2">
                {Math.round(((draftReports + rejectedReports) / totalReports) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 relative">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Geographic Overview</CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={handleExportMapData}
                >
                  <FileDown className="h-4 w-4" />
                  Export Data
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => navigate('/reports')}
                >
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardDescription>
              Interactive map of all report locations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <MapView ignoreFilters={true} />
          </CardContent>
          <div className="px-6 py-4">
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md py-6 text-lg"
              onClick={handleExportMapData}
            >
              <FileDown className="h-6 w-6" />
              EXPORTAR DATOS DEL MAPA
            </Button>
          </div>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Reports by Category</CardTitle>
            <CardDescription>
              {selectedCategories.length > 0 
                ? `${selectedCategories.length} ${selectedCategories.length === 1 ? 'category' : 'categories'} selected` 
                : "Click bars to filter by category"}
            </CardDescription>
            {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedCategories.map(category => (
                  <Badge 
                    key={category} 
                    variant="secondary"
                    className="flex items-center gap-1 cursor-pointer"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                    <X className="h-3 w-3 ml-1" />
                  </Badge>
                ))}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs px-2 h-6"
                  onClick={() => selectedCategories.forEach(cat => toggleCategory(cat))}
                >
                  Clear all
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis 
                    type="category" 
                    dataKey="category" 
                    tick={({ y, payload }) => {
                      const isSelected = selectedCategories.includes(payload.value);
                      return (
                        <text 
                          x={0} 
                          y={y} 
                          dy={4} 
                          textAnchor="start" 
                          fill={isSelected ? "#2196F3" : "#666"} 
                          fontWeight={isSelected ? "bold" : "normal"} 
                          fontSize={12}
                          className="cursor-pointer"
                          onClick={() => handleCategoryClick(payload.value)}
                        >
                          {payload.value}
                        </text>
                      );
                    }}
                    width={100}
                  />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill={(data) => selectedCategories.includes(data.category) ? "#1E40AF" : "#2196F3"} 
                    radius={[0, 4, 4, 0]} 
                    barSize={20}
                    onClick={(data) => handleCategoryClick(data.category)}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {/* Centro de la gráfica con información de categorías seleccionadas */}
            <div className="mt-4 bg-gray-50 p-4 rounded-lg border">
              {selectedCategories.length === 0 ? (
                <div className="text-center">
                  <p className="text-lg font-medium">Categorías</p>
                  <p className="text-sm text-muted-foreground">Seleccione una o más categorías para ver detalles</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Categorías seleccionadas ({selectedCategories.length})</h3>
                    <span className="text-sm font-semibold">
                      {selectedCategoriesInfo?.totalReports} reportes ({selectedCategoriesInfo?.percentage}%)
                    </span>
                  </div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedCategoriesInfo?.categories.map(cat => (
                      <div key={cat.category} className="flex justify-between items-center p-2 bg-white rounded shadow-sm">
                        <span>{cat.category}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{cat.count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({((cat.count / (selectedCategoriesInfo?.totalReports || 1)) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => navigate('/reports')}
            >
              View Detailed Breakdown
            </Button>
          </CardFooter>
        </Card>
        
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            variant="default"
            size="lg"
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl px-6 py-8 rounded-full animate-pulse"
            onClick={handleExportMapData}
          >
            <FileDown className="h-8 w-8 mr-2" />
            EXPORTAR DATOS
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Reports</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-1"
                onClick={() => navigate('/reports')}
              >
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Latest geographic reports added to the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentReports.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentReports.map(report => (
                  <ReportCard key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No reports found</h3>
                <p className="text-muted-foreground mt-1">
                  Get started by creating your first geographic report
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/reports/new')}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Report
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Report Locations</CardTitle>
              <CardDescription>
                Geographic distribution of reported issues
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base shadow-lg py-6 mb-8"
              onClick={handleExportLocationData}
            >
              <FileDown className="h-6 w-6 mr-2" />
              EXPORTAR DATOS DE UBICACIONES
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate('/reports/new')}
            >
              Create New Report
              <PlusCircle className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate('/reports')}
            >
              Browse All Reports
              <FileText className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => navigate('/map')}
            >
              Map View
              <MapPin className="h-4 w-4" />
            </Button>

            <div className="mt-8 mb-4">
              <Button
                variant="default"
                size="lg"
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg py-6 relative z-30"
                onClick={handleExportLocationData}
              >
                <FileDown className="h-6 w-6 mr-2" />
                EXPORTAR DATOS DE UBICACIÓN
              </Button>
            </div>
          </CardContent>
          
          <Separator />
          
          <CardHeader>
            <CardTitle>Status Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col items-center p-3 bg-green-50 rounded-md">
                <CheckCircle2 className="h-5 w-5 text-geo-green mb-1" />
                <span className="text-xl font-bold">{approvedReports}</span>
                <span className="text-xs text-muted-foreground">Approved</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-blue-50 rounded-md">
                <Clock className="h-5 w-5 text-geo-blue mb-1" />
                <span className="text-xl font-bold">{pendingReports}</span>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-amber-50 rounded-md">
                <AlertTriangle className="h-5 w-5 text-amber-500 mb-1" />
                <span className="text-xl font-bold">{draftReports}</span>
                <span className="text-xs text-muted-foreground">Drafts</span>
              </div>
              
              <div className="flex flex-col items-center p-3 bg-red-50 rounded-md">
                <CircleX className="h-5 w-5 text-destructive mb-1" />
                <span className="text-xl font-bold">{rejectedReports}</span>
                <span className="text-xs text-muted-foreground">Rejected</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
