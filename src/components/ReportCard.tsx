
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { GeoReport } from '@/contexts/ReportContext';
import { 
  MapPin, 
  CalendarDays, 
  Tag, 
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleX
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

interface ReportCardProps {
  report: GeoReport;
  onDelete?: (id: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onDelete }) => {
  const navigate = useNavigate();
  
  const handleViewClick = () => {
    navigate(`/reports/${report.id}`);
  };
  
  const handleEditClick = () => {
    navigate(`/reports/edit/${report.id}`);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <CircleX className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-amber-600" />;
    }
  };
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">
            {report.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleViewClick}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEditClick}>
                Edit Report
              </DropdownMenuItem>
              {onDelete && (
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => onDelete(report.id)}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{report.location.name}</span>
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${getStatusColor(report.status)}`}>
            {getStatusIcon(report.status)}
            <span className="capitalize">{report.status}</span>
          </div>
        </div>
        <p className="text-sm line-clamp-2 mb-3">{report.description}</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <CalendarDays className="h-3 w-3" />
          <span>
            {formatDistance(new Date(report.date), new Date(), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Tag className="h-3 w-3" />
          <span>{report.category}</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {report.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {report.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{report.tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleViewClick}
          className="w-full"
        >
          View Report
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
