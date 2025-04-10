
import AppLayout from "@/components/layout/AppLayout";
import MapView from "@/components/map/MapView";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { TimeFilterProvider } from "@/context/TimeFilterContext";

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();
  
  // Handle export button click
  const handleExport = () => {
    // Create a simple event that will trigger the export function in the MapView component
    const exportEvent = new CustomEvent("export-map-data");
    document.dispatchEvent(exportEvent);
    
    // Display toast message with information about which filter is being exported
    const filterName = 
      activeFilter === "all" ? "All Reports" :
      activeFilter === "open" ? "Open Reports" :
      activeFilter === "progress" ? "In Progress Reports" :
      "Resolved Reports";
    
    toast({
      title: "Export started",
      description: `Your ${filterName} data is being downloaded as CSV`,
      duration: 3000,
    });
  };
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
        <p className="text-muted-foreground mt-1">
          Geographic visualization of all reports
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveFilter}>
            <TabsList>
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export {activeFilter === "all" ? "All" : 
                      activeFilter === "open" ? "Open" : 
                      activeFilter === "progress" ? "In Progress" : 
                      "Resolved"}
            </Button>
          </div>
        </div>
        
        <Card className="shadow-md">
          <CardContent className="p-0">
            <TimeFilterProvider>
              <MapView height="70vh" filterStatus={activeFilter} />
            </TimeFilterProvider>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>How to use the map</CardTitle>
            <CardDescription>
              Navigate and interact with geographic report data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-2">
                <h3 className="font-medium">Navigation</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Click and drag to move around</li>
                  <li>Scroll to zoom in and out</li>
                  <li>Double-click to zoom in</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Reports</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Click markers to view report details</li>
                  <li>Use tabs to filter reports by status</li>
                  <li>Color indicates report status</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Tools</h3>
                <ul className="list-disc list-inside text-muted-foreground">
                  <li>Use Export to download CSV data</li>
                  <li>Red markers: Open reports</li>
                  <li>Yellow markers: In Progress reports</li>
                  <li>Green markers: Resolved reports</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default MapPage;
