
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useReports } from '@/contexts/ReportContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import ReportFormFields, { FormData } from '@/components/forms/ReportFormFields';
import TagsInput from '@/components/forms/TagsInput';
import FormActions from '@/components/forms/FormActions';

const initialFormData: FormData = {
  title: '',
  description: '',
  location: {
    lat: 0,
    lng: 0,
    name: '',
  },
  date: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss\'Z\''),
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

  const handleAddTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
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
      <ReportFormFields
        formData={formData}
        date={date}
        handleChange={handleChange}
        handleLocationChange={handleLocationChange}
        handleStatusChange={handleStatusChange}
        handleCategoryChange={handleCategoryChange}
        handleDateChange={handleDateChange}
        locationError={locationError}
        categories={categories}
        formatDisplayDate={formatDisplayDate}
      />
      
      <TagsInput
        tags={formData.tags}
        onAddTag={handleAddTag}
        onRemoveTag={handleRemoveTag}
      />

      <FormActions
        isEditMode={isEditMode}
        onCancel={() => navigate('/reports')}
      />
    </form>
  );
};

export default ReportForm;
