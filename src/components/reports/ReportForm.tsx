
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { Map, Loader2, ImagePlus } from "lucide-react";
import MapView from "@/components/map/MapView";
import { addReport, updateReport } from "@/services/reportService";

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  location: string;
  images: File[];
}

interface ReportFormProps {
  onSubmit?: (report: any) => void;
  isEditing?: boolean;
  initialData?: any;
}

const ReportForm = ({ onSubmit, isEditing = false, initialData }: ReportFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    images: []
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Initialize form data if editing an existing report
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        category: initialData.category?.toLowerCase() || "",
        priority: initialData.priority?.toLowerCase() || "",
        location: initialData.location || "",
        images: []
      });
    }
  }, [isEditing, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 3) {
      toast.error("You can only upload up to 3 images");
      return;
    }

    const newImages = [...formData.images, ...files];
    setFormData(prev => ({ ...prev, images: newImages }));

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    
    setFormData(prev => ({ ...prev, images: newImages }));
    setPreviewUrls(newPreviewUrls);
    
    toast.success("Image removed");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.title || !formData.category || !formData.priority || !formData.location) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (isEditing && initialData) {
      // Update the report
      const updatedReport = updateReport(initialData.id, {
        title: formData.title,
        description: formData.description || "",
        category: formData.category,
        priority: formData.priority,
        location: formData.location,
      });

      console.log("Report updated:", updatedReport);
      
      if (updatedReport) {
        toast.success("Report updated successfully!");
        setIsSubmitting(false);
        navigate(`/reports/${initialData.id}`);
      } else {
        toast.error("Failed to update report");
        setIsSubmitting(false);
      }
    } else {
      // Add new report
      const newReport = addReport({
        title: formData.title,
        description: formData.description || "",
        category: formData.category,
        status: "Open", // Default status for new reports
        priority: formData.priority,
        location: formData.location,
        assignedTo: "Unassigned", // Default assignee
      });

      console.log("Form submitted:", newReport);
      
      // Call the onSubmit callback if provided
      if (onSubmit) {
        onSubmit(newReport);
      }

      toast.success("Report submitted successfully!");
      setIsSubmitting(false);
      navigate("/reports");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Report" : "Create New Report"}</CardTitle>
          <CardDescription>
            {isEditing ? "Update an existing report" : "Submit a new issue or incident report"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="road">Road Maintenance</SelectItem>
                    <SelectItem value="public_service">Public Service</SelectItem>
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="safety">Safety & Security</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange("priority", value)}
                  required
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="location"
                    name="location"
                    placeholder="Address or location description"
                    value={formData.location}
                    onChange={handleChange}
                    className="flex-1"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowMap(!showMap)}
                  >
                    <Map className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {showMap && (
              <div className="mt-4">
                <MapView />
                <p className="text-xs text-muted-foreground mt-2">
                  Click on the map to select a precise location
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide detailed information about the issue"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Images (Optional)</Label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    multiple
                    max={3}
                  />
                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <ImagePlus className="h-8 w-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Upload images (max 3)
                      </span>
                    </div>
                  </Label>
                </div>
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => isEditing ? navigate(`/reports/${initialData.id}`) : navigate("/reports")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Submitting..."}
              </>
            ) : (
              isEditing ? "Update Report" : "Submit Report"
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ReportForm;
