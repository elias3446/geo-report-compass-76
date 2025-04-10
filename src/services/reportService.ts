
// Initial sample data for reports
let reportsData = [
  {
    id: 1,
    title: "Broken Street Light",
    category: "Infrastructure",
    status: "Open",
    priority: "Medium",
    location: "Av. Reforma 123",
    assignedTo: "Carlos Gutierrez",
    createdAt: new Date().toISOString(), // Set to today
  },
  {
    id: 2,
    title: "Pothole on Main Street",
    category: "Road",
    status: "In Progress",
    priority: "High",
    location: "Calle 16 de Septiembre",
    assignedTo: "Ana Mendoza",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 3,
    title: "Graffiti on Public Building",
    category: "Vandalism",
    status: "Open",
    priority: "Low",
    location: "Parque Lincoln",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 4,
    title: "Fallen Tree After Storm",
    category: "Environment",
    status: "Resolved",
    priority: "High",
    location: "Bosque de Chapultepec",
    assignedTo: "Miguel Santos",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 5,
    title: "Broken Pedestrian Signal",
    category: "Infrastructure",
    status: "Resolved",
    priority: "Medium",
    location: "Insurgentes Sur",
    assignedTo: "Laura Díaz",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  }
];

// Define the format for the report type
export type Report = {
  id: number;
  title: string;
  category: string;
  status: string;
  priority: string;
  location: string;
  assignedTo: string;
  createdAt: string;
  description?: string;
};

// Define activities type
export type Activity = {
  id: number;
  type: "report_created" | "report_updated" | "report_resolved" | "report_assigned" | "priority_changed" | "category_changed" | "location_changed"; 
  title: string;
  description: string;
  time: string;
  relatedReportId: number;
  createdAt: string;
};

// Store activities
let activities: Activity[] = [
  { 
    id: 1, 
    type: "report_created", 
    title: "New report submitted", 
    description: "Broken Street Light at Av. Reforma 123", 
    time: "2 hours ago",
    relatedReportId: 1,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 2, 
    type: "report_updated", 
    title: "Report status updated", 
    description: "Pothole on Main Street marked as 'In Progress'", 
    time: "5 hours ago",
    relatedReportId: 2,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 3, 
    type: "report_resolved", 
    title: "Report resolved", 
    description: "Fallen Tree After Storm at Bosque de Chapultepec", 
    time: "1 day ago",
    relatedReportId: 4,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 4, 
    type: "report_assigned", 
    title: "Report assigned", 
    description: "Graffiti on Public Building assigned to Miguel Santos", 
    time: "1 day ago",
    relatedReportId: 3,
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString()
  },
];

// Get all reports
export const getReports = (): Report[] => {
  return reportsData;
};

