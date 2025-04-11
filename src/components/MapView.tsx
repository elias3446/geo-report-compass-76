
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports, GeoReport } from '@/contexts/ReportContext';
import { 
  MapPin, 
  Navigation, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  CircleX,
  FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MapView = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { reports } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState<GeoReport | null>(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [mapZoom, setMapZoom] = useState(1);

  const handlePinClick = (report: GeoReport) => {
    setSelectedReport(report);
    toast({
      title: "Location Selected",
      description: `Viewing: ${report.title}`,
      duration: 3000,
    });
  };

  const navigateToReport = (id: string) => {
    navigate(`/reports/${id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-geo-green" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-geo-blue" />;
      case 'rejected':
        return <CircleX className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    }
  };

  const handleMapPan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const panStep = 5;
    setMapCenter(prev => {
      const newCenter = { ...prev };
      
      switch (direction) {
        case 'up':
          newCenter.y = Math.max(newCenter.y - panStep, 0);
          break;
        case 'down':
          newCenter.y = Math.min(newCenter.y + panStep, 100);
          break;
        case 'left':
          newCenter.x = Math.max(newCenter.x - panStep, 0);
          break;
        case 'right':
          newCenter.x = Math.min(newCenter.x + panStep, 100);
          break;
      }
      
      return newCenter;
    });
  };

  const handleZoom = (zoomIn: boolean) => {
    setMapZoom(prev => {
      if (zoomIn) {
        return Math.min(prev + 0.2, 3);
      } else {
        return Math.max(prev - 0.2, 0.5);
      }
    });
  };

  useEffect(() => {
    const handleExportMapData = () => {
      const data = reports.map(report => ({
        id: report.id,
        title: report.title,
        status: report.status,
        category: report.category,
        date: report.date,
        location: {
          name: report.location.name,
          lat: report.location.lat,
          lng: report.location.lng
        },
        tags: report.tags
      }));
      
      const replacer = (key: string, value: any) => value === null ? '' : value;
      const header = Object.keys(data[0] || {});
      const csv = [
        header.join(','),
        ...data.map(row => header.map(fieldName => {
          if (fieldName === 'location') {
            return JSON.stringify(row[fieldName]).replace(/"/g, '""');
          }
          if (fieldName === 'tags') {
            return `"${row[fieldName].join(';')}"`;
          }
          return JSON.stringify(row[fieldName], replacer).replace(/"/g, '""');
        }).join(','))
      ].join('\r\n');
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `map-data-${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    document.addEventListener('export-map-data', handleExportMapData);
    
    return () => {
      document.removeEventListener('export-map-data', handleExportMapData);
    };
  }, [reports]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden rounded-lg border border-border bg-card">
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleZoom(true)}
          className="bg-white hover:bg-slate-50"
        >
          <span className="text-xl">+</span>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => handleZoom(false)}
          className="bg-white hover:bg-slate-50"
        >
          <span className="text-xl">-</span>
        </Button>
      </div>
      
      <div className="absolute bottom-4 right-4 z-10">
        <div className="grid grid-cols-3 gap-1">
          <div />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMapPan('up')}
            className="bg-white hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4 rotate-0" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMapPan('left')}
            className="bg-white hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4 -rotate-90" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white hover:bg-slate-50 cursor-move"
          >
            <span className="h-3 w-3 rounded-full bg-slate-300" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMapPan('right')}
            className="bg-white hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4 rotate-90" />
          </Button>
          <div />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => handleMapPan('down')}
            className="bg-white hover:bg-slate-50"
          >
            <Navigation className="h-4 w-4 rotate-180" />
          </Button>
          <div />
        </div>
      </div>

      <div 
        ref={mapContainerRef} 
        className="w-full h-full overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')`,
          backgroundSize: `${mapZoom * 100}%`,
          backgroundPosition: `${mapCenter.x}% ${mapCenter.y}%`,
          transition: 'background-size 0.3s ease-out, background-position 0.3s ease-out'
        }}
      >
        {reports.map(report => {
          const pinLeft = ((report.location.lng + 180) / 360) * 100;
          const pinTop = ((90 - report.location.lat) / 180) * 100;
          
          return (
            <TooltipProvider key={report.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                      selectedReport?.id === report.id ? 'scale-150 z-50' : 'hover:scale-125 z-40'
                    }`}
                    style={{ 
                      left: `${pinLeft}%`, 
                      top: `${pinTop}%` 
                    }}
                    onClick={() => handlePinClick(report)}
                  >
                    <MapPin 
                      className={`h-6 w-6 ${
                        report.status === 'approved' ? 'text-geo-green' : 
                        report.status === 'submitted' ? 'text-geo-blue' : 
                        report.status === 'rejected' ? 'text-destructive' : 
                        'text-amber-500'
                      }`} 
                      strokeWidth={2.5} 
                      fill="white" 
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <p>{report.title}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        
        {selectedReport && (
          <Card className="absolute left-4 bottom-4 w-72 animate-fade-in z-50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-md">{selectedReport.title}</h3>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs">
                  {getStatusIcon(selectedReport.status)}
                  <span className="capitalize">{selectedReport.status}</span>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{selectedReport.description}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>{selectedReport.location.name}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {selectedReport.tags.map(tag => (
                  <span key={tag} className="bg-geo-blue-light text-geo-blue-dark text-xs px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <Button 
                size="sm" 
                className="w-full"
                onClick={() => navigateToReport(selectedReport.id)}
              >
                View Full Report
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MapView;
