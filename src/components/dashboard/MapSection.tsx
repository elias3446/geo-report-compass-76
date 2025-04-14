
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import MapView from "@/components/map/MapView";
import { useTimeFilter } from "@/context/TimeFilterContext";

interface MapSectionProps {
  selectedCategories: string[];
  activeReportTab: string;
  handleExportLocationData: () => void;
}

const MapSection = ({
  selectedCategories,
  activeReportTab,
  handleExportLocationData
}: MapSectionProps) => {
  // Access time filter context directly
  const {
    timeFrame,
    selectedYear,
    selectedMonth,
    selectedDay,
    showOpenReports,
    showClosedReports,
    showInProgressReports
  } = useTimeFilter();

  return (
    <Card className="flex flex-col h-full min-h-[500px] lg:min-h-0">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <CardTitle>Report Locations</CardTitle>
            <CardDescription>
              Geographic distribution of reported issues
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategories.length > 0 && activeReportTab === "categories" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {selectedCategories.length > 1 
                  ? `${selectedCategories.length} categories selected`
                  : `Showing: ${selectedCategories[0]}`}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleExportLocationData}
            >
              <Download className="h-4 w-4" />
              Export Map Data
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-grow">
        <div className="h-full min-h-[400px]">
          <MapView 
            height="100%" 
            categoryOnly={activeReportTab === "categories"}
            timeFilters={{
              timeFrame,
              selectedYear,
              selectedMonth,
              selectedDay,
              showOpenReports,
              showClosedReports,
              showInProgressReports
            }}
            selectedCategories={selectedCategories}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapSection;
