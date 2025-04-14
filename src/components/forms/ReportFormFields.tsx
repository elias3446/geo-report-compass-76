
import React from 'react';
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
import { Calendar as CalendarIcon, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormData {
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

interface ReportFormFieldsProps {
  formData: FormData;
  date: Date | undefined;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStatusChange: (value: string) => void;
  handleCategoryChange: (value: string) => void;
  handleDateChange: (selectedDate: Date | undefined) => void;
  locationError: string;
  categories: string[];
  formatDisplayDate: (dateString: string) => string;
}

const ReportFormFields: React.FC<ReportFormFieldsProps> = ({
  formData,
  date,
  handleChange,
  handleLocationChange,
  handleStatusChange,
  handleCategoryChange,
  handleDateChange,
  locationError,
  categories,
  formatDisplayDate
}) => {
  return (
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
    </div>
  );
};

export default ReportFormFields;
