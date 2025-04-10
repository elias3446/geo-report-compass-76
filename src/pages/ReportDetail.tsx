
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useReports, GeoReport } from '@/contexts/ReportContext';
import { 
  MapPin, 
  Calendar, 
  Tag, 
  ArrowLeft, 
  Edit, 
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  CircleX,
  Info,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getReportById, deleteReport } = useReports();
  const { toast } = useToast();
  const [report, setReport] = useState<GeoReport | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Mock data for charts
  const [chartData] = useState([
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 59 },
    { month: 'Mar', value: 80 },
    { month: 'Apr', value: 81 },
    { month: 'May', value: 56 },
    { month: 'Jun', value: 55 },
    { month: 'Jul', value: 40 },
  ]);
  
  useEffect(() => {
    if (id) {
      const reportData = getReportById(id);
      if (reportData) {
        setReport(reportData);
      } else {
        toast({
          title: "Error",
          description: "Report not found",
          variant: "destructive"
        });
        navigate('/reports');
      }
    }
  }, [id, getReportById, navigate, toast]);
  
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (id) {
      deleteReport(id);
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted",
      });
      navigate('/reports');
    }
  };
  
  const handleEdit = () => {
    navigate(`/reports/edit/${id}`);
  };

  const getStatusDetails = () => {
    if (!report) return { icon: null, bgColor: '', text: '' };
    
    switch (report.status) {
      case 'approved':
        return { 
          icon: <CheckCircle2 className="h-5 w-5 text-geo-green-dark" />,
          bgColor: 'bg-geo-green-light',
          text: 'text-geo-green-dark'
        };
      case 'submitted':
        return { 
          icon: <Clock className="h-5 w-5 text-geo-blue-dark" />,
          bgColor: 'bg-geo-blue-light',
          text: 'text-geo-blue-dark'
        };
      case 'rejected':
        return { 
          icon: <CircleX className="h-5 w-5 text-destructive" />,
          bgColor: 'bg-red-100',
          text: 'text-red-800'
        };
      default:
        return { 
          icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
          bgColor: 'bg-amber-100',
          text: 'text-amber-800'
        };
    }
  };
  
  const statusDetails = getStatusDetails();
  
  if (!report) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate('/reports')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{report.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${statusDetails.bgColor} ${statusDetails.text}`}>
                {statusDetails.icon}
                <span className="capitalize">{report.status}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {format(new Date(report.date), 'PPP')}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-1"
          >
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Report Overview</h2>
            <p className="text-muted-foreground mb-6">{report.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground mb-1">Category</span>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-geo-blue" />
                  <span className="font-medium">{report.category}</span>
                </div>
              </div>
              
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground mb-1">Location</span>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-geo-green" />
                  <span className="font-medium">{report.location.name}</span>
                </div>
              </div>
              
              <div className="flex flex-col p-4 bg-muted rounded-lg">
                <span className="text-sm font-medium text-muted-foreground mb-1">Date</span>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-geo-earth-clay" />
                  <span className="font-medium">{format(new Date(report.date), 'PPP')}</span>
                </div>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-semibold mb-4">Geographic Data Visualization</h3>
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2196F3" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-end mt-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>Export Data</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download data as CSV</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-card rounded-lg border p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Location Details</h3>
            <div 
              className="w-full h-[250px] bg-cover bg-center rounded-lg mb-4" 
              style={{ 
                backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80')` 
              }}
            />
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Latitude</span>
                <span className="font-medium">{report.location.lat.toFixed(6)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Longitude</span>
                <span className="font-medium">{report.location.lng.toFixed(6)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Elevation</span>
                <span className="font-medium">127 m</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Terrain</span>
                <span className="font-medium">Urban Area</span>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {report.tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
            <div className="p-4 bg-muted rounded-lg flex items-start gap-3">
              <Info className="h-5 w-5 text-geo-blue mt-0.5" />
              <div>
                <p className="text-sm">This report is part of the quarterly assessment program for environmental monitoring.</p>
                <Link to="/reports" className="text-sm text-geo-blue hover:underline mt-2 inline-block">
                  View related reports
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportDetail;
