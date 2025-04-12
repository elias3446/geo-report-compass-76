
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, ChevronRight } from "lucide-react";

interface Report {
  id: string;
  title: string;
  status: string;
  category: string;
  location: {
    name: string;
    lat: number;
    lng: number;
  };
}

interface LocationListProps {
  reports: Report[];
}

const LocationList = ({ reports }: LocationListProps) => {
  const getReportStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "text-red-500";
      case "In Progress":
        return "text-yellow-500";
      case "Resolved":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              Hotspot Locations
            </CardTitle>
            <CardDescription>
              Live report location history
            </CardDescription>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
            Real-time
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y divide-border">
            {reports.length > 0 ? (
              reports.map((report) => (
                <Link
                  key={report.id}
                  to={`/reports/${report.id}`}
                  className="block hover:bg-muted/50 transition-colors"
                >
                  <div className="p-3 flex items-center gap-3">
                    <div className={`flex-shrink-0 ${getReportStatusColor(report.status)}`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {report.location?.name || "Unknown location"}
                        </h4>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {report.category}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground truncate max-w-[180px] mb-1">
                            {report.title}
                          </p>
                          <div className="flex items-center text-xs text-muted-foreground gap-1">
                            <span>Lat: {report.location?.lat ? report.location.lat.toFixed(2) : "N/A"}</span>
                            <span>Lng: {report.location?.lng ? report.location.lng.toFixed(2) : "N/A"}</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-1 flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-3 flex items-center gap-3">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-grow">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LocationList;