// Helper to format relative time
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) {
    return "Just now";
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

// Add a new report
export const addReport = (report: Omit<Report, "id" | "createdAt">): Report => {
  const newReport = {
    ...report,
    id: Math.max(0, ...reportsData.map(r => r.id)) + 1,
    createdAt: new Date().toISOString(),
  };
  
  reportsData = [newReport, ...reportsData];
  
  // Create a new activity for the report
  addActivity({
    type: "report_created",
    title: "New report submitted",
    description: `${report.title} at ${report.location}`,
    relatedReportId: newReport.id,
    createdAt: new Date().toISOString(),
  });
  
  return newReport;
};

// Update a report
export const updateReport = (id: number, updates: Partial<Report>): Report | null => {
  const index = reportsData.findIndex(r => r.id === id);
  if (index === -1) return null;
  
  const originalReport = { ...reportsData[index] };
  const updatedReport = { ...originalReport, ...updates };
  reportsData[index] = updatedReport;
  
  // Create activities for specific types of updates
  if (updates.status && updates.status !== originalReport.status) {
    if (updates.status === "Resolved") {
      addActivity({
        type: "report_resolved",
        title: "Report resolved",
        description: `${updatedReport.title} at ${updatedReport.location}`,
        relatedReportId: id,
        createdAt: new Date().toISOString(),
      });
    } else {
      addActivity({
        type: "report_updated",
        title: "Report status updated",
        description: `${updatedReport.title} marked as '${updates.status}'`,
        relatedReportId: id,
        createdAt: new Date().toISOString(),
      });
    }
  }
  
  if (updates.assignedTo && updates.assignedTo !== originalReport.assignedTo && updates.assignedTo !== "Unassigned") {
    addActivity({
      type: "report_assigned",
      title: "Report assigned",
      description: `${updatedReport.title} assigned to ${updates.assignedTo}`,
      relatedReportId: id,
      createdAt: new Date().toISOString(),
    });
  }
  
  if (updates.priority && updates.priority !== originalReport.priority) {
    addActivity({
      type: "priority_changed",
      title: "Priority changed",
      description: `${updatedReport.title} priority changed to ${updates.priority}`,
      relatedReportId: id,
      createdAt: new Date().toISOString(),
    });
  }
  
  if (updates.category && updates.category !== originalReport.category) {
    addActivity({
      type: "category_changed",
      title: "Category changed",
      description: `${updatedReport.title} category changed to ${updates.category}`,
      relatedReportId: id,
      createdAt: new Date().toISOString(),
    });
  }
  
  if (updates.location && updates.location !== originalReport.location) {
    addActivity({
      type: "location_changed",
      title: "Location updated",
      description: `${updatedReport.title} location changed to ${updates.location}`,
      relatedReportId: id,
      createdAt: new Date().toISOString(),
    });
  }
  
  return updatedReport;
};

// Delete a report
export const deleteReport = (id: number): boolean => {
  const initialLength = reportsData.length;
  reportsData = reportsData.filter(r => r.id !== id);
  return reportsData.length !== initialLength;
};

// Get reports by status
export const getReportsByStatus = (status: string): Report[] => {
  return reportsData.filter(r => r.status === status);
};

// Add new activity
export const addActivity = (activity: Omit<Activity, "id" | "time">): Activity => {
  const newActivity = {
    ...activity,
    id: Math.max(0, ...activities.map(a => a.id)) + 1,
    time: formatRelativeTime(activity.createdAt)
  };
  
  activities = [newActivity, ...activities];
  return newActivity;
};

// Get all activities
export const getAllActivities = (): Activity[] => {
  // Update relative times before returning
  return activities.map(activity => ({
    ...activity,
    time: formatRelativeTime(activity.createdAt)
  }));
};

// Get activities by report ID
export const getActivitiesByReportId = (reportId: number): Activity[] => {
  return getAllActivities().filter(activity => activity.relatedReportId === reportId);
};

// Calculate reports statistics for dashboard
export const getReportsStats = () => {
  // Total counts
  const totalReports = reportsData.length;
  const openIssues = reportsData.filter(r => r.status === "Open").length;
  const inProgressIssues = reportsData.filter(r => r.status === "In Progress").length;
  const resolvedIssues = reportsData.filter(r => r.status === "Resolved").length;
  
  // Calculate average response time (just a mock calculation for now)
  const averageResponse = "2.3 days";
  
  // Calculate reports by category
  const categories: Record<string, number> = {};
  reportsData.forEach(report => {
    categories[report.category] = (categories[report.category] || 0) + 1;
  });
  
  const reportsByCategory = Object.entries(categories).map(([name, value]) => ({ name, value }));
  
  // Generate monthly data (for this demo, we'll create sample data)
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const reportsByMonth = months.map(month => {
    // In a real app, you would filter reports by month
    return {
      name: month,
      open: Math.floor(Math.random() * 15),
      closed: Math.floor(Math.random() * 15)
    };
  });
  
  // Recent activities - get the most recent 4 activities
  const recentActivities = getAllActivities().slice(0, 4);
  
  // Location hotspots
  const locationHotspots = getReportLocationHotspots();
  
  return {
    totalReports,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    averageResponse,
    reportsByCategory,
    reportsByMonth,
    recentActivities,
    locationHotspots
  };
};

// Get location hotspots
export const getReportLocationHotspots = () => {
  // Count reports by location
  const locations: Record<string, number> = {};
  reportsData.forEach(report => {
    locations[report.location] = (locations[report.location] || 0) + 1;
  });
  
  // Convert to array and sort by count
  const sortedLocations = Object.entries(locations)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // Top 5 locations
    
  return sortedLocations;
};
