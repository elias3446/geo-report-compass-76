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
  },
  // Adding more sample data for better statistics
  {
    id: 6,
    title: "Damaged Playground Equipment",
    category: "Recreation",
    status: "Open",
    priority: "Medium",
    location: "Parque España",
    assignedTo: "Roberto Sánchez",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 7,
    title: "Illegal Dumping",
    category: "Environment",
    status: "In Progress",
    priority: "High",
    location: "Río Consulado",
    assignedTo: "Javier Méndez",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 8,
    title: "Public Bench Broken",
    category: "Urban Furniture",
    status: "Open",
    priority: "Low",
    location: "Alameda Central",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
  },
  {
    id: 9,
    title: "Blocked Storm Drain",
    category: "Water",
    status: "Resolved",
    priority: "Critical",
    location: "Avenida Constituyentes",
    assignedTo: "Patricia Flores",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
  },
  {
    id: 10,
    title: "Damaged Sidewalk",
    category: "Infrastructure",
    status: "In Progress",
    priority: "Medium",
    location: "Calle Madero",
    assignedTo: "Fernando López",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
  },
  {
    id: 11,
    title: "Burned Out Street Light",
    category: "Infrastructure",
    status: "Open",
    priority: "Medium",
    location: "Paseo de la Reforma",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 12,
    title: "Vandalized Bus Stop",
    category: "Vandalism",
    status: "Open",
    priority: "Low",
    location: "Avenida Insurgentes",
    assignedTo: "Maria Rodriguez",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 13,
    title: "Overflowing Public Trash Bins",
    category: "Sanitation",
    status: "In Progress",
    priority: "Medium",
    location: "Zócalo",
    assignedTo: "Diego Martinez",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 14,
    title: "Traffic Light Malfunction",
    category: "Traffic",
    status: "Open",
    priority: "High",
    location: "Periférico Sur",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 15,
    title: "Damaged Bike Lane",
    category: "Transportation",
    status: "Resolved",
    priority: "Medium",
    location: "Avenida Chapultepec",
    assignedTo: "Sofia Torres",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
  },
  {
    id: 16,
    title: "Water Leak from Main Pipe",
    category: "Water",
    status: "In Progress",
    priority: "Critical",
    location: "Colonia Roma",
    assignedTo: "Luis Aguilar",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 17,
    title: "Collapsed Sewer Cover",
    category: "Infrastructure",
    status: "Resolved",
    priority: "High",
    location: "Calle Durango",
    assignedTo: "Isabel Morales",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago
  },
  {
    id: 18,
    title: "Unauthorized Street Vendor",
    category: "Public Order",
    status: "Open",
    priority: "Low",
    location: "Metro Balderas",
    assignedTo: "Unassigned",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
  },
  {
    id: 19,
    title: "Noise Complaint - Construction Site",
    category: "Noise",
    status: "In Progress",
    priority: "Medium",
    location: "Colonia Condesa",
    assignedTo: "Carmen Vega",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 20,
    title: "Broken Public Water Fountain",
    category: "Water",
    status: "Resolved",
    priority: "Low",
    location: "Parque México",
    assignedTo: "Raul Jimenez",
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
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
  // Adding more sample activities
  { 
    id: 5, 
    type: "report_created", 
    title: "New report submitted", 
    description: "Damaged Playground Equipment at Parque España", 
    time: "4 hours ago",
    relatedReportId: 6,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 6, 
    type: "report_updated", 
    title: "Report status updated", 
    description: "Illegal Dumping marked as 'In Progress'", 
    time: "6 hours ago",
    relatedReportId: 7,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 7, 
    type: "priority_changed", 
    title: "Priority changed", 
    description: "Traffic Light Malfunction priority set to 'High'", 
    time: "8 hours ago",
    relatedReportId: 14,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 8, 
    type: "category_changed", 
    title: "Category changed", 
    description: "Water Leak changed from 'Infrastructure' to 'Water'", 
    time: "12 hours ago",
    relatedReportId: 16,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 9, 
    type: "report_assigned", 
    title: "Report assigned", 
    description: "Noise Complaint assigned to Carmen Vega", 
    time: "1 day ago",
    relatedReportId: 19,
    createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000).toISOString()
  },
  { 
    id: 10, 
    type: "report_resolved", 
    title: "Report resolved", 
    description: "Blocked Storm Drain at Avenida Constituyentes", 
    time: "2 days ago",
    relatedReportId: 9,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
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
  const averageResponse = "1.8 days";
  
  // Calculate reports by category
  const categories: Record<string, number> = {};
  reportsData.forEach(report => {
    categories[report.category] = (categories[report.category] || 0) + 1;
  });
  
  const reportsByCategory = Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value); // Sort by count descending
  
  // Generate monthly data with more realistic values based on our sample data
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  
  const reportsByMonth = months.map((month, idx) => {
    // For current and recent months, use more realistic values based on our data
    let openCount = 0;
    let closedCount = 0;
    
    if (idx === currentMonth) {
      // For current month, count from our actual data
      openCount = reportsData.filter(r => {
        const date = new Date(r.createdAt);
        return date.getMonth() === idx && (r.status === "Open" || r.status === "In Progress");
      }).length;
      
      closedCount = reportsData.filter(r => {
        const date = new Date(r.createdAt);
        return date.getMonth() === idx && r.status === "Resolved";
      }).length;
    } else if (idx === (currentMonth - 1 + 12) % 12) {
      // Last month - some realistic values
      openCount = Math.round(reportsData.length * 0.2);
      closedCount = Math.round(reportsData.length * 0.15);
    } else {
      // Random values for history
      openCount = Math.floor(Math.random() * 10) + 2;
      closedCount = Math.floor(Math.random() * 8) + 1;
    }
    
    return {
      name: month,
      open: openCount,
      closed: closedCount
    };
  });
  
  // Recent activities - get the most recent activities
  const recentActivities = getAllActivities().slice(0, 8);
  
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
    .map(([name, value]) => ({ name, value, count: value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 locations
    
  return sortedLocations;
};
