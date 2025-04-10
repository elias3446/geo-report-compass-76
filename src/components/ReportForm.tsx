
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReports, GeoReport } from '@/contexts/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { Calendar as CalendarIcon, MapPin, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FormData {
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  date: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  category: string;
  tags: string[];
}

const initialFormData: FormData = {
  title: '',
  description: '',
  location: {
    lat: 0,
    lng: 0,
    name: '',
  },
  date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''), // Updated to include time
  status: 'draft',
  category: '',
  tags: [],
};

const categories = [
  'Environmental',
  'Urban Planning',
  'Agriculture',
  'Disaster Management',
  'Forestry',
  'Water Resources',
  'Infrastructure',
  'Land Use',
  'Conservation',
  'Climate',
];

const ReportForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addReport, updateReport, getReportById } = useReports();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [tagInput, setTagInput] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [locationError, setLocationError] = useState('');
  
  const isEditMode = !!id;

  // Load report data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const report = getReportById(id);
      if (report) {
        setFormData(report);
        setDate(new Date(report.date));
      } else {
        toast({
          title: "Error",
          description: "Report not found",
          variant: "destructive"
        });
        navigate('/reports');
      }
    }
  }, [id, getReportById, isEditMode, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value as FormData['status'],
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
    }));
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Preserve the current time when changing date
      const currentDate = date || new Date();
      selectedDate.setHours(currentDate.getHours());
      selectedDate.setMinutes(currentDate.getMinutes());
      selectedDate.setSeconds(currentDate.getSeconds());
      
      setDate(selectedDate);
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString(),
      }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: name === 'name' ? value : parseFloat(value) || 0,
      },
    }));

    setLocationError('');
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim().toLowerCase())) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim().toLowerCase()],
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.location.lat || !formData.location.lng || !formData.location.name) {
      setLocationError('Please provide complete location information');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Ensure the current date and time are included
    const reportData = {
      ...formData,
      date: new Date().toISOString(), // Set to current date and time
    };

    if (isEditMode) {
      updateReport(id, reportData);
      toast({
        title: "Success",
        description: "Report updated successfully",
      });
    } else {
      addReport(reportData);
      toast({
        title: "Success",
        description: "New report created successfully",
      });
    }
    
    navigate('/reports');
  };

  // Format date for display
  const formatDisplayDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPP p'); // Format with date and time
    } catch (e) {
      return format(new Date(), 'PPP p');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Report Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter report title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter report description"
            rows={4}
            required
          />
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-xs text-muted-foreground mb-1">
                Location Name
              </label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  value={formData.location.name}
                  onChange={handleLocationChange}
                  placeholder="e.g. Seattle, WA"
                  required
                  className="pl-8"
                />
                <MapPin className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label htmlFor="lat" className="block text-xs text-muted-foreground mb-1">
                Latitude
              </label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="0.000001"
                value={formData.location.lat || ''}
                onChange={handleLocationChange}
                placeholder="e.g. 47.6062"
                required
              />
            </div>
            <div>
              <label htmlFor="lng" className="block text-xs text-muted-foreground mb-1">
                Longitude
              </label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="0.000001"
                value={formData.location.lng || ''}
                onChange={handleLocationChange}
                placeholder="e.g. -122.3321"
                required
              />
            </div>
          </div>
          {locationError && (
            <p className="text-destructive text-sm mt-1">{locationError}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? formatDisplayDate(date.toISOString()) : <span>Current date and time will be used</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  initialFocus
                />
                <div className="p-3 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    The current date and time will be captured automatically when the report is submitted.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select
              value={formData.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Type a tag and press Enter"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/reports')}
        >
          Cancel
        </Button>
        <Button type="submit">
          {isEditMode ? 'Update Report' : 'Create Report'}
        </Button>
      </div>
    </form>
  );
};

export default ReportForm;
