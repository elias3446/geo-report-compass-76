
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReports } from '@/contexts/ReportContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReportCard from '@/components/ReportCard';
import { useToast } from '@/components/ui/use-toast';
import { 
  PlusCircle, 
  Search, 
  Map, 
  List, 
  Filter,
  X,
  AlertTriangle,
  Clock,
  CheckCircle2,
  CircleX
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import MapView from '@/components/MapView';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Reports = () => {
  const { reports, deleteReport } = useReports();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const categories = [...new Set(reports.map(r => r.category))];
  
  const handleCreateNew = () => {
    navigate('/reports/new');
  };
  
  const handleDelete = (id: string) => {
    setReportToDelete(id);
    setShowDeleteDialog(true);
  };
  
  const confirmDelete = () => {
    if (reportToDelete) {
      deleteReport(reportToDelete);
      toast({
        title: "Report Deleted",
        description: "The report has been successfully deleted",
      });
      setShowDeleteDialog(false);
      setReportToDelete(null);
    }
  };
  
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = filterCategory === '' || report.category === filterCategory;
    const matchesStatus = filterStatus === '' || report.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterStatus('');
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'submitted':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <CircleX className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };
  
  const hasActiveFilters = searchTerm !== '' || filterCategory !== '' || filterStatus !== '';
  
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Geographic Reports</h1>
          <p className="text-muted-foreground">Manage and explore geographic reports and data</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={handleCreateNew}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Report
        </Button>
      </div>
      
      <div className="bg-card rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {filterCategory || "Filter by category"}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                {filterStatus ? (
                  <div className="flex items-center gap-1">
                    {getStatusIcon(filterStatus)}
                    <span className="capitalize">{filterStatus}</span>
                  </div>
                ) : (
                  "Filter by status"
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="draft">
                <div className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Draft</span>
                </div>
              </SelectItem>
              <SelectItem value="submitted">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-geo-blue" />
                  <span>Submitted</span>
                </div>
              </SelectItem>
              <SelectItem value="approved">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-geo-green" />
                  <span>Approved</span>
                </div>
              </SelectItem>
              <SelectItem value="rejected">
                <div className="flex items-center gap-1">
                  <CircleX className="h-4 w-4 text-destructive" />
                  <span>Rejected</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-muted-foreground">Active Filters:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Search className="h-3 w-3" />
                  <span>{searchTerm}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchTerm('')}
                  />
                </Badge>
              )}
              {filterCategory && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <span>Category: {filterCategory}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilterCategory('')}
                  />
                </Badge>
              )}
              {filterStatus && (
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(filterStatus)}
                  <span className="capitalize">{filterStatus}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setFilterStatus('')}
                  />
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="list">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center">
            <Map className="h-4 w-4 mr-2" />
            Map View
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          {filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map(report => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="rounded-full bg-muted w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No reports found</h3>
              <p className="text-muted-foreground mt-1">
                {hasActiveFilters 
                  ? "Try adjusting your filters or search terms" 
                  : "Get started by creating your first geographic report"}
              </p>
              {!hasActiveFilters && (
                <Button 
                  className="mt-4" 
                  onClick={handleCreateNew}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Report
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="map">
          <MapView />
        </TabsContent>
      </Tabs>
      
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

export default Reports;
